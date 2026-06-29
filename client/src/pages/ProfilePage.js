import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './Profile.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });

  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data } = await api.put('/auth/profile', {
        name: form.name,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
      });

      updateUser(data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePw = async (e) => {
    e.preventDefault();
    setChangingPw(true);

    try {
      await api.put('/auth/change-password', pwForm);

      toast.success('Password changed!');

      setPwForm({
        currentPassword: '',
        newPassword: '',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div style={styles.page} className="profile-page">
      <div style={styles.container}>
        <h1 style={styles.title} className="profile-title">
          My Profile
        </h1>

        <div style={styles.layout} className="profile-layout">

          {/* LEFT */}
          <div className="profile-left">
            <div style={styles.card} className="profile-card">
              <h2 style={styles.cardTitle}>
                Personal Information
              </h2>

              <form onSubmit={handleProfile}>

                {[
                  ['name', 'Full Name', 'text'],
                  ['phone', 'Phone', 'tel'],
                ].map(([k, l, t]) => (
                  <div key={k} style={styles.field}>
                    <label style={styles.label}>
                      {l}
                    </label>

                    <input
                      type={t}
                      value={form[k]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [k]: e.target.value,
                        })
                      }
                      style={styles.input}
                    />
                  </div>
                ))}

                <h3 style={styles.subTitle}>
                  Address
                </h3>

                {[
                  ['street', 'Street'],
                  ['city', 'City'],
                  ['state', 'State'],
                  ['pincode', 'Pincode'],
                ].map(([k, l]) => (
                  <div key={k} style={styles.field}>
                    <label style={styles.label}>
                      {l}
                    </label>

                    <input
                      value={form[k]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [k]: e.target.value,
                        })
                      }
                      style={styles.input}
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={saving}
                  style={styles.btn}
                  className="profile-btn"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT */}
          <div
            style={styles.right}
            className="profile-right"
          >
            <div style={styles.card} className="profile-card">
              <h2 style={styles.cardTitle}>
                Account Info
              </h2>

              <p style={styles.email}>
                {user?.email}
              </p>

              <span
                style={{
                  background:
                    user?.role === 'admin'
                      ? '#fff3cd'
                      : '#e8f4ff',
                  color:
                    user?.role === 'admin'
                      ? '#856404'
                      : '#0066cc',
                  padding: '4px 12px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {user?.role}
              </span>
            </div>

            <div style={styles.card} className="profile-card">
              <h2 style={styles.cardTitle}>
                Change Password
              </h2>

              <form onSubmit={handlePw}>
                <div style={styles.field}>
                  <label style={styles.label}>
                    Current Password
                  </label>

                  <input
                    type="password"
                    required
                    value={pwForm.currentPassword}
                    onChange={(e) =>
                      setPwForm({
                        ...pwForm,
                        currentPassword:
                          e.target.value,
                      })
                    }
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>
                    New Password
                  </label>

                  <input
                    type="password"
                    required
                    minLength={6}
                    value={pwForm.newPassword}
                    onChange={(e) =>
                      setPwForm({
                        ...pwForm,
                        newPassword:
                          e.target.value,
                      })
                    }
                    style={styles.input}
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPw}
                  style={styles.btn}
                  className="profile-btn"
                >
                  {changingPw
                    ? 'Changing...'
                    : 'Change Password'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    marginLeft: 300,
    background: '#f8f9fa',
    minHeight: '80vh',
    padding: '32px 24px',
  },

  container: {
    maxWidth: 900,
    margin: '0 auto',
  },

  title: {
    fontSize: 26,
    marginLeft: '190px',
    fontWeight: 700,
    color: '#1a1a2e',
    marginBottom: 24,
  },

  layout: {
    display: 'flex',
    gap: 24,
    alignItems: 'flex-start',
  },

  card: {
    background: '#fff',
    borderRadius: 12,
    padding: 24,
    border: '1px solid #eee',
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1a1a2e',
    marginBottom: 16,
  },

  subTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#666',
    margin: '16px 0 10px',
  },

  field: {
    marginBottom: 12,
  },

  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#555',
    marginBottom: 5,
  },

  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 14,
    boxSizing: 'border-box',
  },

  btn: {
    padding: '10px 24px',
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8,
  },

  right: {
    width: 280,
    flexShrink: 0,
  },

  email: {
    color: '#555',
    fontSize: 14,
    marginBottom: 10,
  },
};