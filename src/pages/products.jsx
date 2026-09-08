import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import ProductModal from '../components/ProductModal';
import { useLanguage } from '../context/LanguageContext';
import '../css/products.css';

const DEFAULT_CATEGORIES = ['All', 'Kitchens', 'Bedrooms', 'Living Room', 'Living Room Tables', 'Consoles', 'TV Units', 'Commercial Offices'];

const FALLBACK_SIGNATURE_SUITES = [
  {
    id: 'the-oud-collection',
    name: 'The Oud Collection',
    title: 'The Oud Collection',
    tagline: 'Solid Oak & Bouclé',
    description: 'A signature living-room collection built around solid oak framing, subtle warm curves, and boucle upholstery.',
    desc: 'A signature living-room collection built around solid oak framing, subtle warm curves, and boucle upholstery.',
    price: 'JOD 2,400',
    priceRange: 'JOD 2,400',
    priceNumber: 2400,
    image: 'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Oud-Collection_u9dsnBlwn.jpg?updatedAt=1787138978278',
  },
  {
    id: 'the-wesal-collection',
    name: 'The Wesal Collection',
    title: 'The Wesal Collection',
    tagline: 'Walnut & Architectural Linen',
    description: 'A bedroom collection defined by low-profile walnut woodwork, soft textiles, and serene minimalist balance.',
    desc: 'A bedroom collection defined by low-profile walnut woodwork, soft textiles, and serene minimalist balance.',
    price: 'JOD 1,980',
    priceRange: 'JOD 1,980',
    priceNumber: 1980,
    image: 'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg?updatedAt=1787138960280',
  },
];

function Products() {
  const { t, tName, tDesc } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [signatureSuites, setSignatureSuites] = useState(FALLBACK_SIGNATURE_SUITES);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadInitialData() {
      try {
        setLoading(true);
        const [productsData, categoriesData, premiumData] = await Promise.allSettled([
          api.products.getAll(),
          api.categories.getAll(),
          api.products.getPremium(),
        ]);

        if (isMounted) {
          if (productsData.status === 'fulfilled' && Array.isArray(productsData.value)) {
            setProducts(productsData.value);
          }
          if (categoriesData.status === 'fulfilled' && Array.isArray(categoriesData.value) && categoriesData.value.length > 0) {
            const catNames = categoriesData.value.map((c) => c.name);
            setCategories(['All', ...catNames]);
          }
          if (premiumData.status === 'fulfilled' && Array.isArray(premiumData.value) && premiumData.value.length > 0) {
            setSignatureSuites(premiumData.value);
          }
        }
      } catch (err) {
        console.warn('Products initialization warning:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadInitialData();
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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== 'All') {
      result = result.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        const active = activeCategory.toLowerCase();
        return cat.includes(active) || (active === 'living room' && cat.includes('living'));
      });
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.priceNumber || 0) - (b.priceNumber || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.priceNumber || 0) - (a.priceNumber || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return result;
  }, [products, activeCategory, sortBy]);

  return (
    <div className="products-page">
      {/* Header & Filter Controls */}
      <header className="products-header">
        <span className="products-eyebrow">{t('catalog', 'Catalog')}</span>
        <h1>{t('homeFurniture', 'Home Furniture')}</h1>

        <div className="products-filter-bar">
          {/* Category Tabs */}
          <div className="products-filter-tabs" role="tablist" aria-label="Filter by category">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                className={`products-filter-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                role="tab"
                aria-selected={activeCategory === cat}
              >
                {cat === 'All' ? t('all', 'All') : t(cat, cat)}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="products-sort-wrapper">
            <label htmlFor="products-sort-select" className="visually-hidden">
              Sort Products
            </label>
            <select
              id="products-sort-select"
              className="products-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products by price"
            >
              <option value="default">{t('sortFeatured', 'Featured / Default')}</option>
              <option value="price-low">{t('sortPriceLow', 'Price: Low to High')}</option>
              <option value="price-high">{t('sortPriceHigh', 'Price: High to Low')}</option>
              <option value="newest">{t('sortNewest', 'Newest Arrivals')}</option>
            </select>
          </div>
        </div>
      </header>

      {/* Catalog Grid */}
      <section className="products-grid-section" aria-label="Furniture Products Grid">
        {loading && products.length === 0 ? (
          <div className="products-loading-state py-5 text-center">
            <p>{t('loadingCollection', 'Loading Hurfa collection...')}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="products-empty-state">
            <p>{t('noFurnitureFound', 'No furniture pieces found for the selected filter.')}</p>
            <button
              type="button"
              className="btn btn-outline-dark mt-3"
              onClick={() => setActiveCategory('All')}
            >
              {t('resetFilters', 'Reset Filters')}
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="product-card"
                onClick={() => handleOpenProduct(product)}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${tName(product.name)}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleOpenProduct(product);
                  }
                }}
              >
                <div className="product-card-image-wrap">
                  <img
                    src={product.images ? product.images[0] : product.image}
                    alt={tName(product.name)}
                    loading="lazy"
                  />
                  {product.salePrice && (
                    <span className="product-card-badge">{t('bespokeOffer', 'Bespoke Offer')}</span>
                  )}
                </div>
                <div className="product-card-body">
                  <span className="product-card-category">{t(product.category, product.category)}</span>
                  <h3 className="product-card-title">{tName(product.name)}</h3>
                  <div className="product-card-price-row">
                    <span className="product-card-price">{product.price}</span>
                    <span className="product-card-action">{t('viewPiece', 'View Piece →')}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Signature & Premium Collections Section */}
      <section className="products-premium-section" aria-label="Signature Collections">
        <div className="products-premium-header">
          <span className="products-eyebrow">{t('exclusives', 'Exclusives')}</span>
          <h2>{t('signatureSuites', 'Signature Suites')}</h2>
          <p>
            {t(
              'signatureSuitesDesc',
              'Explore our architectural whole-room conceptual collections, engineered with unified tone and materiality.'
            )}
          </p>
        </div>

        <div className="products-premium-grid">
          {signatureSuites.map((suite) => (
            <article
              key={suite.id}
              className="products-premium-card"
              onClick={() => handleOpenProduct(suite)}
              role="button"
              tabIndex={0}
              aria-label={`View suite details for ${tName(suite.title || suite.name)}`}
              style={{ cursor: 'pointer' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleOpenProduct(suite);
                }
              }}
            >
              <div className="products-premium-media">
                <img
                  src={suite.image || suite.mainImage}
                  alt={tName(suite.title || suite.name)}
                  loading="lazy"
                />
              </div>
              <div className="products-premium-info">
                <span className="products-premium-tag">{t(suite.tagline, suite.tagline)}</span>
                <h3>{tName(suite.title || suite.name)}</h3>
                <p>{tDesc(suite.description || suite.desc)}</p>
                <span className="products-premium-price">{suite.priceRange || suite.price}</span>
              </div>
            </article>
          ))}
        </div>
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

export default Products;
