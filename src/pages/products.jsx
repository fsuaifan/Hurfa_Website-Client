import React, { useState, useMemo } from 'react';
import { CATALOG_PRODUCTS, PREMIUM_COLLECTIONS } from '../data/productsData';
import '../css/products.css';

const CATEGORIES = ['All', 'Kitchens', 'Bedrooms', 'Living Room'];

function Products() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...CATALOG_PRODUCTS];

    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.priceNumber - b.priceNumber);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.priceNumber - a.priceNumber);
    }

    return result;
  }, [activeCategory, sortBy]);

  return (
    <div className="products-page">
      {/* Header & Filter Controls */}
      <header className="products-header">
        <span className="products-eyebrow">Catalog</span>
        <h1>Home Furniture</h1>

        <div className="products-filter-bar">
          {/* Category Tabs */}
          <div className="products-filter-tabs" role="tablist" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                className={`products-filter-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                role="tab"
                aria-selected={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="products-sort-wrap">
            <label htmlFor="products-sort-select">Sort By</label>
            <select
              id="products-sort-select"
              className="products-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main 3-Column Products Grid */}
      <section className="products-grid-section" aria-label="Products Catalog">
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <article key={product.id} className="product-item-card">
              <div className="product-item-media">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  loading="lazy"
                />
              </div>
              <div className="product-item-body">
                <span className="product-item-tag">{product.category}</span>
                <h3>{product.name}</h3>
                <p className="product-item-price">{product.price}</p>
                <p className="product-item-desc">{product.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Premium Collections Section */}
      <section className="products-collections-section" aria-label="Premium Collections">
        <div className="products-collections-header">
          <span className="products-eyebrow">Signature</span>
          <h2>Premium Collection</h2>
        </div>

        <div className="products-collections-grid">
          {PREMIUM_COLLECTIONS.map((col) => (
            <article key={col.id} className="collection-item-card">
              <div className="collection-item-media">
                <img
                  src={col.image}
                  alt={col.name}
                  loading="lazy"
                />
              </div>
              <div className="collection-item-body">
                <span className="product-item-tag">{col.category}</span>
                <h3>{col.name}</h3>
                <p className="collection-item-price">{col.price}</p>
                <p className="collection-item-desc">{col.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Products;