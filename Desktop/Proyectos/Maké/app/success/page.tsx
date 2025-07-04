import React from 'react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div style={{ 
      padding: '4rem 1rem', 
      maxWidth: '800px', 
      margin: '0 auto', 
      textAlign: 'center' 
    }}>
      <div style={{
        backgroundColor: '#f0f9ff',
        borderRadius: '20px',
        padding: '3rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem'
        }}>
          ✅
        </div>
        
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1rem', 
          color: '#065f46' 
        }}>
          ¡Pedido Confirmado!
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#047857',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Gracias por tu compra. Tu pedido ha sido recibido y está siendo procesado.
        </p>
        
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '15px',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1rem', 
            color: '#333' 
          }}>
            ¿Qué sigue?
          </h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📧</span>
              <span>Recibirás un email de confirmación con los detalles de tu pedido</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📱</span>
              <span>Nos pondremos en contacto contigo para confirmar la entrega</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🚚</span>
              <span>Prepararemos tu pedido con mucho cariño</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🍰</span>
              <span>¡Disfruta tus deliciosos postres!</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
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
            fontWeight: '500'
          }}
        >
          Seguir Comprando
        </Link>
        
        <Link 
          href="/"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            backgroundColor: 'transparent',
            color: '#7f1d1d',
            textDecoration: 'none',
            border: '2px solid #7f1d1d',
            borderRadius: '25px',
            fontSize: '1.1rem'
          }}
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
} 