import React from 'react';

const PRODUCTS = [
  { id: 1, name: 'Vintage Leather Biker Jacket', price: 250, category: 'Apparel', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Studded Platform Boots', price: 180, category: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Distressed Denim Vest', price: 95, category: 'Apparel', image: 'https://images.unsplash.com/photo-1576905341935-4282b3d8c8f8?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'Choker with Silver Hardware', price: 45, category: 'Accessories', image: 'https://images.unsplash.com/photo-1535633302701-4966ef71746c?auto=format&fit=crop&w=800&q=80' },
  { id: 5, name: 'Leopard Print Silk Shirt', price: 120, category: 'Apparel', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&w=800&q=80' },
  { id: 6, name: 'Patent Leather Creeper Shoes', price: 160, category: 'Shoes', image: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=800&q=80' },
];

const ProductGrid = ({ addToCart }) => {
  return (
    <section className="products" id="apparel">
      <div className="container">
        <h2 className="section-title punk-text">THE COLLECTION</h2>
        <div className="grid">
          {PRODUCTS.map((product) => (
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
  );
};

export default ProductGrid;
