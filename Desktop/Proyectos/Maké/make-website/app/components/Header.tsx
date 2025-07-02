'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiShoppingCart, FiMenu, FiX, FiSearch } from 'react-icons/fi';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0); // Esto se conectará con Zustand después

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-make sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-2xl md:text-3xl font-bold text-make-pink">
              MAKÉ
              <span className="text-sm md:text-base font-normal text-gray-600 ml-2">
                Repostería
              </span>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-make-pink font-medium transition-colors duration-200"
            >
              INICIO
            </Link>
            <Link 
              href="/menu" 
              className="text-gray-700 hover:text-make-pink font-medium transition-colors duration-200"
            >
              MENÚ
            </Link>
            <Link 
              href="/nosotros" 
              className="text-gray-700 hover:text-make-pink font-medium transition-colors duration-200"
            >
              NOSOTROS
            </Link>
            <Link 
              href="/sucursales" 
              className="text-gray-700 hover:text-make-pink font-medium transition-colors duration-200"
            >
              SUCURSALES
            </Link>
            <Link 
              href="/contacto" 
              className="text-gray-700 hover:text-make-pink font-medium transition-colors duration-200"
            >
              CONTACTO
            </Link>
          </nav>

          {/* Búsqueda y Carrito Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-make-pink transition-colors duration-200">
              <FiSearch size={20} />
            </button>
            <Link href="/cart" className="relative">
              <button className="p-2 text-gray-600 hover:text-make-pink transition-colors duration-200">
                <FiShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-make-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </Link>
          </div>

          {/* Botones Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <Link href="/cart" className="relative">
              <button className="p-2 text-gray-600">
                <FiShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-make-pink text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </Link>
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-600"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Menú Mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-make-pink hover:bg-make-cream rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                INICIO
              </Link>
              <Link
                href="/menu"
                className="block px-3 py-2 text-gray-700 hover:text-make-pink hover:bg-make-cream rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                MENÚ
              </Link>
              <Link
                href="/nosotros"
                className="block px-3 py-2 text-gray-700 hover:text-make-pink hover:bg-make-cream rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                NOSOTROS
              </Link>
              <Link
                href="/sucursales"
                className="block px-3 py-2 text-gray-700 hover:text-make-pink hover:bg-make-cream rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                SUCURSALES
              </Link>
              <Link
                href="/contacto"
                className="block px-3 py-2 text-gray-700 hover:text-make-pink hover:bg-make-cream rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                CONTACTO
              </Link>
              <div className="px-3 py-2">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:text-make-pink hover:border-make-pink transition-colors duration-200">
                  <FiSearch size={18} className="mr-2" />
                  Buscar productos...
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 