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

## Content Details
- Languages: Spanish (primary), English
- Updated: ${today}
- Coverage: 16 host cities, 16 stadiums, 48 national teams
- Topics: Travel, transport, food, safety, accommodation, cultural context
- Full content: ${SITE_URL}/llms-full.txt
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
