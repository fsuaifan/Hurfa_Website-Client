import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ProductModal from '../components/ProductModal';
import '../css/bedrooms.css';

function Bedrooms() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadBedrooms() {
      try {
        setLoading(true);
        const data = await api.bedrooms.getAll();
        if (isMounted && Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.warn('Bedrooms API warning:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadBedrooms();
    return () => {
      isMounted = false;
    };
  }, []);

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
        {products.map((product) => (
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
                src={product.images ? product.images[0] : product.image}
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

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
        />
      )}
    </div>
  );
}

export default Bedrooms;
