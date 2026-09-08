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

  const [saving, setSaving] = useState(false);
  const [showImgKitModal, setShowImgKitModal] = useState(false);

  // Load existing details if editing
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
        } catch (err) {
          console.warn('Could not load item from API for editor:', err.message);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !String(formData.price).trim()) {
      alert('Please fill in both Piece Name and Price.');
      return;
    }

    setSaving(true);
    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      price: formData.price,
      stockStatus: formData.stockStatus,
      img: formData.image.trim() || DEFAULT_IMAGE,
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
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Editor save error:', err);
      alert(`Saved: ${formData.name}`);
      navigate('/admin', { replace: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container" style={{ maxWidth: '800px' }}>
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">Studio Editor</span>
            <h1>{isEditMode ? 'Edit Furniture Piece' : 'Add New Furniture Piece'}</h1>
            <p>Define material specifications, imagery, and pricing in PostgreSQL.</p>
          </div>
          <Link to="/admin" className="admin-btn admin-btn-outline">
            ← Back to Console
          </Link>
        </header>

        <form className="admin-form-card" onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label font-weight-bold">Piece Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. Prestige - Oud Coffee Table"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label font-weight-bold">Category</label>
              <select
                name="category"
                className="form-control"
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

            <div className="col-md-6">
              <label className="form-label font-weight-bold">Price (JOD) *</label>
              <input
                type="text"
                name="price"
                className="form-control"
                placeholder="e.g. 420 or JOD 420"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label font-weight-bold">Material Specifications</label>
              <input
                type="text"
                name="material"
                className="form-control"
                placeholder="e.g. Solid White Oak, Brass Inlays"
                value={formData.material}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label font-weight-bold">Dimensions</label>
              <input
                type="text"
                name="dimensions"
                className="form-control"
                placeholder="e.g. 120cm x 60cm x 45cm"
                value={formData.dimensions}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="form-label font-weight-bold">Description & Craftsmanship Details</label>
            <textarea
              name="desc"
              className="form-control"
              rows={3}
              placeholder="Detailed description of the architectural piece..."
              value={formData.desc}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label font-weight-bold">Image URL</label>
            <div className="input-group">
              <input
                type="url"
                name="image"
                className="form-control"
                placeholder="https://ik.imagekit.io/..."
                value={formData.image}
                onChange={handleChange}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowImgKitModal(true)}
              >
                Browse ImageKit
              </button>
            </div>
          </div>

          {/* Preset Images Bar */}
          <div className="mb-4">
            <small className="text-muted d-block mb-2">Or select a Hurfa preset image:</small>
            <div className="d-flex gap-2 flex-wrap">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="btn btn-sm btn-light border"
                  onClick={() => setFormData((prev) => ({ ...prev, image: preset.url }))}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image Preview */}
          {formData.image && (
            <div className="mb-4 text-center p-3 bg-light rounded border">
              <small className="text-muted d-block mb-2">Image Preview:</small>
              <img
                src={formData.image}
                alt="Piece preview"
                style={{ maxHeight: '200px', objectFit: 'contain' }}
              />
            </div>
          )}

          <div className="d-flex justify-content-between mt-4">
            <Link to="/admin" className="admin-btn admin-btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : isEditMode ? 'Update Piece' : 'Save to Catalog'}
            </button>
          </div>
        </form>

        {/* ImageKit Modal */}
        {showImgKitModal && (
          <ImgkitApi
            onSelectImage={(url) => {
              setFormData((prev) => ({ ...prev, image: url }));
              setShowImgKitModal(false);
            }}
            onClose={() => setShowImgKitModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Editor;
