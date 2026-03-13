import React from 'react';
import { X, Minus, Plus, Trash2, Heart } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, cart, removeFromCart, updateQuantity }) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingThreshold = 150;
  const isShippingFree = subtotal >= shippingThreshold;
  const shipping = subtotal > 0 ? (isShippingFree ? 0 : 15) : 0;
  const total = subtotal + shipping;

  return (
    <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
      <div className="cart-overlay" onClick={onClose}></div>
      <div className="cart-content">
        <div className="cart-header">
          <h2 className="punk-text">YOUR CART</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <Heart size={48} color="var(--color-border)" />
            <p>Your shop is empty.</p>
            <button className="btn btn-primary" onClick={onClose}>ROCK ON</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <div className="cart-item-controls">
                      <div className="qty">
                        <button onClick={() => updateQuantity(item.id, -1)}><Minus size={16} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}><Plus size={16} /></button>
                      </div>
                      <span className="price">${item.price * item.quantity}</span>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="shipping-info">
                {isShippingFree ? (
                  <span className="free-shipping">FREE NATIONWIDE SHIPPING APPLIED! 🤘</span>
                ) : (
                  <span>Add <b>${shippingThreshold - subtotal}</b> more for FREE shipping.</span>
                )}
              </div>

              <div className="character-box">
                <div className="speech-bubble">
                  {subtotal > 200 ? "RAD CHOICES! YOU'VE GOT STYLE." : "THANKS FOR SHOPPING WITH US! ROCK ON."}
                </div>
                <div className="character-avatar girl">
                  <img src="/logo.png" alt="Sonja" />
                </div>
              </div>

              <div className="sum">
                <div className="row"><span>SUBTOTAL</span><span>${subtotal}</span></div>
                <div className="row"><span>SHIPPING</span><span>{shipping === 0 ? 'FREE' : `$${shipping}`}</span></div>
                <div className="row total"><span>TOTAL</span><span>${total}</span></div>
              </div>
              <button className="checkout-btn">CHECKOUT (SQUARE)</button>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default CartDrawer;
