import { getCities } from '@/lib/content/cities'
import { getStadiums } from '@/lib/content/stadiums'

export const dynamic = 'force-static'

const SITE_URL = 'https://www.superfaninfo.com'

export function GET() {
  const cities = getCities()
  const stadiums = getStadiums()
  const today = new Date().toISOString().split('T')[0]

  const cityLines = cities
    .map(
      (city) =>
        `- [${city.name.es}](${SITE_URL}/es/ciudades/${city.slugs.es}): ${city.description.es}`
    )
    .join('\n')

  const stadiumLines = stadiums
    .map(
      (stadium) =>
        `- [${stadium.name.es}](${SITE_URL}/es/estadios/${stadium.slugs.es}): ${stadium.description.es}`
    )
    .join('\n')

  const content = `# SuperFan Mundial 2026

> La guia independiente mas completa en espanol para el Mundial de Futbol 2026. / The most complete independent Spanish-language guide to the 2026 FIFA World Cup.

SuperFan covers all 16 host cities, 16 stadiums, and 48 teams across Mexico, USA, and Canada with deep editorial content including transport, food, neighborhoods, safety, and cultural context for Latin American fans.

## Key Pages

### Host City Guides (Guias de Ciudades Sede)
${cityLines}

### Stadium Guides (Guias de Estadios)
${stadiumLines}

### Teams (Equipos)
- 48 participating teams with group assignments and history
- [Full team list](${SITE_URL}/es/equipos)

### Match Schedule (Calendario)
- [Calendario de Partidos](${SITE_URL}/es/calendario): Calendario completo del Mundial 2026 con todos los partidos de fase de grupos, octavos, cuartos, semifinales y final. Filtra por grupo, ciudad o fecha.

### Travel Guides (Guias de Viaje)
- [Guias de Viaje](${SITE_URL}/es/viajes): Hub de guias de viaje para el Mundial 2026
- [Vuelos al Mundial 2026](${SITE_URL}/es/viajes/vuelos): Como llegar a las ciudades sede desde Latinoamerica, Europa y dentro de Norteamerica
- [Vuelos desde Mexico](${SITE_URL}/es/viajes/vuelos/desde-mexico): Rutas aereas desde las principales ciudades de Mexico
- [Vuelos desde USA](${SITE_URL}/es/viajes/vuelos/desde-usa): Conexiones domesticas e internacionales desde Estados Unidos
- [Vuelos desde Europa](${SITE_URL}/es/viajes/vuelos/desde-europa): Vuelos transatlanticos desde Europa hacia las ciudades sede
- [Hospedaje](${SITE_URL}/es/viajes/hospedaje): Guia de hoteles, Airbnb y alojamiento cerca de los estadios
- [Transporte](${SITE_URL}/es/viajes/transporte): Metro, autobuses, taxis y movilidad en las ciudades sede
- [Visa y Requisitos de Entrada](${SITE_URL}/es/viajes/visa): Requisitos de visa para ciudadanos latinoamericanos en Mexico, USA y Canada

### Fan Guides (Guias para Aficionados)
- [Entradas y Tickets](${SITE_URL}/es/fan/entradas): Como comprar entradas oficiales, precios, categorias y evitar fraudes
- [Seguridad para Aficionados](${SITE_URL}/es/fan/seguridad): Consejos de seguridad, zonas seguras y contactos de emergencia en cada pais sede

### Interactive Tools (Herramientas)
- [Calculadora de Presupuesto](${SITE_URL}/es/herramientas/presupuesto): Calcula el costo total de tu viaje al Mundial 2026: vuelos, hospedaje, entradas, comida y transporte
- [Mapa Interactivo](${SITE_URL}/es/herramientas/mapa): Mapa de las 16 ciudades sede con estadios, zonas de fans y puntos de interes

## Content Details
- Languages: Spanish (primary), English
- Updated: ${today}
- Coverage: 16 host cities, 16 stadiums, 48 national teams, full match schedule
- Topics: Travel, transport, food, safety, accommodation, tickets, cultural context, interactive tools
- Full content: ${SITE_URL}/llms-full.txt
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
