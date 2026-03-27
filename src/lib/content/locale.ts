import type { Locale } from './schemas'

/** Maps any supported locale to the content locale (es or en) used for JSON data access */
export function toContentLocale(lang: string): Locale {
  return lang === 'es' ? 'es' : 'en'
}
