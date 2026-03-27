import { CitiesFileSchema, type City, type Locale } from './schemas'
import citiesJson from '@content/cities.json'

// Validate at import time -- if this throws, next build fails (D-05)
const { cities } = CitiesFileSchema.parse(citiesJson)

/** New locales (pt, fr, de, ar) share the Spanish filesystem slugs */
const EXTRA_LOCALES = ['pt', 'fr', 'de', 'ar'] as const
type ExtraLocale = (typeof EXTRA_LOCALES)[number]
type AnyLocale = Locale | ExtraLocale

/** Maps extended locales to the content locale used for text rendering */
export function toContentLocale(lang: string): Locale {
  return lang === 'es' ? 'es' : 'en'
}

export function getCities(): City[] {
  return cities
}

/**
 * Find a city by slug and language.
 * For extended locales (pt, fr, de, ar), slugs match against the es slug.
 */
export function getCity(slug: string, lang: AnyLocale): City | undefined {
  if (lang === 'es' || lang === 'en') {
    return cities.find((city) => city.slugs[lang] === slug)
  }
  // Extended locales use the Spanish slug
  return cities.find((city) => city.slugs.es === slug)
}

export function getCityById(id: string): City | undefined {
  return cities.find((city) => city.id === id)
}

/**
 * Returns cities grouped by country for index page rendering.
 */
export function getCitiesByCountry(): Record<string, City[]> {
  const grouped: Record<string, City[]> = { mexico: [], usa: [], canada: [] }
  for (const city of cities) {
    grouped[city.country].push(city)
  }
  return grouped
}

/**
 * Returns all slug + lang combinations for generateStaticParams.
 * Includes es/en slugs plus es slugs for each extended locale.
 * Output: [{ lang: 'es', slug: 'ciudad-de-mexico' }, { lang: 'en', slug: 'mexico-city' }, ...]
 */
export function getCitySlugs(): Array<{ slug: string; lang: string }> {
  return cities.flatMap((city) => [
    { slug: city.slugs.es, lang: 'es' },
    { slug: city.slugs.en, lang: 'en' },
    ...EXTRA_LOCALES.map((locale) => ({ slug: city.slugs.es, lang: locale })),
  ])
}
