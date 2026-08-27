import React from 'react';
import { Link } from 'react-router-dom';
import HomeVideo from '../components/Home-vid';
import '../css/homepage.css';

const CATEGORIES = [
  {
    title: 'Kitchen Design',
    eyebrow: 'Kitchens',
    image: 'https://ik.imagekit.io/6dghafkgmq/Kitchens/Kit3V4.jpg?updatedAt=1779196664060',
    link: '/kitchens',
  },
  {
    title: 'Furniture Design',
    eyebrow: 'Furniture',
    image: 'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Wesal-Collection_n299cVlM5.jpg?updatedAt=1787138960280',
    link: '/products',
  },
  {
    title: 'Bedrooms',
    eyebrow: 'Bedrooms',
    image: 'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Tayf_4iPZv6iGf.png?updatedAt=1782466205843',
    link: '/bedrooms',
  },
  {
    title: 'Interior Design',
    eyebrow: 'Interiors',
    image: 'https://ik.imagekit.io/6dghafkgmq/hurfa_catalog/Oud-Collection_u9dsnBlwn.jpg?updatedAt=1787138978278',
    link: '/about',
  },
];

function HomePage() {
  return (
    <div className="homepage">
      {/* 1. Hero Background Video Component */}
      <HomeVideo />

      {/* 2. Statement / Philosophy Section */}
      <section className="home-statement">
        <span className="home-eyebrow">What we do</span>
        <h2>
          We design the rooms you live in most — kitchens, bedrooms, and the furniture in between.
        </h2>
      </section>

      {/* 3. Category Showcase Grid */}
      <section className="home-gallery">
        {CATEGORIES.map((category) => (
          <Link
            to={category.link}
            key={category.title}
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
