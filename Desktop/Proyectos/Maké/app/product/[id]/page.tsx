'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  longDescription: string;
  ingredients: string[];
  allergens: string[];
}

const products: Product[] = [
  { 
    id: 1, 
    name: 'Red Velvet', 
    category: 'pasteles', 
    price: 450, 
    description: 'Delicioso pastel red velvet con frosting de queso crema', 
    image: '/api/placeholder/600/400',
    longDescription: 'Nuestro pastel Red Velvet es una delicia suave y aterciopelada con un hermoso color rojizo natural. Cubierto con un frosting de queso crema perfectamente equilibrado, este pastel combina sutiles sabores de vainilla y cacao con un toque de acidez que lo hace irresistible.',
    ingredients: ['Harina', 'Azúcar', 'Huevos', 'Mantequilla', 'Queso crema', 'Colorante natural', 'Vainilla', 'Cacao'],
    allergens: ['Gluten', 'Huevos', 'Lácteos']
  },
  { 
    id: 2, 
    name: 'Pastel Alemán', 
    category: 'pasteles', 
    price: 420, 
    description: 'Tradicional pastel alemán con chocolate y cerezas', 
    image: '/api/placeholder/600/400',
    longDescription: 'Un clásico pastel alemán que combina el rico sabor del chocolate con la dulzura de las cerezas. Elaborado con receta tradicional y ingredientes de la más alta calidad.',
    ingredients: ['Harina', 'Chocolate', 'Cerezas', 'Azúcar', 'Huevos', 'Mantequilla', 'Crema'],
    allergens: ['Gluten', 'Huevos', 'Lácteos']
  },
  { 
    id: 3, 
    name: 'Brownie Nutella', 
    category: 'brownies', 
    price: 80, 
    description: 'Brownie casero con Nutella', 
    image: '/api/placeholder/600/400',
    longDescription: 'Brownie húmedo y fudgy con abundante Nutella. Perfecto para los amantes del chocolate y las avellanas.',
    ingredients: ['Chocolate', 'Nutella', 'Harina', 'Azúcar', 'Huevos', 'Mantequilla'],
    allergens: ['Gluten', 'Huevos', 'Lácteos', 'Frutos secos']
  },
  { 
    id: 4, 
    name: 'Cupcake Red Velvet', 
    category: 'cupcakes', 
    price: 45, 
    description: 'Cupcake individual de red velvet', 
    image: '/api/placeholder/600/400',
    longDescription: 'Versión individual de nuestro famoso Red Velvet. Perfecto para una porción personal de felicidad.',
    ingredients: ['Harina', 'Azúcar', 'Huevos', 'Mantequilla', 'Queso crema', 'Colorante natural', 'Vainilla'],
    allergens: ['Gluten', 'Huevos', 'Lácteos']
  },
  { 
    id: 5, 
    name: 'Cheesecake Lotus', 
    category: 'cheesecakes', 
    price: 85, 
    description: 'Cheesecake con galletas Lotus', 
    image: '/api/placeholder/600/400',
    longDescription: 'Cremoso cheesecake con base de galletas Lotus y topping de caramelo. Una combinación perfecta de texturas y sabores.',
    ingredients: ['Queso crema', 'Galletas Lotus', 'Azúcar', 'Huevos', 'Caramelo', 'Crema'],
    allergens: ['Gluten', 'Huevos', 'Lácteos']
  },
  { 
    id: 6, 
    name: 'Galleta Chispas', 
    category: 'galletas', 
    price: 25, 
    description: 'Galleta casera con chispas de chocolate', 
    image: '/api/placeholder/600/400',
    longDescription: 'Galleta crujiente por fuera y suave por dentro, con generosas chispas de chocolate. Horneada diariamente.',
    ingredients: ['Harina', 'Azúcar', 'Mantequilla', 'Huevos', 'Chispas de chocolate', 'Vainilla'],
    allergens: ['Gluten', 'Huevos', 'Lácteos']
  }
];

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const productId = parseInt(params.id as string);
  const product = products.find(p => p.id === productId);

  if (!product) {
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
          Producto no encontrado
        </h1>
        
        <p style={{ 
          color: '#666', 
          fontSize: '1.1rem',
          marginBottom: '2rem'
        }}>
          El producto que buscas no existe o ya no está disponible.
        </p>
        
        <button
          onClick={() => router.push('/menu')}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#7f1d1d',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '1.1rem',
            cursor: 'pointer'
          }}
        >
          Ver Menú
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <button
        onClick={() => router.back()}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: 'transparent',
          color: '#7f1d1d',
          border: '1px solid #7f1d1d',
          borderRadius: '20px',
          cursor: 'pointer',
          marginBottom: '2rem'
        }}
      >
        ← Volver
      </button>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '3rem', 
        alignItems: 'start' 
      }}>
        {/* Product Image */}
        <div style={{
          width: '100%',
          height: '500px',
          backgroundImage: `url(${product.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
        }} />

        {/* Product Details */}
        <div style={{ padding: '1rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '1rem', 
            color: '#7f1d1d' 
          }}>
            {product.name}
          </h1>
          
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#7f1d1d',
            marginBottom: '1rem'
          }}>
            ${product.price}
          </div>
          
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#666', 
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            {product.description}
          </p>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.2rem', 
              color: '#333', 
              marginBottom: '0.5rem' 
            }}>
              Descripción
            </h3>
            <p style={{ 
              color: '#666', 
              lineHeight: '1.6' 
            }}>
              {product.longDescription}
            </p>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.2rem', 
              color: '#333', 
              marginBottom: '0.5rem' 
            }}>
              Ingredientes
            </h3>
            <p style={{ 
              color: '#666', 
              lineHeight: '1.6' 
            }}>
              {product.ingredients.join(', ')}
            </p>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.2rem', 
              color: '#333', 
              marginBottom: '0.5rem' 
            }}>
              Alérgenos
            </h3>
            <p style={{ 
              color: '#e74c3c', 
              lineHeight: '1.6',
              fontWeight: '500'
            }}>
              Contiene: {product.allergens.join(', ')}
            </p>
          </div>

          {/* Quantity and Add to Cart */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <span style={{ fontSize: '1.1rem', color: '#333' }}>
              Cantidad:
            </span>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}
              >
                -
              </button>
              
              <span style={{ 
                minWidth: '40px', 
                textAlign: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}>
                {quantity}
              </span>
              
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              width: '100%',
              padding: '1rem 2rem',
              backgroundColor: '#7f1d1d',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              fontSize: '1.2rem',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '1rem',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#5f1515';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#7f1d1d';
            }}
          >
            Agregar al Carrito - ${product.price * quantity}
          </button>

          <button
            onClick={() => router.push('/menu')}
            style={{
              width: '100%',
              padding: '0.75rem 2rem',
              backgroundColor: 'transparent',
              color: '#7f1d1d',
              border: '2px solid #7f1d1d',
              borderRadius: '25px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Seguir Comprando
          </button>
        </div>
      </div>
    </div>
  );
} 