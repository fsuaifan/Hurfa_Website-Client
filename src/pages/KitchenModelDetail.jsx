import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import ModelHero from '../components/ModelHero';
import ModelDetailRows from '../components/ModelDetailRows';
import { useLanguage } from '../context/LanguageContext';
import '../css/Kitchens.css';

function KitchenModelDetail() {
  const { t } = useLanguage();
  const { modelId } = useParams();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;

    async function loadModel() {
      try {
        setLoading(true);
        const data = await api.kitchens.getById(modelId);
        if (isMounted && data && !data.message) {
          setModel(data);
        }
      } catch (err) {
        console.warn('Kitchen model API warning:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (modelId) {
      loadModel();
    }

    return () => {
      isMounted = false;
    };
  }, [modelId]);

  if (loading && !model) {
    return (
      <div className="kitchen-detail-page text-center py-5">
        <div className="container py-5">
          <p className="text-secondary">{t('loadingSpecs', 'Loading kitchen specifications...')}</p>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="kitchen-detail-page text-center py-5">
        <div className="container py-5">
          <h2 className="mb-3">{t('modelNotFound', 'Kitchen Model Not Found')}</h2>
          <p className="text-secondary mb-4">
            {t('modelNotFoundDesc', "We couldn't find the kitchen model you were looking for.")}
          </p>
          <Link to="/kitchens" className="btn btn-outline-dark px-4">
            {t('backToKitchensArrow', '← Back to Collections')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="kitchen-detail-page">
      {/* Back Navigation */}
      <div className="model-back-bar">
        <Link to="/kitchens" className="back-link">
          {t('backToKitchensArrow', '← Back to Collections')}
        </Link>
      </div>

      {/* Model Hero Showcase with Photo Swatches */}
      <ModelHero model={model} />

      {/* Craftsmanship & Feature Breakdown */}
      <ModelDetailRows details={model.details || []} />
    </div>
  );
}

export default KitchenModelDetail;
