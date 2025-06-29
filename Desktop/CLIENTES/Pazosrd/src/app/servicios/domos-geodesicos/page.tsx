import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import ContactSection from '@/components/ContactSection';
import { MessageCircle, CheckCircle, TreePine, Zap, Home, Users, Building, Leaf } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Domos Geodésicos en RD | Glamping y Residenciales | Pazos Holding',
  description: 'Construcción de domos geodésicos para glamping, eventos y residenciales en República Dominicana. Estructuras eco-friendly, montaje rápido, diseño único.',
  keywords: 'domos geodésicos RD, domo glamping República Dominicana, estructuras geodésicas, construcción ecológica, glamping dominicano',
};

const DomosGeodesicosPage = () => {
  const handleWhatsAppClick = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/18492528368?text=${encodedMessage}`, '_blank');
  };

  const applications = [
    {
      title: "Glamping & Turismo",
      description: "Experiencias únicas para huéspedes exigentes",
      icon: <TreePine className="w-12 h-12" />,
      features: ["Alojamiento premium", "Conexión con naturaleza", "Atracción turística única"]
    },
    {
      title: "Eventos & Bodas",
      description: "Espacios memorables para celebraciones",
      icon: <Users className="w-12 h-12" />,
      features: ["Ambiente mágico", "Capacidad flexible", "Resistente al clima"]
    },
    {
      title: "Residencial",
      description: "Viviendas modernas y sostenibles",
      icon: <Home className="w-12 h-12" />,
      features: ["Eficiencia energética", "Diseño futurista", "Construcción rápida"]
    },
    {
      title: "Comercial",
      description: "Oficinas y espacios comerciales únicos",
      icon: <Building className="w-12 h-12" />,
      features: ["Atrae clientes", "Máximo aprovechamiento", "Bajo mantenimiento"]
    }
  ];

  const benefits = [
    { icon: <Leaf className="w-8 h-8" />, title: "100% Eco-Friendly", desc: "Construcción sostenible con mínimo impacto ambiental" },
    { icon: <Zap className="w-8 h-8" />, title: "Montaje Rápido", desc: "Instalación en 2-4 semanas, listo para usar" },
    { icon: <CheckCircle className="w-8 h-8" />, title: "Resistente a Huracanes", desc: "Estructura aerodinámica soporta vientos extremos" },
    { icon: <TreePine className="w-8 h-8" />, title: "Experiencia Única", desc: "Diseño geométrico que impresiona y destaca" }
  ];

  const sizes = [
    { diameter: "6m", area: "28m²", capacity: "2-4 personas", price: "Desde $15,000" },
    { diameter: "8m", area: "50m²", capacity: "4-6 personas", price: "Desde $25,000" },
    { diameter: "10m", area: "78m²", capacity: "6-8 personas", price: "Desde $35,000" },
    { diameter: "12m", area: "113m²", capacity: "8-12 personas", price: "Desde $45,000" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/Render de Geodésica.webp"
            alt="Domo Geodésico"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-green-700/50"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Domos Geodésicos
            <span className="block text-pazos-yellow">El Futuro de la Construcción</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Estructuras eco-friendly para glamping, eventos y residencias. 
            Diseño único que impresiona y funciona.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleWhatsAppClick('Hola! Me interesa información sobre domos geodésicos. ¿Podrían enviarme detalles?')}
              className="cta-button flex items-center space-x-3 px-8 py-4 text-lg font-bold rounded-lg shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <MessageCircle size={24} />
              <span>Cotizar Mi Domo</span>
            </button>
            
            <div className="flex items-center space-x-2 text-green-200 font-semibold">
              <CheckCircle size={20} />
              <span>Montaje en 2-4 semanas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-pazos-navy">
            Aplicaciones de Nuestros Domos
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {applications.map((app, index) => (
              <div key={index} className="text-center p-6 bg-green-50 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-green-100">
                <div className="text-green-600 mb-4 flex justify-center">{app.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-pazos-navy">{app.title}</h3>
                <p className="text-gray-600 mb-4">{app.description}</p>
                <ul className="text-sm space-y-1">
                  {app.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-green-700">
                      <CheckCircle size={14} className="mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-pazos-navy">
            ¿Por Qué Elegir un Domo Geodésico?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-green-600 mb-4 flex justify-center">{benefit.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-pazos-navy">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sizes & Pricing */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-pazos-navy">
            Tamaños y Precios
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sizes.map((size, index) => (
              <div key={index} className="bg-white border-2 border-green-200 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                <div className="text-2xl font-bold text-green-600 mb-2">{size.diameter}</div>
                <div className="text-gray-600 mb-1">Área: {size.area}</div>
                <div className="text-gray-600 mb-4">Capacidad: {size.capacity}</div>
                <div className="text-xl font-bold text-pazos-navy mb-4">{size.price}</div>
                <button
                  onClick={() => handleWhatsAppClick(`Me interesa el domo de ${size.diameter} (${size.area}). ¿Podrían enviarme más información?`)}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Consultar
                </button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">*Precios incluyen estructura, montaje y acabados básicos</p>
            <button
              onClick={() => handleWhatsAppClick('Me gustaría recibir una cotización personalizada para un domo geodésico.')}
              className="bg-pazos-yellow text-pazos-navy px-8 py-3 font-bold rounded-lg shadow-lg hover:bg-yellow-300 transition-colors"
            >
              Cotización Personalizada
            </button>
          </div>
        </div>
      </section>

      {/* Why RD Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            ¿Por Qué un Domo en República Dominicana?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🌴</div>
              <h3 className="font-bold text-xl mb-2">Turismo Experiencial</h3>
              <p>El glamping con domos es tendencia creciente. Atrae turistas que buscan experiencias únicas.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌪️</div>
              <h3 className="font-bold text-xl mb-2">Resistente a Huracanes</h3>
              <p>Estructura aerodinámica ideal para el clima tropical y temporadas de huracanes.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💚</div>
              <h3 className="font-bold text-xl mb-2">Construcción Sostenible</h3>
              <p>Mínimo impacto ambiental, perfecta para la conciencia ecológica actual.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-pazos-navy">
            Preguntas Frecuentes sobre Domos
          </h2>
          
          <div className="space-y-6">
            <details className="bg-green-50 p-6 rounded-lg">
              <summary className="font-bold text-lg cursor-pointer text-pazos-navy">
                ¿Qué es un domo geodésico y cómo funciona?
              </summary>
              <p className="mt-4 text-gray-700">
                Un domo geodésico es una estructura esférica compuesta por triángulos interconectados. 
                Esta geometría distribuye el peso uniformemente, creando una estructura increíblemente fuerte y eficiente.
              </p>
            </details>
            
            <details className="bg-green-50 p-6 rounded-lg">
              <summary className="font-bold text-lg cursor-pointer text-pazos-navy">
                ¿Cómo transportan e instalan un domo geodésico?
              </summary>
              <p className="mt-4 text-gray-700">
                Los domos se fabrican en piezas modulares que se transportan fácilmente. 
                El montaje se realiza in-situ en 2-4 semanas, sin necesidad de maquinaria pesada.
              </p>
            </details>
            
            <details className="bg-green-50 p-6 rounded-lg">
              <summary className="font-bold text-lg cursor-pointer text-pazos-navy">
                ¿Resisten los huracanes y el clima tropical?
              </summary>
              <p className="mt-4 text-gray-700">
                Sí, la forma aerodinámica del domo distribuye los vientos, haciéndolo muy resistente a huracanes. 
                Además, utilizamos materiales especiales para el clima tropical húmedo.
              </p>
            </details>
            
            <details className="bg-green-50 p-6 rounded-lg">
              <summary className="font-bold text-lg cursor-pointer text-pazos-navy">
                ¿Requiere permisos especiales un domo geodésico?
              </summary>
              <p className="mt-4 text-gray-700">
                Dependiendo del uso y tamaño, puede requerir permisos municipales. 
                Nuestro equipo se encarga de toda la documentación y trámites necesarios.
              </p>
            </details>
          </div>
        </div>
      </section>

      <ContactSection />
      
      {/* Floating WhatsApp Button */}
      <button
        onClick={() => handleWhatsAppClick('Hola! Me interesan los domos geodésicos. ¿Podrían ayudarme con información?')}
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-colors z-50"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
};

export default DomosGeodesicosPage; 