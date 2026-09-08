import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import '../css/Kitchens.css';

function KitchenGallery() {
  const { t, tName } = useLanguage();
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
          aria-label={`Explore ${tName(model.title)} Kitchen Model`}
        >
          <img
            src={model.mainImage}
            alt={`${tName(model.title)} kitchen design`}
            loading="lazy"
          />
          <div className="kitchen-tile-label">
            <span className="kitchens-eyebrow">{t(model.eyebrow || 'Model', model.eyebrow || 'Model')}</span>
            <h3>{tName(model.title)}</h3>
          </div>
        </Link>
      ))}
    </section>
  );
}

export default KitchenGallery;
