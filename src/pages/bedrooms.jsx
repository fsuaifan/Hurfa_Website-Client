import React, { useState } from 'react';
import { BEDROOM_PRODUCTS } from '../data/bedroomsData';
import ProductModal from '../components/ProductModal';
import '../css/bedrooms.css';

function Bedrooms() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
          <article
            key={product.id}
            className="bedroom-product-card"
            onClick={() => handleOpenProduct(product)}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${product.name}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleOpenProduct(product);
              }
            }}
          >
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

      {/* Quick-View Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        onAddToCart={(prod, qty) => {
          console.log('Added to cart:', prod?.name, 'Qty:', qty);
          handleCloseModal();
        }}
      />
    </div>
  );
}

export default Bedrooms;