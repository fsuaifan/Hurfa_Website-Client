import React from 'react';
import KitchenGallery from '../components/KitchenGallery';
import { useLanguage } from '../context/LanguageContext';
import '../css/Kitchens.css';

function Kitchens() {
  const { t } = useLanguage();

  return (
    <div className="kitchens-page">
      {/* Page Header */}
      <header className="kitchens-header">
        <span className="kitchens-eyebrow">{t('collections', 'Collections')}</span>
        <h1>{t('kitchens', 'Kitchens')}</h1>
        <p>
          {t(
            'kitchensHeroDesc',
            'Every kitchen we build is designed around how you actually cook and live — from minimalist layouts to warm, traditional finishes.'
          )}
        </p>
      </header>

      {/* 3-Column Collection Showcase */}
      <KitchenGallery />
    </div>
  );
}

export default Kitchens;