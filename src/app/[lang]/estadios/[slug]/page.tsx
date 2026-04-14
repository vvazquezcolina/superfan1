import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStadium, getStadiumSlugs, getStadiums } from '@/lib/content/stadiums'
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
import { TableOfContents, type TocItem } from '@/components/layout/TableOfContents'
import { AirportTransfers } from '@/components/affiliate/AirportTransfers'
import { StadiumTickets } from '@/components/affiliate/StadiumTickets'
import { CITY_IATA } from '@/lib/travelpayouts/flights'
import type { Locale } from '@/lib/content/schemas'
import { toContentLocale } from '@/lib/content/locale'
import {
  Plane, Armchair, Hotel, Accessibility, Calendar, HelpCircle,
  ExternalLink, ChevronLeft, ChevronRight, MapPin, Building2, Users
} from 'lucide-react'

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
  const contentLocale: Locale = toContentLocale(lang)
  const stadium = getStadium(slug, lang)
  if (!stadium) return {}

  const overview = stadium.content.overview[contentLocale]
  const description = overview.length > 155 ? overview.slice(0, 152) + '...' : overview

  const { pathTranslations } = await import('@/lib/i18n')
  const section = pathTranslations.estadios[lang as import('@/app/[lang]/dictionaries').Locale] ?? 'stadiums'
  return buildPageMetadata({
    title: stadium.name[contentLocale],
    description,
    lang: contentLocale,
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

const sectionIcons: Record<string, React.ReactNode> = {
  gettingThere: <Plane className="h-3.5 w-3.5" />,
  seatingGuide: <Armchair className="h-3.5 w-3.5" />,
  nearbyHotels: <Hotel className="h-3.5 w-3.5" />,
  accessibility: <Accessibility className="h-3.5 w-3.5" />,
  matchSchedule: <Calendar className="h-3.5 w-3.5" />,
}

const questionHeaders: Record<string, Record<string, string>> = {
  gettingThere: { es: '¿Cómo llegar al {stadiumName}?', en: 'How to get to {stadiumName}?' },
  seatingGuide: { es: '¿Cómo son los asientos en el {stadiumName}?', en: 'What are the seats like at {stadiumName}?' },
  nearbyHotels: { es: '¿Dónde hospedarse cerca del {stadiumName}?', en: 'Where to stay near {stadiumName}?' },
  accessibility: { es: '¿Es accesible el {stadiumName}?', en: 'Is {stadiumName} accessible?' },
  matchSchedule: { es: '¿Qué partidos se juegan en el {stadiumName}?', en: 'What matches are played at {stadiumName}?' },
}

export default async function StadiumPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const stadium = getStadium(slug, lang)
  if (!stadium) notFound()

  const locale = lang as import('@/app/[lang]/dictionaries').Locale
  const contentLocale: Locale = toContentLocale(lang)
  const dict = await getDictionary(locale)
  const { pathTranslations } = await import('@/lib/i18n')
  const section = pathTranslations.estadios[locale] ?? 'stadiums'
  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/estadios/${slug}`,
    contentLocale,
    dict.breadcrumbs,
    stadium.name[contentLocale],
  )
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const city = getCityById(stadium.city)
  const cityIata = CITY_IATA[stadium.city]

  const canonicalUrl = `https://www.superfaninfo.com/${lang}/${section}/${slug}`
  const stadiumJsonLd = buildStadiumJsonLd(stadium, city?.name[contentLocale] ?? '', contentLocale)
  const faqJsonLd = buildFAQPageJsonLd(stadium.content.faq, contentLocale)
  const articleJsonLd = buildArticleJsonLd({
    headline: stadium.name[contentLocale],
    description: stadium.content.overview[contentLocale],
    url: canonicalUrl,
    dateModified: stadium.lastUpdated,
    lang: contentLocale,
  })

  const sourcesLabel = dict.stadium.sources
  const backLabel = dict.stadium.backToIndex
  const indexPath = `/${lang}/${section}`
  const lastUpdatedLabel = dict.stadium.lastUpdated

  // Build TOC
  const tocTitle = contentLocale === 'es' ? 'En esta guia' : 'In this guide'
  const tocItems: TocItem[] = sectionKeys.map((key) => {
    const qh = questionHeaders[key]
    const label = qh ? qh[contentLocale].replace('{stadiumName}', stadium.name[contentLocale]) : key
    return { id: sectionIds[key], label, icon: sectionIcons[key] }
  })
  tocItems.push({ id: 'faq', label: dict.stadium.faq, icon: <HelpCircle className="h-3.5 w-3.5" /> })
  tocItems.push({ id: 'fuentes', label: sourcesLabel, icon: <ExternalLink className="h-3.5 w-3.5" /> })

  // Prev/Next stadium navigation
  const allStadiums = getStadiums()
  const currentIndex = allStadiums.findIndex((s) => s.id === stadium.id)
  const prevStadium = currentIndex > 0 ? allStadiums[currentIndex - 1] : null
  const nextStadium = currentIndex < allStadiums.length - 1 ? allStadiums[currentIndex + 1] : null

  // City cross-link
  const citiesPath = pathTranslations.ciudades[locale] ?? 'cities'

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

      <article className="mx-auto max-w-4xl space-y-10 py-6">
        <StadiumHero stadium={stadium} lang={contentLocale} />

        {/* Direct-answer overview */}
        <section className="mx-auto max-w-prose rounded-lg border-l-4 border-primary bg-primary/5 p-6">
          <p className="text-lg font-medium leading-relaxed">
            {stadium.content.overview[contentLocale].split('\n\n')[0]}
          </p>
        </section>

        {/* Key Facts */}
        <aside className="mx-auto max-w-prose rounded-xl bg-white border border-border p-5 shadow-sm">
          <p className="font-bold text-sm uppercase tracking-wide text-muted">
            {contentLocale === 'es' ? 'Datos clave' : 'Key Facts'}
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <span className="text-muted">{contentLocale === 'es' ? 'Capacidad' : 'Capacity'}</span>
                <p className="font-semibold">{stadium.capacity.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <div>
                <span className="text-muted">{contentLocale === 'es' ? 'Ciudad sede' : 'Host city'}</span>
                <p className="font-semibold">{city?.name[contentLocale]}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-primary" />
              <div>
                <span className="text-muted">{contentLocale === 'es' ? 'Coordenadas' : 'Location'}</span>
                <p className="font-semibold">{stadium.coordinates.lat.toFixed(2)}N, {Math.abs(stadium.coordinates.lng).toFixed(2)}W</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Table of Contents */}
        <TableOfContents items={tocItems} title={tocTitle} />

        {/* Content Sections */}
        {sectionKeys.map((key) => {
          const qh = questionHeaders[key]
          const titleOverride = qh ? qh[contentLocale].replace('{stadiumName}', stadium.name[contentLocale]) : undefined
          return (
            <React.Fragment key={key}>
              <StadiumSection
                section={stadium.content[key]}
                lang={contentLocale}
                id={sectionIds[key]}
                titleOverride={titleOverride}
              />
              {key === 'gettingThere' && cityIata && (
                <AirportTransfers
                  fromLabel={`${cityIata} (${city?.name[contentLocale] ?? ''})`}
                  fromIata={cityIata}
                  toName={stadium.name[contentLocale]}
                  lang={contentLocale}
                />
              )}
              {key === 'seatingGuide' && (
                <StadiumTickets
                  stadiumName={stadium.name[contentLocale]}
                  cityName={city?.name[contentLocale] ?? ''}
                  lang={contentLocale}
                />
              )}
            </React.Fragment>
          )
        })}

        {/* City cross-link */}
        {city && (
          <section className="mx-auto max-w-prose">
            <Link
              href={`/${lang}/${citiesPath}/${city.slugs[contentLocale]}`}
              className="group flex items-center gap-4 rounded-xl border border-border p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {contentLocale === 'es' ? 'Guia de la ciudad sede' : 'Host city guide'}
                </p>
                <p className="text-lg font-bold group-hover:text-primary transition-colors">
                  {city.name[contentLocale]}
                </p>
                <p className="text-sm text-muted">
                  {contentLocale === 'es' ? 'Transporte, hospedaje, comida y mas' : 'Transport, hotels, food & more'}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted group-hover:text-primary transition-colors" />
            </Link>
          </section>
        )}

        <div id="faq">
          <StadiumFAQ faqs={stadium.content.faq} lang={contentLocale} />
        </div>

        <section id="fuentes" className="mx-auto max-w-prose scroll-mt-20">
          <h2 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
            <ExternalLink className="h-5 w-5 text-primary" />
            {sourcesLabel}
          </h2>
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

        {/* Prev/Next Navigation */}
        <nav className="mx-auto max-w-prose grid grid-cols-2 gap-4 border-t border-border pt-6">
          {prevStadium ? (
            <Link
              href={`/${lang}/${section}/${prevStadium.slugs[contentLocale]}`}
              className="group flex items-center gap-2 rounded-lg border border-border p-4 transition-all hover:border-primary/50 hover:shadow-sm"
            >
              <ChevronLeft className="h-5 w-5 text-muted group-hover:text-primary" />
              <div className="text-left">
                <span className="text-xs text-muted">{contentLocale === 'es' ? 'Anterior' : 'Previous'}</span>
                <p className="text-sm font-semibold group-hover:text-primary transition-colors">{prevStadium.name[contentLocale]}</p>
              </div>
            </Link>
          ) : <div />}
          {nextStadium ? (
            <Link
              href={`/${lang}/${section}/${nextStadium.slugs[contentLocale]}`}
              className="group flex items-center justify-end gap-2 rounded-lg border border-border p-4 transition-all hover:border-primary/50 hover:shadow-sm"
            >
              <div className="text-right">
                <span className="text-xs text-muted">{contentLocale === 'es' ? 'Siguiente' : 'Next'}</span>
                <p className="text-sm font-semibold group-hover:text-primary transition-colors">{nextStadium.name[contentLocale]}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted group-hover:text-primary" />
            </Link>
          ) : <div />}
        </nav>

        <footer className="mx-auto max-w-prose border-t border-border pt-6">
          <p className="text-sm text-muted">
            {lastUpdatedLabel}: {stadium.lastUpdated}
          </p>
          <Link
            href={indexPath}
            className="mt-4 inline-flex items-center gap-1 text-primary underline hover:text-primary/80"
          >
            <ChevronLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </footer>
      </article>
    </>
  )
}
