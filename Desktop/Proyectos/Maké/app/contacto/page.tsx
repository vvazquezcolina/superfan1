'use client';

import React, { useState } from 'react';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '2rem', 
        color: '#7f1d1d',
        textAlign: 'center'
      }}>
        Contáctanos
      </h1>
      
      <p style={{ 
        textAlign: 'center', 
        fontSize: '1.1rem',
        color: '#666',
        marginBottom: '3rem'
      }}>
        ¿Tienes alguna pregunta o quieres hacer un pedido especial? ¡Nos encantaría escucharte!
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '3rem' 
      }}>
        {/* Contact Information */}
        <div>
          <h2 style={{ 
            fontSize: '2rem', 
            marginBottom: '1.5rem', 
            color: '#7f1d1d' 
          }}>
            Información de Contacto
          </h2>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#f9f9f9',
              borderRadius: '10px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📍</span>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Ubicación</h3>
                <p style={{ margin: 0, color: '#666' }}>Guadalajara, Jalisco, México</p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#f9f9f9',
              borderRadius: '10px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📱</span>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>WhatsApp</h3>
                <p style={{ margin: 0, color: '#666' }}>Disponible para pedidos y consultas</p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#f9f9f9',
              borderRadius: '10px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📧</span>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Email</h3>
                <p style={{ margin: 0, color: '#666' }}>info@make-reposteria.com</p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#f9f9f9',
              borderRadius: '10px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>⏰</span>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Horarios</h3>
                <p style={{ margin: 0, color: '#666' }}>Lunes a Domingo: 9:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '1rem', 
              color: '#7f1d1d' 
            }}>
              Síguenos en Redes Sociales
            </h3>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a 
                href="#" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#1877f2',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '25px',
                  fontSize: '0.9rem'
                }}
              >
                📘 Facebook
              </a>
              
              <a 
                href="#" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#E4405F',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '25px',
                  fontSize: '0.9rem'
                }}
              >
                📷 Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 style={{ 
            fontSize: '2rem', 
            marginBottom: '1.5rem', 
            color: '#7f1d1d' 
          }}>
            Envíanos un Mensaje
          </h2>
          
          <form onSubmit={handleSubmit} style={{ 
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <input
                type="text"
                name="name"
                placeholder="Tu nombre"
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
                placeholder="Tu email"
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
              
              <input
                type="tel"
                name="phone"
                placeholder="Tu teléfono"
                value={formData.phone}
                onChange={handleInputChange}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              
              <textarea
                name="message"
                placeholder="Tu mensaje..."
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
              
              <button
                type="submit"
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#7f1d1d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                Enviar Mensaje
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 