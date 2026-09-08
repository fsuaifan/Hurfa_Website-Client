import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import '../css/admin.css';

function Admin() {
  const { t, getLocalizedName, getLocalizedCategory } = useLanguage();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('catalog'); // 'catalog' | 'orders' | 'clients'
  const [loading, setLoading] = useState(true);

  // Catalog State
  const [records, setRecords] = useState(() => {
    try {
      const stored = localStorage.getItem('hurfa_catalog_records');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error(err);
    }
    return [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Clients State
  const [clients, setClients] = useState([]);
  const [clientSearchQuery, setClientSearchQuery] = useState('');

  // Fetch live records from backend on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const data = await api.catalog.getAll();
        if (isMounted && Array.isArray(data)) {
          setRecords(data);
        }
      } catch (e) {
        console.warn('Catalog API warning:', e.message);
      }

      try {
        const ordersData = await api.orders.getAll();
        if (isMounted && Array.isArray(ordersData)) {
          setOrders(ordersData);
        }
      } catch (e) {
        console.warn('Orders API warning:', e.message);
      }

      try {
        const clientsData = await api.clients.getAll();
        if (isMounted && Array.isArray(clientsData)) {
          setClients(clientsData);
        }
      } catch (e) {
        console.warn('Clients API warning:', e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('hurfa_admin_authenticated');
    sessionStorage.removeItem('hurfa_user');
    navigate('/login?redirect=/admin', { replace: true });
  };

  const handleDeleteRecord = async (id, name) => {
    if (window.confirm(`${t('confirmDeleteRecord', 'Are you sure you want to remove')} "${name}" ${t('fromTheCatalog', 'from the catalog?')}`)) {
      try {
        await api.catalog.delete(id);
      } catch (e) {
        console.warn('Delete API fallback:', e.message);
      }
      setRecords((prev) => {
        const updated = prev.filter((r) => r.id !== id);
        try {
          localStorage.setItem('hurfa_catalog_records', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId, currentStatus) => {
    const newStatus = window.prompt(
      `${t('updateStatusFor', 'Update status for')} ${orderId} (${t('status', 'Status')}: ${currentStatus}):\nOptions: In Production, Ready for Delivery, Delivered, Consultation Scheduled`,
      currentStatus
    );
    if (newStatus && newStatus.trim()) {
      try {
        await api.orders.updateStatus(orderId, newStatus.trim());
      } catch (e) {
        console.warn('Order status API fallback:', e.message);
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus.trim() } : o))
      );
    }
  };

  const handleAddClient = async () => {
    const name = window.prompt(t('enterClientFullName', 'Enter client full name:'));
    if (!name || !name.trim()) return;
    const email = window.prompt(t('enterClientEmail', 'Enter client email address:'), 'client@example.com') || 'client@example.com';
    const phone = window.prompt(t('enterClientPhone', 'Enter client phone:'), '+962 7 9000 0000') || '+962 7 9000 0000';
    const city = window.prompt(t('enterDistrictCity', 'Enter district/city:'), 'Amman (Abdoun)') || 'Amman';

    const newClient = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      totalOrders: 0,
      totalSpent: 'JOD 0',
      status: 'Prospect',
      lastActive: 'Just now',
    };

    try {
      await api.clients.create({
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        city: newClient.city,
        status: 'Prospect',
      });
    } catch (e) {
      console.warn('Client create API fallback:', e.message);
    }

    setClients((prev) => [newClient, ...prev]);
  };

  // Filtered Catalog
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesCategory =
        selectedCategory === 'All' || r.category === selectedCategory || (r.category && r.category.includes(selectedCategory));
      const matchesSearch =
        (r.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.category || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [records, searchQuery, selectedCategory]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus =
        orderStatusFilter === 'All' || o.status === orderStatusFilter;
      const matchesSearch =
        (o.id || '').toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        (o.clientName || '').toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        (o.items || '').toLowerCase().includes(orderSearchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderSearchQuery, orderStatusFilter]);

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const query = clientSearchQuery.toLowerCase();
      return (
        (c.name || '').toLowerCase().includes(query) ||
        (c.email || '').toLowerCase().includes(query) ||
        (c.city || '').toLowerCase().includes(query) ||
        (c.phone || '').toLowerCase().includes(query)
      );
    });
  }, [clients, clientSearchQuery]);

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Header Bar */}
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">{t('studioPortal', 'Studio Portal')}</span>
            <h1>{t('managementConsole', 'Management Console')}</h1>
            <p>{t('hurfaStudioPortalDesc', 'Hurfa Architectural Studio • Catalog, Orders & Client Directory')}</p>
          </div>

          <div className="admin-header-actions">
            <Link to="/editor" className="admin-btn admin-btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {t('addNewPiece', 'Add New Piece')}
            </Link>
            <Link to="/products" className="admin-btn admin-btn-outline" target="_blank" rel="noreferrer">
              {t('liveWebsite', 'Live Website ↗')}
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

        {/* Top-Level Section Switcher Tabs */}
        <div className="admin-nav-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === 'catalog'}
            className={`admin-nav-tab ${activeSection === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveSection('catalog')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
            {t('furnitureCatalog', 'Furniture Catalog')} ({records.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === 'orders'}
            className={`admin-nav-tab ${activeSection === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveSection('orders')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {t('ordersAndRequests', 'Orders & Inquiries')} ({orders.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === 'clients'}
            className={`admin-nav-tab ${activeSection === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveSection('clients')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {t('clientDirectory', 'Client Directory')} ({clients.length})
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: CATALOG */}
        {/* ========================================================================= */}
        {activeSection === 'catalog' && (
          <>
            {/* Hurfa KPI Overview Cards */}
            <section className="admin-stats-grid" aria-label={t('furnitureCatalog', 'Catalog KPIs')}>
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('totalCatalogItems', 'Total Catalog Items')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m7.5 4.27 9 5.15" />
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                      <path d="m3.3 7 8.7 5 8.7-5" />
                      <path d="M12 22V12" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">{records.length}</h2>
                <span className="admin-stat-trend">{t('liveAcrossWeb', 'Live across web & boutique')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('bedroomPieces', 'Bedroom Pieces')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 4v16" />
                      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                      <path d="M2 17h20" />
                      <path d="M6 8v9" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">
                  {records.filter((r) => r.category === 'Bedrooms' || (r.category && r.category.includes('Bedroom'))).length}
                </h2>
                <span className="admin-stat-trend">{t('framesWardrobesNightstands', 'Frames, wardrobes & nightstands')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('kitchenSystems', 'Kitchen Systems')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M9 21V9" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">
                  {records.filter((r) => r.category === 'Kitchens' || (r.category && r.category.includes('Kitchen'))).length}
                </h2>
                <span className="admin-stat-trend">{t('chicOrganicContemporary', 'Chic, Organic & Contemporary')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('signatureCollections', 'Signature Collections')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">2</h2>
                <span className="admin-stat-trend">{t('theOudAndTheWesalSuite', 'The Oud & The Wesal Suite')}</span>
              </div>
            </section>

            {/* Filter and Search Controls */}
            <div className="admin-table-controls">
              <input
                type="text"
                className="admin-search-input"
                placeholder={t('searchPieceNameOrCat', 'Search piece name or category...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <select
                className="admin-category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">{t('allCategories', 'All Categories')}</option>
                <option value="Kitchens">{t('Kitchens', 'Kitchens')}</option>
                <option value="Bedrooms">{t('Bedrooms', 'Bedrooms')}</option>
                <option value="Living Room">{t('Living Room', 'Living Room')}</option>
                <option value="Living Room Tables">{t('Living Room Tables', 'Living Room Tables')}</option>
              </select>
            </div>

            {/* Records Table Card */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>{t('catalogRecords', 'Catalog Records')} ({filteredRecords.length})</h2>
              </div>

              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t('productCol', 'Product')}</th>
                      <th>{t('category', 'Category')}</th>
                      <th>{t('price', 'Price')}</th>
                      <th>{t('status', 'Status')}</th>
                      <th>{t('actions', 'Actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                          {t('noMatchingRecordsFound', 'No matching records found.')}
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="admin-prod-cell">
                              <img
                                src={item.image || item.images?.[0]}
                                alt={getLocalizedName(item)}
                                className="admin-prod-thumb"
                                loading="lazy"
                              />
                              <div>
                                <p className="admin-prod-title">{getLocalizedName(item)}</p>
                              </div>
                            </div>
                          </td>
                          <td>{getLocalizedCategory(item.category || item)}</td>
                          <td>
                            <span className="admin-price">{item.price}</span>
                          </td>
                          <td>
                            <span
                              className={`admin-badge-stock ${
                                item.stockStatus === 'Active' ? 'active' : 'low'
                              }`}
                            >
                              {t(item.stockStatus || 'Active', item.stockStatus || 'Active')}
                            </span>
                          </td>
                          <td>
                            <div className="admin-actions-cell">
                              <Link
                                to={`/editor?id=${item.id}`}
                                className="admin-action-btn edit"
                                title={t('editPiece', 'Edit piece specifications')}
                              >
                                {t('edit', 'Edit')}
                              </Link>
                              <button
                                type="button"
                                className="admin-action-btn delete"
                                onClick={() => handleDeleteRecord(item.id, item.name)}
                                title={t('deletePiece', 'Remove piece from catalog')}
                              >
                                {t('delete', 'Delete')}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: ORDERS & INQUIRIES */}
        {/* ========================================================================= */}
        {activeSection === 'orders' && (
          <>
            {/* Orders KPIs */}
            <section className="admin-stats-grid" aria-label={t('ordersAndRequests', 'Order KPIs')}>
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('totalInquiriesOrders', 'Total Inquiries / Orders')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">{orders.length}</h2>
                <span className="admin-stat-trend">{t('lifetimeStudioRequests', 'Lifetime Studio Requests')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('inProduction', 'In Production')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">
                  {orders.filter((o) => o.status === 'In Production').length}
                </h2>
                <span className="admin-stat-trend">{t('workshopJordanActive', 'Workshop Jordan Active')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('readyForDelivery', 'Ready for Delivery')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">
                  {orders.filter((o) => o.status === 'Ready for Delivery').length}
                </h2>
                <span className="admin-stat-trend">{t('qualityInspectedPacked', 'Quality Inspected & Packed')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('consultationsScheduled', 'Consultations Scheduled')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">
                  {orders.filter((o) => o.status === 'Consultation Scheduled').length}
                </h2>
                <span className="admin-stat-trend">{t('architecturalOnSiteVisits', 'Architectural On-Site Visits')}</span>
              </div>
            </section>

            {/* Controls */}
            <div className="admin-table-controls">
              <input
                type="text"
                className="admin-search-input"
                placeholder={t('searchOrderIdClient', 'Search order ID, client name, or piece...')}
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
              />

              <select
                className="admin-category-filter"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
              >
                <option value="All">{t('allStatuses', 'All Statuses')}</option>
                <option value="In Production">{t('inProduction', 'In Production')}</option>
                <option value="Ready for Delivery">{t('readyForDelivery', 'Ready for Delivery')}</option>
                <option value="Delivered">{t('delivered', 'Delivered')}</option>
                <option value="Consultation Scheduled">{t('consultationScheduled', 'Consultation Scheduled')}</option>
              </select>
            </div>

            {/* Orders Table */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>{t('bespokeOrdersInquiries', 'Bespoke Orders & Inquiries')} ({filteredOrders.length})</h2>
              </div>

              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t('orderCode', 'Order Code')}</th>
                      <th>{t('clientName', 'Client Name')}</th>
                      <th>{t('itemsAndDetails', 'Items & Details')}</th>
                      <th>{t('totalValue', 'Total Value')}</th>
                      <th>{t('date', 'Date')}</th>
                      <th>{t('status', 'Status')}</th>
                      <th>{t('action', 'Action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                          {t('noMatchingOrdersFound', 'No matching orders found.')}
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <strong className="admin-order-id">{order.id}</strong>
                          </td>
                          <td>
                            <strong>{order.clientName}</strong>
                            <br />
                            <small style={{ color: '#6b7280' }}>
                              {order.clientEmail || order.clientPhone}
                            </small>
                          </td>
                          <td>{order.items}</td>
                          <td>
                            <span className="admin-price">{order.total}</span>
                          </td>
                          <td>{order.date || t('recent', 'Recent')}</td>
                          <td>
                            <span
                              className={`admin-status-badge ${order.status
                                .toLowerCase()
                                .replace(/\s+/g, '-')}`}
                            >
                              {t(order.status, order.status)}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="admin-action-btn edit"
                              onClick={() =>
                                handleUpdateOrderStatus(order.id, order.status)
                              }
                            >
                              {t('update', 'Update')}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: CLIENTS & PATRONS */}
        {/* ========================================================================= */}
        {activeSection === 'clients' && (
          <>
            {/* Clients KPIs */}
            <section className="admin-stats-grid" aria-label={t('clientDirectory', 'Client KPIs')}>
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('vipStudioPatrons', 'VIP Studio Patrons')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">
                  {clients.filter((c) => c.status === 'VIP').length}
                </h2>
                <span className="admin-stat-trend">{t('highValueArchitects', 'High-value residential architects')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('activeClients', 'Active Clients')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">
                  {clients.filter((c) => c.status === 'Active').length}
                </h2>
                <span className="admin-stat-trend">{t('recentInquiriesProjects', 'Recent inquiries & projects')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('totalPatrons', 'Total Patrons')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">{clients.length}</h2>
                <span className="admin-stat-trend">{t('jordanGccDirectory', 'Jordan & GCC Directory')}</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{t('averageProjectValue', 'Average Project Value')}</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">JOD 2,450</h2>
                <span className="admin-stat-trend">{t('acrossBespokeSuites', 'Across bespoke suites')}</span>
              </div>
            </section>

            {/* Search & Actions Bar */}
            <div className="admin-table-controls">
              <input
                type="text"
                className="admin-search-input"
                placeholder={t('searchPatronsPlaceholder', 'Search patrons by name, email, city, or phone...')}
                value={clientSearchQuery}
                onChange={(e) => setClientSearchQuery(e.target.value)}
              />

              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleAddClient}
              >
                {t('registerClient', '+ Register Client')}
              </button>
            </div>

            {/* Clients Table */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>{t('registeredClientsPatrons', 'Registered Clients & Patrons')} ({filteredClients.length})</h2>
              </div>

              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t('clientName', 'Client Name')}</th>
                      <th>{t('contactInfo', 'Contact Info')}</th>
                      <th>{t('location', 'Location')}</th>
                      <th>{t('ordersCompleted', 'Orders Completed')}</th>
                      <th>{t('totalValue', 'Total Value')}</th>
                      <th>{t('status', 'Status')}</th>
                      <th>{t('lastActive', 'Last Active')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                          {t('noMatchingClientsFound', 'No matching clients found.')}
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map((client) => (
                        <tr key={client.id}>
                          <td>
                            <strong>{client.name}</strong>
                          </td>
                          <td>
                            <div>{client.email}</div>
                            <small style={{ color: '#6b7280' }}>{client.phone}</small>
                          </td>
                          <td>{client.city}</td>
                          <td>{client.orders || client.totalOrders || 0} {t('projects', 'Projects')}</td>
                          <td>
                            <span className="admin-price">{client.spent || client.totalSpent || 'JOD 0'}</span>
                          </td>
                          <td>
                            <span
                              className={`admin-status-badge ${
                                client.status === 'VIP'
                                  ? 'delivered'
                                  : client.status === 'Active'
                                  ? 'in-production'
                                  : 'ready-for-delivery'
                              }`}
                            >
                              {t(client.status, client.status)}
                            </span>
                          </td>
                          <td>
                            <small style={{ color: '#6b7280' }}>
                              {t(client.lastActive || 'Just now', client.lastActive || 'Just now')}
                            </small>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Admin;
