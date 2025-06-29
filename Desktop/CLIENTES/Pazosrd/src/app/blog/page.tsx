import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import ContactSection from '@/components/ContactSection';

export const metadata: Metadata = {
  title: 'Blog | Pazos Holding',
  description: 'Artículos y guías sobre construcción de piscinas, domos geodésicos y chalets en República Dominicana.',
  keywords: 'blog construcción, piscinas, domos geodésicos, chalets, República Dominicana',
};

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-pazos-navy">
            Blog de Construcción
          </h1>
          <p className="text-xl mb-8 text-gray-600">
            Próximamente: Guías, consejos y tendencias en construcción especializada
          </p>
          <div className="bg-gray-100 p-8 rounded-lg">
            <p className="text-lg text-gray-700">
              Estamos preparando contenido valioso sobre piscinas, domos geodésicos y chalets. 
              Mantente atento para artículos exclusivos y guías especializadas.
            </p>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
};

export default BlogPage; 