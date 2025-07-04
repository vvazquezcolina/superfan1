'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const { items, total } = state;
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cash',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate order processing
    setTimeout(() => {
      clearCart();
      router.push('/success');
    }, 2000);
  };

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
          Checkout
        </h1>
        
        <div style={{ 
          padding: '3rem', 
          backgroundColor: '#f9f9f9', 
          borderRadius: '15px' 
        }}>
          <p style={{ 
            color: '#666', 
            fontSize: '1.1rem',
            marginBottom: '2rem'
          }}>
            No hay productos en tu carrito para procesar.
          </p>
          
          <a 
            href="/menu"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              backgroundColor: '#7f1d1d',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '25px',
              fontSize: '1.1rem'
            }}
          >
            Ver Menú
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '2rem', 
        color: '#7f1d1d',
        textAlign: 'center'
      }}>
        Checkout
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '15px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#333' }}>
            Información de Entrega
          </h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input
                type="text"
                name="name"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <input
              type="tel"
              name="phone"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={handleInputChange}
              required
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            
            <input
              type="text"
              name="address"
              placeholder="Dirección completa"
              value={formData.address}
              onChange={handleInputChange}
              required
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input
                type="text"
                name="city"
                placeholder="Ciudad"
                value={formData.city}
                onChange={handleInputChange}
                required
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Código postal"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <h2 style={{ fontSize: '1.5rem', margin: '2rem 0 1rem 0', color: '#333' }}>
            Método de Pago
          </h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formData.paymentMethod === 'cash'}
                onChange={handleInputChange}
              />
              <span>Pago en efectivo al momento de la entrega</span>
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="transfer"
                checked={formData.paymentMethod === 'transfer'}
                onChange={handleInputChange}
              />
              <span>Transferencia bancaria</span>
            </label>
          </div>

          <h2 style={{ fontSize: '1.5rem', margin: '2rem 0 1rem 0', color: '#333' }}>
            Notas Adicionales
          </h2>
          
          <textarea
            name="notes"
            placeholder="Instrucciones especiales para la entrega..."
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              resize: 'vertical',
              width: '100%'
            }}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '1rem 2rem',
              backgroundColor: isSubmitting ? '#ccc' : '#7f1d1d',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: '500',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              marginTop: '2rem'
            }}
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
          </button>
        </form>

        {/* Order Summary */}
        <div style={{
          backgroundColor: '#f9f9f9',
          borderRadius: '15px',
          padding: '2rem',
          height: 'fit-content'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1.5rem',
            color: '#333'
          }}>
            Resumen del Pedido
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            {items.map(item => (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #e5e5e5'
                }}
              >
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>
                    {item.name}
                  </h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                    {item.quantity} × ${item.price}
                  </p>
                </div>
                <span style={{ fontWeight: 'bold', color: '#7f1d1d' }}>
                  ${item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
          
          <div style={{ 
            borderTop: '2px solid #ddd',
            paddingTop: '1rem'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '0.5rem'
            }}>
              <span>Subtotal:</span>
              <span>${total}</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '0.5rem'
            }}>
              <span>Envío:</span>
              <span>Gratis</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#7f1d1d',
              marginTop: '1rem'
            }}>
              <span>Total:</span>
              <span>${total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 