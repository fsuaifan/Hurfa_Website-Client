import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/admin.css';

function Account() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    try {
      const raw = sessionStorage.getItem('hurfa_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const isCustomer = sessionStorage.getItem('hurfa_customer_authenticated') === 'true';
    if (!isCustomer && !user) {
      navigate('/login?redirect=/account', { replace: true });
    }
  }, [navigate, user]);

  const handleLogout = () => {
    sessionStorage.removeItem('hurfa_customer_authenticated');
    sessionStorage.removeItem('hurfa_user');
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
            <h2 className="admin-stat-value">Hurfa Atelier</h2>
            <span className="admin-stat-trend">Client since 2026</span>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Saved Collections</span>
              <div className="admin-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
            <h2 className="admin-stat-value">3</h2>
            <span className="admin-stat-trend">Kitchens & Bedroom sets</span>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Design Inquiries</span>
              <div className="admin-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
            <h2 className="admin-stat-value">1 Active</h2>
            <span className="admin-stat-trend">Consultation scheduled</span>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Delivery Service</span>
              <div className="admin-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
            </div>
            <h2 className="admin-stat-value">White-Glove</h2>
            <span className="admin-stat-trend">Jordan installation included</span>
          </div>
        </section>

        {/* Profile Details Card */}
        <div className="admin-card mb-4">
          <div className="admin-card-header">
            <h2>Account Details</h2>
          </div>
          <div style={{ padding: '24px 32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#78716c', fontWeight: 600 }}>
                  Full Name
                </span>
                <p style={{ fontSize: '1.1rem', fontWeight: 500, margin: '6px 0 0', color: '#1f1d1b' }}>
                  {user.name}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#78716c', fontWeight: 600 }}>
                  Email Address
                </span>
                <p style={{ fontSize: '1.1rem', fontWeight: 500, margin: '6px 0 0', color: '#1f1d1b' }}>
                  {user.email}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#78716c', fontWeight: 600 }}>
                  Contact Phone
                </span>
                <p style={{ fontSize: '1.1rem', fontWeight: 500, margin: '6px 0 0', color: '#1f1d1b' }}>
                  {user.phone || '+962 7 9000 0000'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders / Consultations */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Recent Consultations & Orders</h2>
          </div>
          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Item / Consultation</th>
                  <th>Reference</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="admin-prod-cell">
                      <img
                        src="https://ik.imagekit.io/6dghafkgmq/Kitchens/Kit3V4.jpg?updatedAt=1779196664060"
                        alt="Kitchen Consultation"
                        className="admin-prod-thumb"
                      />
                      <div>
                        <p className="admin-prod-title">Tayf Kitchen Architectural Consultation</p>
                      </div>
                    </div>
                  </td>
                  <td>#HUR-9821</td>
                  <td>
                    <span className="admin-badge admin-badge-active">Confirmed</span>
                  </td>
                  <td>Oct 14, 2026</td>
                  <td>
                    <Link to="/kitchens" className="admin-action-btn admin-action-edit" style={{ textDecoration: 'none', display: 'inline-block' }}>
                      View Piece
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
