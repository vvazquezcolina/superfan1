import React from 'react';

export default function NosotrosPage() {
  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '2rem', 
        color: '#7f1d1d',
        textAlign: 'center'
      }}>
        Sobre Nosotros
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '3rem', 
        alignItems: 'center',
        marginBottom: '3rem'
      }}>
        <div>
          <h2 style={{ 
            fontSize: '2rem', 
            marginBottom: '1rem', 
            color: '#7f1d1d' 
          }}>
            MAKÉ Repostería
          </h2>
          
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#666', 
            lineHeight: '1.6',
            marginBottom: '1.5rem'
          }}>
            Fundada en 2016 por <strong>Mariana Sánchez</strong>, MAKÉ Repostería nació del amor por la repostería artesanal y el deseo de endulzar la vida de las personas con productos hechos con el corazón.
          </p>
          
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#666', 
            lineHeight: '1.6',
            marginBottom: '1.5rem'
          }}>
            Nuestro lema <em>"Para endulzar tu alma, de nuestro corazón pastelero"</em> refleja nuestra filosofía: cada producto es elaborado con ingredientes de la más alta calidad y con el cariño que solo una repostería familiar puede ofrecer.
          </p>
        </div>
        
        <div style={{
          width: '100%',
          height: '400px',
          backgroundImage: 'url(/api/placeholder/500/400)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
        }} />
      </div>

      <div style={{ 
        backgroundColor: '#f9f9f9', 
        padding: '3rem 2rem', 
        borderRadius: '20px',
        marginBottom: '3rem'
      }}>
        <h2 style={{ 
          fontSize: '2rem', 
          marginBottom: '2rem', 
          color: '#7f1d1d',
          textAlign: 'center'
        }}>
          Nuestra Historia
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              color: '#7f1d1d'
            }}>
              2016
            </div>
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              Los Inicios
            </h3>
            <p style={{ 
              color: '#666', 
              lineHeight: '1.6' 
            }}>
              Mariana comenzó desde su cocina, horneando para familia y amigos, descubriendo su pasión por crear momentos dulces.
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              color: '#7f1d1d'
            }}>
              2018
            </div>
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              Crecimiento
            </h3>
            <p style={{ 
              color: '#666', 
              lineHeight: '1.6' 
            }}>
              La demanda creció y MAKÉ se estableció como una repostería reconocida en Guadalajara por su calidad y sabor únicos.
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              color: '#7f1d1d'
            }}>
              2024
            </div>
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              Hoy
            </h3>
            <p style={{ 
              color: '#666', 
              lineHeight: '1.6' 
            }}>
              Continuamos innovando y creando nuevos sabores, manteniendo siempre la calidad artesanal que nos caracteriza.
            </p>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        <div>
          <h2 style={{ 
            fontSize: '2rem', 
            marginBottom: '1.5rem', 
            color: '#7f1d1d' 
          }}>
            Nuestra Misión
          </h2>
          
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#666', 
            lineHeight: '1.6',
            marginBottom: '1rem'
          }}>
            Crear momentos especiales a través de productos de repostería artesanal que despierten sonrisas y endulcen los días de nuestros clientes.
          </p>
          
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#666', 
            lineHeight: '1.6'
          }}>
            Nos comprometemos a usar solo los mejores ingredientes, mantener la tradición artesanal y brindar un servicio excepcional en cada pedido.
          </p>
        </div>
        
        <div>
          <h2 style={{ 
            fontSize: '2rem', 
            marginBottom: '1.5rem', 
            color: '#7f1d1d' 
          }}>
            Nuestros Valores
          </h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>❤️</span>
              <span><strong>Pasión:</strong> Amor por la repostería en cada creación</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🎯</span>
              <span><strong>Calidad:</strong> Ingredientes premium y técnicas artesanales</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🤝</span>
              <span><strong>Confianza:</strong> Compromiso con nuestros clientes</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>✨</span>
              <span><strong>Innovación:</strong> Siempre buscando nuevos sabores</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 