import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { buildJsonLdScript } from '@/lib/jsonld'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { getCities } from '@/lib/content/cities'
import { PackingList } from '@/components/tools/PackingList'
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
  const path = `/${locale}/herramientas/lista-equipaje`

  return buildPageMetadata({
    title: dict.tools.packingTitle,
    description: dict.tools.packingDescription,
    lang: locale,
    path,
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/herramientas/lista-equipaje`,
        en: `${SITE_URL}/en/herramientas/lista-equipaje`,
        'x-default': `${SITE_URL}/es/herramientas/lista-equipaje`,
      },
    },
  })
}

export default async function ListaEquipajePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale

  const dict = await getDictionary(locale)
  const path = `/${locale}/herramientas/lista-equipaje`
  const canonicalUrl = `${SITE_URL}${path}`

  const cities = getCities()
  const cityOptions = cities.map((city) => ({
    id: city.id,
    name: city.name[locale],
  }))

  const breadcrumbs = generateBreadcrumbs(path, locale, dict.breadcrumbs, dict.tools.packingHeading)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: dict.tools.packingTitle,
    description: dict.tools.packingDescription,
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
          <h1 className="text-3xl font-bold md:text-4xl">{dict.tools.packingHeading}</h1>
          <p className="mt-3 text-lg text-muted">{dict.tools.packingSubheading}</p>
        </header>

        <PackingList cities={cityOptions} lang={locale} dict={dict.tools} />
      </div>
    </>
  )
}
