import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/cart.css';

// Initial sample items matching Hurfa collections
const INITIAL_CART_ITEMS = [
  {
    id: 'wardrobe-oak',
    name: 'Wardrobe — Oak',
    category: 'Bedrooms',
    unitPrice: 420,
    quantity: 1,
    image:
      'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Tayf_4iPZv6iGf.png?updatedAt=1782466205843',
  },
  {
    id: 'wesal-bed-frame',
    name: 'Bed Frame — Wesal',
    category: 'Bedrooms',
    unitPrice: 310,
    quantity: 1,
    image:
      'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg?updatedAt=1787138960280',
  },
];

function Cart() {
  const [items, setItems] = useState(INITIAL_CART_ITEMS);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Handlers for cart actions
  const handleQuantityChange = (id, delta) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setItems([]);
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'HURFA10') {
      setPromoApplied(true);
    } else {
      alert('Invalid promo code. Try "HURFA10" for 10% off.');
    }
  };

  // Calculations
  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const grandTotal = Math.max(0, subtotal - discount);

  return (
    <div className="cart-page">
      {/* Header */}
      <header className="cart-header">
        <span className="cart-eyebrow">Your Selection</span>
        <h1>Shopping Cart</h1>
        <p className="cart-subtitle">
          Review your chosen architectural pieces before proceeding to checkout.
        </p>
      </header>

      {items.length === 0 ? (
        /* Empty Cart State */
        <div className="cart-empty-state">
          <div className="cart-empty-icon" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h2>Your cart is currently empty</h2>
          <p>
            Explore our curated collections of bespoke kitchens, bedrooms, and signature
            furniture crafted with material integrity.
          </p>
          <Link to="/products" className="cart-empty-btn">
            Explore Collections
          </Link>
        </div>
      ) : (
        /* Main Cart Grid */
        <div className="cart-content-grid">
          {/* Left Column: Items List */}
          <section className="cart-items-column" aria-label="Cart Items">
            <div className="cart-items-topbar">
              <span className="cart-items-count">
                {totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'}
              </span>
              <button
                type="button"
                className="cart-clear-btn"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
            </div>

            {items.map((item) => (
              <article key={item.id} className="cart-item-card">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>

                <div className="cart-item-details">
                  <span className="cart-item-category">{item.category}</span>
                  <h2 className="cart-item-title">{item.name}</h2>
                  <span className="cart-item-unit-price">
                    JOD {item.unitPrice.toLocaleString()} each
                  </span>

                  <div className="cart-item-controls">
                    <div
                      className="cart-qty-box"
                      role="group"
                      aria-label={`Quantity selector for ${item.name}`}
                    >
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="cart-item-remove-btn"
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item-total-col">
                  <span className="cart-item-total-price">
                    JOD {(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              </article>
            ))}

            <div className="cart-footer-links">
              <Link to="/products" className="cart-continue-link">
                ← Continue Shopping
              </Link>
            </div>
          </section>

          {/* Right Column: Order Summary */}
          <aside className="cart-summary-column" aria-label="Order Summary">
            <div className="cart-summary-box">
              <h2 className="cart-summary-title">Order Summary</h2>

              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>JOD {subtotal.toLocaleString()}</span>
                </div>

                {promoApplied && (
                  <div className="cart-summary-row free-highlight">
                    <span>Promo Discount (10%)</span>
                    <span>- JOD {discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="cart-summary-row free-highlight">
                  <span>White-Glove Delivery</span>
                  <span>Complimentary</span>
                </div>

                <div className="cart-summary-row free-highlight">
                  <span>Installation & Assembly</span>
                  <span>Included</span>
                </div>

                <div className="cart-summary-divider" />

                <div className="cart-summary-row total-row">
                  <span>Total</span>
                  <span>JOD {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Promo Code Form */}
              <form className="cart-promo-form" onSubmit={handleApplyPromo}>
                <input
                  type="text"
                  className="cart-promo-input"
                  placeholder="Promo code (e.g. HURFA10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                />
                <button
                  type="submit"
                  className="cart-promo-btn"
                  disabled={promoApplied || !promoCode.trim()}
                >
                  {promoApplied ? 'Applied' : 'Apply'}
                </button>
              </form>

              {/* Checkout CTA */}
              <button
                type="button"
                className="cart-checkout-btn"
                onClick={() =>
                  alert('Proceeding to Hurfa secure architectural checkout...')
                }
              >
                Proceed to Checkout
              </button>

              {/* Trust Badges */}
              <div className="cart-trust-badges">
                <div className="cart-trust-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                  <span>5-Year Structural Craftsmanship Warranty</span>
                </div>
                <div className="cart-trust-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                    <path d="M15 18H9" />
                    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                    <circle cx="17" cy="18" r="2" />
                    <circle cx="7" cy="18" r="2" />
                  </svg>
                  <span>White-Glove Delivery & Installation in Jordan</span>
                </div>
                <div className="cart-trust-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span>Bespoke Design House Standards</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;