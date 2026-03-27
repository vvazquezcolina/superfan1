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
import { getMatches } from '@/lib/content/schedule'
import { hreflangMap } from '@/lib/i18n'

const SITE_URL = 'https://www.superfaninfo.com'

/**
 * All 6 locales supported by the site.
 */
const locales = ['es', 'en', 'pt', 'fr', 'de', 'ar'] as const
type Locale = (typeof locales)[number]

/**
 * Locales that have ONLY Spanish-named filesystem paths.
 * en is excluded because it has rewrites (cities, stadiums, teams).
 */
const extraLocales: Locale[] = ['pt', 'fr', 'de', 'ar']

/**
 * Returns the actual URL path segment for the given section and locale.
 * ALL locales use Spanish filesystem paths — rewrites exist for English but
 * the sitemap should point to the canonical filesystem path to avoid phantom 404s.
 */
function getPathSegment(_section: 'ciudades' | 'estadios' | 'equipos', _locale: Locale): string {
  // Always use Spanish filesystem paths — these are the actual built pages
  return _section
}

/**
 * Build hreflang alternates for city/stadium/team detail pages.
 *
 * - es  → /es/{section}/{esSlug}
 * - en  → /en/{enSegment}/{enSlug}
 * - pt/fr/de/ar → /{locale}/{section}/{esSlug}  (Spanish filesystem path)
 */
function buildDetailAlternates(
  section: 'ciudades' | 'estadios' | 'equipos',
  esSlug: string,
  enSlug: string,
): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    const hreflang = hreflangMap[locale]
    const seg = getPathSegment(section, locale)
    const slug = locale === 'en' ? enSlug : esSlug
    languages[hreflang] = `${SITE_URL}/${locale}/${seg}/${slug}`
  }
  languages['x-default'] = `${SITE_URL}/es/${section}/${esSlug}`
  return languages
}

/**
 * Build hreflang alternates for city/stadium/team index pages.
 *
 * - es  → /es/{section}
 * - en  → /en/{enSegment}
 * - pt/fr/de/ar → /{locale}/{section}  (Spanish filesystem path)
 */
function buildIndexAlternates(
  section: 'ciudades' | 'estadios' | 'equipos',
): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    const hreflang = hreflangMap[locale]
    const seg = getPathSegment(section, locale)
    languages[hreflang] = `${SITE_URL}/${locale}/${seg}`
  }
  languages['x-default'] = `${SITE_URL}/es/${section}`
  return languages
}

/**
 * Build hreflang alternates for programmatic pages across all 6 locales.
 * Non-es/en locales use the en slug (or the es slug as final fallback).
 * (comparar, como-llegar, dia-de-partido, mejores, partidos, grupos)
 */
function buildAllLocalesAlternates(fsPath: string, esSlug: string, enSlug?: string): Record<string, string> {
  const resolved = enSlug ?? esSlug
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    const hreflang = hreflangMap[locale]
    const slug = locale === 'es' ? esSlug : resolved
    languages[hreflang] = `${SITE_URL}/${locale}/${fsPath}/${slug}`
  }
  languages['x-default'] = `${SITE_URL}/es/${fsPath}/${esSlug}`
  return languages
}

/**
 * Build hreflang alternates for static es+en pages using identical paths.
 */
