import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        <Link to="/" className="logo">
          ⚡ ElectroShop
        </Link>

        <button
          className="hamburger"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          ☰
        </button>

        <div className={`nav-links ${mobileMenu ? 'active' : ''}`}>
          <Link to="/products" className="nav-link">
            Products
          </Link>

          {isAdmin && (
            <Link to="/admin" className="nav-link">
              Admin
            </Link>
          )}
        </div>

        <div className="navbar-right">
          <Link to="/cart" className="cart-btn">
            🛒
            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="user-menu">
              <button
                className="user-btn"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {user.name.split(' ')[0]} ▾
              </button>

              {menuOpen && (
                <div className="dropdown">
                  <Link
                    to="/profile"
                    className="dropdown-item"
                  >
                    Profile
                  </Link>

                  <Link
                    to="/orders"
                    className="dropdown-item"
                  >
                    My Orders
                  </Link>

                  <button
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link
                to="/login"
                className="login-btn"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="register-btn"
              >
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}