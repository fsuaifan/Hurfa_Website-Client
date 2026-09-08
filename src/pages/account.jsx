import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import '../css/admin.css';

function Account() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    try {
      const raw = sessionStorage.getItem('hurfa_user') || localStorage.getItem('hurfa_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const isCustomer =
      sessionStorage.getItem('hurfa_customer_authenticated') === 'true' ||
      localStorage.getItem('hurfa_customer_authenticated') === 'true';
    if (!isCustomer && !user) {
      navigate('/login?redirect=/account', { replace: true });
    }
  }, [navigate, user]);

  useEffect(() => {
    let isMounted = true;
    async function loadUserOrders() {
      if (user?.email) {
        try {
          setLoadingOrders(true);
          const data = await api.orders.getAll({ search: user.email });
          if (isMounted && Array.isArray(data)) {
            setOrders(data);
          }
        } catch (err) {
          console.warn('Could not load user orders from API:', err.message);
        } finally {
          if (isMounted) setLoadingOrders(false);
        }
      }
    }
    loadUserOrders();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleLogout = () => {
    sessionStorage.removeItem('hurfa_customer_authenticated');
    sessionStorage.removeItem('hurfa_user');
    localStorage.removeItem('hurfa_customer_authenticated');
    localStorage.removeItem('hurfa_user');
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Top Header */}
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">Client Portal</span>
            <h1>My Account</h1>
            <p>Welcome back, {user.name}. Manage your orders, inquiries, and saved pieces.</p>
          </div>

          <div className="admin-header-actions">
            <Link to="/products" className="admin-btn admin-btn-outline">
              Browse Catalog
            </Link>
            <Link to="/cart" className="admin-btn admin-btn-primary">
              View Cart
            </Link>
            <button
              type="button"
              className="admin-btn admin-btn-logout"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Profile and Details Card */}
        <section className="admin-stats-grid" aria-label="Account Overview">
          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Membership Status</span>
              <div className="admin-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>
            <div className="admin-stat-value">Active Patron</div>
            <div className="admin-stat-sub">Registered client account</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Email Address</span>
              <div className="admin-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
            </div>
            <div className="admin-stat-value" style={{ fontSize: '1rem', wordBreak: 'break-all' }}>
              {user.email}
            </div>
            <div className="admin-stat-sub">Primary contact email</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Total Orders</span>
              <div className="admin-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
            </div>
            <div className="admin-stat-value">{orders.length}</div>
            <div className="admin-stat-sub">Placed architectural orders</div>
          </div>
        </section>

        {/* User Orders History */}
        <section className="admin-main-section mt-4">
          <h2 className="mb-3">My Bespoke Orders & Requests</h2>

          {loadingOrders ? (
            <p className="text-muted">Loading your orders...</p>
          ) : orders.length === 0 ? (
            <div className="p-4 text-center bg-white rounded border">
              <p className="text-secondary mb-3">You haven't placed any architectural orders yet.</p>
              <Link to="/products" className="btn btn-outline-dark">
                Explore Collections
              </Link>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order Reference</th>
                    <th>Pieces</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="admin-order-code">{o.id}</td>
                      <td>{o.items}</td>
                      <td className="admin-price-cell">{o.total}</td>
                      <td>
                        <span className={`admin-badge-status ${o.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                          {o.status}
                        </span>
                      </td>
                      <td>{o.date || 'Recent'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Account;
