import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getStadium, getStadiumSlugs } from '@/lib/content/stadiums'
import { getCityById } from '@/lib/content/cities'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildAlternates } from '@/lib/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { buildStadiumJsonLd, buildFAQPageJsonLd, buildArticleJsonLd } from '@/lib/jsonld'
import { StadiumHero } from '@/components/stadium/StadiumHero'
import { StadiumSection } from '@/components/stadium/StadiumSection'
import { StadiumFAQ } from '@/components/stadium/StadiumFAQ'
import type { Locale } from '@/lib/content/schemas'

export async function generateStaticParams() {
  return getStadiumSlugs().map(({ slug, lang }) => ({ lang, slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  if (!hasLocale(lang)) return {}
  const stadium = getStadium(slug, lang as Locale)
  if (!stadium) return {}

  const overview = stadium.content.overview[lang as Locale]
  const description = overview.length > 155 ? overview.slice(0, 152) + '...' : overview

  const section = lang === 'es' ? 'estadios' : 'stadiums'
  return buildPageMetadata({
    title: stadium.name[lang as Locale],
    description,
    lang: lang as Locale,
    path: `/${lang}/${section}/${slug}`,
    alternates: buildAlternates('estadios', stadium.slugs),
  })
}

const sectionIds: Record<string, string> = {
  gettingThere: 'como-llegar',
  seatingGuide: 'guia-asientos',
  nearbyHotels: 'hoteles-cercanos',
  accessibility: 'accesibilidad',
  matchSchedule: 'calendario-partidos',
}

const sectionKeys = [
  'gettingThere',
  'seatingGuide',
  'nearbyHotels',
  'accessibility',
  'matchSchedule',
] as const

const questionHeaders: Record<string, Record<string, string>> = {
  gettingThere: { es: 'Como llegar al {stadiumName}?', en: 'How to get to {stadiumName}?' },
  seatingGuide: { es: 'Como son los asientos en el {stadiumName}?', en: 'What are the seats like at {stadiumName}?' },
  nearbyHotels: { es: 'Donde hospedarse cerca del {stadiumName}?', en: 'Where to stay near {stadiumName}?' },
  accessibility: { es: 'Es accesible el {stadiumName}?', en: 'Is {stadiumName} accessible?' },
  matchSchedule: { es: 'Que partidos se juegan en el {stadiumName}?', en: 'What matches are played at {stadiumName}?' },
}

export default async function StadiumPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const stadium = getStadium(slug, lang as Locale)
  if (!stadium) notFound()

  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/estadios/${slug}`,
    locale,
    dict.breadcrumbs,
    stadium.name[locale],
  )
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const city = getCityById(stadium.city)

  const section = locale === 'es' ? 'estadios' : 'stadiums'
  const canonicalUrl = `https://www.superfaninfo.com/${lang}/${section}/${slug}`
  const stadiumJsonLd = buildStadiumJsonLd(stadium, city?.name[locale] ?? '', locale)
  const faqJsonLd = buildFAQPageJsonLd(stadium.content.faq, locale)
  const articleJsonLd = buildArticleJsonLd({
    headline: stadium.name[locale],
    description: stadium.content.overview[locale],
    url: canonicalUrl,
    dateModified: stadium.lastUpdated,
    lang: locale,
  })

  const sourcesLabel = dict.stadium.sources
  const backLabel = dict.stadium.backToIndex
  const indexPath = locale === 'es' ? `/${lang}/estadios` : `/${lang}/stadiums`
  const lastUpdatedLabel = dict.stadium.lastUpdated

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(stadiumJsonLd) }}
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
        <StadiumHero stadium={stadium} lang={locale} />

        <section className="mx-auto max-w-prose rounded-lg border-l-4 border-primary bg-primary/5 p-6">
          <p className="text-lg font-medium leading-relaxed">
            {stadium.content.overview[locale].split('\n\n')[0]}
          </p>
        </section>

        <aside className="mx-auto max-w-prose rounded-lg bg-muted/10 p-4 text-sm">
          <p className="font-semibold">{locale === 'es' ? 'Datos clave' : 'Key Facts'}</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>{locale === 'es' ? 'Capacidad' : 'Capacity'}: {stadium.capacity.toLocaleString()}</li>
            <li>{locale === 'es' ? 'Ciudad sede' : 'Host city'}: {city?.name[locale]}</li>
            <li>{locale === 'es' ? 'Ubicacion' : 'Location'}: {stadium.coordinates.lat.toFixed(2)}N, {Math.abs(stadium.coordinates.lng).toFixed(2)}W</li>
          </ul>
          <p className="mt-2 text-xs text-muted">
            {locale === 'es' ? 'Fuente: FIFA.com, sitio oficial del estadio' : 'Source: FIFA.com, official stadium site'}
          </p>
        </aside>

        {sectionKeys.map((key) => {
          const qh = questionHeaders[key]
          const titleOverride = qh ? qh[locale].replace('{stadiumName}', stadium.name[locale]) : undefined
          return (
            <StadiumSection
              key={key}
              section={stadium.content[key]}
              lang={locale}
              id={sectionIds[key]}
              titleOverride={titleOverride}
            />
          )
        })}

        <StadiumFAQ faqs={stadium.content.faq} lang={locale} />

        <section className="mx-auto max-w-prose">
          <h2 className="text-2xl font-bold md:text-3xl">{sourcesLabel}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            {stadium.content.sources.map((source) => (
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
            {lastUpdatedLabel}: {stadium.lastUpdated}
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
