import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { buildArticleJsonLd, buildJsonLdScript } from '@/lib/jsonld'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { getMatches, getScheduleDisclaimer, getScheduleLastUpdated } from '@/lib/content/schedule'
import { MatchCalendar } from '@/components/schedule/MatchCalendar'
import type { Locale } from '@/lib/content/schemas'

// ISR: re-fetch every hour to pick up FIFA schedule updates
export const revalidate = 3600

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

  const title =
    locale === 'es' ? 'Calendario de Partidos - Mundial 2026' : 'Match Schedule - World Cup 2026'
  const description =
    locale === 'es'
      ? 'Calendario completo de partidos del Mundial 2026. Filtra por grupo, ciudad o fecha para encontrar los partidos que te interesan. 48 partidos de fase de grupos.'
      : 'Complete FIFA World Cup 2026 match schedule. Filter by group, city, or date to find the matches you care about. 48 group stage matches across 16 host cities.'
  const path = `/${locale}/calendario`

  return buildPageMetadata({
    title,
    description,
    lang: locale,
    path,
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/calendario`,
        en: `${SITE_URL}/en/calendario`,
        'x-default': `${SITE_URL}/es/calendario`,
      },
    },
  })
}

export default async function CalendarioPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale

  const dict = await getDictionary(locale)
  const path = `/${lang}/calendario`
  const canonicalUrl = `${SITE_URL}${path}`

  const title =
    locale === 'es' ? 'Calendario de Partidos - Mundial 2026' : 'Match Schedule - World Cup 2026'
  const description =
    locale === 'es'
      ? 'Calendario completo de partidos del Mundial 2026. Filtra por grupo, ciudad o fecha para encontrar los partidos que te interesan. 48 partidos de fase de grupos.'
      : 'Complete FIFA World Cup 2026 match schedule. Filter by group, city, or date to find the matches you care about. 48 group stage matches across 16 host cities.'

  const breadcrumbs = generateBreadcrumbs(path, locale, dict.breadcrumbs, title)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)
  const articleJsonLd = buildArticleJsonLd({
    headline: title,
    description,
    url: canonicalUrl,
    dateModified: getScheduleLastUpdated(),
    lang: locale,
  })

  // SportsEvent JSON-LD for the FIFA World Cup 2026 tournament
  const sportsEventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'FIFA World Cup 2026',
    startDate: '2026-06-11',
    endDate: '2026-07-19',
    location: {
      '@type': 'Place',
      name: 'Mexico, United States, Canada',
    },
    organizer: {
      '@type': 'Organization',
      name: 'FIFA',
    },
    url: 'https://www.fifa.com/worldcup',
  }

  const matches = getMatches()
  const disclaimer = getScheduleDisclaimer()
  const lastUpdated = getScheduleLastUpdated()

  const directAnswerLabel =
    locale === 'es'
      ? 'Este calendario muestra los 48 partidos de la fase de grupos del Mundial 2026. Los partidos se celebran del 11 de junio al 26 de junio de 2026 en 16 estadios de Mexico, Estados Unidos y Canada. Usa los filtros para encontrar partidos por grupo (A-H), ciudad sede o fecha.'
      : 'This schedule shows all 48 group stage matches of the 2026 World Cup. Matches take place from June 11 to June 26, 2026 across 16 stadiums in Mexico, the United States, and Canada. Use the filters to find matches by group (A-H), host city, or date.'

  const lastUpdatedLabel = locale === 'es' ? 'Ultima actualizacion' : 'Last updated'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLdScript(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLdScript(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLdScript(sportsEventJsonLd) }}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mx-auto max-w-4xl py-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
          <p className="mt-4 leading-relaxed text-muted max-w-prose">{directAnswerLabel}</p>
        </header>

        {/* Disclaimer box */}
        <p className="text-sm text-muted border border-border rounded p-3 mb-4">{disclaimer}</p>

        {/* Last updated */}
        <p className="text-xs text-muted mb-6">
          {lastUpdatedLabel}: {lastUpdated}
        </p>

        {/* Client-side filterable match calendar */}
        <MatchCalendar matches={matches} lang={locale} />
      </div>
    </>
  )
}
