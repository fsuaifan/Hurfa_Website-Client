import React from 'react';
import '../css/Kitchens.css';

function ModelDetailRows({ details }) {
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
                alt={`${row.title} detail`}
                loading="lazy"
              />
            </div>
            <div className="model-row-copy">
              <span className="kitchens-eyebrow">Craftsmanship</span>
              <h3>{row.title}</h3>
              <p>{row.copy}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default ModelDetailRows;