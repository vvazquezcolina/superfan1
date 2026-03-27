import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { buildJsonLdScript } from '@/lib/jsonld'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { getCities, toContentLocale } from '@/lib/content/cities'
import { BudgetCalculator } from '@/components/tools/BudgetCalculator'
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
  const path = `/${lang}/herramientas/presupuesto`

  return buildPageMetadata({
    title: dict.tools.budgetTitle,
    description: dict.tools.budgetDescription,
    lang: contentLocale,
    path,
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/herramientas/presupuesto`,
        en: `${SITE_URL}/en/herramientas/presupuesto`,
        'x-default': `${SITE_URL}/es/herramientas/presupuesto`,
      },
    },
  })
}

export default async function PresupuestoPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as import('@/app/[lang]/dictionaries').Locale
  const contentLocale: Locale = toContentLocale(lang)

  const dict = await getDictionary(locale)
  const path = `/${lang}/herramientas/presupuesto`
  const canonicalUrl = `${SITE_URL}${path}`

  // Prepare city options for the client component
  const cities = getCities()
  const cityOptions = cities.map((city) => ({
    id: city.id,
    name: city.name[contentLocale],
  }))

  const breadcrumbs = generateBreadcrumbs(path, contentLocale, dict.breadcrumbs, dict.tools.budgetHeading)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: dict.tools.budgetTitle,
    description: dict.tools.budgetDescription,
    applicationCategory: 'UtilityApplication',
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
          <h1 className="text-3xl font-bold md:text-4xl">{dict.tools.budgetHeading}</h1>
          <p className="mt-3 text-lg text-muted">{dict.tools.budgetSubheading}</p>
        </header>

        <BudgetCalculator cities={cityOptions} lang={contentLocale} dict={dict.tools} />
      </div>
    </>
  )
}
