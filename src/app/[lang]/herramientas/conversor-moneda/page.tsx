import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { buildJsonLdScript } from '@/lib/jsonld'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { CurrencyConverter } from '@/components/tools/CurrencyConverter'
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
  const path = `/${locale}/herramientas/conversor-moneda`

  return buildPageMetadata({
    title: dict.tools.currencyTitle,
    description: dict.tools.currencyDescription,
    lang: locale,
    path,
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/herramientas/conversor-moneda`,
        en: `${SITE_URL}/en/herramientas/conversor-moneda`,
        'x-default': `${SITE_URL}/es/herramientas/conversor-moneda`,
      },
    },
  })
}

export default async function ConversorMonedaPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale

  const dict = await getDictionary(locale)
  const path = `/${locale}/herramientas/conversor-moneda`
  const canonicalUrl = `${SITE_URL}${path}`

  const breadcrumbs = generateBreadcrumbs(path, locale, dict.breadcrumbs, dict.tools.currencyHeading)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: dict.tools.currencyTitle,
    description: dict.tools.currencyDescription,
    applicationCategory: 'FinanceApplication',
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
          <h1 className="text-3xl font-bold md:text-4xl">{dict.tools.currencyHeading}</h1>
          <p className="mt-3 text-lg text-muted">{dict.tools.currencySubheading}</p>
        </header>

        <CurrencyConverter lang={locale} dict={dict.tools} />
      </div>
    </>
  )
}
