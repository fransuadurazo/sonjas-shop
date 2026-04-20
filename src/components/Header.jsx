import React, { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';

const Header = ({ cartCount, onCartOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="header">
      <div className="container header-content">
        <button className="menu-btn" onClick={toggleMenu} aria-label="Toggle Menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <a href="#" className="logo">
          <img src="/logo.png" alt="Sonja's Shop" className="logo-img" />
        </a>

        <nav className="nav-desktop">
          <a href="#apparel">APPAREL</a>
          <a href="#shoes">SHOES</a>
          <a href="#accessories">ACCESSORIES</a>
          <a href="#bits-and-bobs">BITS & BOBS</a>
          <a href="#unique-collectibles">COLLECTIBLES</a>
        </nav>

        <button className="cart-btn" onClick={onCartOpen}>
          <ShoppingCart size={24} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <a href="#apparel" onClick={toggleMenu}>APPAREL</a>
          <a href="#womens-apparel" onClick={toggleMenu}>WOMEN'S APPAREL</a>
          <a href="#mens-apparel" onClick={toggleMenu}>MEN'S APPAREL</a>
          <a href="#shoes" onClick={toggleMenu}>SHOES</a>
          <a href="#accessories" onClick={toggleMenu}>ACCESSORIES</a>
          <a href="#bits-and-bobs" onClick={toggleMenu}>BITS & BOBS</a>
          <a href="#unique-collectibles" onClick={toggleMenu}>COLLECTIBLES</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
