# PRD: Sitio Web del Evento Superfan Cancún 2025

## Introducción / Overview
El evento universitario Superfan Cancún 2025 reunirá a universidades de todo México en la Universidad del Caribe para actividades integradoras y una colaboración especial con la 45 Muestra Nacional de Teatro, con el objetivo de difundir la agenda y la oferta cultural del encuentro.

## Goals
- Incrementar el conocimiento del evento y su programación especial con la Muestra Nacional de Teatro.
- Facilitar que universidades invitadas accedan a información logística (fechas, sede, hospedaje, contactos).
- Mostrar el respaldo institucional de la Universidad del Caribe y socios culturales.

## User Stories
- Como representante de una universidad invitada, quiero conocer la agenda y actividades integradoras para planificar mi asistencia.
- Como estudiante interesado, quiero saber cómo participar en actividades culturales y teatrales durante el evento.
- Como proveedor hotelero, quiero identificar cómo sumarme como patrocinador del evento.

## Functional Requirements
1. La página debe estar desarrollada en Next.js con una estructura de landing page de una sola vista.
2. Debe existir una sección hero con título, subtítulo y CTA principal invitando a conocer el evento.
3. Incluir un bloque que describa a la Universidad del Caribe como organizadora y su trayectoria institucional, utilizando branding y logotipos oficiales.[^1]
4. Incluir un bloque que destaque la participación especial de la 45 Muestra Nacional de Teatro, con resumen de su relevancia nacional.[^2]
5. Presentar la agenda general del evento del 17 de noviembre al 12 de diciembre, con actividades integradoras y eventos teatrales.
6. Mostrar información de sede (Universidad del Caribe, Cancún, Quintana Roo) y detalles logísticos básicos (mapa de Google embebido o enlace, recomendaciones de transporte local).
7. Incluir un apartado de hospedaje con los hoteles patrocinadores, imagen de cada hotel, breve descripción, y enlace al sitio o reservaciones.
8. Añadir un módulo «¿Quieres ser hotel patrocinador?» con botón que abre un correo a `2025@superfaninfo.com`.
9. Destacar testimonios o citas breves de ediciones anteriores ficticias para reforzar credibilidad.
10. Incorporar sección de preguntas frecuentes (FAQ) con al menos cinco preguntas y respuestas.
11. Añadir bloque de contacto que liste los correos `2025@superfaninfo.com` y `superfan@unicaribe.mx`.
12. Footer con logos de Universidad del Caribe y 45 Muestra Nacional de Teatro, redes sociales principales, aviso de privacidad y derechos reservados.
13. Garantizar responsividad en escritorio, tablet y móvil.
14. Optimizar imágenes para peso < 150 KB y atributos alt descriptivos.
15. Preparar etiquetas meta (title, description) y Open Graph / Twitter Card básicas para difusión.

## Non-Goals (Out of Scope)
- Registro en línea o venta de boletos.
- Panel de administración para gestionar contenido dinámico.
- Integraciones de pago o CRM.
- Traducción a otros idiomas.

## Design Considerations
- Respetar la paleta y tipografía institucional de la Universidad del Caribe; incluir logos oficiales como elementos prominentes.[^1]
- Incluir elementos visuales que representen la identidad teatral y cultural de la Muestra Nacional de Teatro.[^2]
- Layout modular siguiendo secciones IMPACT, TRUST, EMPATHY, PAIN, AUTHORITY y ACTION para guiar la narrativa.
- Utilizar fotografía oficial de hoteles patrocinadores provista.

## Technical Considerations
- Implementar la página con Next.js 14+ y app router.
- Usar componentes server/client según necesidad para optimizar carga.
- Validar SEO técnico: URL limpias, estructura H1-H3 jerárquica, sitemap y robots básicos.
- Asegurar carga rápida (<3s) mediante imágenes optimizadas y minificación.
- Configurar favicon y manifest para PWA básica (opcional pero recomendado).

## Success Metrics
- 5,000 visitas únicas a la landing durante la campaña de difusión.
- 1,000 clics en el CTA de agenda o descarga de PDF informativo.
- 100 solicitudes recibidas desde el botón de patrocinio hotelero.

## Open Questions
- ¿Habrá material descargable (PDF con agenda detallada, dossier del evento)?
- ¿Se requiere integración con mapa interactivo de ubicación en sitio o basta un enlace externo?
- ¿Se necesitan versiones alternativas del hero para campañas específicas (p.ej. estudiantes vs. universidades)?
- ¿Qué redes sociales oficiales deben enlazarse en el footer?
- ¿Habrá testimonios reales disponibles o se mantendrán ficticios?

[^1]: Información institucional de la Universidad del Caribe. [Fuente](https://www.unicaribe.mx/)
[^2]: Información de la 45 Muestra Nacional de Teatro. [Fuente](https://mnt.inba.gob.mx/)
