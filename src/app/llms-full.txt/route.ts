import { getCities } from '@/lib/content/cities'
import { getCityById } from '@/lib/content/cities'
import { getStadiums } from '@/lib/content/stadiums'
import { getTeams } from '@/lib/content/teams'

export const dynamic = 'force-static'

const SITE_URL = 'https://www.superfaninfo.com'

const countryLabels: Record<string, string> = {
  mexico: 'Mexico',
  usa: 'Estados Unidos',
  canada: 'Canada',
}

export function GET() {
  const cities = getCities()
  const stadiums = getStadiums()
  const teams = getTeams()
  const today = new Date().toISOString().split('T')[0]

  const cityBlocks = cities
    .map((city) => {
      const faqLines = city.content.faq
        .map((faq) => `- Q: ${faq.question.es} A: ${faq.answer.es}`)
        .join('\n')

      const sourceLines = city.content.sources
        .map((source) => `- ${source.name}: ${source.url}`)
        .join('\n')

      return `### ${city.name.es}
URL: ${SITE_URL}/es/ciudades/${city.slugs.es}
Stadium: ${city.stadium}
Country: ${countryLabels[city.country] ?? city.country}
Last Updated: ${city.lastUpdated}
Overview: ${city.content.overview.es}
FAQ:
${faqLines}
Sources:
${sourceLines}`
    })
    .join('\n\n')

  const stadiumBlocks = stadiums
    .map((stadium) => {
      const city = getCityById(stadium.city)
      const cityName = city ? city.name.es : stadium.city

      const faqLines = stadium.content.faq
        .map((faq) => `- Q: ${faq.question.es} A: ${faq.answer.es}`)
        .join('\n')

      const sourceLines = stadium.content.sources
        .map((source) => `- ${source.name}: ${source.url}`)
        .join('\n')

      return `### ${stadium.name.es}
URL: ${SITE_URL}/es/estadios/${stadium.slugs.es}
City: ${cityName}
Capacity: ${stadium.capacity.toLocaleString()}
Last Updated: ${stadium.lastUpdated}
Overview: ${stadium.content.overview.es}
FAQ:
${faqLines}
Sources:
${sourceLines}`
    })
    .join('\n\n')

  const teamLines = teams
    .map(
      (team) =>
        `- ${team.name.es} (${team.confederation})${team.group ? ' - Group ' + team.group : ''}`
    )
    .join('\n')

  const content = `# SuperFan Mundial 2026 - Full Content Index

> Complete site content for AI systems. Updated: ${today}

## About
SuperFan Mundial 2026 is the most complete independent Spanish-language guide to the FIFA World Cup 2026, covering 16 host cities across Mexico (3), USA (11), and Canada (2). Content includes detailed travel guides with transport, accommodation, food, safety, weather, and cultural context for Latin American fans.

Site: ${SITE_URL}
Languages: Spanish (primary), English
Coverage: 16 host cities, 16 stadiums, 48 national teams, full match schedule
Disclaimer: Independent guide. Not affiliated with or endorsed by FIFA.

## Host Cities

${cityBlocks}

## Stadiums

${stadiumBlocks}

## Teams
48 national teams participating in FIFA World Cup 2026.

${teamLines}

## Match Schedule (Calendario)
URL: ${SITE_URL}/es/calendario
Full match schedule for all 104 games of the 2026 FIFA World Cup.
- 48 group stage matches across 16 host cities in Mexico, USA, and Canada
- Round of 32, Round of 16, Quarterfinals, Semifinals, Third Place, Final
- Tournament dates: June 11 – July 19, 2026
- Final: MetLife Stadium, East Rutherford, New Jersey, July 19, 2026

## Travel Guides (Guias de Viaje)

### Flights Overview (Vuelos al Mundial 2026)
URL: ${SITE_URL}/es/viajes/vuelos
How to fly to host cities from Latin America, Europe, and within North America.
Key airlines serving the host cities: American, Delta, United, Aeromexico, Copa, Avianca, LATAM, Air Canada, WestJet.

### Flights from Mexico (Vuelos desde Mexico)
URL: ${SITE_URL}/es/viajes/vuelos/desde-mexico
Domestic and international routes from Mexico City, Guadalajara, Monterrey, and other Mexican cities to all 16 host cities.

### Flights from USA (Vuelos desde USA)
URL: ${SITE_URL}/es/viajes/vuelos/desde-usa
Domestic connections and international flights from US cities to host cities.

### Flights from Europe (Vuelos desde Europa)
URL: ${SITE_URL}/es/viajes/vuelos/desde-europa
Transatlantic flights from European hub airports (Madrid, London, Paris, Frankfurt, Lisbon) to host cities.

### Accommodation (Hospedaje)
URL: ${SITE_URL}/es/viajes/hospedaje
Hotels, Airbnb, hostels, and lodging near stadiums. Price ranges, booking tips, and neighborhood recommendations for each host city.

### Transport (Transporte)
URL: ${SITE_URL}/es/viajes/transporte
Getting around host cities: metro, buses, taxis, rideshare (Uber/Lyft), and stadium shuttles. Public transit tips for Mexico City, Los Angeles, New York, Toronto, and all 16 venues.

### Visa & Entry Requirements (Visa y Requisitos de Entrada)
URL: ${SITE_URL}/es/viajes/visa
Visa requirements for Latin American passport holders entering Mexico, United States, and Canada for the World Cup 2026. ESTA for USA, eTA for Canada, exemptions for Mexico.

## Fan Guides (Guias para Aficionados)

### Tickets & Entry (Entradas y Tickets)
URL: ${SITE_URL}/es/fan/entradas
Official FIFA ticket purchase process, price categories (Cat 1-4), stadium seating, secondary market warnings, and anti-fraud advice for the 2026 World Cup.

### Fan Safety (Seguridad para Aficionados)
URL: ${SITE_URL}/es/fan/seguridad
Safety advice for traveling fans: safe neighborhoods, emergency contacts in Mexico/USA/Canada, FIFA fan zones, stadium security procedures, health insurance, and what to do in an emergency.

## Interactive Tools (Herramientas Interactivas)

### Budget Calculator (Calculadora de Presupuesto)
URL: ${SITE_URL}/es/herramientas/presupuesto
Interactive calculator to estimate total World Cup trip cost. Inputs: origin city, number of matches, accommodation type, trip duration. Outputs: estimated budget breakdown for flights, tickets, lodging, food, transport.

### Interactive Map (Mapa Interactivo)
URL: ${SITE_URL}/es/herramientas/mapa
Interactive Leaflet map showing all 16 host cities with stadium locations, fan zones, and points of interest. Filter by country (Mexico, USA, Canada).
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
