import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import ContactSection from '@/components/ContactSection';
import { MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Remodelaciones y Construcción | Pazos Holding',
  description: 'Servicios de remodelación, paisajismo y construcción complementaria en República Dominicana.',
  keywords: 'remodelaciones RD, paisajismo, construcción, pérgolas, patios',
};

const RemodelacionesPage = () => {
  const handleWhatsAppClick = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/18492528368?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="pt-24 pb-16 bg-gradient-to-r from-pazos-navy to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Remodelaciones y
            <span className="block text-pazos-yellow">Construcción Complementaria</span>
          </h1>
          <p className="text-xl mb-8">
            Completa tu proyecto con nuestros servicios de remodelación, paisajismo y construcciones complementarias.
          </p>
          <button
            onClick={() => handleWhatsAppClick('Hola! Me interesa información sobre servicios de remodelación.')}
            className="cta-button flex items-center space-x-3 px-8 py-4 text-lg font-bold rounded-lg shadow-2xl hover:scale-105 transition-all duration-300 mx-auto"
          >
            <MessageCircle size={24} />
            <span>Consultar Servicios</span>
          </button>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-pazos-navy">Servicios Disponibles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-xl mb-4">Paisajismo</h3>
              <p>Diseño y construcción de jardines y áreas verdes</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-xl mb-4">Pérgolas</h3>
              <p>Estructuras de sombra y decorativas</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-xl mb-4">Patios</h3>
              <p>Remodelación y construcción de áreas exteriores</p>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
};

export default RemodelacionesPage; 