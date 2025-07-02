# 🚀 Instrucciones de Despliegue - Angular Solutions (Mantenimiento)

## 📋 Resumen Ejecutivo

Esta es una página de mantenimiento completamente autocontenida para Angular Solutions. Incluye:

- ✅ Logo y branding oficial de Angular Solutions
- ✅ Spinner animado y barra de progreso
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Mensajes dinámicos que cambian automáticamente
- ✅ Información de contacto actualizada
- ✅ Meta tags para evitar indexación en buscadores
- ✅ Animaciones suaves y accesibles

## 🎯 Opciones de Despliegue

### 1. GitHub Pages (GRATIS - Recomendado)

1. **Crear repositorio nuevo en GitHub**
   ```bash
   # Ejemplo de nombre: angular-solutions-maintenance
   ```

2. **Subir archivos**
   - Arrastra toda la carpeta `website-en-actualizacion` al repositorio
   - O usa Git:
   ```bash
   git init
   git add .
   git commit -m "feat: add maintenance page"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/angular-solutions-maintenance.git
   git push -u origin main
   ```

3. **Activar GitHub Pages**
   - Ve a Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / (root)
   - Save

4. **URL final**: `https://TU-USUARIO.github.io/angular-solutions-maintenance`

### 2. Netlify (GRATIS - Más rápido)

1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta `website-en-actualizacion` al área de deploy
3. Netlify generará una URL automáticamente
4. **Opcional**: Configura un dominio personalizado

### 3. Vercel (GRATIS - Muy rápido)

1. Ve a [vercel.com](https://vercel.com)
2. Importa desde GitHub o arrastra la carpeta
3. Deploy automático
4. **Opcional**: Configura un dominio personalizado

### 4. Servidor Tradicional (Hosting pagado)

1. Sube todos los archivos vía FTP/SFTP
2. Asegúrate que `index.html` esté en la raíz
3. Funcionará inmediatamente

## 🔧 Pruebas Locales

Antes de subir, puedes probar localmente:

```bash
# Opción 1: Con npx (sin instalar nada)
npx serve .

# Opción 2: Con Live Server (recarga automática)
npx live-server .

# Opción 3: Con HTTP Server en puerto específico
npx http-server . -p 3000
```

Luego abre: `http://localhost:3000` (o el puerto que indique)

## 📱 Configuración de Dominio

### Para dominio principal (ejemplo: angularsolutions.com.mx)

1. **DNS Temporal**: Cambia A Record a la IP del hosting de mantenimiento
2. **Cloudflare**: Usa Page Rules para redirigir
3. **Hosting actual**: Reemplaza el index.html actual

### Para subdominio (ejemplo: maintenance.angularsolutions.com.mx)

1. Crea CNAME record apuntando al hosting de mantenimiento
2. Más seguro para pruebas

## ⚡ Configuración Avanzada

### Personalizar información de contacto

Edita estas líneas en `index.html`:

```html
<!-- Línea ~337 -->
<p>📧 Email: <a href="mailto:TU-EMAIL@angularsolutions.com.mx">TU-EMAIL@angularsolutions.com.mx</a></p>
<p>📱 WhatsApp: <a href="https://wa.me/52TU-NUMERO" target="_blank">+52 TU NUMERO</a></p>
```

### Cambiar fecha estimada

```javascript
// Línea ~345 en index.html
const estimatedDate = new Date(now.getTime() + (X * 24 * 60 * 60 * 1000)); // X días
```

### Modificar colores del brand

```css
/* Líneas ~21-25 en index.html */
:root {
    --angular-blue: #1f3658;
    --angular-yellow: #f8e71c;
    --angular-white: #FFFFFF;
    --angular-gray-light: #f4f5f7;
}
```

## 🔍 SEO y Indexación

La página incluye automáticamente:
- `robots.txt` → Bloquea indexación
- Meta tag `noindex, nofollow`
- Descripción apropiada para mantenimiento

## 📊 Métricas de Rendimiento

- **Tamaño total**: ~80KB
- **Tiempo de carga**: < 1 segundo
- **Compatible**: Todos los navegadores modernos
- **Responsive**: ✅ Móvil, Tablet, Desktop
- **Accesible**: ✅ Cumple estándares WCAG

## 🆘 Soporte

Si tienes problemas:
1. Verifica que todos los archivos estén en la misma carpeta
2. Asegúrate que `index.html` sea el archivo principal
3. Revisa la consola del navegador para errores
4. Contacta al desarrollador que generó esta página

---

**¡Listo para desplegar! 🚀** 