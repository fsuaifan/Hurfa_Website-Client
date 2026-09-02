import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { INITIAL_RECORDS } from '../data/adminCatalogData';
import ImgkitApi from '../components/imgkitApi';
import '../css/admin.css';

const DEFAULT_IMAGE =
  'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg?updatedAt=1787138960280';

const PRESET_IMAGES = [
  {
    label: 'Wesal Suite',
    url: 'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg?updatedAt=1787138960280',
  },
  {
    label: 'Tayf Kitchen',
    url: 'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Tayf_4iPZv6iGf.png?updatedAt=1782466205843',
  },
  {
    label: 'Oud Collection',
    url: 'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Oud-Collection_u9dsnBlwn.jpg?updatedAt=1787138978278',
  },
  {
    label: 'Kitchen Island V4',
    url: 'https://ik.imagekit.io/6dghafkgmq/Kitchens/Kit3V4.jpg?updatedAt=1779196664060',
  },
];

function Editor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const isEditMode = Boolean(productId);

  // Initialize form state - if editing an existing product, populate all details; if adding, start empty
  const [formData, setFormData] = useState(() => {
    if (productId) {
      try {
        const stored = localStorage.getItem('hurfa_catalog_records');
        const records = stored ? JSON.parse(stored) : INITIAL_RECORDS;
        const found = records.find((item) => String(item.id) === String(productId));
        if (found) {
          return {
            name: found.name || '',
            category: found.category || 'Kitchens',
            price: found.price || '',
            stockStatus: found.stockStatus || 'Active',
            image: found.image || '',
            desc: found.desc || '',
            dimensions: found.dimensions || '',
            material: found.material || '',
          };
        }
      } catch (err) {
        console.error('Failed to load product details for editor', err);
      }
    }

    // Empty form for new product
    return {
      name: '',
      category: 'Kitchens',
      price: '',
      stockStatus: 'Active',
      image: '',
      desc: '',
      dimensions: '',
      material: '',
    };
  });

  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImgKitModal, setShowImgKitModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (!formData.name.trim() || !formData.price.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Please provide both a product name and price.',
      });
      return;
    }

    setIsSubmitting(true);

    const finalImage = formData.image.trim() || DEFAULT_IMAGE;
    const formattedPrice = formData.price.trim().toUpperCase().startsWith('JOD')
      ? formData.price.trim()
      : `JOD ${formData.price.trim()}`;

    try {
      const stored = localStorage.getItem('hurfa_catalog_records');
      let records = stored ? JSON.parse(stored) : [...INITIAL_RECORDS];

      if (isEditMode) {
        records = records.map((item) =>
          String(item.id) === String(productId)
            ? {
                ...item,
                name: formData.name.trim(),
                category: formData.category,
                price: formattedPrice,
                stockStatus: formData.stockStatus,
                image: finalImage,
                desc: formData.desc.trim(),
                dimensions: formData.dimensions.trim(),
                material: formData.material.trim(),
              }
            : item
        );
      } else {
        const newProduct = {
          id: Date.now(),
          name: formData.name.trim(),
          category: formData.category,
          price: formattedPrice,
          stockStatus: formData.stockStatus,
          image: finalImage,
          desc: formData.desc.trim(),
          dimensions: formData.dimensions.trim(),
          material: formData.material.trim(),
        };
        records = [newProduct, ...records];
      }

      localStorage.setItem('hurfa_catalog_records', JSON.stringify(records));

      setStatusMessage({
        type: 'success',
        text: isEditMode
          ? 'Product changes saved successfully!'
          : 'New product added to catalog!',
      });

      setTimeout(() => {
        navigate('/admin');
      }, 700);
    } catch (err) {
      console.error('Error saving product in editor', err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to save changes. Please try again.',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container" style={{ maxWidth: '880px' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            to="/admin"
            style={{
              color: '#78716c',
              textDecoration: 'none',
              fontSize: '0.88rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ← Back to Admin Dashboard
          </Link>
        </div>

        {/* Header */}
        <header className="admin-header" style={{ marginBottom: '28px' }}>
          <div>
            <span className="admin-eyebrow">Studio Inventory</span>
            <h1>{isEditMode ? 'Edit Product Details' : 'Add New Product'}</h1>
            <p>
              {isEditMode
                ? `Modifying specifications, imagery, and pricing for item #${productId}.`
                : 'Enter architectural details, category, and pricing to list a new piece in the catalog.'}
            </p>
          </div>
        </header>

        {/* Alert message */}
        {statusMessage.text && (
          <div
            className={`login-alert ${statusMessage.type}`}
            style={{
              padding: '14px 18px',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '0.9rem',
              backgroundColor: statusMessage.type === 'error' ? '#fef2f2' : '#f0fdf4',
              color: statusMessage.type === 'error' ? '#991b1b' : '#166534',
              border: `1px solid ${statusMessage.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
            }}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Editor Form Card */}
        <div className="admin-card" style={{ padding: '36px 32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Row 1: Name & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div className="login-form-group">
                <label htmlFor="editor-name" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1f1d1b', marginBottom: '8px' }}>
                  Product Name *
                </label>
                <input
                  id="editor-name"
                  type="text"
                  name="name"
                  className="admin-search-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  placeholder="e.g. Wesal Bed Frame"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="login-form-group">
                <label htmlFor="editor-category" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1f1d1b', marginBottom: '8px' }}>
                  Category *
                </label>
                <select
                  id="editor-category"
                  name="category"
                  className="admin-category-filter"
                  style={{ width: '100%', boxSizing: 'border-box', height: '42px' }}
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Kitchens">Kitchens</option>
                  <option value="Bedrooms">Bedrooms</option>
                  <option value="Living Room">Living Room</option>
                </select>
              </div>
            </div>

            {/* Row 2: Price & Stock Status */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div className="login-form-group">
                <label htmlFor="editor-price" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1f1d1b', marginBottom: '8px' }}>
                  Price (JOD) *
                </label>
                <input
                  id="editor-price"
                  type="text"
                  name="price"
                  className="admin-search-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  placeholder="e.g. JOD 1,450 or 1450"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="login-form-group">
                <label htmlFor="editor-stockStatus" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1f1d1b', marginBottom: '8px' }}>
                  Stock Status *
                </label>
                <select
                  id="editor-stockStatus"
                  name="stockStatus"
                  className="admin-category-filter"
                  style={{ width: '100%', boxSizing: 'border-box', height: '42px' }}
                  value={formData.stockStatus}
                  onChange={handleChange}
                >
                  <option value="Active">Active (In Stock)</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Made to Order">Made to Order</option>
                </select>
              </div>
            </div>

            {/* Row 3: Image URL & Presets */}
            <div className="login-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <label htmlFor="editor-image" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1f1d1b', margin: 0 }}>
                  Image CDN URL
                </label>
                <button
                  type="button"
                  className="admin-btn admin-btn-outline"
                  style={{ padding: '4px 10px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => setShowImgKitModal(true)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  ImageKit Studio & Transform
                </button>
              </div>
              <input
                id="editor-image"
                type="url"
                name="image"
                className="admin-search-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                placeholder="https://ik.imagekit.io/..."
                value={formData.image}
                onChange={handleChange}
              />
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#78716c' }}>Quick Presets:</span>
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    style={{
                      fontSize: '0.75rem',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid #e7e5e4',
                      background: '#FAF8F5',
                      cursor: 'pointer',
                    }}
                    onClick={() => setFormData((p) => ({ ...p, image: preset.url }))}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Image & Details Preview */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: '#FAF8F5',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e7e5e4',
              }}
            >
              <img
                src={formData.image.trim() || DEFAULT_IMAGE}
                alt="Product Preview"
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  border: '1px solid #d6d3d1',
                  backgroundColor: '#eee9e1',
                }}
                onError={(e) => {
                  e.target.src = DEFAULT_IMAGE;
                }}
              />
              <div>
                <span
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: '#78716c',
                    letterSpacing: '0.06em',
                  }}
                >
                  Live Preview
                </span>
                <p style={{ margin: '4px 0 2px', fontSize: '0.95rem', fontWeight: 600, color: '#1f1d1b' }}>
                  {formData.name.trim() || 'Untitled Piece'}
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ color: '#78716c' }}>{formData.category}</span>
                  <span style={{ color: '#d6d3d1' }}>•</span>
                  <span style={{ fontWeight: 700, color: '#e67e22' }}>
                    {formData.price.trim() || 'Price TBD'}
                  </span>
                  <span style={{ color: '#d6d3d1' }}>•</span>
                  <span
                    className={`admin-badge ${
                      formData.stockStatus === 'Active' ? 'admin-badge-active' : 'admin-badge-low'
                    }`}
                  >
                    {formData.stockStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 4: Material & Dimensions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div className="login-form-group">
                <label htmlFor="editor-material" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1f1d1b', marginBottom: '8px' }}>
                  Material & Finish (Optional)
                </label>
                <input
                  id="editor-material"
                  type="text"
                  name="material"
                  className="admin-search-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  placeholder="e.g. Solid Oak with Matte Lacquer"
                  value={formData.material}
                  onChange={handleChange}
                />
              </div>

              <div className="login-form-group">
                <label htmlFor="editor-dimensions" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1f1d1b', marginBottom: '8px' }}>
                  Dimensions (Optional)
                </label>
                <input
                  id="editor-dimensions"
                  type="text"
                  name="dimensions"
                  className="admin-search-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  placeholder="e.g. 200cm x 160cm x 90cm"
                  value={formData.dimensions}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 5: Description */}
            <div className="login-form-group">
              <label htmlFor="editor-desc" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1f1d1b', marginBottom: '8px' }}>
                Description (Optional)
              </label>
              <textarea
                id="editor-desc"
                name="desc"
                className="admin-search-input"
                style={{
                  width: '100%',
                  minHeight: '100px',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: '1.5',
                }}
                placeholder="Architectural design notes, hardware specs, and craftsmanship details..."
                value={formData.desc}
                onChange={handleChange}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', marginTop: '12px', flexWrap: 'wrap' }}>
              <Link
                to="/admin"
                className="admin-btn admin-btn-outline"
                style={{ padding: '12px 24px' }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                style={{ padding: '12px 28px' }}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Saving...'
                  : isEditMode
                  ? 'Save Changes'
                  : 'Add Piece to Catalog'}
              </button>
            </div>
          </form>
        </div>

        {/* ImageKit Modal Studio */}
        {showImgKitModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(3px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1050,
              padding: '20px',
            }}
            onClick={() => setShowImgKitModal(false)}
          >
            <div
              style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <ImgkitApi
                initialUrl={formData.image}
                onSelect={(url) => {
                  setFormData((prev) => ({ ...prev, image: url }));
                  setShowImgKitModal(false);
                }}
                onClose={() => setShowImgKitModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Editor;
