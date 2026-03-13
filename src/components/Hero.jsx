import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <img src="/logo.png" alt="Sonja's Shop" className="hero-logo" />
        <h1 className="alt-title">ROCK THE <br /> PRE-LOVED</h1>
        <p className="hero-subtext">SPECIALLY CURATED HIGH-END APPAREL, SHOES & ACCESSORIES.</p>
        <div className="hero-cta">
          <a href="#apparel" className="btn btn-primary">SHOP APPAREL</a>
          <a href="#shoes" className="btn btn-secondary">SHOP SHOES</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
