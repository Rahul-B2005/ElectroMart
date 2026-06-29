import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../utils/api';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data));
  }, [id]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>✅</div>
        <h1 style={styles.title}>Order Placed Successfully!</h1>
        <p style={styles.sub}>Thank you for shopping with ElectroShop</p>
        {order && (
          <>
            <div style={styles.orderInfo}>
              <div style={styles.infoRow}><span>Order ID</span><strong>#{order._id.slice(-8).toUpperCase()}</strong></div>
              <div style={styles.infoRow}><span>Total</span><strong>₹{order.totalPrice.toLocaleString()}</strong></div>
              <div style={styles.infoRow}><span>Payment</span><strong>{order.paymentMethod}</strong></div>
              <div style={styles.infoRow}><span>Status</span><strong style={{ color: '#27ae60' }}>{order.orderStatus}</strong></div>
              <div style={styles.infoRow}><span>Delivery to</span><strong>{order.shippingAddress.city}, {order.shippingAddress.state}</strong></div>
            </div>
          </>
        )}
        <div style={styles.btnRow}>
          <Link to={`/orders/${id}`} style={styles.trackBtn}>Track Order</Link>
          <Link to="/products" style={styles.shopBtn}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: 24 },
  card: { background: '#fff', borderRadius: 16, padding: 48, maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  icon: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: 800, color: '#1a1a2e', margin: '0 0 8px' },
  sub: { color: '#888', marginBottom: 28 },
  orderInfo: { background: '#f8f9fa', borderRadius: 10, padding: 20, marginBottom: 28, textAlign: 'left' },
  infoRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '6px 0', borderBottom: '1px solid #eee' },
  btnRow: { display: 'flex', gap: 12 },
  trackBtn: { flex: 1, padding: '12px 0', background: '#1a1a2e', color: '#00d4ff', textDecoration: 'none', borderRadius: 8, fontWeight: 700 },
  shopBtn: { flex: 1, padding: '12px 0', border: '2px solid #1a1a2e', color: '#1a1a2e', textDecoration: 'none', borderRadius: 8, fontWeight: 700 },
};
