import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import '../css/admin.css';

function Account() {
  const { t } = useLanguage();
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
    async function loadOrders() {
      if (user?.email) {
        try {
          const data = await api.orders.getAll({ search: user.email });
          if (isMounted && Array.isArray(data)) {
            setOrders(data);
          }
        } catch (e) {
          console.warn('Orders API fallback:', e.message);
        }
      }
    }
    loadOrders();
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
            <span className="admin-eyebrow">{t('clientPortal', 'Client Portal')}</span>
            <h1>{t('myAccount', 'My Account')}</h1>
            <p>{t('welcomeBackAccount', 'Welcome back,')} {user.name}. {t('manageAccountDesc', 'Manage your orders, inquiries, and saved pieces.')}</p>
          </div>

          <div className="admin-header-actions">
            <Link to="/products" className="admin-btn admin-btn-outline">
              {t('browseCatalog', 'Browse Catalog')}
            </Link>
            <Link to="/cart" className="admin-btn admin-btn-primary">
              {t('viewCart', 'View Cart')}
            </Link>
            <button
              type="button"
              className="admin-btn admin-btn-logout"
              onClick={handleLogout}
            >
              {t('logOut', 'Log Out')}
            </button>
          </div>
        </header>

        {/* Profile and Details Card */}
        <section className="admin-stats-grid" aria-label={t('clientPortal', 'Account Overview')}>
          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span className="admin-stat-label">{t('membershipStatus', 'Membership Status')}</span>
              <div className="admin-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>
            <h2 className="admin-stat-value">Hurfa Atelier</h2>
            <span className="admin-stat-trend">{t('clientSince', 'Client since 2026')}</span>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span className="admin-stat-label">{t('savedCollections', 'Saved Collections')}</span>
              <div className="admin-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
            <h2 className="admin-stat-value">3</h2>
            <span className="admin-stat-trend">{t('kitchensAndBedroomsSets', 'Kitchens & Bedroom sets')}</span>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span className="admin-stat-label">{t('designInquiries', 'Design Inquiries')}</span>
              <div className="admin-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
            <h2 className="admin-stat-value">{orders.length > 0 ? `${orders.length} ${t('active', 'Active')}` : `1 ${t('active', 'Active')}`}</h2>
            <span className="admin-stat-trend">{t('consultationScheduled', 'Consultation scheduled')}</span>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span className="admin-stat-label">{t('deliveryService', 'Delivery Service')}</span>
              <div className="admin-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
            </div>
            <h2 className="admin-stat-value">{t('whiteGlove', 'White-Glove')}</h2>
            <span className="admin-stat-trend">{t('jordanInstallationIncluded', 'Jordan installation included')}</span>
          </div>
        </section>

        {/* Profile Details Card */}
        <div className="admin-card mb-4">
          <div className="admin-card-header">
            <h2>{t('accountDetails', 'Account Details')}</h2>
          </div>
          <div style={{ padding: '24px' }}>
            <div className="row g-3">
              <div className="col-md-6">
                <label style={{ fontSize: '0.8125rem', textTransform: 'uppercase', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                  {t('fullName', 'Full Name')}
                </label>
                <p style={{ fontSize: '1rem', fontWeight: '500', color: '#111827' }}>
                  {user.name}
                </p>
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: '0.8125rem', textTransform: 'uppercase', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                  {t('emailAddress', 'Email Address')}
                </label>
                <p style={{ fontSize: '1rem', fontWeight: '500', color: '#111827' }}>
                  {user.email}
                </p>
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: '0.8125rem', textTransform: 'uppercase', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                  {t('accountRole', 'Account Role')}
                </label>
                <p style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', textTransform: 'capitalize' }}>
                  {user.role || t('clientMember', 'Client Member')}
                </p>
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: '0.8125rem', textTransform: 'uppercase', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                  {t('locationServiceArea', 'Location Service Area')}
                </label>
                <p style={{ fontSize: '1rem', fontWeight: '500', color: '#111827' }}>
                  {t('ammanJordanComplimentary', 'Amman, Jordan (Complimentary Delivery)')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Consultation Banner */}
        <div className="admin-card mb-4">
          <div className="admin-card-header">
            <h2>{t('architecturalConsultations', 'Architectural Consultations')}</h2>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <strong style={{ fontSize: '1.0625rem', color: '#111827' }}>
                  {t('spaceAssessment', 'On-Site Space & Material Assessment')}
                </strong>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '4px' }}>
                  {t('statusLabel', 'Status:')} <span className="admin-status-badge in-production">{t('scheduled', 'Scheduled')}</span> • {t('dedicatedArchitect', 'Dedicated Architect: Eng. Tariq')}
                </p>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-outline"
                onClick={() => alert(t('consultationDetailsAlert', 'Consultation details sent to your registered email.'))}
              >
                {t('viewDetails', 'View Details')}
              </button>
            </div>
          </div>
        </div>

        {/* My Orders Table */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>{t('myOrdersHeading', 'My Orders & Bespoke Requests')} ({orders.length})</h2>
          </div>
          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('orderCode', 'Order Code')}</th>
                  <th>{t('piecesDetails', 'Pieces & Details')}</th>
                  <th>{t('total', 'Total')}</th>
                  <th>{t('orderDate', 'Date')}</th>
                  <th>{t('orderStatus', 'Status')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '36px', color: '#6b7280' }}>
                      {t('noPastOrders', 'No past orders found.')}{' '}
                      <Link to="/products" style={{ color: '#0f3a2b', fontWeight: 600 }}>
                        {t('catalog', 'Catalog')}
                      </Link>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong className="admin-order-id">{order.id}</strong>
                      </td>
                      <td>{order.items}</td>
                      <td>
                        <span className="admin-price">{order.total}</span>
                      </td>
                      <td>{order.date}</td>
                      <td>
                        <span
                          className={`admin-status-badge ${order.status
                            ?.toLowerCase()
                            .replace(/\s+/g, '-') || 'in-production'}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
