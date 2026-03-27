import React, { useState, useEffect } from 'react';

const ProductGrid = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const CATEGORIES = ['Apparel', 'Shoes', 'Accessories', 'Bits and Bobs', 'Unique Collectibles'];

  useEffect(() => {
    fetch('/data/products.json')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading products:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}><p className="punk-text">LOADING SHOP...</p></div>;
  }

  return (
    <div className="product-sections">
      {CATEGORIES.map((category) => (
        <section key={category} className="products" id={category.toLowerCase().replace(/\s+/g, '-')}>
          <div className="container">
            <h2 className="section-title punk-text">{category}</h2>
            <div className="grid">
              {products.filter(p => p.category === category).map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    <button className="add-btn" onClick={() => addToCart(product)}>+ ADD TO CART</button>
                  </div>
                  <div className="product-info">
                    <span className="category">{product.category}</span>
                    <h3 className="name">{product.name}</h3>
                    <span className="price">${product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default ProductGrid;
