import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import '../css/Kitchens.css';

function KitchenGallery() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadKitchens() {
      try {
        setLoading(true);
        const data = await api.kitchens.getAll();
        if (isMounted && Array.isArray(data)) {
          setModels(data);
        }
      } catch (err) {
        console.warn('Kitchens API warning:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadKitchens();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="kitchens-gallery-grid" aria-label="Kitchen Models Collection">
      {models.map((model) => (
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
            <span className="kitchens-eyebrow">{model.eyebrow || 'Model'}</span>
            <h3>{model.title}</h3>
          </div>
        </Link>
      ))}
    </section>
  );
}

export default KitchenGallery;
