import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
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

  // Initialize form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Kitchens',
    price: '',
    stockStatus: 'Active',
    image: '',
    desc: '',
    dimensions: '',
    material: '',
  });

  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImgKitModal, setShowImgKitModal] = useState(false);

  // Fetch product from API if in edit mode
  useEffect(() => {
    let isMounted = true;
    async function loadItem() {
      if (productId) {
        try {
          const item = await api.catalog.getById(productId);
          if (isMounted && item && !item.message) {
            setFormData({
              name: item.name || '',
              category: item.category || 'Kitchens',
              price: item.price || item.priceNumber || '',
              stockStatus: item.stockStatus || 'Active',
              image: item.image || item.images?.[0] || '',
              desc: item.desc || '',
              dimensions: item.dimensions || '',
              material: item.material || '',
            });
          }
        } catch (e) {
          console.warn('Could not load item from API for editor:', e.message);
        }
      }
    }
    loadItem();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
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

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      price: formattedPrice,
      stockStatus: formData.stockStatus,
      img: finalImage,
      desc: formData.desc.trim(),
      dimensions: formData.dimensions.trim(),
      material: formData.material.trim(),
    };

    try {
      if (isEditMode) {
        await api.catalog.update(productId, payload);
      } else {
        await api.catalog.create(payload);
      }
    } catch (err) {
      console.warn('Catalog API warning:', err.message);
    }

    try {
      const stored = localStorage.getItem('hurfa_catalog_records');
      let records = stored ? JSON.parse(stored) : [];

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
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to save record to storage.',
      });
      setIsSubmitting(false);
    }
  };

  const handleSelectPreset = (url) => {
    setFormData((prev) => ({
      ...prev,
      image: url,
    }));
  };

  const handleImageKitSelect = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      image: imageUrl,
    }));
    setShowImgKitModal(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Header Bar */}
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">Studio Editor</span>
            <h1>{isEditMode ? 'Edit Furniture Piece' : 'Add New Furniture Piece'}</h1>
            <p>
              {isEditMode
                ? 'Update product details, pricing, dimensions, and specifications.'
                : 'Create a new piece and publish it directly to the Hurfa catalog.'}
            </p>
          </div>

          <div className="admin-header-actions">
            <Link to="/admin" className="admin-btn admin-btn-outline">
              ← Back to Management
            </Link>
          </div>
        </header>

        {/* Status Message Alert */}
        {statusMessage.text && (
          <div
            className={`admin-status-alert ${statusMessage.type}`}
            role="alert"
          >
            {statusMessage.type === 'error' ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Editor Form Card */}
        <div className="admin-form-container">
          <form className="admin-form" onSubmit={handleSubmit} noValidate>
            {/* Row 1: Name and Category */}
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="name" className="admin-form-label">
                  Piece Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="admin-form-input"
                  placeholder="e.g. Prestige - Oud Coffee Table"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="category" className="admin-form-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  className="admin-form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Kitchens">Kitchens</option>
                  <option value="Bedrooms">Bedrooms</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Living Room Tables">Living Room Tables</option>
                  <option value="Consoles">Consoles</option>
                  <option value="TV Units">TV Units</option>
                  <option value="Commercial Offices">Commercial Offices</option>
                </select>
              </div>
            </div>

            {/* Row 2: Price and Stock Status */}
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="price" className="admin-form-label">
                  Price (JOD) <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  className="admin-form-input"
                  placeholder="e.g. 420 or JOD 420"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="stockStatus" className="admin-form-label">
                  Inventory Status
                </label>
                <select
                  id="stockStatus"
                  name="stockStatus"
                  className="admin-form-select"
                  value={formData.stockStatus}
                  onChange={handleChange}
                >
                  <option value="Active">Active / In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Made to Order">Made to Order (Bespoke)</option>
                </select>
              </div>
            </div>

            {/* Row 3: Dimensions and Material */}
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="dimensions" className="admin-form-label">
                  Dimensions
                </label>
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  className="admin-form-input"
                  placeholder="e.g. 100cm x 100cm x 32.5cm"
                  value={formData.dimensions}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="material" className="admin-form-label">
                  Materials & Craftsmanship
                </label>
                <input
                  type="text"
                  id="material"
                  name="material"
                  className="admin-form-input"
                  placeholder="e.g. Oak Veneer, HMR Moisture-Resistant Wood"
                  value={formData.material}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 4: Description */}
            <div className="admin-form-group">
              <label htmlFor="desc" className="admin-form-label">
                Architectural Description
              </label>
              <textarea
                id="desc"
                name="desc"
                rows="3"
                className="admin-form-textarea"
                placeholder="Describe the aesthetic language, joinery, and structural finishes of the piece..."
                value={formData.desc}
                onChange={handleChange}
              />
            </div>

            {/* Row 5: Image Management */}
            <div className="admin-form-group">
              <div className="admin-label-row">
                <label htmlFor="image" className="admin-form-label">
                  Product Image URL
                </label>
                <button
                  type="button"
                  className="admin-imgkit-trigger"
                  onClick={() => setShowImgKitModal(true)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  Browse ImageKit Asset Library
                </button>
              </div>

              <input
                type="url"
                id="image"
                name="image"
                className="admin-form-input"
                placeholder="https://ik.imagekit.io/6dghafkgmq/..."
                value={formData.image}
                onChange={handleChange}
              />

              {/* Image Preset Quick Pickers */}
              <div className="admin-presets-wrapper">
                <span className="admin-presets-title">Hurfa Studio Presets:</span>
                <div className="admin-presets-list">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className="admin-preset-btn"
                      onClick={() => handleSelectPreset(preset.url)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Preview Box */}
              {formData.image && (
                <div className="admin-image-preview-card">
                  <span className="admin-preview-title">Active Media Preview:</span>
                  <img
                    src={formData.image}
                    alt="Product preview"
                    className="admin-image-preview"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="admin-form-actions">
              <button
                type="button"
                className="admin-btn admin-btn-outline"
                onClick={() => navigate('/admin')}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Saving Piece...'
                  : isEditMode
                  ? 'Save Changes'
                  : 'Publish to Catalog'}
              </button>
            </div>
          </form>
        </div>

        {/* ImageKit Asset Explorer Modal */}
        {showImgKitModal && (
          <ImgkitApi
            onSelectImage={handleImageKitSelect}
            onClose={() => setShowImgKitModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Editor;
