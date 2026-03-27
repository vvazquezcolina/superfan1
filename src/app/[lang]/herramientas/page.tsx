import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { buildJsonLdScript } from '@/lib/jsonld'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
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
  const path = `/${locale}/herramientas`

  return buildPageMetadata({
    title: dict.tools.toolsIndexTitle,
    description: dict.tools.toolsIndexDescription,
    lang: locale,
    path,
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/herramientas`,
        en: `${SITE_URL}/en/herramientas`,
        'x-default': `${SITE_URL}/es/herramientas`,
      },
    },
  })
}

export default async function HerramientasPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale

  const dict = await getDictionary(locale)
  const path = `/${locale}/herramientas`
  const canonicalUrl = `${SITE_URL}${path}`

  const breadcrumbs = generateBreadcrumbs(path, locale, dict.breadcrumbs)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.tools.toolsIndexTitle,
    description: dict.tools.toolsIndexDescription,
    url: canonicalUrl,
    numberOfItems: 5,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: dict.tools.budgetHeading,
        url: `${SITE_URL}/${locale}/herramientas/presupuesto`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: dict.tools.mapHeading,
        url: `${SITE_URL}/${locale}/herramientas/mapa`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: dict.tools.itineraryHeading,
        url: `${SITE_URL}/${locale}/herramientas/itinerario`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: dict.tools.currencyHeading,
        url: `${SITE_URL}/${locale}/herramientas/conversor-moneda`,
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: dict.tools.packingHeading,
        url: `${SITE_URL}/${locale}/herramientas/lista-equipaje`,
      },
    ],
  }

  const tools = [
    {
      slug: 'presupuesto',
      icon: '💰',
      heading: dict.tools.budgetHeading,
      description: dict.tools.toolsIndexBudgetDesc,
      color: 'green',
    },
    {
      slug: 'mapa',
      icon: '🗺',
      heading: dict.tools.mapHeading,
      description: dict.tools.toolsIndexMapDesc,
      color: 'blue',
    },
    {
      slug: 'itinerario',
      icon: '📅',
      heading: dict.tools.itineraryHeading,
      description: dict.tools.toolsIndexItineraryDesc,
      color: 'purple',
    },
    {
      slug: 'conversor-moneda',
      icon: '💱',
      heading: dict.tools.currencyHeading,
      description: dict.tools.toolsIndexCurrencyDesc,
      color: 'orange',
    },
    {
      slug: 'lista-equipaje',
      icon: '🎒',
      heading: dict.tools.packingHeading,
      description: dict.tools.toolsIndexPackingDesc,
      color: 'teal',
    },
  ]

  const colorMap: Record<string, { bg: string; border: string; icon: string; link: string }> = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'bg-green-100 text-green-700',
      link: 'text-green-700 hover:text-green-800',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'bg-blue-100 text-blue-700',
      link: 'text-blue-700 hover:text-blue-800',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'bg-purple-100 text-purple-700',
      link: 'text-purple-700 hover:text-purple-800',
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: 'bg-orange-100 text-orange-700',
      link: 'text-orange-700 hover:text-orange-800',
    },
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      icon: 'bg-teal-100 text-teal-700',
      link: 'text-teal-700 hover:text-teal-800',
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
        dangerouslySetInnerHTML={{ __html: buildJsonLdScript(itemListJsonLd) }}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mx-auto max-w-4xl py-6">
        <header className="mb-10">
          <h1 className="text-3xl font-bold md:text-4xl">{dict.tools.toolsIndexHeading}</h1>
          <p className="mt-3 text-lg text-muted">{dict.tools.toolsIndexSubheading}</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => {
            const colors = colorMap[tool.color]
            return (
              <Link
                key={tool.slug}
                href={`/${locale}/herramientas/${tool.slug}`}
                className={`group rounded-xl border ${colors.border} ${colors.bg} p-5 flex flex-col gap-3 hover:shadow-md transition-shadow`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${colors.icon} flex items-center justify-center text-2xl flex-shrink-0`}
                  aria-hidden="true"
                >
                  {tool.icon}
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-gray-900 text-base leading-snug group-hover:underline">
                    {tool.heading}
                  </h2>
                  <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <span className={`text-sm font-semibold ${colors.link} mt-auto`}>
                  {dict.tools.toolsUseTool} →
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
