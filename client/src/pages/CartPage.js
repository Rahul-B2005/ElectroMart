import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const tax = Math.round(cartTotal * 0.18);
  const shipping = cartTotal > 1000 ? 0 : 99;
  const total = cartTotal + tax + shipping;

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <p style={{ fontSize: '60px' }}>🛒</p>
        <h2>Your Cart is Empty</h2>
        <p>Add some products to get started</p>

        <Link to="/products" className="cart-shop-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">

        <h1 className="cart-title">
          Shopping Cart ({cart.length} items)
        </h1>

        <div className="cart-layout">

          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.product} className="cart-item">

                <img
                  src={item.image || 'https://via.placeholder.com/80'}
                  alt={item.name}
                  className="cart-item-image"
                />

                <div className="cart-item-info">
                  <h3 className="cart-item-name">
                    {item.name}
                  </h3>

                  <p className="cart-item-price">
                    ₹{item.price.toLocaleString()}
                  </p>
                </div>

                <div className="cart-qty-controls">
                  <button
                    className="cart-qty-btn"
                    onClick={() =>
                      updateQuantity(
                        item.product,
                        item.quantity - 1
                      )
                    }
                  >
                    −
                  </button>

                  <span className="cart-qty">
                    {item.quantity}
                  </span>

                  <button
                    className="cart-qty-btn"
                    onClick={() =>
                      updateQuantity(
                        item.product,
                        Math.min(
                          item.stock,
                          item.quantity + 1
                        )
                      )
                    }
                  >
                    +
                  </button>
                </div>

                <span className="cart-subtotal">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>

                <button
                  className="cart-remove-btn"
                  onClick={() => removeFromCart(item.product)}
                >
                  ✕
                </button>

              </div>
            ))}

            <button
              onClick={clearCart}
              className="cart-clear-btn"
            >
              Clear Cart
            </button>
          </div>

          <div className="cart-summary">

            <h2 className="cart-summary-title">
              Order Summary
            </h2>

            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>

            <div className="cart-summary-row">
              <span>GST (18%)</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>

            <div className="cart-summary-row">
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? '#27ae60' : '#333' }}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>

            {shipping > 0 && (
              <p className="cart-free-ship-note">
                Add ₹{(1000 - cartTotal).toLocaleString()} more for free shipping
              </p>
            )}

            <div className="cart-total-row">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <button
              className="cart-checkout-btn"
              onClick={() =>
                user
                  ? navigate('/checkout')
                  : navigate('/login')
              }
            >
              {user
                ? 'Proceed to Checkout'
                : 'Login to Checkout'}
            </button>

            <Link
              to="/products"
              className="cart-continue-link"
            >
              ← Continue Shopping
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}