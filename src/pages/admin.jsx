import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { INITIAL_RECORDS, INITIAL_ORDERS, INITIAL_CLIENTS } from '../data/adminCatalogData';
import { api } from '../services/api';
import '../css/admin.css';

function Admin() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('catalog'); // 'catalog' | 'orders' | 'clients'

  // Catalog State
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Orders State
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Clients State
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [clientSearchQuery, setClientSearchQuery] = useState('');

  // Live Stats State
  const [liveStats, setLiveStats] = useState(null);

  // Load live data from Backend API on mount
  useEffect(() => {
    let isMounted = true;

    async function loadAdminData() {
      // 1. Fetch live KPI stats
      try {
        const stats = await api.catalog.getStats();
        if (isMounted && stats) setLiveStats(stats);
      } catch (err) {
        console.warn('Using local stats fallback:', err.message);
      }

      // 2. Fetch live catalog records
      try {
        const catalog = await api.catalog.getAll();
        if (isMounted && Array.isArray(catalog) && catalog.length > 0) {
          setRecords(catalog);
        }
      } catch (err) {
        console.warn('Using local catalog fallback:', err.message);
      }

      // 3. Fetch live orders
      try {
        const ordersData = await api.orders.getAll();
        if (isMounted && Array.isArray(ordersData) && ordersData.length > 0) {
          setOrders(ordersData);
        }
      } catch (err) {
        console.warn('Using local orders fallback:', err.message);
      }

      // 4. Fetch live clients
      try {
        const clientsData = await api.clients.getAll();
        if (isMounted && Array.isArray(clientsData) && clientsData.length > 0) {
          setClients(clientsData);
        }
      } catch (err) {
        console.warn('Using local clients fallback:', err.message);
      }
    }

    loadAdminData();
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
    if (window.confirm(`Are you sure you want to remove "${name}" from the catalog?`)) {
      try {
        await api.catalog.delete(id);
      } catch (err) {
        console.warn('Delete API warning:', err.message);
      }
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleUpdateOrderStatus = async (orderId, currentStatus) => {
    const newStatus = window.prompt(
      `Update status for ${orderId} (Current: ${currentStatus}):\nOptions: In Production, Ready for Delivery, Delivered, Consultation Scheduled`,
      currentStatus
    );
    if (newStatus && newStatus.trim()) {
      try {
        await api.orders.updateStatus(orderId, newStatus.trim());
      } catch (err) {
        console.warn('Order status update API warning:', err.message);
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus.trim() } : o))
      );
    }
  };

  const handleAddClient = async () => {
    const name = window.prompt('Enter client full name:');
    if (!name || !name.trim()) return;
    const email = window.prompt('Enter client email address:', 'client@example.com') || 'client@example.com';
    const phone = window.prompt('Enter client phone:', '+962 7 9000 0000') || '+962 7 9000 0000';
    const city = window.prompt('Enter district/city:', 'Amman (Abdoun)') || 'Amman';

    const newClientData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      status: 'Prospect',
      total_orders: 0,
      total_spent: 0,
    };

    try {
      const created = await api.clients.create(newClientData);
      setClients((prev) => [created, ...prev]);
    } catch (err) {
      console.warn('Create client API fallback:', err.message);
      setClients((prev) => [
        {
          id: Date.now(),
          ...newClientData,
          orders: 0,
          spent: 'JOD 0',
          lastActive: 'Just now',
        },
        ...prev,
      ]);
    }
  };

  // Filtered Catalog
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesCategory =
        selectedCategory === 'All' || (r.category && r.category.toLowerCase().includes(selectedCategory.toLowerCase()));
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
        orderStatusFilter === 'All' || (o.status && o.status.toLowerCase() === orderStatusFilter.toLowerCase());
      const matchesSearch =
        (o.clientName || '').toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        (o.id || '').toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        (o.items || '').toLowerCase().includes(orderSearchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderSearchQuery, orderStatusFilter]);

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      return (
        (c.name || '').toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
        (c.email || '').toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
        (c.city || '').toLowerCase().includes(clientSearchQuery.toLowerCase())
      );
    });
  }, [clients, clientSearchQuery]);

  // Category list
  const categories = useMemo(() => {
    const cats = new Set(records.map((r) => r.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [records]);

  // Calculated overview stats
  const totalCatalogCount = liveStats?.totalCatalogItems ?? records.length;
  const grossRevenue = liveStats?.grossRevenue ?? 'JOD 18,450';
  const activeOrdersCount = liveStats?.activeOrders ?? orders.filter((o) => o.status !== 'Delivered').length;
  const totalClientsCount = liveStats?.totalClients ?? clients.length;

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Top Header */}
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">Studio Portal</span>
            <h1>Management Console</h1>
            <p>Hurfa Architectural Studio • Live PostgreSQL Database Integration</p>
          </div>

          <div className="admin-header-actions">
            <Link to="/editor" className="admin-btn admin-btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add New Piece
            </Link>
            <Link to="/products" className="admin-btn admin-btn-outline" target="_blank" rel="noreferrer">
              Live Website ↗
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

        {/* Studio Overview Stats */}
        <section className="admin-stats-grid" aria-label="Studio Overview Metrics">
          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Total Catalog Pieces</span>
              <div className="admin-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
            </div>
            <div className="admin-stat-value">{totalCatalogCount}</div>
            <div className="admin-stat-sub">Active bespoke inventory</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Active Orders & Requests</span>
              <div className="admin-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
            </div>
            <div className="admin-stat-value">{activeOrdersCount}</div>
            <div className="admin-stat-sub">In production or scheduling</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Gross Fulfilled Volume</span>
              <div className="admin-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </div>
            <div className="admin-stat-value">{grossRevenue}</div>
            <div className="admin-stat-sub">Jordan architectural projects</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span className="admin-stat-label">VIP Clients & Patrons</span>
              <div className="admin-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
            <div className="admin-stat-value">{totalClientsCount}</div>
            <div className="admin-stat-sub">Registered accounts</div>
          </div>
        </section>

        {/* Section Navigation Tabs */}
        <div className="admin-section-nav" role="tablist">
          <button
            type="button"
            className={`admin-section-tab ${activeSection === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveSection('catalog')}
          >
            Furniture Catalog ({records.length})
          </button>
          <button
            type="button"
            className={`admin-section-tab ${activeSection === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveSection('orders')}
          >
            Orders & Requests ({orders.length})
          </button>
          <button
            type="button"
            className={`admin-section-tab ${activeSection === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveSection('clients')}
          >
            Clients & Patrons ({clients.length})
          </button>
        </div>

        {/* SECTION 1: CATALOG MANAGEMENT */}
        {activeSection === 'catalog' && (
          <section className="admin-main-section">
            <div className="admin-filter-bar">
              <div className="admin-search-wrapper">
                <input
                  type="text"
                  placeholder="Search piece by name or material..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-search-input"
                />
              </div>

              <div className="admin-category-tabs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`admin-category-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Piece</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock / Visibility</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="admin-piece-cell">
                          <img
                            src={item.image || item.images?.[0]}
                            alt={item.name}
                            className="admin-piece-img"
                          />
                          <div>
                            <div className="admin-piece-name">{item.name}</div>
                            <div className="admin-piece-material">{item.material || 'Solid Wood & Fine Hardware'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-badge-cat">{item.category}</span>
                      </td>
                      <td className="admin-price-cell">{item.price}</td>
                      <td>
                        <span className={`admin-badge-stock ${item.stockStatus === 'Low Stock' ? 'low' : 'active'}`}>
                          {item.stockStatus || 'Active'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-action-btns">
                          <Link to={`/editor?id=${item.id}`} className="admin-btn-action edit">
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="admin-btn-action delete"
                            onClick={() => handleDeleteRecord(item.id, item.name)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SECTION 2: ORDERS & REQUESTS */}
        {activeSection === 'orders' && (
          <section className="admin-main-section">
            <div className="admin-filter-bar">
              <div className="admin-search-wrapper">
                <input
                  type="text"
                  placeholder="Search by client name, reference code, or pieces..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="admin-search-input"
                />
              </div>

              <div className="admin-category-tabs">
                {['All', 'In Production', 'Ready for Delivery', 'Delivered', 'Consultation Scheduled'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`admin-category-btn ${orderStatusFilter === status ? 'active' : ''}`}
                    onClick={() => setOrderStatusFilter(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ref Code</th>
                    <th>Client</th>
                    <th>Items Ordered / Inquired</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="admin-order-code">{order.id}</td>
                      <td>
                        <div>
                          <strong>{order.clientName}</strong>
                          <div className="admin-client-contact">{order.clientEmail || order.clientPhone}</div>
                        </div>
                      </td>
                      <td>{order.items}</td>
                      <td className="admin-price-cell">{order.total}</td>
                      <td>
                        <span className={`admin-badge-status ${order.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-btn-action edit"
                          onClick={() => handleUpdateOrderStatus(order.id, order.status)}
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SECTION 3: CLIENTS & PATRONS */}
        {activeSection === 'clients' && (
          <section className="admin-main-section">
            <div className="admin-filter-bar">
              <div className="admin-search-wrapper">
                <input
                  type="text"
                  placeholder="Search patrons by name, email, or city..."
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                  className="admin-search-input"
                />
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleAddClient}
              >
                + Register Client
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Contact Info</th>
                    <th>Location</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id}>
                      <td>
                        <strong>{client.name}</strong>
                      </td>
                      <td>
                        <div>{client.email}</div>
                        <div className="admin-client-contact">{client.phone}</div>
                      </td>
                      <td>{client.city}</td>
                      <td>{client.orders || 0}</td>
                      <td className="admin-price-cell">{client.spent || 'JOD 0'}</td>
                      <td>
                        <span className={`admin-badge-client ${client.status?.toLowerCase()}`}>
                          {client.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Admin;
