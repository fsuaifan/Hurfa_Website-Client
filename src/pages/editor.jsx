import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
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
    label: 'Tayf Bedroom / Suite',
    url: 'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Tayf_4iPZv6iGf.png?updatedAt=1782466205843',
  },
  {
    label: 'Oud Collection',
    url: 'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Oud-Collection_u9dsnBlwn.jpg?updatedAt=1787138978278',
  },
  {
    label: 'Rawas Suite',
    url: 'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Rawas_II_J2llqj_AWB.png',
  },
  {
    label: 'Barah Suite',
    url: 'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Sanam_lq-is0WSy.png',
  },
  {
    label: 'Kitchen Island V4',
    url: 'https://ik.imagekit.io/6dghafkgmq/Kitchens/Kit3V4.jpg?updatedAt=1779196664060',
  },
];

function Editor() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const queryType = searchParams.get('type');
  const isEditMode = Boolean(productId);

  // Initialize form state
  const [formData, setFormData] = useState({
    name: '',
    category: queryType === 'bedroom' ? 'Bedrooms' : 'Kitchens',
    price: '',
    price2: '',
    stockStatus: 'In Stock',
    isVisible: true,
    image: '',
    desc: '',
    dimensions: '',
    material: '',
  });

  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImgKitModal, setShowImgKitModal] = useState(false);

  // Fetch product or bedroom from API if in edit mode
  useEffect(() => {
    let isMounted = true;
    async function loadItem() {
      if (productId) {
        try {
          let item = null;
          if (queryType === 'bedroom') {
            try {
              item = await api.bedrooms.getById(productId);
            } catch (e) {
              item = await api.catalog.getById(productId);
            }
          } else {
            try {
              item = await api.catalog.getById(productId);
            } catch (e) {
              item = await api.bedrooms.getById(productId);
            }
          }

          if (isMounted && item && !item.message) {
            const isBed = queryType === 'bedroom' || item.category === 'Bedrooms';
            setFormData({
              name: item.name || '',
              category: isBed ? 'Bedrooms' : (item.category || 'Kitchens'),
              price: item.price || item.priceNumber || '',
              price2: item.price2 || item.price2Formatted || '',
              stockStatus: item.stockStatus || 'In Stock',
              isVisible: item.isVisible !== false,
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
  }, [productId, queryType]);

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
        text: t('editorFillRequired', 'Please provide both a piece name and price.'),
      });
      return;
    }

    setIsSubmitting(true);

    const finalImage = formData.image.trim() || DEFAULT_IMAGE;
    const formattedPrice = formData.price.trim().toUpperCase().startsWith('JOD')
      ? formData.price.trim()
      : `JOD ${formData.price.trim()}`;

    const isBedroom = formData.category === 'Bedrooms' || queryType === 'bedroom';
    const finalIsVisible = formData.isVisible !== false;
    const finalStockStatus = formData.stockStatus || 'In Stock';
    const cleanPrice = String(formData.price).replace(/[^0-9.]/g, '');
    const cleanPrice2 = String(formData.price2 || '').replace(/[^0-9.]/g, '');

    try {
      if (isBedroom) {
        const bedroomPayload = {
          name: formData.name.trim(),
          desc: formData.desc.trim(),
          img: finalImage,
          price: cleanPrice ? parseFloat(cleanPrice) : null,
          price2: cleanPrice2 ? parseFloat(cleanPrice2) : null,
          isvisible: finalIsVisible,
          isVisible: finalIsVisible,
          stock_status: finalStockStatus,
          stockStatus: finalStockStatus,
        };

        if (isEditMode) {
          await api.bedrooms.update(productId, bedroomPayload);
        } else {
          await api.bedrooms.create(bedroomPayload);
        }
      } else {
        const catalogPayload = {
          name: formData.name.trim(),
          category: formData.category,
          price: formattedPrice,
          stockStatus: finalStockStatus,
          stock_status: finalStockStatus,
          isVisible: finalIsVisible,
          isvisible: finalIsVisible,
          img: finalImage,
          desc: formData.desc.trim(),
          dimensions: formData.dimensions.trim(),
          material: formData.material.trim(),
        };

        if (isEditMode) {
          await api.catalog.update(productId, catalogPayload);
        } else {
          await api.catalog.create(catalogPayload);
        }
      }

      setStatusMessage({
        type: 'success',
        text: isEditMode
          ? t('editorChangesSaved', 'Piece changes saved successfully!')
          : t('editorAddedSuccess', 'New piece added to catalog!'),
      });

      setTimeout(() => {
        navigate('/admin');
      }, 700);
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: t('editorSaveFailed', 'Failed to save record to storage.'),
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
            <span className="admin-eyebrow">{t('studioEditor', 'Studio Editor')}</span>
            <h1>{isEditMode ? t('editPiece', 'Edit Furniture Piece') : t('addNewPiece', 'Add New Furniture Piece')}</h1>
            <p>
              {isEditMode
                ? t('editPieceSubtitle', 'Update product details, pricing, dimensions, and specifications.')
                : t('addNewPieceSubtitle', 'Create a new piece and publish it directly to the Hurfa catalog.')}
            </p>
          </div>

          <div className="admin-header-actions">
            <Link to="/admin" className="admin-btn admin-btn-outline">
              {t('backToManagement', '← Back to Management')}
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
                  {t('pieceName', 'Piece Name')} <span className="required">*</span>
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
                  {t('category', 'Category')} <span className="required">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  className="admin-form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Kitchens">{t('Kitchens', 'Kitchens')}</option>
                  <option value="Bedrooms">{t('Bedrooms', 'Bedrooms')}</option>
                  <option value="Living Room">{t('Living Room', 'Living Room')}</option>
                  <option value="Living Room Tables">{t('Living Room Tables', 'Living Room Tables')}</option>
                  <option value="Consoles">{t('Consoles', 'Consoles')}</option>
                  <option value="TV Units">{t('TV Units', 'TV Units')}</option>
                  <option value="Commercial Offices">{t('Commercial Offices', 'Commercial Offices')}</option>
                </select>
              </div>
            </div>

            {/* Row 2: Price and Stock Status */}
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="price" className="admin-form-label">
                  {formData.category === 'Bedrooms'
                    ? t('standardPrice', 'Standard Price (JOD)')
                    : t('priceJod', 'Price (JOD)')}{' '}
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  className="admin-form-input"
                  placeholder={formData.category === 'Bedrooms' ? 'e.g. 1450' : 'e.g. 420 or JOD 420'}
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              {formData.category === 'Bedrooms' && (
                <div className="admin-form-group">
                  <label htmlFor="price2" className="admin-form-label">
                    {t('wardrobeOptionPrice', 'With Wardrobe / Option B (JOD)')}
                  </label>
                  <input
                    type="text"
                    id="price2"
                    name="price2"
                    className="admin-form-input"
                    placeholder="e.g. 2100"
                    value={formData.price2}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="admin-form-group">
                <label htmlFor="stockStatus" className="admin-form-label">
                  {t('stockStatus', 'Stock Status')}
                </label>
                <select
                  id="stockStatus"
                  name="stockStatus"
                  className="admin-form-select"
                  value={formData.stockStatus}
                  onChange={handleChange}
                >
                  <option value="In Stock">{t('inStock', 'In-stock')}</option>
                  <option value="Low Stock">{t('lowStock', 'Low-stock')}</option>
                  <option value="Out of Stock">{t('outOfStock', 'Out-of-stock')}</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="isVisible" className="admin-form-label">
                  {t('visibility', 'Catalog Visibility')}
                </label>
                <select
                  id="isVisible"
                  name="isVisible"
                  className="admin-form-select"
                  value={formData.isVisible ? 'visible' : 'hidden'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isVisible: e.target.value === 'visible',
                    }))
                  }
                >
                  <option value="visible">{t('visibleActive', 'Visible (Published on Website)')}</option>
                  <option value="hidden">{t('hiddenPiece', 'Hidden (Draft / Unpublished)')}</option>
                </select>
              </div>
            </div>

            {/* Row 3: Dimensions and Material */}
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="dimensions" className="admin-form-label">
                  {t('dimensions', 'Dimensions')}
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
                  {t('materialsDesc', 'Materials & Craftsmanship')}
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
                {t('description', 'Description')}
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
                  {t('imageMedia', 'Product Image URL')}
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
                  {t('uploadViaImageKit', 'Browse ImageKit Asset Library')}
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
                <span className="admin-presets-title">{t('selectPreset', 'Hurfa Studio Presets:')}</span>
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
                  <span className="admin-preview-title">{t('imageMedia', 'Active Media Preview:')}</span>
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
                {t('cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t('savePiece', 'Saving Piece...')
                  : isEditMode
                  ? t('savePiece', 'Save Changes')
                  : t('savePiece', 'Publish to Catalog')}
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
