import { StadiumsFileSchema, type Stadium, type Locale } from './schemas'
import stadiumsJson from '@content/stadiums.json'

// Validate at import time -- if this throws, next build fails (D-05)
const { stadiums } = StadiumsFileSchema.parse(stadiumsJson)

export function getStadiums(): Stadium[] {
  return stadiums
}

export function getStadium(slug: string, lang: Locale): Stadium | undefined {
  return stadiums.find((stadium) => stadium.slugs[lang] === slug)
}

export function getStadiumById(id: string): Stadium | undefined {
  return stadiums.find((stadium) => stadium.id === id)
}

/**
 * Returns all slug + lang combinations for generateStaticParams.
 * Output: [{ lang: 'es', slug: 'estadio-azteca' }, { lang: 'en', slug: 'estadio-azteca' }, ...]
 */
export function getStadiumSlugs(): Array<{ slug: string; lang: Locale }> {
  return stadiums.flatMap((stadium) => [
    { slug: stadium.slugs.es, lang: 'es' as const },
    { slug: stadium.slugs.en, lang: 'en' as const },
  ])
}
