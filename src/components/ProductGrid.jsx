import React, { useState, useEffect } from 'react';

/**
 * Tiny image carousel for a single product card.
 * Shows dot indicators + prev/next arrows only when there are multiple images.
 */
const ProductImageCarousel = ({ images, alt }) => {
  const [current, setCurrent] = useState(0);
  const hasMultiple = images.length > 1;

  const prev = (e) => {
    e.stopPropagation();
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  };

  const next = (e) => {
    e.stopPropagation();
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  };

  return (
    <div className="carousel-wrapper">
      {/* All images are stacked; only the active one is visible */}
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${alt} — photo ${i + 1}`}
          className={`carousel-img ${i === current ? 'active' : ''}`}
        />
      ))}

      {hasMultiple && (
        <>
          <button className="carousel-arrow carousel-prev" onClick={prev} aria-label="Previous photo">‹</button>
          <button className="carousel-arrow carousel-next" onClick={next} aria-label="Next photo">›</button>
          <div className="carousel-dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`carousel-dot ${i === current ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ProductGrid = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const CATEGORIES = ['Apparel', 'Shoes', 'Accessories', 'Bits and Bobs', 'Unique Collectibles'];

  useEffect(() => {
    try {
      const productModules = import.meta.glob('../data/products/*.json', { eager: true });
      const loadedProducts = Object.values(productModules).map(module => module.default || module);
      loadedProducts.sort((a, b) => a.id - b.id);
      setProducts(loadedProducts);
      setLoading(false);
    } catch (err) {
      console.error('Error loading products:', err);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}><p className="punk-text">LOADING SHOP...</p></div>;
  }

  return (
    <div className="product-sections">
      {(() => {
        const sections = [];
        CATEGORIES.forEach((category) => {
          const categoryProducts = products.filter(p => p.category === category);
          if (categoryProducts.length === 0) return;

          if (category === 'Apparel') {
            const women = categoryProducts.filter(p => p.sku?.startsWith('WOM-'));
            const men = categoryProducts.filter(p => p.sku?.startsWith('MEN-'));
            const apparelBase = categoryProducts.filter(p => !p.sku?.startsWith('WOM-') && !p.sku?.startsWith('MEN-'));

            if (women.length > 0) sections.push({ title: "Women's Apparel", products: women, id: 'womens-apparel' });
            if (men.length > 0) sections.push({ title: "Men's Apparel", products: men, id: 'mens-apparel' });
            if (apparelBase.length > 0) sections.push({ title: "Apparel", products: apparelBase, id: 'apparel' });
          } else {
            sections.push({ title: category, products: categoryProducts, id: category.toLowerCase().replace(/\s+/g, '-') });
          }
        });

        return sections.map((section) => (
          <section key={section.id} className="products" id={section.id}>
            <div className="container">
              <h2 className="section-title punk-text">{section.title}</h2>
              <div className="grid">
                {section.products.map((product) => {
                  const allImages = product.images && product.images.length > 0
                    ? product.images
                    : [product.image];

                  return (
                    <div key={product.id} className="product-card">
                      <div className="product-image">
                        <ProductImageCarousel images={allImages} alt={product.name} />
                        <button className="add-btn" onClick={() => addToCart(product)}>+ ADD TO CART</button>
                      </div>
                      <div className="product-info">
                        <span className="category">{product.category}</span>
                        <h3 className="name">{product.name}</h3>
                        <div className="price-container">
                          {product.retailPrice && (
                            <span className="retail-price">Original Retail: ${product.retailPrice}</span>
                          )}
                          <span className="price">Sonja's Price: ${product.price}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ));
      })()}
    </div>
  );
};

export default ProductGrid;
