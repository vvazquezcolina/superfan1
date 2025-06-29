import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import ContactSection from '@/components/ContactSection';

export const metadata: Metadata = {
  title: 'Quiénes Somos | Pazos Holding',
  description: '27 años de experiencia en construcción. Conoce la historia de Pazos Holding y nuestro equipo en República Dominicana.',
  keywords: 'Pazos Holding, constructora República Dominicana, experiencia construcción',
};

const NosotrosPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-pazos-navy text-center">
            Quiénes Somos
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="bg-pazos-navy text-white p-8 rounded-lg mb-8">
              <h2 className="text-3xl font-bold mb-4 text-pazos-yellow">27 Años de Experiencia</h2>
              <p className="text-xl">
                Con una trayectoria de 27 años en el sector de la construcción, Pazos Holding 
                llega a República Dominicana para ofrecer servicios especializados de alta calidad.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-2xl font-bold text-pazos-navy mb-4">Experiencia</h3>
                <p>Más de dos décadas perfeccionando técnicas de construcción especializada</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-2xl font-bold text-pazos-navy mb-4">Innovación</h3>
                <p>Traemos las últimas tecnologías y tendencias a República Dominicana</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-2xl font-bold text-pazos-navy mb-4">Calidad</h3>
                <p>Cada proyecto es único y cumple con los más altos estándares</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-4 text-pazos-navy">Nuestra Llegada a RD</h2>
            <p className="text-lg mb-6">
              Reconocemos el potencial del mercado dominicano y el crecimiento del sector turístico 
              y residencial de lujo. Nuestro objetivo es brindar opciones de construcción innovadoras 
              que complementen el estilo de vida tropical y las necesidades específicas del país.
            </p>
            
            <h2 className="text-3xl font-bold mb-4 text-pazos-navy">Nuestra Filosofía</h2>
            <p className="text-lg">
              Creemos en la construcción responsable, sostenible y personalizada. Cada cliente tiene 
              necesidades únicas, y nuestro compromiso es materializar sus visiones con la más alta 
              calidad y respeto por el medio ambiente.
            </p>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
};

export default NosotrosPage; 