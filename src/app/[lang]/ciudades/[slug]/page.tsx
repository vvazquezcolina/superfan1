import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCity, getCitySlugs, getCities } from '@/lib/content/cities'
import { getStadiumById } from '@/lib/content/stadiums'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildAlternates } from '@/lib/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { buildPlaceJsonLd, buildFAQPageJsonLd, buildArticleJsonLd } from '@/lib/jsonld'
import { CityHero } from '@/components/city/CityHero'
import { CitySection } from '@/components/city/CitySection'
import { CityFAQ } from '@/components/city/CityFAQ'
import { BookingWidget } from '@/components/affiliate/BookingWidget'
import { FlightPrices } from '@/components/affiliate/FlightPrices'
import { CityActivities } from '@/components/affiliate/CityActivities'
import { CityQuickFacts } from '@/components/city/CityQuickFacts'
import { StickyQuickBook } from '@/components/affiliate/StickyQuickBook'
import { WhatsAppShare } from '@/components/engagement/WhatsAppShare'
import {
  buildAviasalesUrl,
  CITY_IATA,
  getCheapestFlightToCity,
} from '@/lib/travelpayouts/flights'
import {
  buildKlookHotelsUrl,
  buildWelcomePickupsSearchUrl,
} from '@/lib/travelpayouts/partners'
import { getMatchesByCity } from '@/lib/content/schedule'
import { TableOfContents, type TocItem } from '@/components/layout/TableOfContents'
import type { Locale } from '@/lib/content/schemas'
import { toContentLocale } from '@/lib/content/locale'
import {
  Plane, Bus, MapPin, Utensils, Shield, Cloud, BookOpen,
  HelpCircle, ExternalLink, ChevronLeft, ChevronRight, Building2
} from 'lucide-react'

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
  const contentLocale: Locale = toContentLocale(lang)
  const city = getCity(slug, lang)
  if (!city) return {}

  const overview = city.content.overview[contentLocale]
  const description = overview.length > 155 ? overview.slice(0, 152) + '...' : overview

  const { pathTranslations } = await import('@/lib/i18n')
  const section = pathTranslations.ciudades[lang as import('@/app/[lang]/dictionaries').Locale] ?? 'cities'
  return buildPageMetadata({
    title: city.name[contentLocale],
    description,
    lang: contentLocale,
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

const sectionIcons: Record<string, React.ReactNode> = {
  gettingThere: <Plane className="h-3.5 w-3.5" />,
  gettingAround: <Bus className="h-3.5 w-3.5" />,
  neighborhoods: <MapPin className="h-3.5 w-3.5" />,
  foodAndDrink: <Utensils className="h-3.5 w-3.5" />,
  safety: <Shield className="h-3.5 w-3.5" />,
  weather: <Cloud className="h-3.5 w-3.5" />,
  culturalContext: <BookOpen className="h-3.5 w-3.5" />,
}

const questionHeaders: Record<string, Record<string, string>> = {
  gettingThere: { es: '¿Cómo llegar a {cityName}?', en: 'How to get to {cityName}?' },
  gettingAround: { es: '¿Cómo moverse en {cityName}?', en: 'How to get around {cityName}?' },
  neighborhoods: { es: '¿Dónde hospedarse en {cityName}?', en: 'Where to stay in {cityName}?' },
  foodAndDrink: { es: '¿Qué comer y beber en {cityName}?', en: 'What to eat and drink in {cityName}?' },
  safety: { es: '¿Es seguro visitar {cityName}?', en: 'Is {cityName} safe to visit?' },
  weather: { es: '¿Cómo es el clima en {cityName} durante el Mundial?', en: 'What is the weather like in {cityName} during the World Cup?' },
  culturalContext: { es: '¿Qué debe saber un fan latinoamericano sobre {cityName}?', en: 'What should a Latin American fan know about {cityName}?' },
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const city = getCity(slug, lang)
  if (!city) notFound()

  const locale = lang as import('@/app/[lang]/dictionaries').Locale
  const contentLocale: Locale = toContentLocale(lang)
  const dict = await getDictionary(locale)
  const { pathTranslations } = await import('@/lib/i18n')
  const section = pathTranslations.ciudades[locale] ?? 'cities'
  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/ciudades/${slug}`,
    contentLocale,
    dict.breadcrumbs,
    city.name[contentLocale],
  )
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const canonicalUrl = `https://www.superfaninfo.com/${lang}/${section}/${slug}`
  const placeJsonLd = buildPlaceJsonLd(city, contentLocale)
  const faqJsonLd = buildFAQPageJsonLd(city.content.faq, contentLocale)
  const articleJsonLd = buildArticleJsonLd({
    headline: city.name[contentLocale],
    description: city.content.overview[contentLocale],
    url: canonicalUrl,
    dateModified: city.lastUpdated,
    lang: contentLocale,
  })

  const sourcesLabel = dict.city.sources
  const backLabel = dict.city.backToIndex
  const indexPath = `/${lang}/${section}`
  const lastUpdatedLabel = dict.city.lastUpdated

  // Build TOC items
  const tocTitle = contentLocale === 'es' ? 'En esta guia' : 'In this guide'
  const tocItems: TocItem[] = sectionKeys.map((key) => {
    const qh = questionHeaders[key]
    const label = qh ? qh[contentLocale].replace('{cityName}', city.name[contentLocale]) : key
    return { id: sectionIds[key], label, icon: sectionIcons[key] }
  })
  tocItems.push({ id: 'faq', label: dict.city.faq, icon: <HelpCircle className="h-3.5 w-3.5" /> })
  tocItems.push({ id: 'fuentes', label: sourcesLabel, icon: <ExternalLink className="h-3.5 w-3.5" /> })

  // Prev/Next city navigation
  const allCities = getCities()
  const currentIndex = allCities.findIndex((c) => c.id === city.id)
  const prevCity = currentIndex > 0 ? allCities[currentIndex - 1] : null
  const nextCity = currentIndex < allCities.length - 1 ? allCities[currentIndex + 1] : null

  // Stadium cross-link
  const stadium = getStadiumById(city.stadium)
  const stadiumsPath = pathTranslations.estadios[locale] ?? 'stadiums'

  // Pull cheapest cached flight from MEX for the LLM-citable Quick Facts block.
  // Network-cached for 24h via flights.ts, so this adds <200ms per build.
  const cityIata = CITY_IATA[city.id]
  const cityMatches = getMatchesByCity(city.id)
  const cheapestFromMex = await getCheapestFlightToCity('MEX', city.id)
  const countryName: Record<string, { es: string; en: string }> = {
    mexico: { es: 'México', en: 'Mexico' },
    usa: { es: 'Estados Unidos', en: 'United States' },
    canada: { es: 'Canadá', en: 'Canada' },
  }
  const countryDisplay =
    countryName[city.country]?.[contentLocale === 'es' ? 'es' : 'en'] ??
    city.country

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

      {/* Sticky quick-book bar — appears after scroll, one-tap CTAs */}
      <StickyQuickBook
        flightHref={
          cityIata
            ? buildAviasalesUrl('MEX', cityIata, '2026-06-11', '2026-06-18')
            : undefined
        }
        hotelHref={buildKlookHotelsUrl(city.name[contentLocale], contentLocale)}
        transferHref={buildWelcomePickupsSearchUrl(city.name[contentLocale])}
        cityName={city.name[contentLocale]}
        lang={contentLocale}
      />

      <article className="mx-auto max-w-4xl space-y-10 py-6">
        <CityHero city={city} lang={contentLocale} />

        {/* Direct-answer overview block */}
        <section className="mx-auto max-w-prose rounded-lg border-l-4 border-primary bg-primary/5 p-6">
          <p className="text-lg font-medium leading-relaxed">
            {city.content.overview[contentLocale].split('\n\n')[0]}
          </p>
        </section>

        {/* Key Facts */}
        <aside className="mx-auto max-w-prose rounded-xl bg-white border border-border p-5 shadow-sm">
          <p className="font-bold text-sm uppercase tracking-wide text-muted">
            {contentLocale === 'es' ? 'Datos clave' : 'Key Facts'}
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-primary" />
              <div>
                <span className="text-muted">{contentLocale === 'es' ? 'Estadio' : 'Stadium'}</span>
                <p className="font-semibold">{stadium?.name[contentLocale] ?? city.stadium}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <div>
                <span className="text-muted">{contentLocale === 'es' ? 'Pais' : 'Country'}</span>
                <p className="font-semibold">{contentLocale === 'es' ? (city.country === 'mexico' ? 'Mexico' : city.country === 'usa' ? 'Estados Unidos' : 'Canada') : (city.country === 'mexico' ? 'Mexico' : city.country === 'usa' ? 'United States' : 'Canada')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Cloud className="h-4 w-4 text-primary" />
              <div>
                <span className="text-muted">{contentLocale === 'es' ? 'Coordenadas' : 'Location'}</span>
                <p className="font-semibold">{city.coordinates.lat.toFixed(2)}N, {Math.abs(city.coordinates.lng).toFixed(2)}W</p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">
            {contentLocale === 'es' ? 'Fuente: FIFA.com, sitios oficiales de turismo' : 'Source: FIFA.com, official tourism sites'}
          </p>
        </aside>

        {/* LLM-citable Quick Facts block */}
        <CityQuickFacts
          cityName={city.name[contentLocale]}
          countryName={countryDisplay}
          airportIata={cityIata}
          matchCount={cityMatches.length}
          cheapestFlightUsd={cheapestFromMex?.price}
          stadiumName={stadium?.name[contentLocale]}
          lang={contentLocale}
        />

        {/* Table of Contents */}
        <TableOfContents items={tocItems} title={tocTitle} />

        {/* Content Sections */}
        {sectionKeys.map((key) => {
          const qh = questionHeaders[key]
          const titleOverride = qh ? qh[contentLocale].replace('{cityName}', city.name[contentLocale]) : undefined
          return (
            <React.Fragment key={key}>
              <CitySection
                section={city.content[key]}
                lang={contentLocale}
                id={sectionIds[key]}
                titleOverride={titleOverride}
              />
              {key === 'gettingThere' && (
                <FlightPrices
                  cityId={city.id}
                  cityName={city.name[contentLocale]}
                  lang={contentLocale}
                />
              )}
              {key === 'neighborhoods' && (
                <BookingWidget
                  cityName={city.name[contentLocale]}
                  citySlug={slug}
                  lang={contentLocale}
                  dict={dict.affiliate}
                />
              )}
              {key === 'foodAndDrink' && (
                <CityActivities
                  cityName={city.name[contentLocale]}
                  citySlug={slug}
                  lang={contentLocale}
                />
              )}
            </React.Fragment>
          )
        })}

        {/* Stadium cross-link */}
        {stadium && (
          <section className="mx-auto max-w-prose">
            <Link
              href={`/${lang}/${stadiumsPath}/${stadium.slugs[contentLocale]}`}
              className="group flex items-center gap-4 rounded-xl border border-border p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {contentLocale === 'es' ? 'Estadio sede en esta ciudad' : 'Host stadium in this city'}
                </p>
                <p className="text-lg font-bold group-hover:text-primary transition-colors">
                  {stadium.name[contentLocale]}
                </p>
                <p className="text-sm text-muted">
                  {contentLocale === 'es' ? 'Capacidad' : 'Capacity'}: {stadium.capacity.toLocaleString()}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted group-hover:text-primary transition-colors" />
            </Link>
          </section>
        )}

        <div id="faq">
          <CityFAQ faqs={city.content.faq} lang={contentLocale} />
        </div>

        {/* WhatsApp share — amplifies LATAM distribution */}
        <div className="mx-auto flex max-w-prose justify-center py-2">
          <WhatsAppShare
            url={`https://www.superfaninfo.com/${lang}/${section}/${slug}`}
            title={
              contentLocale === 'es'
                ? `Guía de ${city.name[contentLocale]} para el Mundial 2026`
                : `${city.name[contentLocale]} guide for the 2026 World Cup`
            }
            lang={contentLocale}
          />
        </div>

        <section id="fuentes" className="mx-auto max-w-prose scroll-mt-20">
          <h2 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
            <ExternalLink className="h-5 w-5 text-primary" />
            {sourcesLabel}
          </h2>
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

        {/* Prev/Next Navigation */}
        <nav className="mx-auto max-w-prose grid grid-cols-2 gap-4 border-t border-border pt-6">
          {prevCity ? (
            <Link
              href={`/${lang}/${section}/${prevCity.slugs[contentLocale]}`}
              className="group flex items-center gap-2 rounded-lg border border-border p-4 transition-all hover:border-primary/50 hover:shadow-sm"
            >
              <ChevronLeft className="h-5 w-5 text-muted group-hover:text-primary" />
              <div className="text-left">
                <span className="text-xs text-muted">{contentLocale === 'es' ? 'Anterior' : 'Previous'}</span>
                <p className="text-sm font-semibold group-hover:text-primary transition-colors">{prevCity.name[contentLocale]}</p>
              </div>
            </Link>
          ) : <div />}
          {nextCity ? (
            <Link
              href={`/${lang}/${section}/${nextCity.slugs[contentLocale]}`}
              className="group flex items-center justify-end gap-2 rounded-lg border border-border p-4 transition-all hover:border-primary/50 hover:shadow-sm"
            >
              <div className="text-right">
                <span className="text-xs text-muted">{contentLocale === 'es' ? 'Siguiente' : 'Next'}</span>
                <p className="text-sm font-semibold group-hover:text-primary transition-colors">{nextCity.name[contentLocale]}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted group-hover:text-primary" />
            </Link>
          ) : <div />}
        </nav>

        <footer className="mx-auto max-w-prose border-t border-border pt-6">
          <p className="text-sm text-muted">
            {lastUpdatedLabel}: {city.lastUpdated}
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
