import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#7f1d1d',
      color: 'white',
      padding: '2rem 0',
      marginTop: '4rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem'
      }}>
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>MAKÉ Repostería</h3>
          <p style={{ lineHeight: '1.6', opacity: 0.9 }}>
            Para endulzar tu alma, de nuestro corazón pastelero. Repostería artesanal desde 2016.
          </p>
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Contacto</h4>
          <p style={{ marginBottom: '0.5rem' }}>📍 Guadalajara, Jalisco</p>
          <p style={{ marginBottom: '0.5rem' }}>📱 WhatsApp disponible</p>
          <p style={{ marginBottom: '0.5rem' }}>📧 info@make-reposteria.com</p>
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Productos</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>🍰 Pasteles</li>
            <li style={{ marginBottom: '0.5rem' }}>🧁 Cupcakes</li>
            <li style={{ marginBottom: '0.5rem' }}>🍫 Brownies</li>
            <li style={{ marginBottom: '0.5rem' }}>🍪 Galletas</li>
          </ul>
        </div>
        
        <div>
          <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Síguenos</h4>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ color: 'white', textDecoration: 'none' }}>📘 Facebook</a>
            <a href="#" style={{ color: 'white', textDecoration: 'none' }}>📷 Instagram</a>
          </div>
        </div>
      </div>
      
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        marginTop: '2rem',
        paddingTop: '1rem',
        textAlign: 'center',
        fontSize: '0.9rem',
        opacity: 0.8
      }}>
        <p>&copy; 2024 MAKÉ Repostería. Todos los derechos reservados.</p>
        <p>Desarrollado con 💝 para endulzar tu alma</p>
      </div>
    </footer>
  );
} 