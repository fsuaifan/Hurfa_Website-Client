import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { getCart, removeFromCart, updateCartQuantity, clearCart } from '../utils/cartUtils';
import '../css/cart.css';

function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => getCart());
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Sync state from cartUtils / storage events
  const syncCartState = useCallback(() => {
    setItems(getCart());
  }, []);

  useEffect(() => {
    syncCartState();
    window.addEventListener('hurfa-cart-updated', syncCartState);
    window.addEventListener('storage', syncCartState);
    return () => {
      window.removeEventListener('hurfa-cart-updated', syncCartState);
      window.removeEventListener('storage', syncCartState);
    };
  }, [syncCartState]);

  // Load from backend if user is logged in
  useEffect(() => {
    let isMounted = true;
    async function syncBackendCart() {
      try {
        const userStr = sessionStorage.getItem('hurfa_user') || localStorage.getItem('hurfa_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user?.email) {
            const dbCart = await api.cart.get(user.email);
            if (isMounted && Array.isArray(dbCart) && dbCart.length > 0) {
              const formatted = dbCart.map((row) => ({
                id: row.id || row.product_id,
                name: row.name,
                category: row.category || 'Furniture',
                unitPrice: parseFloat(row.price) || 0,
                price: parseFloat(row.price) || 0,
                quantity: row.quantity || 1,
                image: row.img || row.image || 'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg',
              }));
              setItems(formatted);
            }
          }
        }
      } catch (err) {
        console.warn('Using local cart state:', err.message);
      }
    }
    syncBackendCart();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handlers
  const handleQuantityChange = (id, delta) => {
    const updated = updateCartQuantity(id, delta);
    setItems(updated);
  };

  const handleRemoveItem = (id) => {
    const updated = removeFromCart(id);
    setItems(updated);
  };

  const handleClearCart = () => {
    clearCart();
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

  const totalItemCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const subtotal = items.reduce((acc, item) => {
    const unitPrice = item.unitPrice !== undefined ? item.unitPrice : item.price || 0;
    return acc + unitPrice * (item.quantity || 1);
  }, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const grandTotal = Math.max(0, subtotal - discount);

  const handleCheckout = async () => {
    const userStr = sessionStorage.getItem('hurfa_user') || localStorage.getItem('hurfa_user');
    let user = { name: 'Valued Patron', email: 'guest@hurfa.com', phone: '+962 7 9000 0000' };

    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (e) {
        console.error(e);
      }
    }

    const itemsSummary = items.map((i) => `${i.name} (x${i.quantity || 1})`).join(', ');

    setCheckingOut(true);
    try {
      const order = await api.orders.create({
        clientName: user.name || 'Valued Patron',
        clientEmail: user.email || 'patron@example.com',
        clientPhone: user.phone || '+962 7 9000 0000',
        items: itemsSummary,
        total: grandTotal,
        deliveryAddress: 'Amman, Jordan',
        status: 'In Production',
      });

      setOrderSuccess(order);
      clearCart();
      setItems([]);
    } catch (err) {
      console.error('Checkout error:', err);
      alert(`Checkout could not be completed: ${err.message || 'Please check your connection and try again.'}`);
    } finally {
      setCheckingOut(false);
    }
  };

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

      {/* Order Success Confirmation Banner */}
      {orderSuccess ? (
        <div className="cart-empty-state text-center py-5">
          <div className="cart-empty-icon mb-3" style={{ color: '#27ae60' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2>Thank you for your order!</h2>
          <p className="mb-2">
            Order Reference: <strong>{orderSuccess.id}</strong>
          </p>
          <p className="text-secondary mb-4">
            Your bespoke architectural order has been received and scheduled for production.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/products" className="cart-empty-btn">
              Explore More Pieces
            </Link>
            <Link to="/account" className="btn btn-outline-dark px-4 py-2">
              View My Orders
            </Link>
          </div>
        </div>
      ) : items.length === 0 ? (
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
                        aria-label={`Decrease quantity for ${item.name}`}
                      >
                        -
                      </button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        aria-label={`Increase quantity for ${item.name}`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="cart-item-remove-btn"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  <span>JOD {(item.unitPrice * item.quantity).toLocaleString()}</span>
                </div>
              </article>
            ))}
          </section>

          {/* Right Column: Summary Card */}
          <aside className="cart-summary-column" aria-label="Order Summary">
            <div className="cart-summary-card">
              <h2>Order Summary</h2>

              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span>Items Subtotal</span>
                  <span>JOD {subtotal.toLocaleString()}</span>
                </div>

                {promoApplied && (
                  <div className="cart-summary-row discount">
                    <span>Architectural Discount (10%)</span>
                    <span>-JOD {discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="cart-summary-row">
                  <span>White-Glove Delivery</span>
                  <span className="cart-free-tag">Complimentary</span>
                </div>

                <div className="cart-summary-row total">
                  <span>Estimated Total</span>
                  <span>JOD {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Promo Code Form */}
              <form className="cart-promo-form" onSubmit={handleApplyPromo}>
                <input
                  type="text"
                  className="cart-promo-input"
                  placeholder="Promo Code (HURFA10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button type="submit" className="cart-promo-btn">
                  Apply
                </button>
              </form>

              {/* Checkout Button */}
              <button
                type="button"
                className="cart-checkout-btn"
                disabled={checkingOut}
                onClick={handleCheckout}
              >
                {checkingOut ? 'Placing Order...' : 'Proceed to Checkout'}
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
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
