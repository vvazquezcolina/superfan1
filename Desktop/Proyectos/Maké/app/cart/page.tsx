'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { items, total } = state;

  if (items.length === 0) {
    return (
      <div style={{ 
        padding: '4rem 1rem', 
        maxWidth: '800px', 
        margin: '0 auto', 
        textAlign: 'center' 
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '1rem', 
          color: '#7f1d1d' 
        }}>
          Tu Carrito
        </h1>
        
        <div style={{ 
          padding: '3rem', 
          backgroundColor: '#f9f9f9', 
          borderRadius: '15px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1rem', 
            color: '#666' 
          }}>
            Tu carrito está vacío
          </h2>
          <p style={{ 
            color: '#888', 
            marginBottom: '2rem',
            fontSize: '1.1rem'
          }}>
            ¡Agrega algunos deliciosos productos de nuestra repostería!
          </p>
          
          <Link 
            href="/menu"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              backgroundColor: '#7f1d1d',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: '500',
              transition: 'background-color 0.3s ease'
            }}
          >
            Ver Menú
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '2rem', 
        color: '#7f1d1d',
        textAlign: 'center'
      }}>
        Tu Carrito
      </h1>

      <div style={{ display: 'grid', gap: '2rem' }}>
        {/* Cart Items */}
        <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '1.5rem' }}>
          {items.map(item => (
            <div 
              key={item.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto auto auto',
                gap: '1rem',
                alignItems: 'center',
                padding: '1rem 0',
                borderBottom: '1px solid #e5e5e5'
              }}
            >
              {/* Product Image */}
              <div style={{
                width: '80px',
                height: '80px',
                backgroundImage: item.image ? `url(${item.image})` : 'url(/api/placeholder/80/80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '10px'
              }} />

              {/* Product Info */}
              <div>
                <h3 style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontSize: '1.1rem',
                  color: '#333'
                }}>
                  {item.name}
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  ${item.price} c/u
                </p>
              </div>

              {/* Quantity Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{
                    width: '30px',
                    height: '30px',
                    border: '1px solid #ddd',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  -
                </button>
                
                <span style={{ 
                  minWidth: '30px', 
                  textAlign: 'center',
                  fontSize: '1rem'
                }}>
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{
                    width: '30px',
                    height: '30px',
                    border: '1px solid #ddd',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <div style={{ 
                fontSize: '1.1rem', 
                fontWeight: 'bold',
                color: '#7f1d1d'
              }}>
                ${item.price * item.quantity}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(item.id)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#ff4757',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{
          backgroundColor: '#f9f9f9',
          borderRadius: '15px',
          padding: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1rem',
            color: '#333'
          }}>
            Resumen del Pedido
          </h2>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '1rem',
            fontSize: '1.1rem'
          }}>
            <span>Subtotal:</span>
            <span>${total}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '1rem',
            fontSize: '1.1rem'
          }}>
            <span>Envío:</span>
            <span>Gratis</span>
          </div>
          
          <div style={{ 
            borderTop: '2px solid #ddd',
            paddingTop: '1rem',
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: '#7f1d1d'
          }}>
            <span>Total:</span>
            <span>${total}</span>
          </div>

          <div style={{ 
            display: 'grid', 
            gap: '1rem', 
            marginTop: '2rem' 
          }}>
            <Link
              href="/checkout"
              style={{
                display: 'block',
                padding: '1rem 2rem',
                backgroundColor: '#7f1d1d',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: '500',
                textAlign: 'center',
                transition: 'background-color 0.3s ease'
              }}
            >
              Proceder al Checkout
            </Link>
            
            <button
              onClick={clearCart}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: 'transparent',
                color: '#666',
                border: '2px solid #ddd',
                borderRadius: '25px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Vaciar Carrito
            </button>
            
            <Link
              href="/menu"
              style={{
                display: 'block',
                padding: '0.75rem 2rem',
                backgroundColor: 'transparent',
                color: '#7f1d1d',
                border: '2px solid #7f1d1d',
                borderRadius: '25px',
                fontSize: '1rem',
                textAlign: 'center',
                textDecoration: 'none'
              }}
            >
              Seguir Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 