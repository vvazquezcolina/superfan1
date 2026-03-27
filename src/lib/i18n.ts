import type { Locale } from '@/app/[lang]/dictionaries'

export const locales: Locale[] = ['es', 'en', 'pt', 'fr', 'de', 'ar']
export const defaultLocale: Locale = 'es'
export const SITE_URL = 'https://www.superfaninfo.com'

/** Human-readable locale names for UI display */
export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
  fr: 'Français',
  de: 'Deutsch',
  ar: 'العربية',
}

/** Text direction per locale — Arabic is RTL */
export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  es: 'ltr',
  en: 'ltr',
  pt: 'ltr',
  fr: 'ltr',
  de: 'ltr',
  ar: 'rtl',
}

/** BCP-47 hreflang codes — es uses es-419 for Latin America targeting */
export const hreflangMap: Record<Locale, string> = {
  es: 'es-419',
  en: 'en',
  pt: 'pt-BR',
  fr: 'fr',
  de: 'de',
  ar: 'ar',
}

// Map from Spanish filesystem path segments to localized URL equivalents.
// All new locales route through the Spanish filesystem paths via Next.js rewrites.
export const pathTranslations: Record<string, Record<Locale, string>> = {
  ciudades: {
    es: 'ciudades',
    en: 'cities',
    pt: 'cidades',
    fr: 'villes',
    de: 'staedte',
    ar: 'cities',
  },
  estadios: {
    es: 'estadios',
    en: 'stadiums',
    pt: 'estadios',
    fr: 'stades',
    de: 'stadien',
    ar: 'stadiums',
  },
  equipos: {
    es: 'equipos',
    en: 'teams',
    pt: 'equipes',
    fr: 'equipes',
    de: 'teams',
    ar: 'teams',
  },
  divulgacion: {
    es: 'divulgacion',
    en: 'disclosure',
    pt: 'divulgacao',
    fr: 'divulgation',
    de: 'offenlegung',
    ar: 'disclosure',
  },
  privacidad: {
    es: 'privacidad',
    en: 'privacy',
    pt: 'privacidade',
    fr: 'confidentialite',
    de: 'datenschutz',
    ar: 'privacy',
  },
  acerca: {
    es: 'acerca',
    en: 'about',
    pt: 'sobre',
    fr: 'a-propos',
    de: 'ueber-uns',
    ar: 'about',
  },
  comparar: {
    es: 'comparar',
    en: 'compare',
    pt: 'comparar',
    fr: 'comparer',
    de: 'vergleichen',
    ar: 'compare',
  },
  'como-llegar': {
    es: 'como-llegar',
    en: 'how-to-get',
    pt: 'como-chegar',
    fr: 'comment-aller',
    de: 'wie-komme-ich',
    ar: 'how-to-get',
  },
  'dia-de-partido': {
    es: 'dia-de-partido',
    en: 'match-day',
    pt: 'dia-de-jogo',
    fr: 'jour-de-match',
    de: 'spieltag',
    ar: 'match-day',
  },
  mejores: {
    es: 'mejores',
    en: 'best',
    pt: 'melhores',
    fr: 'meilleurs',
    de: 'beste',
    ar: 'best',
  },
}

/**
 * Build hreflang alternates for generateMetadata().
 * Includes all 6 locales. x-default -> Spanish (es-419).
 */
export function buildAlternates(
  section: string,
  slugs: Record<string, string>,
) {
  const languages: Record<string, string> = {}

  for (const locale of locales) {
    const hreflang = hreflangMap[locale]
    const pathSegment = pathTranslations[section]?.[locale] ?? section
    // All locales share the same slug (es slug), except en which has its own slug field
    const slug = slugs[locale] ?? slugs.es
    languages[hreflang] = `${SITE_URL}/${locale}/${pathSegment}/${slug}`
  }

  // x-default points to Spanish
  const esPath = pathTranslations[section]?.es ?? section
  languages['x-default'] = `${SITE_URL}/es/${esPath}/${slugs.es}`

  return {
    canonical: undefined as string | undefined,
    languages,
  }
}

/**
 * Build hreflang alternates for index/listing pages (no slug).
 */
export function buildIndexAlternates(section: string) {
  const languages: Record<string, string> = {}

  for (const locale of locales) {
    const hreflang = hreflangMap[locale]
    const pathSegment = pathTranslations[section]?.[locale] ?? section
    languages[hreflang] = `${SITE_URL}/${locale}/${pathSegment}`
  }

  // x-default points to Spanish
  const esPath = pathTranslations[section]?.es ?? section
  languages['x-default'] = `${SITE_URL}/es/${esPath}`

  return { languages }
}

/**
 * Build hreflang alternates for the homepage.
 */
export function buildHomeAlternates() {
  const languages: Record<string, string> = {}

  for (const locale of locales) {
    const hreflang = hreflangMap[locale]
    languages[hreflang] = `${SITE_URL}/${locale}`
  }

  languages['x-default'] = `${SITE_URL}/es`

  return { languages }
}
