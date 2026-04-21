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
  const [quickViewProduct, setQuickViewProduct] = useState(null);
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

            const subGroups = [];
            if (women.length > 0) subGroups.push({ title: "Women's", products: women });
            if (men.length > 0) subGroups.push({ title: "Men's", products: men });
            if (apparelBase.length > 0) subGroups.push({ title: "Other", products: apparelBase });

            if (subGroups.length > 0) {
              sections.push({ title: 'Apparel', subGroups, id: 'apparel' });
            }
          } else {
            sections.push({ title: category, products: categoryProducts, id: category.toLowerCase().replace(/\s+/g, '-') });
          }
        });

        const renderProducts = (products) => (
          <div className="grid">
            {products.map((product) => {
              const allImages = product.images && product.images.length > 0
                ? product.images
                : [product.image];

              return (
                <div key={product.id} className="product-card" onClick={() => setQuickViewProduct(product)} style={{ cursor: 'pointer' }}>
                  <div className="product-image">
                    <ProductImageCarousel images={allImages} alt={product.name} />
                    <button className="add-btn" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>+ ADD TO CART</button>
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
        );

        return sections.map((section) => (
          <section key={section.id} className="products" id={section.id}>
            <div className="container">
              <h2 className="section-title punk-text">{section.title}</h2>
              {section.subGroups ? (
                <div className="subgroups-container">
                  {section.subGroups.map((group, index) => (
                    <div key={group.title} className="subcategory-group" style={{ marginBottom: '3rem' }}>
                      {index > 0 && <hr style={{ border: 'none', borderTop: '2px solid red', margin: '2rem 0 2rem 0' }} />}
                      <h3 className="subcategory-title punk-text" style={{ color: 'red', textTransform: 'uppercase', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                        {group.title}
                      </h3>
                      {renderProducts(group.products)}
                    </div>
                  ))}
                </div>
              ) : (
                renderProducts(section.products)
              )}
            </div>
          </section>
        ));
      })()}

      {quickViewProduct && (
        <div className="quick-view-overlay open" onClick={() => setQuickViewProduct(null)}>
          <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
            <button className="qv-close" onClick={() => setQuickViewProduct(null)}>×</button>
            <button className="qv-arrow qv-prev" onClick={(e) => {
              e.stopPropagation();
              const currentIndex = products.findIndex(p => p.id === quickViewProduct.id);
              const prevIndex = (currentIndex - 1 + products.length) % products.length;
              setQuickViewProduct(products[prevIndex]);
            }}>‹</button>
            <button className="qv-arrow qv-next" onClick={(e) => {
              e.stopPropagation();
              const currentIndex = products.findIndex(p => p.id === quickViewProduct.id);
              const nextIndex = (currentIndex + 1) % products.length;
              setQuickViewProduct(products[nextIndex]);
            }}>›</button>
            
            <div className="qv-image">
              <ProductImageCarousel images={quickViewProduct.images && quickViewProduct.images.length > 0 ? quickViewProduct.images : [quickViewProduct.image]} alt={quickViewProduct.name} />
            </div>
            
            <div className="qv-details">
              <div className="qv-category">{quickViewProduct.category}</div>
              <h2 className="qv-title punk-text">{quickViewProduct.name}</h2>
              <div className="qv-price-container">
                <div className="qv-price">${quickViewProduct.price}</div>
                {quickViewProduct.retailPrice && (
                  <div className="qv-retail">Original: ${quickViewProduct.retailPrice}</div>
                )}
              </div>
              
              <div className="qv-meta">
                {quickViewProduct.size && (
                  <div className="qv-meta-item">
                    <span className="qv-meta-label">Size:</span>
                    <span>{quickViewProduct.size}</span>
                  </div>
                )}
              </div>
              
              {quickViewProduct.description && (
                <div className="qv-description">
                  {quickViewProduct.description}
                </div>
              )}
              
              <button className="qv-add-btn" onClick={(e) => { 
                e.stopPropagation(); 
                addToCart(quickViewProduct); 
                setQuickViewProduct(null); 
              }}>
                + Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
