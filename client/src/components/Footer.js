import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.col}>
          <h3 style={styles.brand}>⚡ ElectroShop</h3>
          <p style={styles.text}>Your one-stop destination for the latest electronics at the best prices.</p>
        </div>
        <div style={styles.col}>
          <h4 style={styles.heading}>Shop</h4>
          {['Smartphones','Laptops','Audio','Cameras','Gaming','Accessories'].map(c => (
            <Link key={c} to={`/products?category=${c}`} style={styles.link}>{c}</Link>
          ))}
        </div>
        <div style={styles.col}>
          <h4 style={styles.heading}>Account</h4>
          <Link to="/profile" style={styles.link}>My Profile</Link>
          <Link to="/orders" style={styles.link}>My Orders</Link>
          <Link to="/cart" style={styles.link}>Cart</Link>
        </div>
        <div style={styles.col}>
          <h4 style={styles.heading}>Support</h4>
          <span style={styles.text}>📧 support@electroshop.com</span>
          <span style={styles.text}>📞 1800-123-4567</span>
          <span style={styles.text}>Mon–Sat, 9am–6pm</span>
        </div>
      </div>
      <div style={styles.bottom}>
        <span>© 2025 ElectroShop. All rights reserved.</span>
      </div>
    </footer>
  );
}

const styles = {
  footer: { background: '#1a1a2e', color: '#ccc', marginTop: 60 },
  inner: { maxWidth: 1200, margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 32 },
  col: { display: 'flex', flexDirection: 'column', gap: 8 },
  brand: { color: '#00d4ff', margin: '0 0 8px', fontSize: 18 },
  heading: { color: '#fff', margin: '0 0 8px', fontSize: 15, fontWeight: 600 },
  link: { color: '#aaa', textDecoration: 'none', fontSize: 13 },
  text: { color: '#888', fontSize: 13, lineHeight: 1.6 },
  bottom: { borderTop: '1px solid #2a2a4a', textAlign: 'center', padding: '16px 24px', fontSize: 13, color: '#666' },
};
