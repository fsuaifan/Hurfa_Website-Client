import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart } from '../utils/cartUtils';
import '../css/floating-cart.css';

function FloatingCart({ onClick, ariaLabel }) {
  const navigate = useNavigate();
  const [count, setCount] = useState(() => {
    const items = getCart();
    return items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  });

  useEffect(() => {
    const syncCount = () => {
      const items = getCart();
      setCount(items.reduce((acc, item) => acc + (item.quantity || 1), 0));
    };

    window.addEventListener('storage', syncCount);
    window.addEventListener('hurfa-cart-updated', syncCount);
    return () => {
      window.removeEventListener('storage', syncCount);
      window.removeEventListener('hurfa-cart-updated', syncCount);
    };
  }, []);

  const label = ariaLabel || `Shopping cart with ${count} ${count === 1 ? 'item' : 'items'}`;
  const handleClick = onClick || (() => navigate('/cart'));

  return (
    <button
      type="button"
      className="floating-cart-btn"
      onClick={handleClick}
      aria-label={label}
    >
      {/* Shopping Bag SVG Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="floating-cart-icon"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      {/* Cart Items Count Badge */}
      <span className={`floating-cart-badge ${count > 0 ? '' : 'is-hidden'}`}>
        {count}
      </span>
    </button>
  );
}

export default FloatingCart;