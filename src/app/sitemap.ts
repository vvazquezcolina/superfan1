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

/**
 * Build hreflang alternates for static pages that use the same path for all locales
 * (programmatic pages where the filesystem path is the Spanish name).
 */
function buildProgrammaticAlternates(
  fsPath: string,
  slug: string,
): Record<string, string> {
  return {
    'es-419': `${SITE_URL}/es/${fsPath}/${slug}`,
    en: `${SITE_URL}/en/${fsPath}/${slug}`,
    'x-default': `${SITE_URL}/es/${fsPath}/${slug}`,
  }
}

/**
 * Build hreflang alternates for static index pages using the same filesystem path for all locales.
 */
function buildStaticIndexAlternates(
  esPath: string,
  enPath: string,
): Record<string, string> {
  return {
    'es-419': `${SITE_URL}/es/${esPath}`,
    en: `${SITE_URL}/en/${enPath}`,
    'x-default': `${SITE_URL}/es/${esPath}`,
  }
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

  // Team index pages -- all 6 locales
  const teamIndexAlternates = buildSitemapIndexAlternates('equipos')
  for (const locale of locales) {
    const pathSegment = pathTranslations.equipos[locale]
    entries.push({
      url: `${SITE_URL}/${locale}/${pathSegment}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: teamIndexAlternates },
    })
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

  // Travel subpages (viajes/*) -- es and en only
  const travelSubpages = [
    { path: 'viajes/vuelos', priority: 0.7 },
    { path: 'viajes/vuelos/desde-mexico', priority: 0.6 },
    { path: 'viajes/vuelos/desde-usa', priority: 0.6 },
    { path: 'viajes/vuelos/desde-europa', priority: 0.6 },
    { path: 'viajes/hospedaje', priority: 0.7 },
    { path: 'viajes/transporte', priority: 0.7 },
    { path: 'viajes/visa', priority: 0.7 },
  ]
  for (const { path, priority } of travelSubpages) {
    const alts = buildStaticIndexAlternates(path, path)
    entries.push({
      url: `${SITE_URL}/es/${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority,
      alternates: { languages: alts },
    })
    entries.push({
      url: `${SITE_URL}/en/${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority,
      alternates: { languages: alts },
    })
  }

  // Fan guide pages (fan/*) -- es and en only
  const fanSubpages = [
    { path: 'fan/entradas', priority: 0.7 },
    { path: 'fan/seguridad', priority: 0.7 },
  ]
  for (const { path, priority } of fanSubpages) {
    const alts = buildStaticIndexAlternates(path, path)
    entries.push({
      url: `${SITE_URL}/es/${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority,
      alternates: { languages: alts },
    })
    entries.push({
      url: `${SITE_URL}/en/${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority,
      alternates: { languages: alts },
    })
  }

  // Tools index and subpages (herramientas/*) -- es and en only
  const toolsPages = [
    { path: 'herramientas', priority: 0.7 },
    { path: 'herramientas/presupuesto', priority: 0.6 },
    { path: 'herramientas/mapa', priority: 0.6 },
    { path: 'herramientas/itinerario', priority: 0.6 },
    { path: 'herramientas/conversor-moneda', priority: 0.6 },
    { path: 'herramientas/lista-equipaje', priority: 0.6 },
  ]
  for (const { path, priority } of toolsPages) {
    const alts = buildStaticIndexAlternates(path, path)
    entries.push({
      url: `${SITE_URL}/es/${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority,
      alternates: { languages: alts },
    })
    entries.push({
      url: `${SITE_URL}/en/${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority,
      alternates: { languages: alts },
    })
  }

  // Calendar page (calendario) -- es and en only
  const calendarAlts = buildStaticIndexAlternates('calendario', 'calendario')
  entries.push({
    url: `${SITE_URL}/es/calendario`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: { languages: calendarAlts },
  })
  entries.push({
    url: `${SITE_URL}/en/calendario`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: { languages: calendarAlts },
  })

  // Legal/about pages -- all 6 locales
  const legalSections = ['acerca', 'privacidad', 'divulgacion']
  for (const section of legalSections) {
    const legalAlternates = buildSitemapIndexAlternates(section)
    for (const locale of locales) {
      const pathSegment = pathTranslations[section]?.[locale] ?? section
      entries.push({
        url: `${SITE_URL}/${locale}/${pathSegment}`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
        alternates: { languages: legalAlternates },
      })
    }
  }

  // City comparison pages -- use ACTUAL filesystem paths (Spanish names for all locales)
  for (const comparison of comparisons) {
    const comparisonAlternates = buildProgrammaticAlternates('comparar', comparison.slugs.es)
    entries.push({
      url: `${SITE_URL}/es/comparar/${comparison.slugs.es}`,
      lastModified: new Date(comparison.lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.75,
      alternates: { languages: comparisonAlternates },
    })
    entries.push({
      url: `${SITE_URL}/en/comparar/${comparison.slugs.es}`,
      lastModified: new Date(comparison.lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.75,
      alternates: { languages: comparisonAlternates },
    })
  }

  // How-to-get (travel route) pages -- use ACTUAL filesystem paths (Spanish names)
  for (const route of routes) {
    const routeAlternates = buildProgrammaticAlternates('como-llegar', route.slugs.es)
    entries.push({
      url: `${SITE_URL}/es/como-llegar/${route.slugs.es}`,
      lastModified: new Date(route.lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.75,
      alternates: { languages: routeAlternates },
    })
    entries.push({
      url: `${SITE_URL}/en/como-llegar/${route.slugs.es}`,
      lastModified: new Date(route.lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.75,
      alternates: { languages: routeAlternates },
    })
  }

  // Match day guide pages -- use ACTUAL filesystem paths (Spanish names)
  for (const guide of matchDayGuides) {
    const guideAlternates = buildProgrammaticAlternates('dia-de-partido', guide.slug)
    entries.push({
      url: `${SITE_URL}/es/dia-de-partido/${guide.slug}`,
      lastModified: new Date(guide.lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.75,
      alternates: { languages: guideAlternates },
    })
    entries.push({
      url: `${SITE_URL}/en/dia-de-partido/${guide.slug}`,
      lastModified: new Date(guide.lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.75,
      alternates: { languages: guideAlternates },
    })
  }

  // Best-of listicle pages -- use ACTUAL filesystem paths (Spanish names)
  for (const listicle of listicles) {
    const listicleAlternates = buildProgrammaticAlternates('mejores', listicle.slug)
    entries.push({
      url: `${SITE_URL}/es/mejores/${listicle.slug}`,
      lastModified: new Date(listicle.lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages: listicleAlternates },
    })
    entries.push({
      url: `${SITE_URL}/en/mejores/${listicle.slug}`,
      lastModified: new Date(listicle.lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages: listicleAlternates },
    })
  }

  return entries
}
