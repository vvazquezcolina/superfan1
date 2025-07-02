## Relevant Files

- `package.json` - Configuración del proyecto Next.js con dependencias necesarias
- `tailwind.config.js` - Configuración de Tailwind CSS con colores de marca
- `next.config.js` - Configuración de Next.js para optimización
- `app/layout.tsx` - Layout principal de la aplicación
- `app/page.tsx` - Página de inicio con hero section
- `app/components/Header.tsx` - Componente de navegación principal
- `app/components/Footer.tsx` - Componente de pie de página
- `app/menu/page.tsx` - Página de catálogo de productos
- `app/nosotros/page.tsx` - Página sobre Mariana y la historia de Maké
- `app/sucursales/page.tsx` - Página de ubicaciones
- `app/contacto/page.tsx` - Página de contacto
- `app/product/[id]/page.tsx` - Página individual de producto con personalización
- `app/cart/page.tsx` - Página del carrito de compras
- `app/checkout/page.tsx` - Página de checkout con Stripe
- `lib/stripe.ts` - Configuración de Stripe para pagos
- `lib/products.ts` - Datos y lógica de productos
- `lib/types.ts` - Tipos TypeScript para la aplicación
- `public/images/` - Directorio para imágenes de productos y marca

### Notes

- Usar Next.js 14+ con App Router para mejor SEO
- Tailwind CSS para styling rápido y responsive
- Integración completa con Stripe para pagos
- Diseño mobile-first siguiendo el material del PDF

## Tasks

- [x] 1.0 Configuración inicial del proyecto Next.js
  - [x] 1.1 Crear proyecto Next.js con TypeScript y Tailwind CSS
  - [x] 1.2 Instalar dependencias principales (Stripe, React Icons, etc.)
  - [x] 1.3 Configurar Tailwind con colores de marca de Maké
  - [x] 1.4 Configurar estructura de carpetas y archivos base
  - [x] 1.5 Crear tipos TypeScript para productos y carritos

- [ ] 2.0 Implementación del diseño base y componentes principales
  - [ ] 2.1 Crear componente Header con navegación principal
  - [ ] 2.2 Crear componente Footer con información de contacto
  - [ ] 2.3 Implementar layout principal responsive
  - [ ] 2.4 Crear componentes UI reutilizables (botones, cards, forms)
  - [ ] 2.5 Implementar página de inicio con hero section

- [ ] 3.0 Desarrollo del sistema de productos y catálogo
  - [ ] 3.1 Crear base de datos de productos con categorías
  - [ ] 3.2 Implementar página de menú/catálogo con filtros
  - [ ] 3.3 Crear componente ProductCard para mostrar productos
  - [ ] 3.4 Implementar funcionalidad de búsqueda de productos
  - [ ] 3.5 Crear sección "Best Sellers" en página principal

- [ ] 4.0 Implementación del sistema de personalización de productos
  - [ ] 4.1 Crear página individual de producto con formulario de personalización
  - [ ] 4.2 Implementar selector de tamaños con precios dinámicos
  - [ ] 4.3 Implementar selector de sabores y colores
  - [ ] 4.4 Crear sistema de texto personalizado con validaciones
  - [ ] 4.5 Implementar selector de decoraciones extras

- [ ] 5.0 Desarrollo del sistema e-commerce (carrito y checkout)
  - [ ] 5.1 Implementar context de carrito de compras
  - [ ] 5.2 Crear página de carrito con funciones CRUD
  - [ ] 5.3 Implementar cálculo de precios totales con personalizaciones
  - [ ] 5.4 Crear formulario de información del cliente
  - [ ] 5.5 Implementar página de resumen de pedido

- [ ] 6.0 Integración de pagos con Stripe
  - [ ] 6.1 Configurar Stripe con claves de API
  - [ ] 6.2 Crear API routes para procesamiento de pagos
  - [ ] 6.3 Implementar formulario de pago con Stripe Elements
  - [ ] 6.4 Crear página de confirmación de pedido
  - [ ] 6.5 Implementar manejo de errores de pago

- [ ] 7.0 Optimización, testing y deployment
  - [ ] 7.1 Implementar páginas restantes (Nosotros, Sucursales, Contacto)
  - [ ] 7.2 Optimizar imágenes y performance
  - [ ] 7.3 Implementar SEO y meta tags
  - [ ] 7.4 Hacer testing responsive en diferentes dispositivos
  - [ ] 7.5 Deploy en Vercel con variables de entorno 