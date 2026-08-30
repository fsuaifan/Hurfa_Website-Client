import React, { useState, useEffect } from 'react';
import '../css/product-modal.css';

function ProductModal({ isOpen, onClose, product, onAddToCart }) {
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Normalize product images array
  const images = product?.images || (product?.image ? [product.image] : []);

  // Sync active image and reset quantity when product changes or modal opens
  useEffect(() => {
    if (product) {
      setActiveImage(images[0] || '');
      setQuantity(1);
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

  const handleAddToCart = () => {
    onAddToCart?.(product, quantity);
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
                alt={product.name || product.title || 'Product view'}
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
            <span className="product-modal-eyebrow">{product.category}</span>
          )}
          <h2 id="modal-product-title">{product.name || product.title}</h2>
          <div className="product-modal-price">{product.price}</div>
          <p className="product-modal-desc">
            {product.desc || product.description || 'Crafted with premium materials and signature Hurfa detail.'}
          </p>

          {/* Actions: Quantity & Add to Cart */}
          <div className="product-modal-actions">
            <div className="product-modal-qty-row">
              <label htmlFor="modal-qty-input">Quantity</label>
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
              onClick={handleAddToCart}
            >
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;