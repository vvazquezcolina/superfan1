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

## Host Cities

${cityBlocks}

## Stadiums

${stadiumBlocks}

## Teams
48 national teams participating in FIFA World Cup 2026.

${teamLines}
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
