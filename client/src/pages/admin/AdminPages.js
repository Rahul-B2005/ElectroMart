import { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import "./AdminPages.css";

/* ==========================================
   ADMIN SIDEBAR
========================================== */

function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <div className="admin-side-title">
        ADMIN PANEL
      </div>

      <Link
        to="/"
        className="admin-side-link"
      >
        🏠 Store
      </Link>

      <div className="admin-divider"></div>

      <Link
        to="/admin"
        className="admin-side-link"
      >
        📊 Dashboard
      </Link>

      <Link
        to="/admin/products"
        className="admin-side-link"
      >
        📦 Products
      </Link>

      <Link
        to="/admin/orders"
        className="admin-side-link"
      >
        🛍 Orders
      </Link>

      <Link
        to="/admin/users"
        className="admin-side-link"
      >
        👥 Users
      </Link>
    </div>
  );
}

/* ==========================================
   ADMIN DASHBOARD
========================================== */

export function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  useEffect(() => {
    Promise.all([
      api.get("/products?limit=1"),
      api.get("/orders"),
      api.get("/users"),
    ])
      .then(([p, o, u]) => {
        const revenue =
          o.data.orders?.reduce(
            (acc, order) =>
              acc + order.totalPrice,
            0
          ) || 0;

        setStats({
          products: p.data.total,
          orders: o.data.total,
          users: u.data.total,
          revenue,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const cards = [
    {
      label: "Total Products",
      value: stats.products,
      color: "#3498db",
    },
    {
      label: "Total Orders",
      value: stats.orders,
      color: "#27ae60",
    },
    {
      label: "Total Users",
      value: stats.users,
      color: "#9b59b6",
    },
    {
      label: "Revenue",
      value: `₹${(
        stats.revenue / 1000
      ).toFixed(1)}K`,
      color: "#f39c12",
    },
  ];

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="admin-main">
        <h1 className="admin-title">
          Dashboard
        </h1>

        <div className="admin-stat-grid">
          {cards.map((card) => (
            <div
              key={card.label}
              className="admin-stat-card"
            >
              <div
                className="admin-stat-number"
                style={{
                  color: card.color,
                }}
              >
                {card.value}
              </div>

              <div className="admin-stat-label">
                {card.label}
              </div>
            </div>
          ))}
        </div>

        <div className="admin-info-box">
          <p>
            Use the sidebar to manage
            products, orders and users.
          </p>
        </div>
      </div>
    </div>
  );
}



/* ==========================================
   ADMIN PRODUCTS
========================================== */

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await api.get(
        "/products?limit=50"
      );

      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    }
  };

  const handleDelete = async (
    id,
    name
  ) => {
    const confirmDelete =
      window.confirm(
        `Delete "${name}" ?`
      );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);

      setProducts((prev) =>
        prev.filter(
          (product) =>
            product._id !== id
        )
      );

      toast.success(
        "Product deleted successfully"
      );
    } catch (error) {
      console.error(error);
      toast.error(
        "Delete operation failed"
      );
    }
  };

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="admin-main">
        <div className="admin-toolbar">
          <h1 className="admin-title">
            Products
          </h1>

          <button
            className="admin-btn add-btn"
            onClick={() =>
              navigate(
                "/admin/products/new"
              )
            }
          >
            + Add Product
          </button>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length > 0 ? (
                products.map(
                  (product) => (
                    <tr
                      key={product._id}
                    >
                      <td>
                        <img
                          src={
                            product
                              .images?.[0]
                          }
                          alt={
                            product.name
                          }
                          className="product-image"
                        />
                      </td>

                      <td>
                        <div className="product-name">
                          {product.name}
                        </div>

                        <div className="product-brand">
                          {
                            product.brand
                          }
                        </div>
                      </td>

                      <td>
                        {
                          product.category
                        }
                      </td>

                      <td>
                        ₹
                        {product.price.toLocaleString()}
                      </td>

                      <td>
                        <span
                          className={
                            product.stock >
                            0
                              ? "badge success"
                              : "badge danger"
                          }
                        >
                          {product.stock >
                          0
                            ? product.stock
                            : "Out"}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className="admin-btn edit-btn"
                            onClick={() =>
                              navigate(
                                `/admin/products/edit/${product._id}`
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="admin-btn delete-btn"
                            onClick={() =>
                              handleDelete(
                                product._id,
                                product.name
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="empty-state"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   ADMIN ORDERS
========================================== */

export function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const statusColors = {
    Processing: "warning",
    Confirmed: "info",
    Shipped: "primary",
    Delivered: "success",
    Cancelled: "danger",
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data.orders || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    }
  };

  const updateStatus = async (id, orderStatus) => {
    try {
      const { data } = await api.put(
        `/orders/${id}/status`,
        { orderStatus }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? data : order
        )
      );

      toast.success("Order status updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="admin-main">
        <div className="admin-toolbar">
          <h1 className="admin-title">
            Orders ({orders.length})
          </h1>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <strong>
                        #
                        {order._id
                          .slice(-8)
                          .toUpperCase()}
                      </strong>
                    </td>

                    <td>
                      <div className="customer-name">
                        {order.user?.name ||
                          "Unknown User"}
                      </div>

                      <div className="customer-email">
                        {order.user?.email}
                      </div>
                    </td>

                    <td>
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <strong>
                        ₹
                        {order.totalPrice?.toLocaleString()}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          statusColors[
                            order.orderStatus
                          ]
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td>
                      <select
                        className="status-select"
                        value={
                          order.orderStatus
                        }
                        onChange={(e) =>
                          updateStatus(
                            order._id,
                            e.target.value
                          )
                        }
                      >
                        <option value="Processing">
                          Processing
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Shipped">
                          Shipped
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="empty-state"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==============================
// ADMIN USERS
// ==============================

export function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const toggleRole = async (id, currentRole) => {
    const role = currentRole === 'admin' ? 'user' : 'admin';

    if (!window.confirm(`Change role to ${role}?`)) return;

    try {
      const { data } = await api.put(`/users/${id}/role`, {
        role,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? data : user
        )
      );

      toast.success('User role updated');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to update role'
      );
    }
  };

  const deleteUser = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${name}?`
      )
    )
      return;

    try {
      await api.delete(`/users/${id}`);

      setUsers((prev) =>
        prev.filter((user) => user._id !== id)
      );

      toast.success('User deleted');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to delete user'
      );
    }
  };

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="admin-main">
        <div className="admin-toolbar">
          <h1 className="admin-title">
            Users ({users.length})
          </h1>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <strong>{user.name}</strong>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          user.role === 'admin'
                            ? 'badge-warning'
                            : 'badge-info'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        user.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-secondary"
                          onClick={() =>
                            toggleRole(
                              user._id,
                              user.role
                            )
                          }
                        >
                          {user.role === 'admin'
                            ? 'Make User'
                            : 'Make Admin'}
                        </button>

                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            deleteUser(
                              user._id,
                              user.name
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="empty-state"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==============================
// PRODUCT FORM
// ==============================

export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Smartphones',
    brand: '',
    images: '',
    stock: '',
    featured: false,
  });

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);

      setForm({
        name: data.name || '',
        description: data.description || '',
        price: data.price || '',
        originalPrice: data.originalPrice || '',
        category: data.category || 'Smartphones',
        brand: data.brand || '',
        images: data.images?.join(', ') || '',
        stock: data.stock || '',
        featured: data.featured || false,
      });
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/admin/products');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      stock: Number(form.stock),
      images: form.images
        .split(',')
        .map((img) => img.trim())
        .filter(Boolean),
    };

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', payload);
        toast.success('Product created successfully');
      }

      navigate('/admin/products');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to save product'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="admin-main">
        <h1 className="admin-title">
          {isEdit
            ? 'Edit Product'
            : 'Add New Product'}
        </h1>

        <form
          className="product-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label>Product Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              rows="5"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹)</label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Original Price (₹)</label>

              <input
                type="number"
                name="originalPrice"
                value={form.originalPrice}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Brand</label>

              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock</label>

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="Smartphones">
                Smartphones
              </option>
              <option value="Laptops">
                Laptops
              </option>
              <option value="Audio">
                Audio
              </option>
              <option value="Cameras">
                Cameras
              </option>
              <option value="Gaming">
                Gaming
              </option>
              <option value="Accessories">
                Accessories
              </option>
              <option value="TVs">
                TVs
              </option>
              <option value="Tablets">
                Tablets
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Product Images (comma separated URLs)
            </label>

            <input
              type="text"
              name="images"
              value={form.images}
              onChange={handleChange}
              placeholder="https://image1.jpg, https://image2.jpg"
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />

            <label htmlFor="featured">
              Featured Product
            </label>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? 'Saving...'
                : isEdit
                ? 'Update Product'
                : 'Create Product'}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                navigate('/admin/products')
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminSidebar;