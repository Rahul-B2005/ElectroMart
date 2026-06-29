import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './Checkout.css';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  const tax = Math.round(cartTotal * 0.18);
  const shipping = cartTotal > 1000 ? 0 : 99;
  const total = cartTotal + tax + shipping;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      return toast.error('Cart is empty');
    }

    setLoading(true);

    try {
      const { data } = await api.post('/orders', {
        items: cart.map((item) => ({
          product: item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: form,
        paymentMethod,
      });

      clearCart();

      toast.success('Order placed successfully!');

      navigate(`/order-success/${data._id}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to place order'
      );
    } finally {
      setLoading(false);
    }
  };

  const Field = ({
    label,
    name,
    placeholder,
    required = true,
  }) => (
    <div className="checkout-field">
      <label className="checkout-label">{label}</label>

      <input
        type="text"
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className="checkout-input"
      />
    </div>
  );

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-layout">

          {/* Left Side */}
          <form
            onSubmit={handleSubmit}
            className="checkout-form"
          >
            <div className="checkout-card">
              <h2 className="checkout-card-title">
                Delivery Address
              </h2>

              <div className="checkout-row">
                <Field
                  label="Full Name"
                  name="name"
                  placeholder="John Doe"
                />

                <Field
                  label="Phone Number"
                  name="phone"
                  placeholder="9876543210"
                />
              </div>

              <Field
                label="Street Address"
                name="street"
                placeholder="123 Main Street"
              />

              <div className="checkout-row">
                <Field
                  label="City"
                  name="city"
                  placeholder="Chennai"
                />

                <Field
                  label="State"
                  name="state"
                  placeholder="Tamil Nadu"
                />

                <Field
                  label="Pincode"
                  name="pincode"
                  placeholder="600001"
                />
              </div>
            </div>

            <div className="checkout-card">
              <h2 className="checkout-card-title">
                Payment Method
              </h2>

              {[
                ['COD', '💵 Cash on Delivery'],
                ['Card', '💳 Credit / Debit Card'],
                ['UPI', '📱 UPI'],
                ['NetBanking', '🏦 Net Banking'],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className="checkout-radio-row"
                >
                  <input
                    type="radio"
                    value={value}
                    checked={paymentMethod === value}
                    onChange={() =>
                      setPaymentMethod(value)
                    }
                  />

                  <span className="checkout-radio-label">
                    {label}
                  </span>

                  {value === 'COD' && (
                    <span className="checkout-popular-badge">
                      Popular
                    </span>
                  )}
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="checkout-place-btn"
            >
              {loading
                ? 'Placing Order...'
                : `Place Order • ₹${total.toLocaleString()}`}
            </button>
          </form>

          {/* Right Side */}
          <div className="checkout-summary">
            <h2 className="checkout-card-title">
              Order Summary
            </h2>

            {cart.map((item) => (
              <div
                key={item.product}
                className="checkout-order-item"
              >
                <span className="checkout-order-item-name">
                  {item.name} × {item.quantity}
                </span>

                <span>
                  ₹
                  {(
                    item.price * item.quantity
                  ).toLocaleString()}
                </span>
              </div>
            ))}

            <div className="checkout-divider"></div>

            <div className="checkout-sum-row">
              <span>Subtotal</span>
              <span>
                ₹{cartTotal.toLocaleString()}
              </span>
            </div>

            <div className="checkout-sum-row">
              <span>GST (18%)</span>
              <span>
                ₹{tax.toLocaleString()}
              </span>
            </div>

            <div className="checkout-sum-row">
              <span>Shipping</span>

              <span
                style={{
                  color:
                    shipping === 0
                      ? '#27ae60'
                      : '#333',
                }}
              >
                {shipping === 0
                  ? 'FREE'
                  : `₹${shipping}`}
              </span>
            </div>

            <div className="checkout-divider"></div>

            <div className="checkout-total-row">
              <span>Total</span>

              <span>
                ₹{total.toLocaleString()}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}