import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './Orders.css';

const statusColor = { Processing: '#f39c12', Confirmed: '#3498db', Shipped: '#9b59b6', Delivered: '#27ae60', Cancelled: '#e74c3c' };

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.center}>Loading orders...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>My Orders</h1>
        {orders.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: 48 }}>📦</p>
            <p>No orders yet. <Link to="/products">Start shopping!</Link></p>
          </div>
        ) : orders.map(order => (
          <div key={order._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <span style={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</span>
                <span style={styles.date}>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={styles.right}>
                <span style={{ ...styles.statusBadge, background: statusColor[order.orderStatus] + '22', color: statusColor[order.orderStatus] }}>{order.orderStatus}</span>
                <strong style={styles.total}>₹{order.totalPrice.toLocaleString()}</strong>
              </div>
            </div>
            <div style={styles.items}>
              {order.items?.slice(0,3).map((item, i) => (
                <span key={i} style={styles.itemChip}>{item.name} ×{item.quantity}</span>
              ))}
              {order.items?.length > 3 && <span style={styles.more}>+{order.items.length - 3} more</span>}
            </div>
            <Link to={`/orders/${order._id}`} style={styles.viewBtn}>View Details →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const { data } = await api.put(`/orders/${id}/cancel`);
      setOrder(data); toast.success('Order cancelled');
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel'); } finally { setCancelling(false); }
  };

  if (!order) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={{ ...styles.container, maxWidth: 800 }}>
        <h1 style={styles.title}>Order Details</h1>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <span style={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</span>
              <span style={styles.date}>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <span style={{ ...styles.statusBadge, background: statusColor[order.orderStatus] + '22', color: statusColor[order.orderStatus] }}>{order.orderStatus}</span>
          </div>

          <h3 style={styles.section}>Items</h3>
          {order.items.map((item, i) => (
            <div key={i} style={styles.item}>
              <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} style={styles.itemImg} />
              <span style={styles.itemName}>{item.name}</span>
              <span style={styles.itemQty}>×{item.quantity}</span>
              <span style={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}

          <h3 style={styles.section}>Shipping Address</h3>
          <div style={styles.addressBlock}>
            <strong>{order.shippingAddress.name}</strong><br />
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
            📞 {order.shippingAddress.phone}
          </div>

          <h3 style={styles.section}>Payment</h3>
          <div style={styles.addressBlock}>
            Method: <strong>{order.paymentMethod}</strong> &nbsp;|&nbsp;
            Status: <strong style={{ color: order.paymentStatus === 'Paid' ? '#27ae60' : '#f39c12' }}>{order.paymentStatus}</strong>
          </div>

          <h3 style={styles.section}>Price Breakdown</h3>
          <div style={styles.priceRow}><span>Items</span><span>₹{order.itemsPrice.toLocaleString()}</span></div>
          <div style={styles.priceRow}><span>Tax</span><span>₹{order.taxPrice.toLocaleString()}</span></div>
          <div style={styles.priceRow}><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
          <div style={{ ...styles.priceRow, fontWeight: 700, fontSize: 16, borderTop: '2px solid #eee', paddingTop: 10 }}><span>Total</span><span>₹{order.totalPrice.toLocaleString()}</span></div>

          {['Processing', 'Confirmed'].includes(order.orderStatus) && (
            <button onClick={handleCancel} disabled={cancelling} style={styles.cancelBtn}>
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
        <Link to="/orders" style={{ display: 'inline-block', marginTop: 16, color: '#666', textDecoration: 'none', fontSize: 14 }}>← Back to Orders</Link>
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#f8f9fa', minHeight: '80vh', padding: '32px 24px' },
  container: { maxWidth: 900, margin: '0 auto' },
  center: { textAlign: 'center', padding: 80, fontSize: 16, color: '#666' },
  title: { fontSize: 26, fontWeight: 700, color: '#1a1a2e', marginBottom: 24 },
  card: { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #eee', marginBottom: 12 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 },
  right: { display: 'flex', alignItems: 'center', gap: 12 },
  orderId: { fontWeight: 700, fontSize: 15, color: '#1a1a2e', marginRight: 12 },
  date: { color: '#888', fontSize: 13 },
  statusBadge: { padding: '3px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600 },
  total: { fontSize: 16, color: '#1a1a2e' },
  items: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  itemChip: { background: '#f0f0f0', borderRadius: 6, padding: '3px 10px', fontSize: 12, color: '#555' },
  more: { background: '#e8f4ff', borderRadius: 6, padding: '3px 10px', fontSize: 12, color: '#0066cc' },
  viewBtn: { color: '#0066cc', textDecoration: 'none', fontSize: 14, fontWeight: 600 },
  section: { fontSize: 14, fontWeight: 700, color: '#1a1a2e', margin: '20px 0 10px', paddingTop: 16, borderTop: '1px solid #f0f0f0' },
  item: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #f5f5f5' },
  itemImg: { width: 50, height: 50, objectFit: 'contain', background: '#f8f9fa', borderRadius: 6 },
  itemName: { flex: 1, fontSize: 14, color: '#333' },
  itemQty: { color: '#888', fontSize: 13 },
  itemPrice: { fontWeight: 600, fontSize: 14 },
  addressBlock: { background: '#f8f9fa', borderRadius: 8, padding: 14, fontSize: 14, color: '#555', lineHeight: 1.8 },
  priceRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555', padding: '6px 0' },
  cancelBtn: { marginTop: 20, padding: '10px 24px', background: '#fff', border: '2px solid #e74c3c', color: '#e74c3c', borderRadius: 8, fontWeight: 600, cursor: 'pointer' },
  empty: { textAlign: 'center', padding: 60, color: '#666' },

};
