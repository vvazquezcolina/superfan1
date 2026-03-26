import { CitiesFileSchema, type City, type Locale } from './schemas'
import citiesJson from '@content/cities.json'

// Validate at import time -- if this throws, next build fails (D-05)
const { cities } = CitiesFileSchema.parse(citiesJson)

export function getCities(): City[] {
  return cities
}

export function getCity(slug: string, lang: Locale): City | undefined {
  return cities.find((city) => city.slugs[lang] === slug)
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
 * Output: [{ lang: 'es', slug: 'ciudad-de-mexico' }, { lang: 'en', slug: 'mexico-city' }, ...]
 */
export function getCitySlugs(): Array<{ slug: string; lang: Locale }> {
  return cities.flatMap((city) => [
    { slug: city.slugs.es, lang: 'es' as const },
    { slug: city.slugs.en, lang: 'en' as const },
  ])
}
