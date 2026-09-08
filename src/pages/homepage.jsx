import React from 'react';
import { Link } from 'react-router-dom';
import HomeVideo from '../components/Home-vid';
import { useLanguage } from '../context/LanguageContext';
import '../css/homepage.css';

function HomePage() {
  const { t } = useLanguage();

  const categories = [
    {
      title: t('kitchenDesign', 'Kitchen Design'),
      eyebrow: t('kitchens', 'Kitchens'),
      image: 'https://ik.imagekit.io/6dghafkgmq/Kitchens/Kit3V4.jpg?updatedAt=1779196664060',
      link: '/kitchens',
    },
    {
      title: t('furnitureDesign', 'Furniture Design'),
      eyebrow: t('homeFurniture', 'Furniture'),
      image: 'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg?updatedAt=1787138960280',
      link: '/products',
    },
    {
      title: t('bedrooms', 'Bedrooms'),
      eyebrow: t('bedrooms', 'Bedrooms'),
      image: 'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Tayf_4iPZv6iGf.png?updatedAt=1782466205843',
      link: '/bedrooms',
    },
    {
      title: t('interiorDesign', 'Interior Design'),
      eyebrow: t('interiorDesign', 'Interiors'),
      image: 'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Oud-Collection_u9dsnBlwn.jpg?updatedAt=1787138978278',
      link: '/about',
    },
  ];

  return (
    <div className="homepage">
      {/* 1. Hero Background Video Component */}
      <HomeVideo />

      {/* 2. Statement / Philosophy Section */}
      <section className="home-statement">
        <span className="home-eyebrow">{t('whatWeDo', 'What we do')}</span>
        <h2>
          {t(
            'whatWeDoStatement',
            'We design the rooms you live in most — kitchens, bedrooms, and the furniture in between.'
          )}
        </h2>
      </section>

      {/* 3. Category Showcase Grid */}
      <section className="home-gallery">
        {categories.map((category, idx) => (
          <Link
            to={category.link}
            key={idx}
            className="home-tile"
            aria-label={`Explore ${category.title}`}
          >
            <img
              src={category.image}
              alt={category.title}
              loading="lazy"
            />
            <div className="home-tile-label">
              <span className="home-eyebrow">{category.eyebrow}</span>
              <h3>{category.title}</h3>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default HomePage;
