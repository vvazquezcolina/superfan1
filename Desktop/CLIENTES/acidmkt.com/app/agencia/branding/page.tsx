import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Branding y Diseño Gráfico - ACID MKT | Vemos lo que otros pasan por alto',
  description: 'Identidad visual visionaria y tecnológica. Creamos marcas que ven más allá de lo obvio. Descarga nuestro Brand Guide completo.',
  keywords: 'branding visionario, diseño tecnológico, identidad visual, brand guide acid mkt, diseño de marca innovador',
  openGraph: {
    title: 'Branding y Diseño Gráfico - ACID MKT',
    description: 'Creamos marcas memorables y sistemas de identidad visual completos. Branding profesional para empresas en México.',
  },
}

const brandingServices = [
  {
    title: 'Identidad Corporativa',
    description: 'Desarrollo completo de identidad visual: logotipo, paleta de colores, tipografías y elementos gráficos.',
    icon: '🎨',
    features: ['Logotipo y isologo', 'Paleta de colores', 'Tipografías corporativas', 'Elementos gráficos']
  },
  {
    title: 'Manual de Marca',
    description: 'Guía completa de uso de la marca con normas y aplicaciones para mantener la consistencia.',
    icon: '📖',
    features: ['Brand guidelines', 'Usos correctos', 'Aplicaciones', 'Especificaciones técnicas']
  },
  {
    title: 'Papelería Corporativa',
    description: 'Diseño de materiales impresos y digitales que reflejen la identidad de tu marca.',
    icon: '📄',
    features: ['Tarjetas de presentación', 'Papel membretado', 'Facturas y documentos', 'Sobres y carpetas']
  },
  {
    title: 'Branding Digital',
    description: 'Adaptación de tu marca para medios digitales con optimización para redes sociales y web.',
    icon: '💻',
    features: ['Logos para redes sociales', 'Banners web', 'Signatures digitales', 'Avatares y covers']
  },
  {
    title: 'Rebranding',
    description: 'Renovación y actualización de marcas existentes para adaptarlas a nuevos mercados.',
    icon: '🔄',
    features: ['Análisis de marca actual', 'Propuesta de renovación', 'Migración gradual', 'Comunicación del cambio']
  },
  {
    title: 'Packaging Design',
    description: 'Diseño de empaques y envases que destacan en el punto de venta.',
    icon: '📦',
    features: ['Diseño de empaques', 'Etiquetas y stickers', 'Cajas y contenedores', 'Display y exhibidores']
  }
]

const packages = [
  {
    name: 'Branding Básico',
    price: '$15,000',
    description: 'Ideal para startups y pequeñas empresas',
    features: [
      'Logotipo principal',
      'Versiones en positivo y negativo',
      'Paleta de colores básica',
      'Tipografía principal',
      '3 aplicaciones básicas',
      'Manual de marca básico (PDF)',
      'Archivos vectoriales',
      'Revisiones incluidas: 3'
    ],
    highlighted: false
  },
  {
    name: 'Branding Profesional',
    price: '$28,500',
    description: 'La opción más popular para empresas establecidas',
    features: [
      'Logotipo + isologo + imagotipo',
      'Versiones completas (color, B/N, monocromático)',
      'Paleta de colores extendida',
      'Tipografías primaria y secundaria',
      'Sistema de iconografía',
      '8 aplicaciones profesionales',
      'Manual de marca completo',
      'Papelería corporativa básica',
      'Archivos vectoriales y raster',
      'Revisiones incluidas: 5'
    ],
    highlighted: true
  },
  {
    name: 'Branding Premium',
    price: '$45,000',
    description: 'Solución integral para grandes empresas',
    features: [
      'Sistema de identidad completo',
      'Múltiples versiones y variaciones',
      'Paleta de colores premium',
      'Sistema tipográfico completo',
      'Iconografía personalizada',
      'Elementos gráficos únicos',
      '15+ aplicaciones',
      'Manual de marca premium',
      'Papelería corporativa completa',
      'Plantillas editables',
      'Branding digital optimizado',
      'Asesoría en implementación',
      'Revisiones incluidas: 8'
    ],
    highlighted: false
  }
]

