const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// ==========================================
// PLACE ORDER
// ==========================================
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items',
      });
    }

    // Calculate prices
    const itemsPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const taxPrice = Math.round(itemsPrice * 0.18);
    const shippingPrice = itemsPrice > 1000 ? 0 : 99;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const order = await Order.create({
  user: req.user._id,
  items,
  shippingAddress,
  paymentMethod,

  itemsPrice,
  taxPrice,
  shippingPrice,
  totalPrice,

  paymentStatus:
    paymentMethod === 'COD'
      ? 'Pending'
      : 'Paid',

  paidAt:
    paymentMethod === 'COD'
      ? undefined
      : new Date(),

  orderStatus: 'Processing',
});
    // Update stock and sold count
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
          sold: item.quantity,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ==========================================
// USER ORDERS
// ==========================================
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images');

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ==========================================
// GET SINGLE ORDER
// ==========================================
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Not authorized',
      });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ==========================================
// ADMIN - GET ALL ORDERS
// ==========================================
router.get('/', protect, admin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = status
      ? { orderStatus: status }
      : {};

    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      orders,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ==========================================
// ADMIN UPDATE STATUS
// ==========================================
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const {
      orderStatus,
      paymentStatus,
      trackingNumber,
    } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;

      if (paymentStatus === 'Paid') {
        order.paidAt = new Date();
      }
    }

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (orderStatus === 'Delivered') {
      order.deliveredAt = new Date();

      // COD becomes paid after delivery
      if (
        order.paymentMethod === 'COD' &&
        order.paymentStatus !== 'Paid'
      ) {
        order.paymentStatus = 'Paid';
        order.paidAt = new Date();
      }
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order updated successfully',
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ==========================================
// USER CANCEL ORDER
// ==========================================
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    if (
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'Not authorized',
      });
    }

    if (
      ['Shipped', 'Delivered'].includes(
        order.orderStatus
      )
    ) {
      return res.status(400).json({
        message: 'Cannot cancel after shipping',
      });
    }

    order.orderStatus = 'Cancelled';

    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: item.quantity,
          sold: -item.quantity,
        },
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;