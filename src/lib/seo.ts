import type { Metadata } from 'next'
import type { Locale } from '@/lib/content/schemas'

const SITE_URL = 'https://www.superfaninfo.com'
const SITE_NAME_ES = 'SuperFan Mundial 2026'
const SITE_NAME_EN = 'SuperFan World Cup 2026'

interface PageMetadataInput {
  title: string // The page-specific title (without site suffix)
  description: string // 120-155 character description
  lang: Locale
  path: string // e.g., '/es/ciudades/ciudad-de-mexico'
  alternates: {
    languages: Record<string, string>
  }
  imageAlt?: string // Alt text for OG image
}

const ogLocaleMap: Record<string, string> = {
  es: 'es_419',
  en: 'en_US',
  pt: 'pt_BR',
  fr: 'fr_FR',
  de: 'de_DE',
  ar: 'ar_AR',
}

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const { title, description, lang, path, alternates, imageAlt: _imageAlt } =
    input
  const siteName = lang === 'es' ? SITE_NAME_ES : SITE_NAME_EN
  const canonicalUrl = `${SITE_URL}${path}`

  // Truncate description to 155 chars if needed (per D-20)
  const safeDescription =
    description.length > 155 ? description.slice(0, 152) + '...' : description

  return {
    title, // Uses template from layout: "{title} | SuperFan Mundial 2026" (per D-19)
    description: safeDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: alternates.languages,
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description: safeDescription,
      url: canonicalUrl,
      siteName,
      locale: ogLocaleMap[lang] ?? 'en_US',
      type: 'website',
      // Next.js auto-discovers opengraph-image.tsx files co-located with pages.
      // metadataBase in layout.tsx ensures absolute URLs are generated correctly.
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteName}`,
      description: safeDescription,
      // Twitter picks up the same image Next.js generates from opengraph-image.tsx
      // when metadataBase is set to https://www.superfaninfo.com in layout.tsx
    },
  }
}
