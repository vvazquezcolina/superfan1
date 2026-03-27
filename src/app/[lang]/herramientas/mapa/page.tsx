import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { buildJsonLdScript } from '@/lib/jsonld'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { getStadiums } from '@/lib/content/stadiums'
import { getCityById } from '@/lib/content/cities'
import { InteractiveMap } from '@/components/tools/InteractiveMap'
import type { Locale } from '@/lib/content/schemas'

const SITE_URL = 'https://www.superfaninfo.com'

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const locale = lang as Locale

  const dict = await getDictionary(locale)
  const path = `/${locale}/herramientas/mapa`

  return buildPageMetadata({
    title: dict.tools.mapTitle,
    description: dict.tools.mapDescription,
    lang: locale,
    path,
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/herramientas/mapa`,
        en: `${SITE_URL}/en/herramientas/mapa`,
        'x-default': `${SITE_URL}/es/herramientas/mapa`,
      },
    },
  })
}

export default async function MapaPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale

  const dict = await getDictionary(locale)
  const path = `/${locale}/herramientas/mapa`
  const canonicalUrl = `${SITE_URL}${path}`

  // Build StadiumMarker[] for the client component (server-side data prep)
  const stadiums = getStadiums()
  const stadiumMarkers = stadiums.map((stadium) => {
    const city = getCityById(stadium.city)
    return {
      id: stadium.id,
      name: stadium.name[locale],
      cityId: stadium.city,
      cityName: city?.name[locale] ?? stadium.city,
      capacity: stadium.capacity,
      lat: stadium.coordinates.lat,
      lng: stadium.coordinates.lng,
      countryColor:
        city?.country === 'mexico'
          ? '#16a34a'
          : city?.country === 'canada'
            ? '#dc2626'
            : '#2563eb',
      stadiumSlug: stadium.slugs[locale],
      citySlug: city?.slugs[locale] ?? stadium.city,
    }
  })

  const breadcrumbs = generateBreadcrumbs(path, locale, dict.breadcrumbs, dict.tools.mapHeading)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: dict.tools.mapTitle,
    description: dict.tools.mapDescription,
    applicationCategory: 'UtilityApplication',
    url: canonicalUrl,
    inLanguage: locale === 'es' ? 'es-419' : 'en',
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
          <h1 className="text-3xl font-bold md:text-4xl">{dict.tools.mapHeading}</h1>
          <p className="mt-3 text-lg text-muted">{dict.tools.mapSubheading}</p>
        </header>

        <InteractiveMap
          stadiums={stadiumMarkers}
          lang={locale}
          dict={{
            mapLoading: dict.tools.mapLoading,
            popupCapacity: dict.tools.popupCapacity,
            popupCityGuide: dict.tools.popupCityGuide,
            popupStadiumPage: dict.tools.popupStadiumPage,
          }}
        />

        <p className="mt-4 text-sm text-muted">
          {locale === 'es' ? '16 estadios en 3 paises' : '16 stadiums across 3 countries'}
        </p>
      </div>
    </>
  )
}
