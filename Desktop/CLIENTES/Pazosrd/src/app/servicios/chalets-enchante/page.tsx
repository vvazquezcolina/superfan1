import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import ContactSection from '@/components/ContactSection';
import { MessageCircle, CheckCircle, Clock, Home, Users, Zap, DollarSign, Leaf } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Chalets Enchante - Cabañas de Lujo Prefabricadas | Pazos Holding',
  description: 'Chalets prefabricados de lujo en República Dominicana. Construcción rápida, diseños elegantes, perfectos para turismo y residencias. Personalizables y sostenibles.',
  keywords: 'cabañas prefabricadas lujo RD, chalets modulares República Dominicana, casas prefabricadas, construcción rápida, turismo rural',
};

const ChaletsEnchantePage = () => {
  const handleWhatsAppClick = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/18492528368?text=${encodedMessage}`, '_blank');
  };

  const models = [
    {
      name: "Enchante Classic",
      area: "45m²",
      bedrooms: "1",
      capacity: "2-4 personas",
      features: ["Cocina equipada", "Baño completo", "Terraza cubierta"],
      price: "Desde $35,000",
      image: "/images/Render Chalet.webp"
    },
    {
      name: "Enchante Family",
      area: "70m²", 
      bedrooms: "2",
      capacity: "4-6 personas",
      features: ["2 habitaciones", "Sala-comedor", "Cocina premium", "2 baños"],
      price: "Desde $55,000",
      image: "/images/promoción de chalets.webp"
    },
    {
      name: "Enchante Suite",
      area: "90m²",
      bedrooms: "3",
      capacity: "6-8 personas",
      features: ["3 habitaciones", "2 baños", "Cocina gourmet", "Terraza amplia"],
      price: "Desde $75,000",
      image: "/images/Render Chalet.webp"
    }
  ];

  const benefits = [
    { icon: <Clock className="w-8 h-8" />, title: "Construcción Rápida", desc: "Listo en 4-6 semanas vs 6 meses tradicional" },
    { icon: <DollarSign className="w-8 h-8" />, title: "30% Más Barato", desc: "Costo menor que construcción tradicional" },
    { icon: <Leaf className="w-8 h-8" />, title: "Eco-Friendly", desc: "Materiales sostenibles, eficiencia energética" },
    { icon: <Home className="w-8 h-8" />, title: "Personalizable", desc: "Diseños adaptados a tus necesidades" }
  ];

  const applications = [
    {
      title: "Turismo Rural",
      description: "Cabañas para rental, glamping y ecoturismo",
      benefits: ["ROI rápido", "Atrae turistas", "Bajo mantenimiento"],
      icon: "🏞️"
    },
    {
      title: "Residencia Familiar",
      description: "Casa de campo, casa de huéspedes o vivienda principal",
      benefits: ["Confort total", "Diseño moderno", "Vida sostenible"],
      icon: "🏡"
    },
    {
      title: "Inversión Inmobiliaria",
      description: "Proyectos de desarrollo turístico y residencial",
      benefits: ["Construcción rápida", "Múltiples unidades", "Rentabilidad"],
      icon: "💼"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/Render Chalet.webp"
            alt="Chalet Enchante"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/70 to-amber-700/50"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Chalets Enchante
            <span className="block text-pazos-yellow">Cabañas de Lujo Prefabricadas</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Diseños elegantes, construcción rápida, perfectos para turismo 
            y residencias. El lujo de una cabaña sin la espera.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleWhatsAppClick('Hola! Me interesan los Chalets Enchante. ¿Podrían enviarme información sobre modelos y precios?')}
              className="cta-button flex items-center space-x-3 px-8 py-4 text-lg font-bold rounded-lg shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <MessageCircle size={24} />
              <span>Ver Modelos</span>
            </button>
            
            <div className="flex items-center space-x-2 text-amber-200 font-semibold">
              <CheckCircle size={20} />
              <span>Listo en 4-6 semanas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-pazos-navy">
            Modelos de Chalets Enchante
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {models.map((model, index) => (
              <div key={index} className="bg-white border border-amber-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={model.image}
                    alt={model.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-pazos-navy">{model.name}</h3>
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>{model.area}</span>
                    <span>{model.bedrooms} hab.</span>
                    <span>{model.capacity}</span>
                  </div>
                  
                  <ul className="text-sm space-y-1 mb-4">
                    {model.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle size={14} className="mr-2 text-green-600 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="text-xl font-bold text-pazos-navy mb-4">{model.price}</div>
                  <button
                    onClick={() => handleWhatsAppClick(`Me interesa el modelo ${model.name} (${model.area}). ¿Podrían enviarme más detalles?`)}
                    className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Más Información
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-pazos-navy">
            Ventajas de los Chalets Prefabricados
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-amber-600 mb-4 flex justify-center">{benefit.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-pazos-navy">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-pazos-navy">
            Usos Ideales para Chalets Enchante
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {applications.map((app, index) => (
              <div key={index} className="text-center p-8 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-lg">
                <div className="text-6xl mb-4">{app.icon}</div>
                <h3 className="font-bold text-xl mb-4 text-pazos-navy">{app.title}</h3>
                <p className="text-gray-700 mb-6">{app.description}</p>
                <ul className="space-y-2">
                  {app.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center justify-center text-amber-700">
                      <CheckCircle size={16} className="mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-pazos-navy">
            Proceso de Construcción
          </h2>
          
          <div className="space-y-6">
            {[
              "Consulta y selección de modelo personalizable",
              "Diseño 3D y planos arquitectónicos",
              "Fabricación en taller con materiales premium",
              "Preparación del terreno y cimentación",
              "Montaje in-situ en 1-2 semanas",
              "Acabados finales y entrega llave en mano"
            ].map((step, index) => (
              <div key={index} className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <p className="text-lg">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-pazos-navy">
            Chalet Prefabricado vs Construcción Tradicional
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 p-8 rounded-lg border-2 border-green-200">
              <h3 className="font-bold text-xl mb-6 text-green-800">Chalets Enchante</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-green-700">
                  <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                  <span>4-6 semanas construcción</span>
                </li>
                <li className="flex items-center text-green-700">
                  <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                  <span>30% menos costo</span>
                </li>
                <li className="flex items-center text-green-700">
                  <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                  <span>Calidad controlada en fábrica</span>
                </li>
                <li className="flex items-center text-green-700">
                  <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                  <span>Materiales eco-friendly</span>
                </li>
                <li className="flex items-center text-green-700">
                  <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                  <span>Garantía estructural incluida</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-red-50 p-8 rounded-lg border-2 border-red-200">
              <h3 className="font-bold text-xl mb-6 text-red-800">Construcción Tradicional</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-red-700">
                  <span className="w-5 h-5 mr-3 flex-shrink-0 text-red-500">✗</span>
                  <span>4-6 meses construcción</span>
                </li>
                <li className="flex items-center text-red-700">
                  <span className="w-5 h-5 mr-3 flex-shrink-0 text-red-500">✗</span>
                  <span>Costo impredecible</span>
                </li>
                <li className="flex items-center text-red-700">
                  <span className="w-5 h-5 mr-3 flex-shrink-0 text-red-500">✗</span>
                  <span>Calidad variable</span>
                </li>
                <li className="flex items-center text-red-700">
                  <span className="w-5 h-5 mr-3 flex-shrink-0 text-red-500">✗</span>
                  <span>Dependiente del clima</span>
                </li>
                <li className="flex items-center text-red-700">
                  <span className="w-5 h-5 mr-3 flex-shrink-0 text-red-500">✗</span>
                  <span>Trámites complejos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para tu Chalet Enchante?
          </h2>
          <p className="text-xl mb-8">
            Personaliza tu chalet ideal y recibe una cotización sin compromiso
          </p>
          <button
            onClick={() => handleWhatsAppClick('Me gustaría personalizar un Chalet Enchante. ¿Podrían ayudarme con el diseño y cotización?')}
            className="bg-white text-amber-700 px-8 py-4 text-lg font-bold rounded-lg shadow-2xl hover:bg-gray-100 transition-colors inline-flex items-center space-x-3"
          >
            <MessageCircle size={24} />
            <span>Personalizar Mi Chalet</span>
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
            <details className="bg-amber-50 p-6 rounded-lg">
              <summary className="font-bold text-lg cursor-pointer text-pazos-navy">
                ¿Qué incluye el precio del chalet?
              </summary>
              <p className="mt-4 text-gray-700">
                El precio incluye fabricación, transporte, montaje, acabados interiores básicos, 
                instalaciones eléctricas y de plomería. Los acabados premium y mobiliario son opcionales.
              </p>
            </details>
            
            <details className="bg-amber-50 p-6 rounded-lg">
              <summary className="font-bold text-lg cursor-pointer text-pazos-navy">
                ¿Puedo personalizar el diseño?
              </summary>
              <p className="mt-4 text-gray-700">
                Absolutamente. Los modelos base se pueden personalizar en distribución, 
                acabados, colores y características especiales según tus necesidades.
              </p>
            </details>
            
            <details className="bg-amber-50 p-6 rounded-lg">
              <summary className="font-bold text-lg cursor-pointer text-pazos-navy">
                ¿Qué garantía tienen los chalets?
              </summary>
              <p className="mt-4 text-gray-700">
                Ofrecemos garantía estructural de 5 años y garantía de 2 años en acabados. 
                Todos nuestros materiales son de primera calidad con certificaciones internacionales.
              </p>
            </details>
          </div>
        </div>
      </section>

      <ContactSection />
      
      {/* Floating WhatsApp Button */}
      <button
        onClick={() => handleWhatsAppClick('Hola! Me interesan los Chalets Enchante. ¿Podrían ayudarme?')}
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-colors z-50"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
};

export default ChaletsEnchantePage; 