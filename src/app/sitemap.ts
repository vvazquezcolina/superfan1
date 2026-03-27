import type { MetadataRoute } from 'next'
import { getCities } from '@/lib/content/cities'
import { getStadiums } from '@/lib/content/stadiums'
import { getTeams } from '@/lib/content/teams'
import {
  getCityComparisons,
  getRoutes,
  getMatchDayGuides,
  getListicles,
} from '@/lib/content/programmatic'
import { locales, hreflangMap, pathTranslations } from '@/lib/i18n'

const SITE_URL = 'https://www.superfaninfo.com'

/**
 * Build the hreflang alternates object for a given section and per-locale slugs.
 * New locales (pt, fr, de, ar) use the es slug since content only has es/en slugs.
 */
function buildSitemapAlternates(
  section: string,
  slugs: Record<string, string>,
): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    const hreflang = hreflangMap[locale]
    const pathSegment = pathTranslations[section]?.[locale] ?? section
    const slug = slugs[locale] ?? slugs.es
    languages[hreflang] = `${SITE_URL}/${locale}/${pathSegment}/${slug}`
  }
  return languages
}

/**
 * Build hreflang alternates for index pages (no slug).
 */
function buildSitemapIndexAlternates(section: string): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    const hreflang = hreflangMap[locale]
    const pathSegment = pathTranslations[section]?.[locale] ?? section
    languages[hreflang] = `${SITE_URL}/${locale}/${pathSegment}`
  }
  return languages
}

export default function sitemap(): MetadataRoute.Sitemap {
  const cities = getCities()
  const stadiums = getStadiums()
  const teams = getTeams()
  const comparisons = getCityComparisons()
  const routes = getRoutes()
  const matchDayGuides = getMatchDayGuides()
  const listicles = getListicles()

  const entries: MetadataRoute.Sitemap = []

  // Homepage -- all 6 locales, highest priority
  const homeAlternates: Record<string, string> = {}
  for (const locale of locales) {
    homeAlternates[hreflangMap[locale]] = `${SITE_URL}/${locale}`
  }

  for (const locale of locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: { languages: homeAlternates },
    })
  }

  // City index pages -- all 6 locales
  const cityIndexAlternates = buildSitemapIndexAlternates('ciudades')
  for (const locale of locales) {
    const pathSegment = pathTranslations.ciudades[locale]
    entries.push({
      url: `${SITE_URL}/${locale}/${pathSegment}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: { languages: cityIndexAlternates },
    })
  }

  // City pages -- all 6 locales
  for (const city of cities) {
    const cityAlternates = buildSitemapAlternates('ciudades', city.slugs)
    for (const locale of locales) {
      const pathSegment = pathTranslations.ciudades[locale]
      const slug = city.slugs[locale as keyof typeof city.slugs] ?? city.slugs.es
      entries.push({
        url: `${SITE_URL}/${locale}/${pathSegment}/${slug}`,
        lastModified: new Date(city.lastUpdated),
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: { languages: cityAlternates },
      })
    }
  }

  // Stadium index pages -- all 6 locales
  const stadiumIndexAlternates = buildSitemapIndexAlternates('estadios')
  for (const locale of locales) {
    const pathSegment = pathTranslations.estadios[locale]
    entries.push({
      url: `${SITE_URL}/${locale}/${pathSegment}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: stadiumIndexAlternates },
    })
  }

  // Stadium pages -- all 6 locales
  for (const stadium of stadiums) {
    const stadiumAlternates = buildSitemapAlternates('estadios', stadium.slugs)
    for (const locale of locales) {
      const pathSegment = pathTranslations.estadios[locale]
      const slug = stadium.slugs[locale as keyof typeof stadium.slugs] ?? stadium.slugs.es
      entries.push({
        url: `${SITE_URL}/${locale}/${pathSegment}/${slug}`,
        lastModified: new Date(stadium.lastUpdated),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: { languages: stadiumAlternates },
      })
    }
  }

  // Team pages -- all 6 locales
  for (const team of teams) {
    const teamAlternates = buildSitemapAlternates('equipos', team.slugs)
    for (const locale of locales) {
      const pathSegment = pathTranslations.equipos[locale]
      const slug = team.slugs[locale as keyof typeof team.slugs] ?? team.slugs.es
      entries.push({
        url: `${SITE_URL}/${locale}/${pathSegment}/${slug}`,
        lastModified: new Date(team.lastUpdated),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: { languages: teamAlternates },
      })
    }
  }

  // City comparison pages -- es and en only (programmatic, no multi-locale slugs)
  for (const comparison of comparisons) {
    const comparisonAlternates: Record<string, string> = {
      'es-419': `${SITE_URL}/es/comparar/${comparison.slugs.es}`,
      en: `${SITE_URL}/en/compare/${comparison.slugs.en}`,
      'x-default': `${SITE_URL}/es/comparar/${comparison.slugs.es}`,
    }
    entries.push({
      url: `${SITE_URL}/es/comparar/${comparison.slugs.es}`,
      lastModified: new Date(comparison.lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.75,
      alternates: { languages: comparisonAlternates },
    })
    entries.push({
      url: `${SITE_URL}/en/compare/${comparison.slugs.en}`,
      lastModified: new Date(comparison.lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.75,
      alternates: { languages: comparisonAlternates },
    })
  }

  // How-to-get (travel route) pages -- es and en only
  for (const route of routes) {
    const routeAlternates: Record<string, string> = {
      'es-419': `${SITE_URL}/es/como-llegar/${route.slugs.es}`,
      en: `${SITE_URL}/en/how-to-get/${route.slugs.en}`,
      'x-default': `${SITE_URL}/es/como-llegar/${route.slugs.es}`,
    }
    entries.push({
      url: `${SITE_URL}/es/como-llegar/${route.slugs.es}`,
      lastModified: new Date(route.lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.75,
      alternates: { languages: routeAlternates },
    })
    entries.push({
      url: `${SITE_URL}/en/how-to-get/${route.slugs.en}`,
      lastModified: new Date(route.lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.75,
      alternates: { languages: routeAlternates },
    })
  }

  // Match day guide pages -- es and en only
  for (const guide of matchDayGuides) {
    const guideAlternates: Record<string, string> = {
      'es-419': `${SITE_URL}/es/dia-de-partido/${guide.slug}`,
      en: `${SITE_URL}/en/match-day/${guide.slug}`,
      'x-default': `${SITE_URL}/es/dia-de-partido/${guide.slug}`,
    }
    entries.push({
      url: `${SITE_URL}/es/dia-de-partido/${guide.slug}`,
      lastModified: new Date(guide.lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.75,
      alternates: { languages: guideAlternates },
    })
    entries.push({
      url: `${SITE_URL}/en/match-day/${guide.slug}`,
      lastModified: new Date(guide.lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.75,
      alternates: { languages: guideAlternates },
    })
  }

  // Best-of listicle pages -- es and en only
  for (const listicle of listicles) {
    const listicleAlternates: Record<string, string> = {
      'es-419': `${SITE_URL}/es/mejores/${listicle.slug}`,
      en: `${SITE_URL}/en/best/${listicle.slug}`,
      'x-default': `${SITE_URL}/es/mejores/${listicle.slug}`,
    }
    entries.push({
      url: `${SITE_URL}/es/mejores/${listicle.slug}`,
      lastModified: new Date(listicle.lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages: listicleAlternates },
    })
    entries.push({
      url: `${SITE_URL}/en/best/${listicle.slug}`,
      lastModified: new Date(listicle.lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages: listicleAlternates },
    })
  }

  return entries
}
