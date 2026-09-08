import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../css/Kitchens.css';

function ModelDetailRows({ details }) {
  const { t, tName, tDesc } = useLanguage();
  if (!details || details.length === 0) return null;

  return (
    <section className="model-detail-rows" aria-label="Craftsmanship and Materials">
      {details.map((row, index) => {
        const isReverse = index % 2 !== 0;
        return (
          <article
            key={row.title}
            className={`model-detail-row ${isReverse ? 'reverse' : ''}`}
          >
            <div className="model-row-image">
              <img
                src={row.image}
                alt={`${tName(row.title)} detail`}
                loading="lazy"
              />
            </div>
            <div className="model-row-copy">
              <span className="kitchens-eyebrow">{t('craftsmanship', 'Craftsmanship')}</span>
              <h3>{tName(row.title)}</h3>
              <p>{tDesc(row.copy)}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default ModelDetailRows;