const process = [
  { step: '01', title: 'Brief y Estrategia', desc: 'Definimos la personalidad, valores y objetivos de tu marca' },
  { step: '02', title: 'Investigación', desc: 'Analizamos la competencia y el mercado objetivo' },
  { step: '03', title: 'Conceptualización', desc: 'Desarrollamos conceptos creativos y propuestas iniciales' },
  { step: '04', title: 'Diseño y Desarrollo', desc: 'Creamos la identidad visual completa' },
  { step: '05', title: 'Aplicaciones', desc: 'Diseñamos las aplicaciones en diferentes medios' },
  { step: '06', title: 'Manual de Marca', desc: 'Documentamos todos los elementos y su uso correcto' },
  { step: '07', title: 'Entrega Final', desc: 'Te entregamos todos los archivos y documentación' }
]

const portfolio = [
  {
    title: 'Restaurante Gourmet',
    category: 'Hospitalidad',
    image: '/images/Portfolio/Acid01.jpg',
    description: 'Identidad completa para cadena de restaurantes premium'
  },
  {
    title: 'Tech Startup',
    category: 'Tecnología',
    image: '/images/Portfolio/Acid02.jpg',
    description: 'Branding para empresa de software innovador'
  },
  {
    title: 'Clínica Dental',
    category: 'Salud',
    image: '/images/Portfolio/Acid03.jpg',
    description: 'Renovación de imagen para clínica especializada'
  },
  {
    title: 'Firma de Abogados',
    category: 'Servicios Profesionales',
    image: '/images/Portfolio/Acid04.jpg',
    description: 'Identidad corporativa para despacho jurídico'
  }
]

const testimonials = [
  {
    name: 'María González',
    company: 'Restaurante Luna',
    text: 'ACID MKT transformó completamente nuestra imagen. El nuevo branding nos ayudó a atraer más clientes y posicionarnos como un restaurante premium.',
    rating: 5
  },
  {
    name: 'Carlos Mendoza',
    company: 'TechFlow Solutions',
    text: 'El equipo entendió perfectamente nuestra visión. Crearon una identidad que refleja nuestra innovación y nos diferencia de la competencia.',
    rating: 5
  },
  {
    name: 'Ana Ramírez',
    company: 'Clínica Dental Smile',
    text: 'Profesionales excepcionales. El manual de marca nos permite mantener consistencia en todas nuestras comunicaciones.',
    rating: 5
  }
]

