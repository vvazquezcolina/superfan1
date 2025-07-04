import React from 'react';

export default function SucursalesPage() {
  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '2rem', 
        color: '#7f1d1d',
        textAlign: 'center'
      }}>
        Ubicaciones y Entregas
      </h1>
      
      <p style={{ 
        textAlign: 'center', 
        fontSize: '1.1rem',
        color: '#666',
        marginBottom: '3rem'
      }}>
        Llevamos nuestros deliciosos postres directamente a tu puerta en Guadalajara
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        {/* Main Location */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '2px solid #7f1d1d'
        }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1rem', 
            color: '#7f1d1d' 
          }}>
            🏠 Ubicación Principal
          </h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📍</span>
              <span><strong>Guadalajara, Jalisco</strong></span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⏰</span>
              <span>Lunes a Domingo: 9:00 AM - 8:00 PM</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📱</span>
              <span>Pedidos por WhatsApp</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🚚</span>
              <span>Servicio a domicilio disponible</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '2rem',
          borderRadius: '15px'
        }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1rem', 
            color: '#7f1d1d' 
          }}>
            🚚 Información de Entrega
          </h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#333' }}>
                Horarios de Entrega
              </h3>
              <p style={{ color: '#666', margin: 0 }}>
                Lunes a Domingo: 10:00 AM - 7:00 PM
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#333' }}>
                Tiempo de Entrega
              </h3>
              <p style={{ color: '#666', margin: 0 }}>
                2-4 horas (dependiendo de la zona)
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#333' }}>
                Costo de Envío
              </h3>
              <p style={{ color: '#666', margin: 0 }}>
                <strong>¡GRATIS!</strong> En pedidos dentro de Guadalajara
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Zones */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '3rem'
      }}>
        <h2 style={{ 
          fontSize: '2rem', 
          marginBottom: '1.5rem', 
          color: '#7f1d1d',
          textAlign: 'center'
        }}>
          Zonas de Entrega
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem' 
        }}>
          <div style={{ 
            backgroundColor: '#f0f9ff', 
            padding: '1.5rem', 
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: '0.5rem', 
              color: '#0369a1' 
            }}>
              Zona Centro
            </h3>
            <p style={{ color: '#666', margin: 0 }}>
              Centro Histórico, Americana, Lafayette
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#f0fdf4', 
            padding: '1.5rem', 
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: '0.5rem', 
              color: '#059669' 
            }}>
              Zona Sur
            </h3>
            <p style={{ color: '#666', margin: 0 }}>
              Providencia, Del Valle, Chapalita
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#fff7ed', 
            padding: '1.5rem', 
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: '0.5rem', 
              color: '#ea580c' 
            }}>
              Zona Norte
            </h3>
            <p style={{ color: '#666', margin: 0 }}>
              Zapopan, Arcos Vallarta, Plaza del Sol
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#fdf2f8', 
            padding: '1.5rem', 
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: '0.5rem', 
              color: '#be185d' 
            }}>
            Zona Oriente
            </h3>
            <p style={{ color: '#666', margin: 0 }}>
              Tlaquepaque, Tonalá, Las Pintas
            </p>
          </div>
        </div>
      </div>

      {/* How to Order */}
      <div style={{
        backgroundColor: '#7f1d1d',
        color: 'white',
        padding: '3rem 2rem',
        borderRadius: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          fontSize: '2rem', 
          marginBottom: '2rem' 
        }}>
          ¿Cómo Hacer tu Pedido?
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '2rem' 
        }}>
          <div>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem' 
            }}>
              1️⃣
            </div>
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: '0.5rem' 
            }}>
              Selecciona
            </h3>
            <p style={{ opacity: 0.9 }}>
              Elige tus productos favoritos de nuestro menú
            </p>
          </div>
          
          <div>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem' 
            }}>
              2️⃣
            </div>
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: '0.5rem' 
            }}>
              Confirma
            </h3>
            <p style={{ opacity: 0.9 }}>
              Completa tu información de entrega
            </p>
          </div>
          
          <div>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem' 
            }}>
              3️⃣
            </div>
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: '0.5rem' 
            }}>
              Recibe
            </h3>
            <p style={{ opacity: 0.9 }}>
              Disfruta tus postres en la comodidad de tu hogar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 