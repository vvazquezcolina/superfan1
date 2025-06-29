import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import ContactSection from '@/components/ContactSection';
import { MessageCircle, CheckCircle, Clock, Shield, Droplets, Users, Award, Wrench } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Construcción de Piscinas de Concreto en RD | Pazos Holding',
  description: 'Especialistas en construcción de piscinas de concreto y jacuzzis en República Dominicana. 27 años de experiencia, garantía incluida, financiamiento disponible desde $200 USD/mes.',
  keywords: 'construcción piscinas RD, piscinas de concreto República Dominicana, jacuzzis, piscinas Santo Domingo, piscinas Punta Cana',
};

const PiscinasPage = () => {
  const handleWhatsAppClick = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/18492528368?text=${encodedMessage}`, '_blank');
  };

  const projects = [
    {
      title: "Piscina Infinity - Punta Cana Resort",
      description: "Piscina infinity de 15m con acabado en piedra coralina",
      image: "/images/render de piscina.webp"
    },
    {
      title: "Jacuzzi Residencial - Santo Domingo", 
      description: "Jacuzzi integrado con sistema de hidroterapia",
      image: "/images/Render Jacuzzi.webp"
    }
  ];

  const benefits = [
    { icon: <Droplets className="w-8 h-8" />, title: "Diseños Personalizados", desc: "Cada piscina adaptada a tu espacio y estilo" },
    { icon: <Shield className="w-8 h-8" />, title: "Garantía 5 Años", desc: "Garantía estructural completa por escrito" },
    { icon: <Clock className="w-8 h-8" />, title: "6-8 Semanas", desc: "Construcción puntual respetando plazos" },
    { icon: <Wrench className="w-8 h-8" />, title: "Mantenimiento", desc: "Servicio post-venta y mantenimiento disponible" }
  ];

  const process = [
    "Consulta gratuita y diseño 3D personalizado",
    "Permisos y trámites municipales incluidos",
    "Excavación y preparación del terreno",
    "Estructura de acero y concreto premium",
    "Sistema de filtración de última tecnología",
    "Acabados de lujo y entrega llave en mano"
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/render de piscina.webp"
            alt="Piscina de lujo"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Tu Piscina de Ensueño
            <span className="block text-pazos-yellow">En República Dominicana</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Especialistas en piscinas de concreto con 27 años de experiencia. 
            Diseños personalizados, garantía incluida.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleWhatsAppClick('Hola! Quiero cotizar una piscina de concreto para mi propiedad.')}
              className="cta-button flex items-center space-x-3 px-8 py-4 text-lg font-bold rounded-lg shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <MessageCircle size={24} />
              <span>Cotizar Mi Piscina Ahora</span>
            </button>
            
            <div className="flex items-center space-x-2 text-pazos-yellow font-semibold">
              <CheckCircle size={20} />
              <span>Desde $200 USD/mes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 bg-pazos-navy text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-pazos-yellow mb-2">27+</div>
              <div className="text-sm">Años de Experiencia</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pazos-yellow mb-2">300+</div>
              <div className="text-sm">Piscinas Construidas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pazos-yellow mb-2">5</div>
              <div className="text-sm">Años de Garantía</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pazos-yellow mb-2">100%</div>
              <div className="text-sm">Satisfacción</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-pazos-navy">
            ¿Por Qué Elegir Nuestras Piscinas?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-pazos-yellow mb-4 flex justify-center">{benefit.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-pazos-navy">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-pazos-navy">
            Nuestro Proceso de Construcción
          </h2>
          
          <div className="space-y-6">
            {process.map((step, index) => (
              <div key={index} className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow">
                <div className="flex-shrink-0 w-8 h-8 bg-pazos-yellow text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <p className="text-lg">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Gallery */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-pazos-navy">
            Proyectos Destacados
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-64">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-pazos-navy">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <button
                    onClick={() => handleWhatsAppClick(`Me interesa un proyecto similar a: ${project.title}`)}
                    className="text-pazos-yellow font-semibold hover:underline"
                  >
                    Solicitar proyecto similar →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financing CTA */}
      <section className="py-16 bg-gradient-to-r from-pazos-yellow to-yellow-400">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Image
            src="/images/Tu piscina desde 200 USD mensuales.webp"
            alt="Financiamiento desde $200 USD mensuales"
            width={600}
            height={400}
            className="mx-auto mb-8 rounded-lg shadow-lg"
          />
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-pazos-navy">
            Tu Piscina Desde $200 USD Mensuales
          </h2>
          <p className="text-xl mb-8 text-pazos-navy">
            Financiamiento directo sin intermediarios. Haz realidad tu piscina hoy.
          </p>
          <button
            onClick={() => handleWhatsAppClick('Me interesa el financiamiento para piscinas. ¿Podrían enviarme más información sobre los planes de pago?')}
            className="bg-pazos-navy text-white px-8 py-4 text-lg font-bold rounded-lg shadow-2xl hover:bg-blue-800 transition-colors inline-flex items-center space-x-3"
          >
            <MessageCircle size={24} />
            <span>Consultar Financiamiento</span>
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-pazos-navy">
            Preguntas Frecuentes
          </h2>
          
          <div className="space-y-6">
            <details className="bg-gray-50 p-6 rounded-lg">
              <summary className="font-bold text-lg cursor-pointer text-pazos-navy">
                ¿Cuánto tiempo tarda la construcción de una piscina?
              </summary>
              <p className="mt-4 text-gray-700">
                Una piscina estándar toma entre 6-8 semanas desde el inicio hasta la entrega. 
                Los tiempos pueden variar según el diseño, tamaño y condiciones del terreno.
              </p>
            </details>
            
            <details className="bg-gray-50 p-6 rounded-lg">
              <summary className="font-bold text-lg cursor-pointer text-pazos-navy">
                ¿Incluyen los permisos municipales?
              </summary>
              <p className="mt-4 text-gray-700">
                Sí, gestionamos todos los permisos necesarios ante las autoridades municipales. 
                Nuestro equipo se encarga de toda la documentación requerida.
              </p>
            </details>
            
            <details className="bg-gray-50 p-6 rounded-lg">
              <summary className="font-bold text-lg cursor-pointer text-pazos-navy">
                ¿Qué incluye la garantía de 5 años?
              </summary>
              <p className="mt-4 text-gray-700">
                La garantía cubre defectos estructurales, filtraciones, y funcionamiento del sistema de filtración. 
                Cualquier problema relacionado con la construcción está cubierto sin costo adicional.
              </p>
            </details>
          </div>
        </div>
      </section>

      <ContactSection />
      
      {/* Floating WhatsApp Button */}
      <button
        onClick={() => handleWhatsAppClick('Hola! Estoy interesado en construir una piscina. ¿Podrían ayudarme?')}
        className="fixed bottom-6 right-6 bg-pazos-whatsapp text-white p-4 rounded-full shadow-2xl hover:bg-pazos-whatsapp-dark transition-colors z-50"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
};

export default PiscinasPage; 