function buildStaticEsEnAlternates(esPath: string, enPath?: string): Record<string, string> {
  return {
    'es-419': `${SITE_URL}/es/${esPath}`,
    en: `${SITE_URL}/en/${enPath ?? esPath}`,
    'x-default': `${SITE_URL}/es/${esPath}`,
  }
}

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const cities = getCities()
  const stadiums = getStadiums()
  const teams = getTeams()
  const comparisons = getCityComparisons()
  const routes = getRoutes()
  const matchDayGuides = getMatchDayGuides()
  const listicles = getListicles()
  const matches = getMatches()

  const entries: MetadataRoute.Sitemap = []

  // ─── Homepages — all 6 locales ─────────────────────────────────────────────
  const homeAlternates: Record<string, string> = {}
  for (const locale of locales) {
    homeAlternates[hreflangMap[locale]] = `${SITE_URL}/${locale}`
  }
  homeAlternates['x-default'] = `${SITE_URL}/es`

  for (const locale of locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: { languages: homeAlternates },
    })
  }

  // ─── City index pages — all 6 locales ──────────────────────────────────────
  const cityIndexAlts = buildIndexAlternates('ciudades')
  // es + en
  entries.push({
    url: `${SITE_URL}/es/ciudades`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
    alternates: { languages: cityIndexAlts },
  })
  entries.push({
    url: `${SITE_URL}/en/ciudades`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
    alternates: { languages: cityIndexAlts },
  })
  // pt, fr, de, ar → Spanish filesystem path
  for (const locale of extraLocales) {
    entries.push({
      url: `${SITE_URL}/${locale}/ciudades`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: { languages: cityIndexAlts },
    })
  }

  // ─── City detail pages — all 6 locales ─────────────────────────────────────
  for (const city of cities) {
    const esSlug = city.slugs.es
    const enSlug = city.slugs.en ?? city.slugs.es
    const cityAlts = buildDetailAlternates('ciudades', esSlug, enSlug)

    entries.push({
      url: `${SITE_URL}/es/ciudades/${esSlug}`,
      lastModified: new Date(city.lastUpdated),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: { languages: cityAlts },
    })
    entries.push({
      url: `${SITE_URL}/en/ciudades/${enSlug}`,
      lastModified: new Date(city.lastUpdated),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: { languages: cityAlts },
    })
    for (const locale of extraLocales) {
      entries.push({
        url: `${SITE_URL}/${locale}/ciudades/${esSlug}`,
        lastModified: new Date(city.lastUpdated),
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: { languages: cityAlts },
      })
    }
  }

  // ─── Stadium index pages — all 6 locales ───────────────────────────────────
  const stadiumIndexAlts = buildIndexAlternates('estadios')
  entries.push({
    url: `${SITE_URL}/es/estadios`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: { languages: stadiumIndexAlts },
  })
  entries.push({
    url: `${SITE_URL}/en/estadios`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: { languages: stadiumIndexAlts },
  })
  for (const locale of extraLocales) {
    entries.push({
      url: `${SITE_URL}/${locale}/estadios`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: stadiumIndexAlts },
    })
  }

  // ─── Stadium detail pages — all 6 locales ──────────────────────────────────
  for (const stadium of stadiums) {
    const esSlug = stadium.slugs.es
    const enSlug = stadium.slugs.en ?? stadium.slugs.es
    const stadiumAlts = buildDetailAlternates('estadios', esSlug, enSlug)

    entries.push({
      url: `${SITE_URL}/es/estadios/${esSlug}`,
      lastModified: new Date(stadium.lastUpdated),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: stadiumAlts },
    })
    entries.push({
      url: `${SITE_URL}/en/estadios/${enSlug}`,
      lastModified: new Date(stadium.lastUpdated),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: stadiumAlts },
    })
    for (const locale of extraLocales) {
      entries.push({
        url: `${SITE_URL}/${locale}/estadios/${esSlug}`,
        lastModified: new Date(stadium.lastUpdated),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: { languages: stadiumAlts },
      })
    }
  }

  // ─── Team index pages — all 6 locales ──────────────────────────────────────
  const teamIndexAlts = buildIndexAlternates('equipos')
  entries.push({
    url: `${SITE_URL}/es/equipos`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: { languages: teamIndexAlts },
  })
  entries.push({
    url: `${SITE_URL}/en/equipos`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: { languages: teamIndexAlts },
  })
  for (const locale of extraLocales) {
    entries.push({
      url: `${SITE_URL}/${locale}/equipos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: teamIndexAlts },
    })
  }

  // ─── Team detail pages — all 6 locales ─────────────────────────────────────
  for (const team of teams) {
    const esSlug = team.slugs.es
    const enSlug = team.slugs.en ?? team.slugs.es
    const teamAlts = buildDetailAlternates('equipos', esSlug, enSlug)

    entries.push({
      url: `${SITE_URL}/es/equipos/${esSlug}`,
      lastModified: new Date(team.lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages: teamAlts },
    })
    entries.push({
      url: `${SITE_URL}/en/equipos/${enSlug}`,
      lastModified: new Date(team.lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages: teamAlts },
    })
    for (const locale of extraLocales) {
      entries.push({
        url: `${SITE_URL}/${locale}/equipos/${esSlug}`,
        lastModified: new Date(team.lastUpdated),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: { languages: teamAlts },
      })
    }
  }

  // ─── Index pages that exist for ALL 6 locales ──────────────────────────────
  const allLocaleIndexPages = [
    { path: 'viajes', priority: 0.7, freq: 'monthly' as const },
    { path: 'fan', priority: 0.7, freq: 'monthly' as const },
    { path: 'calendario', priority: 0.8, freq: 'weekly' as const },
  ]
  for (const { path, priority, freq } of allLocaleIndexPages) {
    const alts: Record<string, string> = {}
    for (const loc of locales) {
      alts[hreflangMap[loc]] = `${SITE_URL}/${loc}/${path}`
    }
    alts['x-default'] = `${SITE_URL}/es/${path}`
    for (const loc of locales) {
      entries.push({
        url: `${SITE_URL}/${loc}/${path}`,
        lastModified: new Date(),
        changeFrequency: freq,
        priority,
        alternates: { languages: alts },
      })
    }
  }

  // ─── Subpages that exist for ES + EN only ─────────────────────────────────
  const esEnSubpages = [
    { path: 'viajes/vuelos', priority: 0.7, freq: 'monthly' as const },
    { path: 'viajes/vuelos/desde-mexico', priority: 0.6, freq: 'monthly' as const },
    { path: 'viajes/vuelos/desde-usa', priority: 0.6, freq: 'monthly' as const },
    { path: 'viajes/vuelos/desde-europa', priority: 0.6, freq: 'monthly' as const },
    { path: 'viajes/hospedaje', priority: 0.7, freq: 'monthly' as const },
    { path: 'viajes/transporte', priority: 0.7, freq: 'monthly' as const },
    { path: 'viajes/visa', priority: 0.7, freq: 'monthly' as const },
    { path: 'fan/entradas', priority: 0.7, freq: 'monthly' as const },
    { path: 'fan/seguridad', priority: 0.7, freq: 'monthly' as const },
    { path: 'herramientas', priority: 0.7, freq: 'monthly' as const },
    { path: 'herramientas/conversor-moneda', priority: 0.6, freq: 'monthly' as const },
  ]
  for (const { path, priority, freq } of esEnSubpages) {
    const alts = buildStaticEsEnAlternates(path)
    for (const loc of ['es', 'en'] as const) {
      entries.push({
        url: `${SITE_URL}/${loc}/${path}`,
        lastModified: new Date(),
        changeFrequency: freq,
        priority,
        alternates: { languages: alts },
      })
    }
  }

  // ─── Tools subpages — all 6 locales (except conversor-moneda which is es+en) ─
  const toolsSubpages = [
    { path: 'herramientas/presupuesto', priority: 0.6, freq: 'monthly' as const },
    { path: 'herramientas/mapa', priority: 0.6, freq: 'monthly' as const },
    { path: 'herramientas/itinerario', priority: 0.6, freq: 'monthly' as const },
    { path: 'herramientas/lista-equipaje', priority: 0.6, freq: 'monthly' as const },
  ]
  for (const { path, priority, freq } of toolsSubpages) {
    const alts: Record<string, string> = {}
    for (const loc of locales) {
      alts[hreflangMap[loc]] = `${SITE_URL}/${loc}/${path}`
    }
    alts['x-default'] = `${SITE_URL}/es/${path}`
    for (const loc of locales) {
      entries.push({
        url: `${SITE_URL}/${loc}/${path}`,
        lastModified: new Date(),
        changeFrequency: freq,
        priority,
        alternates: { languages: alts },
      })
    }
  }

  // ─── Legal pages ────────────────────────────────────────────────────────────
  // Spanish legal pages — es only
  for (const path of ['acerca', 'privacidad', 'divulgacion']) {
    entries.push({
      url: `${SITE_URL}/es/${path}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          'es-419': `${SITE_URL}/es/${path}`,
          'x-default': `${SITE_URL}/es/${path}`,
        },
      },
    })
  }
  // English legal pages — en only
  for (const path of ['about', 'privacy', 'disclosure']) {
    entries.push({
      url: `${SITE_URL}/en/${path}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          en: `${SITE_URL}/en/${path}`,
        },
      },
    })
  }

  // ─── City comparison pages (comparar) — all 6 locales ──────────────────────
  for (const comparison of comparisons) {
    const esSlug = comparison.slugs.es
    const enSlug = comparison.slugs.en ?? comparison.slugs.es
    const alts = buildAllLocalesAlternates('comparar', esSlug, enSlug)
    for (const locale of locales) {
      const slug = locale === 'es' ? esSlug : enSlug
      entries.push({
        url: `${SITE_URL}/${locale}/comparar/${slug}`,
        lastModified: new Date(comparison.lastUpdated),
        changeFrequency: 'monthly',
        priority: 0.75,
        alternates: { languages: alts },
      })
    }
  }

  // ─── How-to-get pages (como-llegar) — all 6 locales ─────────────────────────
  for (const route of routes) {
    const esSlug = route.slugs.es
    const enSlug = route.slugs.en ?? route.slugs.es
    const alts = buildAllLocalesAlternates('como-llegar', esSlug, enSlug)
    for (const locale of locales) {
      const slug = locale === 'es' ? esSlug : enSlug
      entries.push({
        url: `${SITE_URL}/${locale}/como-llegar/${slug}`,
        lastModified: new Date(route.lastUpdated),
        changeFrequency: 'monthly',
        priority: 0.75,
        alternates: { languages: alts },
      })
    }
  }

  // ─── Match day guide pages (dia-de-partido) — all 6 locales ─────────────────
  for (const guide of matchDayGuides) {
    const alts = buildAllLocalesAlternates('dia-de-partido', guide.slug)
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/dia-de-partido/${guide.slug}`,
        lastModified: new Date(guide.lastUpdated),
        changeFrequency: 'monthly',
        priority: 0.75,
        alternates: { languages: alts },
      })
    }
  }

  // ─── Best-of listicle pages (mejores) — all 6 locales ───────────────────────
  for (const listicle of listicles) {
    const alts = buildAllLocalesAlternates('mejores', listicle.slug)
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/mejores/${listicle.slug}`,
        lastModified: new Date(listicle.lastUpdated),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: { languages: alts },
      })
    }
  }

  // ─── Match pages (partidos) — 48 matches × 6 locales ────────────────────────
  for (const match of matches) {
    const alts = buildAllLocalesAlternates('partidos', match.id)
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/partidos/${match.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: { languages: alts },
      })
    }
  }

  // ─── Group pages (grupos) — Groups A-L × 6 locales ──────────────────────────
  for (const group of GROUPS) {
    const groupSlug = group
    const alts = buildAllLocalesAlternates('grupos', groupSlug)
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/grupos/${groupSlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: { languages: alts },
      })
    }
  }

  return entries
}
