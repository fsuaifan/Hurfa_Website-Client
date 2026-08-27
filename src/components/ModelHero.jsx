import React, { useState, useEffect } from 'react';
import '../css/Kitchens.css';

function ModelHero({ model }) {
  const [activeImage, setActiveImage] = useState(model.mainImage);

  // Sync active image when model changes
  useEffect(() => {
    setActiveImage(model.mainImage);
  }, [model]);

  return (
    <section className="model-hero-section" aria-label={`${model.title} Showcase`}>
      {/* Main Large Display Image */}
      <div className="model-main-display">
        <img
          src={activeImage}
          alt={`${model.title} main view`}
        />
      </div>

      {/* Swatches Thumbnail Row */}
      {model.variations && model.variations.length > 1 && (
        <div className="model-swatches-row" role="tablist" aria-label="Photo angles and finishes">
          {model.variations.map((imgUrl, index) => (
            <button
              type="button"
              key={index}
              className={`model-swatch-btn ${activeImage === imgUrl ? 'active' : ''}`}
              onClick={() => setActiveImage(imgUrl)}
              aria-label={`View photo variation ${index + 1}`}
              aria-selected={activeImage === imgUrl}
            >
              <img src={imgUrl} alt={`Thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}

      {/* Model Meta Information */}
      <div className="model-meta-info">
        <h1>{model.title}</h1>
        <p>{model.desc}</p>
      </div>
    </section>
  );
}

export default ModelHero;