import { StadiumsFileSchema, type Stadium, type Locale } from './schemas'
import { getCityById } from './cities'
import stadiumsJson from '@content/stadiums.json'

// Validate at import time -- if this throws, next build fails (D-05)
const { stadiums } = StadiumsFileSchema.parse(stadiumsJson)

/** New locales (pt, fr, de, ar) share the Spanish filesystem slugs */
const EXTRA_LOCALES = ['pt', 'fr', 'de', 'ar'] as const
type ExtraLocale = (typeof EXTRA_LOCALES)[number]
type AnyLocale = Locale | ExtraLocale

export function getStadiums(): Stadium[] {
  return stadiums
}

/**
 * Find a stadium by slug and language.
 * For extended locales (pt, fr, de, ar), slugs match against the es slug.
 */
export function getStadium(slug: string, lang: AnyLocale): Stadium | undefined {
  if (lang === 'es' || lang === 'en') {
    return stadiums.find((stadium) => stadium.slugs[lang] === slug)
  }
  // Extended locales use the Spanish slug
  return stadiums.find((stadium) => stadium.slugs.es === slug)
}

export function getStadiumById(id: string): Stadium | undefined {
  return stadiums.find((stadium) => stadium.id === id)
}

/**
 * Returns stadiums grouped by country for index page rendering.
 * Looks up each stadium's city to determine the country.
 */
export function getStadiumsByCountry(): Record<string, Stadium[]> {
  const grouped: Record<string, Stadium[]> = { mexico: [], usa: [], canada: [] }
  for (const stadium of stadiums) {
    const city = getCityById(stadium.city)
    if (city) {
      grouped[city.country].push(stadium)
    }
  }
  return grouped
}

/**
 * Returns all slug + lang combinations for generateStaticParams.
 * Includes es/en slugs plus es slugs for each extended locale.
 * Output: [{ lang: 'es', slug: 'estadio-azteca' }, { lang: 'en', slug: 'estadio-azteca' }, ...]
 */
export function getStadiumSlugs(): Array<{ slug: string; lang: string }> {
  return stadiums.flatMap((stadium) => [
    { slug: stadium.slugs.es, lang: 'es' },
    { slug: stadium.slugs.en, lang: 'en' },
    ...EXTRA_LOCALES.map((locale) => ({ slug: stadium.slugs.es, lang: locale })),
  ])
}
