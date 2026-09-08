import React, { useState, useEffect } from 'react';
import '../css/Kitchens.css';

function ModelHero({ model }) {
  const variations = model.variations || [];
  const initialMain = variations[0]?.mainImg || variations[0]?.mainImage || model.mainImage || '';
  const [activeMain, setActiveMain] = useState(initialMain);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Sync active main image when model changes
  useEffect(() => {
    const defaultMain = model.variations?.[0]?.mainImg || model.variations?.[0]?.mainImage || model.mainImage || '';
    setActiveMain(defaultMain);
    setSelectedIndex(0);
  }, [model]);

  const handleSelectVariation = (variation, index) => {
    const newMain = typeof variation === 'string' ? variation : variation.mainImg || variation.mainImage || variation.img;
    if (newMain) {
      setActiveMain(newMain);
      setSelectedIndex(index);
    }
  };

  return (
    <section className="model-hero-section" aria-label={`${model.title || model.name} Showcase`}>
      {/* Main Large Display Image */}
      <div className="model-main-display">
        <img
          src={activeMain || model.mainImage}
          alt={`${model.title || model.name} main view`}
        />
      </div>

      {/* Round Color / Material Variation Swatches (matching Hurfa PHP kitchenModel) */}
      {variations && variations.length > 0 && (
        <div className="model-swatches-row" role="tablist" aria-label="Kitchen model color and finish variations">
          {variations.map((item, index) => {
            const mainImg = typeof item === 'string' ? item : item.mainImg || item.mainImage;
            const varImg = typeof item === 'string' ? item : item.varImg || item.varImage || item.mainImg || item.mainImage;
            const isSelected = selectedIndex === index || activeMain === mainImg;

            return (
              <button
                type="button"
                key={item.id || index}
                className={`model-swatch-btn ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectVariation(item, index)}
                onMouseEnter={() => handleSelectVariation(item, index)}
                aria-label={`View finish variation ${index + 1}`}
                aria-selected={isSelected}
                role="tab"
              >
                <img
                  src={varImg}
                  alt={`Variation swatch ${index + 1}`}
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Model Meta Information */}
      <div className="model-meta-info">
        <h1>{model.title || model.name}</h1>
        <p>{model.desc || 'Experience the perfect blend of architectural style and functionality with our premium kitchen designs.'}</p>
      </div>
    </section>
  );
}

export default ModelHero;