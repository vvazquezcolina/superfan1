import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import ContactSection from '@/components/ContactSection';

export const metadata: Metadata = {
  title: 'Contacto | Pazos Holding',
  description: 'Contáctanos para cotizar tu proyecto de piscinas, domos geodésicos o chalets en República Dominicana.',
  keywords: 'contacto Pazos Holding, cotización construcción RD, WhatsApp',
};

const ContactoPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-pazos-navy">
            Contáctanos
          </h1>
          <p className="text-xl mb-8 text-gray-600">
            Estamos listos para hacer realidad tu proyecto
          </p>
        </div>
      </section>

      <ContactSection />
    </div>
  );
};

export default ContactoPage; 