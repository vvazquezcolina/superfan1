import type { Locale } from '@/app/[lang]/dictionaries'

export const locales: Locale[] = ['es', 'en']
export const defaultLocale: Locale = 'es'
export const SITE_URL = 'https://www.superfaninfo.com'

// Map from Spanish filesystem path segments to English URL equivalents
export const pathTranslations: Record<string, Record<Locale, string>> = {
  ciudades: { es: 'ciudades', en: 'cities' },
  estadios: { es: 'estadios', en: 'stadiums' },
  equipos: { es: 'equipos', en: 'teams' },
  divulgacion: { es: 'divulgacion', en: 'disclosure' },
  privacidad: { es: 'privacidad', en: 'privacy' },
  acerca: { es: 'acerca', en: 'about' },
}

/**
 * Build hreflang alternates for generateMetadata().
 * Per D-03: uses es-419 for Spanish, en for English, x-default -> Spanish.
 * Always includes self-reference, cross-reference, and x-default.
 */
export function buildAlternates(
  section: string,
  slugs: Record<Locale, string>,
) {
  const pathEs = pathTranslations[section]?.es ?? section
  const pathEn = pathTranslations[section]?.en ?? section

  return {
    canonical: undefined as string | undefined, // caller sets based on current lang
    languages: {
      'es-419': `${SITE_URL}/es/${pathEs}/${slugs.es}`,
      en: `${SITE_URL}/en/${pathEn}/${slugs.en}`,
      'x-default': `${SITE_URL}/es/${pathEs}/${slugs.es}`,
    },
  }
}

/**
 * Build hreflang alternates for index/listing pages (no slug).
 */
export function buildIndexAlternates(section: string) {
  const pathEs = pathTranslations[section]?.es ?? section
  const pathEn = pathTranslations[section]?.en ?? section

  return {
    languages: {
      'es-419': `${SITE_URL}/es/${pathEs}`,
      en: `${SITE_URL}/en/${pathEn}`,
      'x-default': `${SITE_URL}/es/${pathEs}`,
    },
  }
}

/**
 * Build hreflang alternates for the homepage.
 */
export function buildHomeAlternates() {
  return {
    languages: {
      'es-419': `${SITE_URL}/es`,
      en: `${SITE_URL}/en`,
      'x-default': `${SITE_URL}/es`,
    },
  }
}
