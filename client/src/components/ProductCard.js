import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// Category fallback images using placehold.co (no CORS issues)
const CATEGORY_PLACEHOLDERS = {
  Smartphones:  'https://placehold.co/300x200/1a1a2e/00d4ff?text=Smartphone',
  Laptops:      'https://placehold.co/300x200/1a1a2e/00d4ff?text=Laptop',
  Audio:        'https://placehold.co/300x200/1a1a2e/00d4ff?text=Audio',
  Cameras:      'https://placehold.co/300x200/1a1a2e/00d4ff?text=Camera',
  Gaming:       'https://placehold.co/300x200/1a1a2e/00d4ff?text=Gaming',
  TVs:          'https://placehold.co/300x200/1a1a2e/00d4ff?text=TV',
  Tablets:      'https://placehold.co/300x200/1a1a2e/00d4ff?text=Tablet',
  Accessories:  'https://placehold.co/300x200/1a1a2e/00d4ff?text=Accessory',
};

const DEFAULT_IMG = 'https://placehold.co/300x200/1a1a2e/00d4ff?text=No+Image';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [imgSrc, setImgSrc] = useState(product.images?.[0] || DEFAULT_IMG);

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleImgError = () => {
    // On error, fall back to category placeholder
    const fallback = CATEGORY_PLACEHOLDERS[product.category] || DEFAULT_IMG;
    setImgSrc(fallback);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product._id}`} style={styles.card}>
      <div style={styles.imgWrap}>
        <img
          src={imgSrc}
          alt={product.name}
          style={styles.img}
          onError={handleImgError}
        />
        {discount > 0 && <span style={styles.badge}>-{discount}%</span>}
        {product.stock === 0 && <div style={styles.outOfStock}>Out of Stock</div>}
      </div>
      <div style={styles.body}>
        <p style={styles.brand}>{product.brand}</p>
        <h3 style={styles.name}>{product.name}</h3>
        <div style={styles.rating}>
          {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
          <span style={styles.reviews}> ({product.numReviews})</span>
        </div>
        <div style={styles.priceRow}>
          <span style={styles.price}>₹{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span style={styles.original}>₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          style={product.stock === 0 ? styles.disabledBtn : styles.addBtn}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
    background: '#fff',
    borderRadius: 12,
    border: '1px solid #eee',
    overflow: 'hidden',
    transition: 'box-shadow .2s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  imgWrap: {
    position: 'relative',
    background: '#f8f9fa',
    width: '100%',
    height: 200,
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
    padding: '12px',
    boxSizing: 'border-box',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    background: '#e74c3c',
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 7px',
    borderRadius: 4,
    zIndex: 1,
  },
  outOfStock: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    zIndex: 1,
  },
  body: { padding: 14 },
  brand: {
    fontSize: 11,
    color: '#888',
    margin: '0 0 4px',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
    margin: '0 0 6px',
    color: '#1a1a2e',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  rating: { color: '#f39c12', fontSize: 13, marginBottom: 8 },
  reviews: { color: '#999', fontSize: 12 },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
  },
  price: { fontSize: 18, fontWeight: 700, color: '#1a1a2e' },
  original: { fontSize: 13, color: '#aaa', textDecoration: 'line-through' },
  addBtn: {
    width: '100%',
    padding: '9px 0',
    background: '#1a1a2e',
    color: '#00d4ff',
    border: 'none',
    borderRadius: 7,
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
  },
  disabledBtn: {
    width: '100%',
    padding: '9px 0',
    background: '#eee',
    color: '#aaa',
    border: 'none',
    borderRadius: 7,
    fontWeight: 600,
    fontSize: 13,
    cursor: 'not-allowed',
  },
};
