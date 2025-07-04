'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
}

const products: Product[] = [
  { id: 1, name: 'Red Velvet', category: 'pasteles', price: 450, description: 'Delicioso pastel red velvet con frosting de queso crema', image: '/api/placeholder/300/300' },
  { id: 2, name: 'Pastel Alemán', category: 'pasteles', price: 420, description: 'Tradicional pastel alemán con chocolate y cerezas', image: '/api/placeholder/300/300' },
  { id: 3, name: 'Brownie Nutella', category: 'brownies', price: 80, description: 'Brownie casero con Nutella', image: '/api/placeholder/300/300' },
  { id: 4, name: 'Cupcake Red Velvet', category: 'cupcakes', price: 45, description: 'Cupcake individual de red velvet', image: '/api/placeholder/300/300' },
  { id: 5, name: 'Cheesecake Lotus', category: 'cheesecakes', price: 85, description: 'Cheesecake con galletas Lotus', image: '/api/placeholder/300/300' },
  { id: 6, name: 'Galleta Chispas', category: 'galletas', price: 25, description: 'Galleta casera con chispas de chocolate', image: '/api/placeholder/300/300' },
];

const categories = [
  { id: 'all', name: 'Todos los productos' },
  { id: 'pasteles', name: 'Pasteles' },
  { id: 'brownies', name: 'Brownies' },
  { id: 'cupcakes', name: 'Cupcakes' },
  { id: 'cheesecakes', name: 'Cheesecakes' },
  { id: 'galletas', name: 'Galletas' }
];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addItem } = useCart();

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '2rem', 
        color: '#7f1d1d',
        fontSize: '2.5rem'
      }}>
        Nuestro Menú
      </h1>
      
      <p style={{ 
        textAlign: 'center', 
        marginBottom: '3rem', 
        fontSize: '1.1rem',
        color: '#666'
      }}>
        Para endulzar tu alma, de nuestro corazón pastelero
      </p>

      {/* Categories Filter */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '1rem', 
        justifyContent: 'center',
        marginBottom: '3rem'
      }}>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            style={{
              padding: '0.75rem 1.5rem',
              border: '2px solid #7f1d1d',
              backgroundColor: selectedCategory === category.id ? '#7f1d1d' : 'transparent',
              color: selectedCategory === category.id ? 'white' : '#7f1d1d',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        {filteredProducts.map(product => (
          <div
            key={product.id}
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: '15px',
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              width: '100%',
              height: '250px',
              backgroundImage: `url(${product.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
            
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                margin: '0 0 0.5rem 0', 
                color: '#7f1d1d',
                fontSize: '1.25rem'
              }}>
                {product.name}
              </h3>
              
              <p style={{ 
                margin: '0 0 1rem 0', 
                color: '#666',
                fontSize: '0.9rem',
                lineHeight: '1.4'
              }}>
                {product.description}
              </p>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <span style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: '#7f1d1d' 
                }}>
                  ${product.price}
                </span>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#7f1d1d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#5f1515';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#7f1d1d';
                  }}
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          color: '#666'
        }}>
          <p>No hay productos en esta categoría.</p>
        </div>
      )}
    </div>
  );
} 