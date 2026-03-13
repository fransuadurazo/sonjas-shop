import React from 'react';
import { Instagram, Facebook, Phone, MapPin, Calendar } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h2 className="punk-text">SONJA'S SHOP</h2>
          <p>HIGH-END APPAREL ACCESSORIES SHOES CLOTHS FOR AGES 15+</p>
          <div className="socials">
            <a href="https://www.instagram.com/omglovethat/" target="_blank" rel="noopener noreferrer">
              <Instagram size={20} />
            </a>
            <Facebook size={20} />
          </div>
        </div>

        <div className="footer-contact">
          <h3>LOCATED IN LOS ANGELES</h3>
          <p><MapPin size={16} /> 11026 Ventura Boulevard #100<br />Studio City CA 91604</p>
          <p><Phone size={16} /> 747-203-4753</p>
          <p><Calendar size={16} /> Private appointments available</p>
        </div>

        <div className="footer-links">
          <h3>INFO</h3>
          <a href="#">SHIPPING & RETURNS</a>
          <a href="#">TERMS OF SERVICE</a>
          <a href="#">PRIVACY POLICY</a>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} SONJASSHOP.COM. ALL RIGHTS RESERVED.</p>
        <p>Rock the pre-loved.</p>
      </div>

    </footer>
  );
};

export default Footer;
