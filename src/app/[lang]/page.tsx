import type { Metadata } from 'next'
import { getDictionary, hasLocale } from './dictionaries'
import { notFound } from 'next/navigation'
import { buildPageMetadata } from '@/lib/seo'
import { buildHomeAlternates } from '@/lib/i18n'
import type { Locale } from '@/lib/content/schemas'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)

  return buildPageMetadata({
    title: dict.site.tagline,
    description: dict.home.description,
    lang: lang as Locale,
    path: `/${lang}`,
    alternates: buildHomeAlternates(),
  })
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: dict.site.name,
    url: `https://www.superfaninfo.com/${lang}`,
    description: dict.home.description,
    inLanguage: lang === 'es' ? 'es-419' : 'en',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <h1>{dict.home.heading}</h1>
      <p>{dict.home.subheading}</p>
    </>
  )
}
