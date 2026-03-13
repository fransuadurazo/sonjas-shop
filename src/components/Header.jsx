import React from 'react';
import { ShoppingCart, Menu } from 'lucide-react';

const Header = ({ cartCount, onCartOpen }) => {
  return (
    <header className="header">
      <div className="container header-content">
        <button className="menu-btn"><Menu size={24} /></button>

        <a href="#" className="logo">
          <img src="/logo.png" alt="Sonja's Shop" className="logo-img" />
        </a>

        <nav className="nav-desktop">
          <a href="#apparel">APPAREL</a>
          <a href="#shoes">SHOES</a>
          <a href="#accessories">ACCESSORIES</a>
        </nav>

        <button className="cart-btn" onClick={onCartOpen}>
          <ShoppingCart size={24} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
};

export default Header;
