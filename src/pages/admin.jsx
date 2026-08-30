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

function Admin() {
  const navigate = useNavigate();
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Top Header */}
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">Studio Management</span>
            <h1>Admin Dashboard</h1>
            <p>Monitor collection records, inventory status, and catalog items.</p>
          </div>

          <div className="admin-header-actions">
            <Link to="/" className="admin-btn admin-btn-outline">
              View Storefront
            </Link>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handleAddProduct}
            >
              + Add Product
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-logout"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Hurfa KPI Overview Cards */}
        <section className="admin-stats-grid" aria-label="Key Performance Indicators">
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
      </div>
    </div>
  );
}

export default Admin;
