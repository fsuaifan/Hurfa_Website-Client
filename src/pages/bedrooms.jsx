import React from 'react';
import { BEDROOM_PRODUCTS } from '../data/bedroomsData';
import '../css/bedrooms.css';

function Bedrooms() {
  return (
    <div className="bedrooms-page">
      {/* Bedrooms Hero Header */}
      <header className="bedroom-hero">
        <span className="bedrooms-eyebrow">Collections</span>
        <h1>Bedrooms</h1>
        <p>
          Bed frames, wardrobes, and nightstands built to match — pick a piece to
          see finishes, pricing, and details.
        </p>
      </header>

      {/* 2-Column Product Grid */}
      <section className="bedrooms-product-grid" aria-label="Bedroom Products">
        {BEDROOM_PRODUCTS.map((product) => (
          <article key={product.id} className="bedroom-product-card">
            <div className="bedroom-card-media">
              <img
                src={product.images[0]}
                alt={product.name}
                loading="lazy"
              />
            </div>
            <div className="bedroom-card-body">
              <h3>{product.name}</h3>
              <p className="bedroom-card-price">{product.price}</p>
              <p className="bedroom-card-desc">{product.desc}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default Bedrooms;