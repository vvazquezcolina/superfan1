import type { WithContext, Place, StadiumOrArena, SportsTeam, FAQPage, Article, Organization, ItemList } from 'schema-dts'
import type { City, Stadium, Team, CityFAQ, Locale } from '@/lib/content/schemas'

const SITE_URL = 'https://www.superfaninfo.com'
const ORG_NAME = 'SuperFan Mundial 2026'

const COUNTRY_NAMES: Record<string, Record<Locale, string>> = {
  mexico: { es: 'Mexico', en: 'Mexico' },
  usa: { es: 'Estados Unidos', en: 'United States' },
  canada: { es: 'Canada', en: 'Canada' },
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

export function buildPlaceJsonLd(city: City, lang: Locale): WithContext<Place> {
  const section = lang === 'es' ? 'ciudades' : 'cities'
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: city.name[lang],
    description: truncate(city.content.overview[lang], 300),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: city.coordinates.lat,
      longitude: city.coordinates.lng,
    },
    url: `${SITE_URL}/${lang}/${section}/${city.slugs[lang]}`,
    containedInPlace: {
      '@type': 'Country',
      name: COUNTRY_NAMES[city.country]?.[lang] ?? city.country,
    },
  } as WithContext<Place>
}

export function buildStadiumJsonLd(
  stadium: Stadium,
  cityName: string,
  lang: Locale,
): WithContext<StadiumOrArena> {
  const section = lang === 'es' ? 'estadios' : 'stadiums'
  return {
    '@context': 'https://schema.org',
    '@type': 'StadiumOrArena',
    name: stadium.name[lang],
    description: truncate(stadium.content.overview[lang], 300),
    maximumAttendeeCapacity: stadium.capacity,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: stadium.coordinates.lat,
      longitude: stadium.coordinates.lng,
    },
    url: `${SITE_URL}/${lang}/${section}/${stadium.slugs[lang]}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
    },
    event: {
      '@type': 'SportsEvent',
      name: 'FIFA World Cup 2026',
      startDate: '2026-06-11',
      endDate: '2026-07-19',
    },
  } as WithContext<StadiumOrArena>
}

export function buildSportsTeamJsonLd(
  team: Team,
  lang: Locale,
): WithContext<SportsTeam> {
  const section = lang === 'es' ? 'equipos' : 'teams'
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: team.name[lang],
    description: team.description[lang],
    sport: 'Football (Soccer)',
    url: `${SITE_URL}/${lang}/${section}/${team.slugs[lang]}`,
    memberOf: {
      '@type': 'SportsOrganization',
      name: team.confederation,
    },
  } as WithContext<SportsTeam>
}

export function buildFAQPageJsonLd(
  faqs: CityFAQ[],
  lang: Locale,
): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question' as const,
      name: faq.question[lang],
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: faq.answer[lang],
      },
    })),
  } as WithContext<FAQPage>
}

export function buildArticleJsonLd(params: {
  headline: string
  description: string
  url: string
  dateModified: string
  lang: Locale
}): WithContext<Article> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.headline,
    description: truncate(params.description, 300),
    url: params.url,
    dateModified: params.dateModified,
    inLanguage: params.lang === 'es' ? 'es-419' : 'en',
    publisher: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE_URL,
    },
    author: {
      '@type': 'Organization',
      name: ORG_NAME,
    },
  } as WithContext<Article>
}

export function buildOrganizationJsonLd(
  lang: Locale,
): WithContext<Organization> {
  const description =
    lang === 'es'
      ? 'La guia mas completa en espanol para el Mundial FIFA 2026 en Mexico, Estados Unidos y Canada.'
      : 'The most comprehensive Spanish-language guide to the FIFA World Cup 2026 in Mexico, the United States, and Canada.'
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG_NAME,
    url: SITE_URL,
    description,
    sameAs: [],
  } as WithContext<Organization>
}

export function buildItemListJsonLd(
  items: Array<{ name: string; url: string }>,
  _lang: Locale,
): WithContext<ItemList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  } as WithContext<ItemList>
}

/** Convenience: returns JSON string for use with dangerouslySetInnerHTML */
export function buildJsonLdScript(data: object): string {
  return JSON.stringify(data)
}
