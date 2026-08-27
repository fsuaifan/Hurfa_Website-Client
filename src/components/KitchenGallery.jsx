import React from 'react';
import { Link } from 'react-router-dom';
import { KITCHEN_MODELS } from '../data/kitchensData';
import '../css/Kitchens.css';

function KitchenGallery() {
  return (
    <section className="kitchens-gallery-grid" aria-label="Kitchen Models Collection">
      {KITCHEN_MODELS.map((model) => (
        <Link
          to={`/kitchens/${model.id}`}
          key={model.id}
          className="kitchen-tile"
          aria-label={`Explore ${model.title} Kitchen Model`}
        >
          <img
            src={model.mainImage}
            alt={`${model.title} kitchen design`}
            loading="lazy"
          />
          <div className="kitchen-tile-label">
            <span className="kitchens-eyebrow">{model.eyebrow}</span>
            <h3>{model.title}</h3>
          </div>
        </Link>
      ))}
    </section>
  );
}

export default KitchenGallery;