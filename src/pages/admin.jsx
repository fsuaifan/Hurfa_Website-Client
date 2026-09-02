import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { INITIAL_RECORDS, INITIAL_ORDERS, INITIAL_CLIENTS } from '../data/adminCatalogData';
import '../css/admin.css';

function Admin() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('catalog'); // 'catalog' | 'orders' | 'clients'

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
    return INITIAL_RECORDS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Orders State
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Clients State
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [clientSearchQuery, setClientSearchQuery] = useState('');

  const handleLogout = () => {
    sessionStorage.removeItem('hurfa_admin_authenticated');
    navigate('/login?redirect=/admin', { replace: true });
  };

  const handleDeleteRecord = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the catalog?`)) {
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

  const handleUpdateOrderStatus = (orderId, currentStatus) => {
    const newStatus = window.prompt(
      `Update status for ${orderId} (Current: ${currentStatus}):\nOptions: In Production, Ready for Delivery, Delivered, Consultation Scheduled`,
      currentStatus
    );
    if (newStatus && newStatus.trim()) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus.trim() } : o))
      );
    }
  };

  const handleAddClient = () => {
    const name = window.prompt('Enter client full name:');
    if (!name || !name.trim()) return;
    const email = window.prompt('Enter client email address:', 'client@example.com') || 'client@example.com';
    const phone = window.prompt('Enter client phone:', '+962 7 9000 0000') || '+962 7 9000 0000';
    const city = window.prompt('Enter district/city:', 'Amman (Abdoun)') || 'Amman';

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

    setClients((prev) => [newClient, ...prev]);
  };

  // Filtered Catalog
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesCategory =
        selectedCategory === 'All' || r.category === selectedCategory;
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [records, searchQuery, selectedCategory]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus =
        orderStatusFilter === 'All' || o.status === orderStatusFilter;
      const matchesSearch =
        o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.clientName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.items.toLowerCase().includes(orderSearchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderSearchQuery, orderStatusFilter]);

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const query = clientSearchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query)
      );
    });
  }, [clients, clientSearchQuery]);

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Top Header */}
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">Studio Management</span>
            <h1>Admin Dashboard</h1>
            <p>Monitor collection records, customer orders, and client relationships.</p>
          </div>

          <div className="admin-header-actions">
            <Link to="/" className="admin-btn admin-btn-outline">
              View Storefront
            </Link>
            {activeSection === 'catalog' && (
              <Link to="/editor" className="admin-btn admin-btn-primary">
                + Add Product
              </Link>
            )}
            {activeSection === 'clients' && (
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleAddClient}
              >
                + Add Client
              </button>
            )}
            <button
              type="button"
              className="admin-btn admin-btn-logout"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Section Navigation Tabs */}
        <div className="admin-nav-tabs" role="tablist" aria-label="Admin Sections">
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === 'catalog'}
            className={`admin-nav-tab ${activeSection === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveSection('catalog')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            Catalog & Inventory ({records.length})
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
            Orders & Requests ({orders.length})
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
            Clients & Patrons ({clients.length})
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: CATALOG */}
        {/* ========================================================================= */}
        {activeSection === 'catalog' && (
          <>
            {/* Hurfa KPI Overview Cards */}
            <section className="admin-stats-grid" aria-label="Catalog Key Performance Indicators">
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">Total Catalog Items</span>
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
                <span className="admin-stat-trend">Live across web & boutique</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">Bedroom Pieces</span>
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
                  {records.filter((r) => r.category === 'Bedrooms').length}
                </h2>
                <span className="admin-stat-trend">Frames, wardrobes & nightstands</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">Kitchen Systems</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M9 21V9" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">
                  {records.filter((r) => r.category === 'Kitchens').length}
                </h2>
                <span className="admin-stat-trend">Chic, Organic & Contemporary</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">Signature Collections</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">2</h2>
                <span className="admin-stat-trend">The Oud & The Wesal Suite</span>
              </div>
            </section>

            {/* Filter and Search Controls */}
            <div className="admin-table-controls">
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search piece name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <select
                className="admin-category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Kitchens">Kitchens</option>
                <option value="Bedrooms">Bedrooms</option>
                <option value="Living Room">Living Room</option>
              </select>
            </div>

            {/* Records Table Card */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>Catalog Records ({filteredRecords.length})</h2>
              </div>

              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                          No matching records found.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="admin-prod-cell">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="admin-prod-thumb"
                                loading="lazy"
                              />
                              <div>
                                <p className="admin-prod-title">{item.name}</p>
                              </div>
                            </div>
                          </td>
                          <td>{item.category}</td>
                          <td>
                            <span className="admin-price">{item.price}</span>
                          </td>
                          <td>
                            <span
                              className={`admin-badge ${
                                item.stockStatus === 'Active'
                                  ? 'admin-badge-active'
                                  : 'admin-badge-low'
                              }`}
                            >
                              {item.stockStatus}
                            </span>
                          </td>
                          <td>
                            <div className="admin-actions-cell">
                              <Link
                                to={`/editor?id=${item.id}`}
                                className="admin-action-btn admin-action-edit"
                                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                              >
                                Edit
                              </Link>
                              <button
                                type="button"
                                className="admin-action-btn admin-action-delete"
                                onClick={() => handleDeleteRecord(item.id, item.name)}
                              >
                                Delete
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
        {/* SECTION 2: ORDERS */}
        {/* ========================================================================= */}
        {activeSection === 'orders' && (
          <>
            {/* Orders KPIs */}
            <section className="admin-stats-grid" aria-label="Orders KPIs">
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">Total Orders</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                      <path d="M3 6h18" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">{orders.length}</h2>
                <span className="admin-stat-trend">Current cycle</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">In Production</span>
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
                <span className="admin-stat-trend">Crafting in workshop</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">Ready & Out</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                      <path d="M15 18H9" />
                      <circle cx="17" cy="18" r="2" />
                      <circle cx="7" cy="18" r="2" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">
                  {orders.filter((o) => o.status === 'Ready for Delivery').length}
                </h2>
                <span className="admin-stat-trend">White-glove dispatched</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">Order Volume</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">JOD 6,955</h2>
                <span className="admin-stat-trend">+14% vs last month</span>
              </div>
            </section>

            {/* Orders Controls */}
            <div className="admin-table-controls">
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search by Order ID, client, or item..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
              />

              <select
                className="admin-category-filter"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="In Production">In Production</option>
                <option value="Ready for Delivery">Ready for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Consultation Scheduled">Consultation Scheduled</option>
              </select>
            </div>

            {/* Orders Table Card */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>Customer Orders & Architecture Requests ({filteredOrders.length})</h2>
              </div>

              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Client</th>
                      <th>Ordered Items</th>
                      <th>Total</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                          No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id}>
                          <td>
                            <strong>{ord.id}</strong>
                            <div style={{ fontSize: '0.78rem', color: '#78716c' }}>{ord.deliveryAddress}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#1f1d1b' }}>{ord.clientName}</div>
                            <div style={{ fontSize: '0.8rem', color: '#78716c' }}>{ord.clientEmail}</div>
                          </td>
                          <td style={{ maxWidth: '280px' }}>
                            <span style={{ fontSize: '0.88rem' }}>{ord.items}</span>
                          </td>
                          <td>
                            <span className="admin-price">{ord.total}</span>
                          </td>
                          <td>{ord.date}</td>
                          <td>
                            <span
                              className={`admin-badge ${
                                ord.status === 'Delivered'
                                  ? 'admin-badge-active'
                                  : ord.status === 'In Production'
                                  ? 'admin-badge-low'
                                  : 'admin-badge-neutral'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="admin-action-btn admin-action-edit"
                              onClick={() => handleUpdateOrderStatus(ord.id, ord.status)}
                            >
                              Update Status
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
        {/* SECTION 3: CLIENTS */}
        {/* ========================================================================= */}
        {activeSection === 'clients' && (
          <>
            {/* Clients KPIs */}
            <section className="admin-stats-grid" aria-label="Clients KPIs">
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">Total Clients</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">{clients.length}</h2>
                <span className="admin-stat-trend">Patrons & registered accounts</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">VIP Studio Members</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">
                  {clients.filter((c) => c.status === 'Active VIP').length}
                </h2>
                <span className="admin-stat-trend">High architectural volume</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">Primary Region</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">Amman</h2>
                <span className="admin-stat-trend">Abdoun, Dabouq, Sweifieh</span>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span className="admin-stat-label">Client Retention</span>
                  <div className="admin-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                </div>
                <h2 className="admin-stat-value">92%</h2>
                <span className="admin-stat-trend">Returning for secondary spaces</span>
              </div>
            </section>

            {/* Clients Search Bar */}
            <div className="admin-table-controls">
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search by client name, email, phone, or neighborhood..."
                value={clientSearchQuery}
                onChange={(e) => setClientSearchQuery(e.target.value)}
              />
            </div>

            {/* Clients Table Card */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>Client Roster & Accounts ({filteredClients.length})</h2>
              </div>

              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Client Name</th>
                      <th>Contact Details</th>
                      <th>Location</th>
                      <th>Total Orders</th>
                      <th>Lifetime Spent</th>
                      <th>Tier</th>
                      <th>Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                          No matching clients found.
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map((client) => (
                        <tr key={client.id}>
                          <td>
                            <div className="admin-prod-cell">
                              <div
                                style={{
                                  width: '38px',
                                  height: '38px',
                                  borderRadius: '50%',
                                  backgroundColor: '#FAF8F5',
                                  border: '1px solid #e7e5e4',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 600,
                                  fontSize: '0.85rem',
                                  color: '#1f1d1b',
                                }}
                              >
                                {client.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                              </div>
                              <div>
                                <p className="admin-prod-title">{client.name}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.88rem', color: '#1f1d1b' }}>{client.email}</div>
                            <div style={{ fontSize: '0.8rem', color: '#78716c' }}>{client.phone}</div>
                          </td>
                          <td>{client.city}</td>
                          <td>
                            <strong>{client.totalOrders}</strong>
                          </td>
                          <td>
                            <span className="admin-price">{client.totalSpent}</span>
                          </td>
                          <td>
                            <span
                              className={`admin-badge ${
                                client.status === 'Active VIP'
                                  ? 'admin-badge-active'
                                  : 'admin-badge-neutral'
                              }`}
                            >
                              {client.status}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.84rem', color: '#78716c' }}>{client.lastActive}</td>
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
