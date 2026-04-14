import { getCities } from '@/lib/content/cities'
import { getStadiums } from '@/lib/content/stadiums'
import { getCityComparisons, getListicles } from '@/lib/content/programmatic'

export const dynamic = 'force-static'

const SITE_URL = 'https://www.superfaninfo.com'

export function GET() {
  const cities = getCities()
  const stadiums = getStadiums()
  const comparisons = getCityComparisons()
  const listicles = getListicles()
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

### Live Flight Prices (Precios de Vuelos en Vivo)
Every host city page surfaces real cached round-trip flight prices from Mexico City (MEX), Miami (MIA), Madrid (MAD), and Bogota (BOG) for the World Cup window (May-August 2026). Sourced from the Travelpayouts/Aviasales public price cache, refreshed every 24 hours via ISR.
- Each city page includes a "Datos rapidos" Quick Facts block with the cheapest cached fare from MEX, the host stadium, and the main airport IATA — formatted for direct citation.
- The /viajes/vuelos/desde-* sub-pages list every host city sorted by cheapest fare for that specific origin.
- Aviasales reward rate is published at 40% of agency commission with a 30-day cookie.

### Bookable Travel Services (Servicios Reservables)
The site partners with reviewed providers via the Travelpayouts affiliate network. All links carry FTC disclosure and pay no extra cost to the user.
- Hotels: Booking.com partner search with World Cup dates pre-filled, embedded on every host city page, the hospedaje guide, comparison pages, match-day pages, and individual match pages.
- Flights: Aviasales / Kiwi.com / Trip.com — real cached prices on every city page and dedicated by-origin sub-pages (desde-mexico, desde-usa, desde-europa). 16 host cities × 4 origins.
- Airport transfers: Welcome Pickups and Kiwitaxi side-by-side CTAs on stadium pages, dia-de-partido pages, como-llegar route pages, and the transporte guide. Deep-linked from the city's main airport to the venue.
- Tours and activities: GetYourGuide search cards on every city page (city tours, top attractions, food experiences) plus standalone CTAs on stadium and match pages for venue tours via Tiqets and Klook.
- Travel insurance: EKTA (25% reward, 30-day cookie) on the visa guide, hospedaje page, dia-de-partido pages, fan/entradas page, every group page, and listicle pages. Required for many entry visas to the host countries.
- Flight delay compensation: AirHelp claim CTA on the flights guide, the desde-europa sub-page, and the fan/entradas page. Covered by EU regulation 261/2004 — applies to flights to/from the EU and EU-operator flights worldwide.

Affiliate disclosure: SuperFan is an independent guide, not affiliated with FIFA. We earn small commissions on partner bookings to fund the site, at no cost to readers.

### Match Pages (Paginas de Partidos)
Individual detail pages for each of the 48 group stage matches with venue info, city guide links, and travel context.
- [Partido m001](${SITE_URL}/es/partidos/m001): Partido del Grupo A en Los Angeles (SoFi Stadium), 11 jun 2026
- [Partido m007](${SITE_URL}/es/partidos/m007): Primer partido del Grupo B
- [Partido m048](${SITE_URL}/es/partidos/m048): Ultimo partido de la fase de grupos
- Full match index: ${SITE_URL}/es/calendario

### Group Pages (Paginas de Grupos)
Individual pages for each of the 8 groups with team listings, match schedule, and venue details.
- [Grupo A](${SITE_URL}/es/grupos/A): Equipos, partidos y ciudades sede del Grupo A
- [Grupo B](${SITE_URL}/es/grupos/B): Equipos, partidos y ciudades sede del Grupo B
- [Grupo C](${SITE_URL}/es/grupos/C) through [Grupo H](${SITE_URL}/es/grupos/H): All 8 groups covered

### City vs City Comparisons (Comparativas)
${comparisons.length} city-vs-city comparison pages helping fans decide which host city to visit.
- Example: [Los Angeles vs Dallas](${SITE_URL}/es/comparar/los-angeles-vs-dallas)
- Covers costs, transport, weather, safety, stadium capacity, and nightlife side by side

### Rankings & Listicles (Rankings)
${listicles.length} curated ranking pages covering stadiums and cities by category.
- Example: [Estadios por Capacidad](${SITE_URL}/es/rankings/estadios-por-capacidad): Los 16 estadios del Mundial ordenados de mayor a menor
- Example: [Ciudades mas Baratas](${SITE_URL}/es/rankings/ciudades-mas-baratas): Ranking de ciudades sede por costo de vida para el fan
- Covers capacity, budget, food, history, family friendliness, weather, transport, and more

## Content Details
- Languages: Spanish (primary), English
- Updated: ${today}
- Coverage: 16 host cities, 16 stadiums, 48 national teams, 48 group stage matches, 8 groups, full match schedule
- Topics: Travel, transport, food, safety, accommodation, tickets, cultural context, interactive tools, city comparisons, rankings
- Programmatic pages: ${comparisons.length} city comparisons, ${listicles.length} ranking listicles
- Full content: ${SITE_URL}/llms-full.txt
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
