import React, { useState, useEffect } from 'react';
import { addToCart } from '../utils/cartUtils';
import { useLanguage } from '../context/LanguageContext';
import '../css/product-modal.css';

function ProductModal({ isOpen, onClose, product, onAddToCart }) {
  const { t, tName, tDesc } = useLanguage();
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('standard'); // 'standard' | 'set2'
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Normalize product images array
  const images = product?.images || (product?.image ? [product.image] : []);

  // Sync active image and reset quantity when product changes or modal opens
  useEffect(() => {
    if (product) {
      setActiveImage(images[0] || product.mainImage || product.image || '');
      setQuantity(1);
      setSelectedVariant('standard');
      setAddedSuccess(false);
    }
  }, [product, isOpen]);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const hasDualPrice = Boolean(product.price2 && product.price2 > 0);
  const isSet2 = selectedVariant === 'set2';

  const activePriceNumber = isSet2 ? product.price2 : (product.priceNumber || 0);
  const activeSalePrice = isSet2 ? (product.salePrice2 || null) : (product.salePrice || null);
  const activePriceFormatted = isSet2 
    ? (product.price2Formatted || `JOD ${product.price2?.toLocaleString()}`) 
    : product.price;

  const handleAddToCartClick = () => {
    const variantLabel = hasDualPrice ? (isSet2 ? 'Suite with Wardrobe / Option B' : 'Standard Suite') : null;
    
    const productToAdd = {
      ...product,
      priceNumber: activePriceNumber,
      price: activePriceFormatted,
      salePrice: activeSalePrice,
    };

    if (onAddToCart) {
      onAddToCart(productToAdd, quantity, variantLabel);
    } else {
      addToCart(productToAdd, quantity, variantLabel);
    }

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose?.();
    }, 700);
  };

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div
      className={`product-modal-overlay ${isOpen ? 'open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      <div className="product-modal-box">
        {/* Close Button */}
        <button
          type="button"
          className="product-modal-close"
          onClick={onClose}
          aria-label="Close product view"
        >
          &times;
        </button>

        {/* Left Column: Product Images */}
        <div className="product-modal-images">
          <div className="product-modal-main-img">
            {activeImage && (
              <img
                src={activeImage}
                alt={tName(product.name || product.title || 'Product view')}
              />
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="product-modal-thumbs" role="tablist" aria-label="Product angles">
              {images.map((imgUrl, index) => (
                <button
                  type="button"
                  key={index}
                  className={`product-modal-thumb-btn ${activeImage === imgUrl ? 'active' : ''}`}
                  onClick={() => setActiveImage(imgUrl)}
                  aria-label={`View photo ${index + 1}`}
                  aria-selected={activeImage === imgUrl}
                >
                  <img src={imgUrl} alt={`Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Information */}
        <div className="product-modal-info">
          {product.category && (
            <span className="product-modal-eyebrow">{t(product.category, product.category)}</span>
          )}
          <h2 id="modal-product-title">{tName(product.name || product.title)}</h2>
          
          {/* Price Display with Sale Support */}
          <div className="product-modal-price">
            {activeSalePrice ? (
              <div className="d-flex align-items-center gap-2">
                <span className="text-decoration-line-through text-secondary" style={{ fontSize: '1.1rem' }}>
                  {activePriceFormatted}
                </span>
                <span className="text-danger fw-bold">
                  JOD {activeSalePrice.toLocaleString()}
                </span>
                <span className="badge bg-danger ms-1" style={{ fontSize: '0.75rem' }}>
                  {t('specialOffer', 'Special Offer')}
                </span>
              </div>
            ) : (
              <span>{activePriceFormatted}</span>
            )}
          </div>

          {/* Variant Selector if product has dual pricing (e.g. Set with Wardrobe) */}
          {hasDualPrice && (
            <div className="product-variant-selector mb-3">
              <label className="d-block text-secondary small text-uppercase mb-1 fw-semibold">
                {t('configurationOption', 'Configuration Option')}
              </label>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className={`btn btn-sm ${!isSet2 ? 'btn-dark' : 'btn-outline-dark'}`}
                  onClick={() => setSelectedVariant('standard')}
                >
                  {t('standardSuite', 'Standard Suite')} ({product.price})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${isSet2 ? 'btn-dark' : 'btn-outline-dark'}`}
                  onClick={() => setSelectedVariant('set2')}
                >
                  {t('expandedSuite', 'Expanded Suite')} ({product.price2Formatted || `JOD ${product.price2}`})
                </button>
              </div>
            </div>
          )}

          <p className="product-modal-desc">
            {tDesc(product.desc || product.description || 'Crafted with premium materials and signature Hurfa architectural detail.')}
          </p>

          {product.material && (
            <div className="mb-2 small text-secondary">
              <strong className="text-dark">{t('materials', 'Materials:')}</strong> {product.material}
            </div>
          )}

          {product.dimensions && (
            <div className="mb-3 small text-secondary">
              <strong className="text-dark">{t('dimensions', 'Dimensions:')}</strong> {product.dimensions}
            </div>
          )}

          {/* Actions: Quantity & Add to Cart */}
          <div className="product-modal-actions">
            <div className="product-modal-qty-row">
              <label htmlFor="modal-qty-input">{t('quantity', 'Quantity')}</label>
              <div className="product-modal-qty-controls">
                <button
                  type="button"
                  className="product-modal-qty-btn"
                  onClick={handleDecrement}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  id="modal-qty-input"
                  type="text"
                  className="product-modal-qty-input"
                  value={quantity}
                  readOnly
                  aria-live="polite"
                />
                <button
                  type="button"
                  className="product-modal-qty-btn"
                  onClick={handleIncrement}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              className="btn-product-add-cart"
              onClick={handleAddToCartClick}
              style={addedSuccess ? { backgroundColor: '#16a34a', borderColor: '#16a34a' } : {}}
            >
              <span>{addedSuccess ? t('addedToCart', '✓ Added to Cart') : t('addToCart', 'Add to Cart')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;