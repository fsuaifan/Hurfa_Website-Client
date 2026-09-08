import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { KITCHEN_MODELS_DATA } from '../data/kitchensData';
import { api } from '../services/api';
import ModelHero from '../components/ModelHero';
import ModelDetailRows from '../components/ModelDetailRows';
import '../css/Kitchens.css';

function KitchenModelDetail() {
  const { modelId } = useParams();
  const [model, setModel] = useState(KITCHEN_MODELS_DATA[modelId?.toLowerCase()]);

  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;

    async function loadModel() {
      try {
        const data = await api.kitchens.getById(modelId);
        if (isMounted && data && !data.message) {
          setModel(data);
        }
      } catch (err) {
        console.warn('Using local model fallback:', err.message);
      }
    }

    if (modelId) {
      loadModel();
    }

    return () => {
      isMounted = false;
    };
  }, [modelId]);

  if (!model) {
    return (
      <div className="kitchen-detail-page text-center py-5">
        <div className="container py-5">
          <h2 className="mb-3">Kitchen Model Not Found</h2>
          <p className="text-secondary mb-4">
            We couldn't find the kitchen model you were looking for.
          </p>
          <Link to="/kitchens" className="btn btn-outline-dark px-4">
            ← Back to Kitchens
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
          ← Back to Collections
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
