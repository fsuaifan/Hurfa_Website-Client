import React from 'react';
import KitchenGallery from '../components/KitchenGallery';
import '../css/Kitchens.css';

function Kitchens() {
  return (
    <div className="kitchens-page">
      {/* Page Header */}
      <header className="kitchens-header">
        <span className="kitchens-eyebrow">Collections</span>
        <h1>Kitchens</h1>
        <p>
          Every kitchen we build is designed around how you actually cook and
          live — from minimalist layouts to warm, traditional finishes.
        </p>
      </header>

      {/* 3-Column Collection Showcase */}
      <KitchenGallery />
    </div>
  );
}

export default Kitchens;