export default function BrandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, Helvetica Neue, sans-serif' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white py-24" style={{ background: 'linear-gradient(135deg, #1D333C 0%, #00B89D 100%)' }}>
        <div className="absolute inset-0" style={{ 
          backgroundImage: `repeating-linear-gradient(90deg, transparent 0%, transparent 48%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 52%, transparent 54%)`,
          backgroundSize: '24px 100%'
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-2 rounded-lg mb-6" style={{ backgroundColor: 'rgba(255, 193, 7, 0.2)', border: '1px solid #FFC107' }}>
                <span className="text-yellow-300 font-medium">Visionaria • Tecnológica • Curiosa</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6" style={{ fontFamily: 'Poppins, Montserrat, sans-serif', lineHeight: '1.1', letterSpacing: '0.02em' }}>
                Vemos lo que otros <span style={{ color: '#FFC107' }}>pasan por alto</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-10 opacity-90" style={{ lineHeight: '1.3' }}>
                Identidad visual que enfoca en los detalles que marcan la diferencia. Diseño que amplía perspectivas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/images/Brand/Brand-guide-Acid.docx" 
                  download
                  className="px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-center font-medium"
                  style={{ 
                    backgroundColor: '#00B89D', 
                    color: 'white',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#008E7F'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00B89D'}
                >
                  📖 Descubre nuestro Brand Guide
                </a>
                <Link 
                  href="https://wa.me/529981374865?text=Hola,%20quiero%20explorar%20sus%20servicios%20de%20branding%20visionario" 
                  className="px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-center border-2"
                  style={{ 
                    borderColor: '#1D333C', 
                    color: '#1D333C',
                    backgroundColor: 'white',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#1D333C'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                    e.currentTarget.style.color = '#1D333C'
                  }}
                >
                  Conecta con nosotros
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative p-8 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <Image
                  src="/images/Brand/Acid-Logo.png"
                  alt="ACID MKT - Branding Visionario"
                  width={500}
                  height={300}
                  className="mx-auto"
                />
                <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-lg" style={{ backgroundColor: '#FFC107', color: '#1D333C' }}>
                  <span className="font-bold" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>24px min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Essence Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif', color: '#1D333C' }}>
              Esencia de Marca
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#1D333C', lineHeight: '1.3' }}>
              Cada elemento visual amplifica nuestra propuesta: ver más allá de lo evidente, 
              enfocar en detalles que otros no perciben.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl shadow-lg bg-white border-t-4" style={{ borderTopColor: '#00B89D' }}>
              <div className="text-5xl mb-6">👁️</div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1D333C' }}>Visionaria</h3>
              <p style={{ color: '#1D333C', lineHeight: '1.3' }}>
                Anticipamos tendencias, exploramos perspectivas no convencionales y vemos oportunidades donde otros ven obstáculos.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl shadow-lg bg-white border-t-4" style={{ borderTopColor: '#00B89D' }}>
              <div className="text-5xl mb-6">⚡</div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1D333C' }}>Tecnológica</h3>
              <p style={{ color: '#1D333C', lineHeight: '1.3' }}>
                Integramos innovación digital con diseño intuitivo. Cada pixel tiene propósito, cada interacción cuenta.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl shadow-lg bg-white border-t-4" style={{ borderTopColor: '#00B89D' }}>
              <div className="text-5xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1D333C' }}>Curiosa</h3>
              <p style={{ color: '#1D333C', lineHeight: '1.3' }}>
                Investigamos, cuestionamos, iteramos. La curiosidad impulsa cada decisión creativa que tomamos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Guide Download Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-8" style={{ fontFamily: 'Poppins, sans-serif', color: '#1D333C' }}>
                Manual de Marca Completo
              </h2>
              <p className="text-xl mb-8" style={{ color: '#1D333C', lineHeight: '1.3' }}>
                Especificaciones técnicas, paleta oficial, tipografías, iconografía y guías de aplicación. 
                Todo lo necesario para mantener la consistencia visual.
              </p>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full mt-2" style={{ backgroundColor: '#00B89D' }}></div>
                  <div>
                    <h4 className="font-bold mb-2" style={{ color: '#1D333C', fontFamily: 'Poppins, sans-serif' }}>Logotipo & Versiones</h4>
                    <p style={{ color: '#1D333C', fontSize: '14px' }}>Versión principal, invertida, zonas de protección, tamaños mínimos</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full mt-2" style={{ backgroundColor: '#00B89D' }}></div>
                  <div>
                    <h4 className="font-bold mb-2" style={{ color: '#1D333C', fontFamily: 'Poppins, sans-serif' }}>Tipografía Sistemática</h4>
                    <p style={{ color: '#1D333C', fontSize: '14px' }}>Poppins Bold, Inter Regular, IBM Plex Mono - especificaciones completas</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full mt-2" style={{ backgroundColor: '#00B89D' }}></div>
                  <div>
                    <h4 className="font-bold mb-2" style={{ color: '#1D333C', fontFamily: 'Poppins, sans-serif' }}>Paleta & Accesibilidad</h4>
                    <p style={{ color: '#1D333C', fontSize: '14px' }}>Vision Teal, Midnight Navy, ratios de contraste AA compliant</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full mt-2" style={{ backgroundColor: '#00B89D' }}></div>
                  <div>
                    <h4 className="font-bold mb-2" style={{ color: '#1D333C', fontFamily: 'Poppins, sans-serif' }}>Do & Don't Guide</h4>
                    <p style={{ color: '#1D333C', fontSize: '14px' }}>Buenas prácticas, errores comunes, aplicaciones correctas</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/images/Brand/Brand-guide-Acid.docx" 
                  download
                  className="px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-center shadow-lg"
                  style={{ 
                    backgroundColor: '#00B89D', 
                    color: 'white',
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#008E7F'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00B89D'}
                >
                  📖 Descargar Brand Guide Completo
                </a>
                <Link 
                  href="https://wa.me/529981374865?text=Quiero%20explorar%20el%20desarrollo%20de%20identidad%20visual%20para%20mi%20marca" 
                  className="px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-center border-2"
                  style={{ 
                    borderColor: '#1D333C', 
                    color: '#1D333C',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#1D333C'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#1D333C'
                  }}
                >
                  Explorar Servicios
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/Brand/Acid-Vertical.png"
                  alt="Brand Guide ACID MKT"
                  width={400}
                  height={500}
                  className="w-full h-auto"
                />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-lg text-sm font-bold" style={{ backgroundColor: '#FFC107', color: '#1D333C', fontFamily: 'IBM Plex Mono, monospace' }}>
                  Vision Teal<br/>#00B89D
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20" style={{ backgroundColor: '#1D333C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Servicios de Identidad Visual
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto" style={{ lineHeight: '1.3' }}>
              Enfocamos cada detalle, amplificamos tu esencia. Diseño que conecta con precisión.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl shadow-lg transition-all duration-300 border-2 border-transparent" 
                 style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                 onMouseOver={(e) => e.currentTarget.style.borderColor = '#00B89D'}
                 onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}>
              <div className="text-4xl mb-6" style={{ color: '#00B89D' }}>🎯</div>
              <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Identidad Corporativa</h3>
              <p className="text-gray-300 mb-6" style={{ lineHeight: '1.3' }}>
                Logotipo, paleta Vision Teal, tipografía sistemática. Cada elemento amplifica tu propuesta única.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-300">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#00B89D' }}></div>
                  Logotipo + isologo optimizado
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#00B89D' }}></div>
                  Paleta de colores accesible
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#00B89D' }}></div>
                  Sistema tipográfico completo
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-xl shadow-lg transition-all duration-300 border-2 border-transparent" 
                 style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                 onMouseOver={(e) => e.currentTarget.style.borderColor = '#00B89D'}
                 onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}>
              <div className="text-4xl mb-6" style={{ color: '#00B89D' }}>📐</div>
              <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Manual de Marca</h3>
              <p className="text-gray-300 mb-6" style={{ lineHeight: '1.3' }}>
                Especificaciones técnicas, guías de uso, patrones visuales. Consistencia que trasciende.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-300">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#00B89D' }}></div>
                  Guías de aplicación detalladas
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#00B89D' }}></div>
                  Do & Don't específicos
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#00B89D' }}></div>
                  Cuadrícula de 8px sistemática
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-xl shadow-lg transition-all duration-300 border-2 border-transparent" 
                 style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                 onMouseOver={(e) => e.currentTarget.style.borderColor = '#00B89D'}
                 onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}>
              <div className="text-4xl mb-6" style={{ color: '#00B89D' }}>💼</div>
              <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Aplicaciones Estratégicas</h3>
              <p className="text-gray-300 mb-6" style={{ lineHeight: '1.3' }}>
                Papelería, digital, merch. Cada touchpoint refuerza tu identidad con precisión.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-300">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#00B89D' }}></div>
                  Tarjetas 30% logo ratio
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#00B89D' }}></div>
                  Mockups redes sociales
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#00B89D' }}></div>
                  Merch monocromático
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8" style={{ fontFamily: 'Poppins, sans-serif', color: '#1D333C' }}>
            ¿Listo para ver más allá?
          </h2>
          <p className="text-xl mb-10" style={{ color: '#1D333C', lineHeight: '1.3' }}>
            Conecta con nosotros. Exploremos juntos cómo amplificar la identidad visual de tu marca 
            con la precisión que marca la diferencia.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="https://wa.me/529981374865?text=Quiero%20explorar%20el%20desarrollo%20de%20identidad%20visual%20que%20vea%20más%20allá%20de%20lo%20obvio"
              className="px-10 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg"
              style={{ 
                backgroundColor: '#00B89D', 
                color: 'white',
                fontFamily: 'Poppins, sans-serif',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#008E7F'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00B89D'}
            >
              📱 Conecta por WhatsApp
            </Link>
            <Link
              href="mailto:hola@acidmkt.com?subject=Consulta%20Identidad%20Visual&body=Hola,%20quiero%20explorar%20el%20desarrollo%20de%20identidad%20visual%20visionaria%20para%20mi%20marca."
              className="px-10 py-4 rounded-lg font-semibold transition-all duration-300 border-2"
              style={{ 
                borderColor: '#1D333C', 
                color: '#1D333C',
                fontFamily: 'Poppins, sans-serif'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1D333C'
                e.currentTarget.style.color = 'white'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#1D333C'
              }}
            >
              ✉️ Escríbenos Email
            </Link>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-center items-center gap-4 text-sm" style={{ color: '#1D333C', fontFamily: 'IBM Plex Mono, monospace' }}>
              <span>Vision Teal: #00B89D</span>
              <span>•</span>
              <span>Midnight Navy: #1D333C</span>
              <span>•</span>
              <span>AA Contrast Compliant</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 