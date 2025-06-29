'use client';

import React from 'react';

const IntroSection = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Título Principal */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-pazos-navy mb-6 leading-tight">
          Construcción
          <span className="block text-pazos-yellow">Personalizada</span>
          <span className="block text-2xl md:text-3xl lg:text-4xl font-normal mt-2 text-gray-700">
            con 27 años de experiencia
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Calidad, Innovación y Satisfacción Garantizada en cada proyecto
        </p>

        {/* Descripción adicional */}
        <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
          Especialistas en piscinas de concreto, domos geodésicos y chalets de lujo. 
          Transformamos tus espacios con diseños únicos y construcción de primera calidad.
        </p>
      </div>
    </section>
  );
};

export default IntroSection; 