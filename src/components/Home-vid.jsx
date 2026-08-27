import React from "react";
import { Container } from "react-bootstrap";
import "../css/home-video.css";

const VIDEO_URL = "https://ik.imagekit.io/6dghafkgmq/video/IMG_8031%20(1).mp4";

function HomeVideo() {
  return (
    <section className="hero-video-section text-white d-flex align-items-end">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="hero-video"
      >
        <source src={VIDEO_URL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark gradient overlay for text contrast */}
      <div className="hero-video-overlay" />

      {/* Hero content */}
      <Container fluid className="hero-video-container px-4 px-md-5 pb-5">
        <div className="hero-video-content">
          <h1 className="hero-video-title display-5 fw-light text-uppercase mb-3">
            Expertly crafted, carefully selected.
          </h1>
          <p className="hero-video-desc lead fw-light text-white-50 mb-0">
            Hurfa designs kitchens, bedrooms, furniture, and interiors — built to
            last, made to fit your space.
          </p>
        </div>
      </Container>
    </section>
  );
}

export default HomeVideo;

