import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { buildJsonLdScript } from '@/lib/jsonld'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { getCities, toContentLocale } from '@/lib/content/cities'
import { ItineraryPlanner } from '@/components/tools/ItineraryPlanner'
import type { Locale } from '@/lib/content/schemas'

const SITE_URL = 'https://www.superfaninfo.com'

export async function generateStaticParams() {
  return [
    { lang: 'es' },
    { lang: 'en' },
    { lang: 'pt' },
    { lang: 'fr' },
    { lang: 'de' },
    { lang: 'ar' },
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dictLocale = lang as import('@/app/[lang]/dictionaries').Locale
  const contentLocale: Locale = toContentLocale(lang)

  const dict = await getDictionary(dictLocale)
  const path = `/${lang}/herramientas/itinerario`

  return buildPageMetadata({
    title: dict.tools.itineraryTitle,
    description: dict.tools.itineraryDescription,
    lang: contentLocale,
    path,
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/herramientas/itinerario`,
        en: `${SITE_URL}/en/herramientas/itinerario`,
        'x-default': `${SITE_URL}/es/herramientas/itinerario`,
      },
    },
  })
}

export default async function ItinerarioPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as import('@/app/[lang]/dictionaries').Locale
  const contentLocale: Locale = toContentLocale(lang)

  const dict = await getDictionary(locale)
  const path = `/${lang}/herramientas/itinerario`
  const canonicalUrl = `${SITE_URL}${path}`

  const cities = getCities()
  const cityOptions = cities.map((city) => ({
    id: city.id,
    name: city.name[contentLocale],
  }))

  const breadcrumbs = generateBreadcrumbs(path, contentLocale, dict.breadcrumbs, dict.tools.itineraryHeading)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: dict.tools.itineraryTitle,
    description: dict.tools.itineraryDescription,
    applicationCategory: 'TravelApplication',
    url: canonicalUrl,
    inLanguage: contentLocale === 'es' ? 'es-419' : 'en',
    operatingSystem: 'Web browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLdScript(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLdScript(softwareJsonLd) }}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mx-auto max-w-4xl py-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">{dict.tools.itineraryHeading}</h1>
          <p className="mt-3 text-lg text-muted">{dict.tools.itinerarySubheading}</p>
        </header>

        <ItineraryPlanner
          cities={cityOptions}
          lang={contentLocale}
          dict={dict.tools}
        />
      </div>
    </>
  )
}
