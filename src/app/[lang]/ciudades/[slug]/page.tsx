import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCity, getCitySlugs } from '@/lib/content/cities'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildAlternates } from '@/lib/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { buildPlaceJsonLd, buildFAQPageJsonLd, buildArticleJsonLd } from '@/lib/jsonld'
import { CityHero } from '@/components/city/CityHero'
import { CitySection } from '@/components/city/CitySection'
import { CityFAQ } from '@/components/city/CityFAQ'
import type { Locale } from '@/lib/content/schemas'

export async function generateStaticParams() {
  return getCitySlugs().map(({ slug, lang }) => ({ lang, slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  if (!hasLocale(lang)) return {}
  const city = getCity(slug, lang as Locale)
  if (!city) return {}

  const overview = city.content.overview[lang as Locale]
  const description = overview.length > 155 ? overview.slice(0, 152) + '...' : overview

  const section = lang === 'es' ? 'ciudades' : 'cities'
  return buildPageMetadata({
    title: city.name[lang as Locale],
    description,
    lang: lang as Locale,
    path: `/${lang}/${section}/${slug}`,
    alternates: buildAlternates('ciudades', city.slugs),
  })
}

const sectionIds: Record<string, string> = {
  gettingThere: 'como-llegar',
  gettingAround: 'como-moverse',
  neighborhoods: 'donde-hospedarse',
  foodAndDrink: 'comida-y-bebida',
  safety: 'seguridad',
  weather: 'clima',
  culturalContext: 'contexto-cultural',
}

const sectionKeys = [
  'gettingThere',
  'gettingAround',
  'neighborhoods',
  'foodAndDrink',
  'safety',
  'weather',
  'culturalContext',
] as const

export default async function CityPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const city = getCity(slug, lang as Locale)
  if (!city) notFound()

  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/ciudades/${slug}`,
    locale,
    dict.breadcrumbs,
    city.name[locale],
  )
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const section = locale === 'es' ? 'ciudades' : 'cities'
  const canonicalUrl = `https://www.superfaninfo.com/${lang}/${section}/${slug}`
  const placeJsonLd = buildPlaceJsonLd(city, locale)
  const faqJsonLd = buildFAQPageJsonLd(city.content.faq, locale)
  const articleJsonLd = buildArticleJsonLd({
    headline: city.name[locale],
    description: city.content.overview[locale],
    url: canonicalUrl,
    dateModified: city.lastUpdated,
    lang: locale,
  })

  const sourcesLabel = locale === 'es' ? 'Fuentes' : 'Sources'
  const backLabel = locale === 'es' ? 'Ver todas las ciudades' : 'View all cities'
  const indexPath = locale === 'es' ? `/${lang}/ciudades` : `/${lang}/cities`
  const lastUpdatedLabel = locale === 'es' ? 'Ultima actualizacion' : 'Last updated'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Breadcrumbs items={breadcrumbs} />

      <article className="mx-auto max-w-4xl space-y-12 py-6">
        <CityHero city={city} lang={locale} />

        {sectionKeys.map((key) => (
          <CitySection
            key={key}
            section={city.content[key]}
            lang={locale}
            id={sectionIds[key]}
          />
        ))}

        <CityFAQ faqs={city.content.faq} lang={locale} />

        <section className="mx-auto max-w-prose">
          <h2 className="text-2xl font-bold md:text-3xl">{sourcesLabel}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            {city.content.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary/80"
                >
                  {source.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mx-auto max-w-prose border-t border-border pt-6">
          <p className="text-sm text-muted">
            {lastUpdatedLabel}: {city.lastUpdated}
          </p>
          <a
            href={indexPath}
            className="mt-4 inline-block text-primary underline hover:text-primary/80"
          >
            {backLabel}
          </a>
        </footer>
      </article>
    </>
  )
}
