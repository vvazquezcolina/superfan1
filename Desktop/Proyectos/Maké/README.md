# 🍰 MAKÉ Repostería - Progressive Web App

> Para endulzar tu alma, de nuestro corazón pastelero.

**MAKÉ Repostería** es una Progressive Web App (PWA) completa para una repostería artesanal fundada en 2016 por Mariana Sánchez. La aplicación está optimizada para ofrecer una experiencia excepcional tanto en dispositivos móviles como de escritorio.

![MAKÉ Repostería](https://img.shields.io/badge/PWA-Ready-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Performance](https://img.shields.io/badge/Performance-95%2B-success)

---

## 🚀 Características Principales

### ✨ Progressive Web App (PWA)
- **Instalable** en dispositivos móviles y desktop
- **Funciona offline** con Service Worker inteligente
- **Cache automático** de imágenes y recursos críticos
- **Push notifications** ready (próximamente)

### ⚡ Rendimiento Optimizado
- **Carga < 3 segundos** en conexiones 3G
- **99% reducción** en tamaño de imágenes
- **Lazy loading** con Intersection Observer
- **Critical CSS** inlineado

### 📱 Experiencia Móvil
- **Responsive design** perfecto
- **Touch-friendly** interface
- **Aspect ratios** optimizados
- **Instalación nativa** desde el navegador

### 🎨 UI/UX Avanzada
- **Skeleton loading** durante carga
- **Animaciones suaves** y micro-interactions
- **Estados de feedback** visual
- **Navegación intuitiva**

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico
- **Framework**: Next.js 15.3.4
- **Lenguaje**: TypeScript
- **Estilos**: CSS Modules + Tailwind (opcional)
- **PWA**: Service Worker + Web App Manifest
- **Optimización**: ImageMagick, Intersection Observer

### Estructura del Proyecto
```
make/
├── app/                        # Next.js App Router
│   ├── components/            # Componentes reutilizables
│   ├── lib/                   # Utilidades y helpers
│   ├── (pages)/              # Rutas de la aplicación
│   └── globals.css           # Estilos globales
├── public/                    # Assets estáticos
│   ├── images-optimized/     # Imágenes optimizadas (16MB)
│   ├── sw.js                 # Service Worker
│   ├── manifest.json         # PWA Manifest
│   └── icons/                # Íconos PWA
├── docs/                      # Documentación
│   ├── FINAL_OPTIMIZATION_REPORT.md
│   └── OPTIMIZATION_REPORT.md
└── package.json              # Dependencias
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18.0 o superior
- npm 8.0 o superior

### Instalación Local
```bash
# Clonar el repositorio
git clone https://github.com/vvazquezcolina/make.git
cd make

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm start
```

### Variables de Entorno
```env
# .env.local
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

---

## 📖 Páginas y Funcionalidades

### 🏠 Página Principal (`/`)
- Hero section con productos destacados
- Navegación principal
- Call-to-action para menú

### 🍰 Menú (`/menu`)
- Catálogo completo de productos
- Filtros por categoría
- Galería de imágenes optimizadas
- Información de precios

### 🛒 Carrito (`/cart`)
- Gestión de productos seleccionados
- Cálculo automático de totales
- Persistencia en localStorage

### 💳 Checkout (`/checkout`)
- Formulario de información del cliente
- Integración con sistemas de pago
- Confirmación de pedido

### ℹ️ Páginas Informativas
- **Nosotros** (`/nosotros`): Historia de MAKÉ
- **Contacto** (`/contacto`): Información de contacto
- **Sucursales** (`/sucursales`): Ubicaciones

---

## 🎯 Optimizaciones Implementadas

### 🖼️ Sistema de Imágenes
- **98 imágenes optimizadas** (68-356KB cada una)
- **9 categorías** de productos mapeadas
- **Lazy loading** con placeholder
- **Preload** de imágenes críticas

### ⚡ Performance
- **Service Worker** para cache offline
- **Resource hints** (dns-prefetch, preconnect)
- **Critical CSS** inlineado
- **Tree shaking** automático

### 📊 SEO
- **Meta tags** completos
- **Open Graph** optimizado
- **Twitter Cards** implementadas
- **Structured Data** preparado

---

## 📊 Métricas de Rendimiento

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|---------|
| **Tiempo de carga** | >20s | <3s | 85% ⬆️ |
| **Tamaño total** | 1.7GB | 16MB | 99% ⬇️ |
| **Lighthouse Performance** | 45 | 95+ | +50 |
| **PWA Score** | 0 | 100 | +100 |

---

## 🚢 Despliegue

### Vercel (Recomendado)
```bash
# Conectar con Vercel
npm i -g vercel
vercel

# O usar el botón de despliegue
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vvazquezcolina/make)

### Netlify
```bash
# Build command
npm run build

# Publish directory
out
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests de performance
npm run lighthouse

# Tests de PWA
npm run pwa-test
```

---

## 📚 Documentación Técnica

### Reportes Disponibles
- [📋 Reporte Final de Optimización](./FINAL_OPTIMIZATION_REPORT.md)
- [📊 Reporte de Testing](./TESTING_REPORT.md)
- [🔧 Guía de Optimización](./OPTIMIZATION_REPORT.md)

### API Routes
- `/api/products` - Catálogo de productos
- `/api/cart` - Gestión del carrito
- `/api/orders` - Procesamiento de pedidos

---

## 🤝 Contribución

### Flujo de Trabajo
1. Fork el repositorio
2. Crear branch: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de Código
- **ESLint** configurado
- **Prettier** para formateo
- **Conventional Commits**
- **TypeScript** estricto

---

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo local
npm run build        # Compilar para producción
npm run start        # Ejecutar producción
npm run lint         # Linter
npm run type-check   # Verificar tipos TypeScript
npm run analyze      # Analizar bundle
```

---

## 📱 PWA Features

### Instalación
1. **Móvil**: Abrir en navegador → "Agregar a pantalla de inicio"
2. **Desktop**: Ícono de instalación en barra de direcciones
3. **Chrome**: Menú → "Instalar MAKÉ..."

### Funcionalidades Offline
- ✅ **Cache inteligente** de páginas visitadas
- ✅ **Imágenes precargadas** disponibles offline
- ✅ **Formularios** guardados para sincronización
- ✅ **Navegación básica** sin conexión

---

## 🎨 Personalización

### Colores de Marca
```css
:root {
  --primary: #7f1d1d;        /* Rojo MAKÉ */
  --secondary: #fef7cd;      /* Crema */
  --accent: #f59e0b;         /* Dorado */
  --text: #374151;           /* Gris oscuro */
}
```

### Tipografía
- **Primaria**: Merriweather (serif)
- **Secundaria**: Montserrat (sans-serif)

---

## 📞 Soporte

### Contacto
- **Email**: victor@angularsolutions.mx
- **GitHub**: [@vvazquezcolina](https://github.com/vvazquezcolina)
- **LinkedIn**: [Victor Vazquez](https://linkedin.com/in/vvazquezcolina)

### Issues
Para reportar bugs o solicitar features, crear un [issue](https://github.com/vvazquezcolina/make/issues).

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](./LICENSE) para detalles.

---

## 🎉 Agradecimientos

- **Mariana Sánchez** - Fundadora de MAKÉ Repostería
- **Equipo de desarrollo** - Optimizaciones y testing
- **Comunidad Next.js** - Framework y documentación

---

<div align="center">

**🍰 Hecho con amor para endulzar tu alma 🍰**

[🌐 Sitio Web](https://make-reposteria.vercel.app) • [📱 Instalar PWA](https://make-reposteria.vercel.app) • [📧 Contacto](mailto:victor@angularsolutions.mx)

</div>
