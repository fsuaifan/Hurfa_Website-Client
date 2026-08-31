import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/admin.css';

const INITIAL_RECORDS = [
  {
    id: 1,
    name: 'Tayf Kitchen Set',
    category: 'Kitchens',
    price: 'JOD 1,450',
    stockStatus: 'Active',
    image:
      'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Tayf_4iPZv6iGf.png?updatedAt=1782466205843',
  },
  {
    id: 2,
    name: 'Oud Collection Sofa',
    category: 'Living Room',
    price: 'JOD 680',
    stockStatus: 'Active',
    image:
      'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Oud-Collection_u9dsnBlwn.jpg?updatedAt=1787138978278',
  },
  {
    id: 3,
    name: 'Wesal Bed Frame',
    category: 'Bedrooms',
    price: 'JOD 310',
    stockStatus: 'Active',
    image:
      'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg?updatedAt=1787138960280',
  },
  {
    id: 4,
    name: 'Kitchen Island V4',
    category: 'Kitchens',
    price: 'JOD 1,980',
    stockStatus: 'Low Stock',
    image:
      'https://ik.imagekit.io/6dghafkgmq/Kitchens/Kit3V4.jpg?updatedAt=1779196664060',
  },
  {
    id: 5,
    name: 'Wardrobe — Oak',
    category: 'Bedrooms',
    price: 'JOD 420',
    stockStatus: 'Active',
    image:
      'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Tayf_4iPZv6iGf.png?updatedAt=1782466205843',
  },
  {
    id: 6,
    name: 'Dresser — Six Drawer',
    category: 'Bedrooms',
    price: 'JOD 265',
    stockStatus: 'Active',
    image:
      'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Oud-Collection_u9dsnBlwn.jpg?updatedAt=1787138978278',
  },
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-2026-101',
    clientName: 'Nour Al-Husseini',
    clientEmail: 'nour.h@example.com',
    items: 'Tayf Kitchen Set, Kitchen Island V4',
    total: 'JOD 3,430',
    date: 'Aug 29, 2026',
    status: 'In Production',
    deliveryAddress: 'Abdoun, Amman',
  },
  {
    id: 'ORD-2026-102',
    clientName: 'Tariq Haddad',
    clientEmail: 'tariq.haddad@example.com',
    items: 'Wesal Bed Frame, Wardrobe — Oak',
    total: 'JOD 730',
    date: 'Aug 27, 2026',
    status: 'Ready for Delivery',
    deliveryAddress: 'Dabouq, Amman',
  },
  {
    id: 'ORD-2026-103',
    clientName: 'Lina Kassem',
    clientEmail: 'lina.k@example.com',
    items: 'Oud Collection Sofa',
    total: 'JOD 680',
    date: 'Aug 24, 2026',
    status: 'Delivered',
    deliveryAddress: 'Sweifieh, Amman',
  },
  {
    id: 'ORD-2026-104',
    clientName: 'Yazeed Bakhit',
    clientEmail: 'yazeed.b@example.com',
    items: 'Dresser — Six Drawer',
    total: 'JOD 265',
    date: 'Aug 21, 2026',
    status: 'Delivered',
    deliveryAddress: 'Um Uthaina, Amman',
  },
  {
    id: 'ORD-2026-105',
    clientName: 'Rania Kawar',
    clientEmail: 'rania.kawar@example.com',
    items: 'Custom Architectural Kitchen Consultation',
    total: 'JOD 1,850',
    date: 'Aug 19, 2026',
    status: 'Consultation Scheduled',
    deliveryAddress: 'Deir Ghbar, Amman',
  },
];

const INITIAL_CLIENTS = [
  {
    id: 1,
    name: 'Nour Al-Husseini',
    email: 'nour.h@example.com',
    phone: '+962 7 9811 2233',
    city: 'Amman (Abdoun)',
    totalOrders: 2,
    totalSpent: 'JOD 4,280',
    status: 'Active VIP',
    lastActive: 'Today',
  },
  {
    id: 2,
    name: 'Tariq Haddad',
    email: 'tariq.haddad@example.com',
    phone: '+962 7 9554 4321',
    city: 'Amman (Dabouq)',
    totalOrders: 1,
    totalSpent: 'JOD 730',
    status: 'Active',
    lastActive: '2 days ago',
  },
  {
    id: 3,
    name: 'Lina Kassem',
    email: 'lina.k@example.com',
    phone: '+962 7 8665 1199',
    city: 'Amman (Sweifieh)',
    totalOrders: 3,
    totalSpent: 'JOD 2,150',
    status: 'Active VIP',
    lastActive: '5 days ago',
  },
  {
    id: 4,
    name: 'Yazeed Bakhit',
    email: 'yazeed.b@example.com',
    phone: '+962 7 9123 4567',
    city: 'Amman (Um Uthaina)',
    totalOrders: 1,
    totalSpent: 'JOD 265',
    status: 'Active',
    lastActive: '1 week ago',
  },
  {
    id: 5,
    name: 'Rania Kawar',
    email: 'rania.kawar@example.com',
    phone: '+962 7 9778 8990',
    city: 'Amman (Deir Ghbar)',
    totalOrders: 2,
    totalSpent: 'JOD 3,600',
    status: 'Active VIP',
    lastActive: '3 days ago',
  },
  {
    id: 6,
    name: 'Omar Majali',
    email: 'omar.majali@example.com',
    phone: '+962 7 9443 2211',
    city: 'Amman (Shmeisani)',
    totalOrders: 0,
    totalSpent: 'JOD 0',
    status: 'Prospect',
    lastActive: '2 weeks ago',
  },
];

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

  const handleLogout = () => {
    sessionStorage.removeItem('hurfa_admin_authenticated');
    navigate('/login?redirect=/admin', { replace: true });
  };

  const handleDeleteRecord = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the catalog?`)) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleAddProduct = () => {
    const title = window.prompt('Enter product name:');
    if (!title || !title.trim()) return;

    const category = window.prompt('Enter category (Kitchens, Bedrooms, Living Room):', 'Bedrooms') || 'Bedrooms';
    const price = window.prompt('Enter price (e.g. JOD 450):', 'JOD 450') || 'JOD 450';

    const newRecord = {
      id: Date.now(),
      name: title.trim(),
      category: category.trim(),
      price: price.trim(),
      stockStatus: 'Active',
      image:
        'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg?updatedAt=1787138960280',
    };

    setRecords((prev) => [newRecord, ...prev]);
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
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleAddProduct}
              >
                + Add Product
              </button>
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
                              <button
                                type="button"
                                className="admin-action-btn admin-action-edit"
                                onClick={() => {
                                  const newPrice = window.prompt(
                                    `Update price for ${item.name}:`,
                                    item.price
                                  );
                                  if (newPrice && newPrice.trim()) {
                                    setRecords((prev) =>
                                      prev.map((r) =>
                                        r.id === item.id
                                          ? { ...r, price: newPrice.trim() }
                                          : r
                                      )
                                    );
                                  }
                                }}
                              >
                                Edit
                              </button>
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
