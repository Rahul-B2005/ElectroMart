// LoginPage
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={authStyles.page}>
      <div style={authStyles.card}>
        <h1 style={authStyles.title}>⚡ Sign In</h1>
        <p style={authStyles.sub}>Welcome back to ElectroShop</p>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={authStyles.input} />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={authStyles.input} />
          <button type="submit" disabled={loading} style={authStyles.btn}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p style={authStyles.link}>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

// RegisterPage
export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={authStyles.page}>
      <div style={authStyles.card}>
        <h1 style={authStyles.title}>⚡ Create Account</h1>
        <p style={authStyles.sub}>Join ElectroShop today</p>
        <form onSubmit={handleSubmit}>
          <input placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={authStyles.input} />
          <input type="email" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={authStyles.input} />
          <input type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} style={authStyles.input} />
          <button type="submit" disabled={loading} style={authStyles.btn}>{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>
        <p style={authStyles.link}>Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}

const authStyles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: 24 },
  card: { background: '#fff', borderRadius: 16, padding: 40, width: '100%', maxWidth: 420, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #eee' },
  title: { textAlign: 'center', fontSize: 26, fontWeight: 800, color: '#1a1a2e', margin: '0 0 6px' },
  sub: { textAlign: 'center', color: '#888', marginBottom: 28, fontSize: 15 },
  input: { display: 'block', width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 10, fontSize: 15, marginBottom: 14, boxSizing: 'border-box' },
  btn: { width: '100%', padding: '13px 0', background: '#1a1a2e', color: '#00d4ff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: 'pointer' },
  link: { textAlign: 'center', color: '#666', fontSize: 14, marginTop: 20 },
  demo: { marginTop: 20, background: '#f8f9fa', borderRadius: 8, padding: 12 },
  code: { display: 'block', fontSize: 12, color: '#555', fontFamily: 'monospace', padding: '2px 0' },
};
