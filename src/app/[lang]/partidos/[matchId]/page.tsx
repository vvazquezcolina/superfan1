import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, Building2, Clock, Users, ChevronLeft, Trophy } from 'lucide-react'
import { getMatches } from '@/lib/content/schedule'
import { getCityById } from '@/lib/content/cities'
import { getStadiumById } from '@/lib/content/stadiums'
import { getMatchDayGuide } from '@/lib/content/programmatic'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { buildJsonLdScript } from '@/lib/jsonld'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { FlightPrices } from '@/components/affiliate/FlightPrices'
import { BookingWidget } from '@/components/affiliate/BookingWidget'
import { AirportTransfers } from '@/components/affiliate/AirportTransfers'
import { CityActivities } from '@/components/affiliate/CityActivities'
import { CITY_IATA } from '@/lib/travelpayouts/flights'
import type { Locale } from '@/lib/content/schemas'
import { toContentLocale } from '@/lib/content/locale'

const SITE_URL = 'https://www.superfaninfo.com'

// ISR: update daily to pick up schedule changes
export const revalidate = 86400

const LOCALES = ['es', 'en', 'pt', 'fr', 'de', 'ar'] as const

export async function generateStaticParams() {
  const matches = getMatches()
  return matches.flatMap((match) =>
    LOCALES.map((lang) => ({ lang, matchId: match.id })),
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string, contentLocale: Locale): string {
  try {
    const date = new Date(dateStr + 'T12:00:00Z')
    const locale = contentLocale === 'es' ? 'es-419' : 'en-US'
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    })
  } catch {
    return dateStr
  }
}

function formatDateShort(dateStr: string, contentLocale: Locale): string {
  try {
    const date = new Date(dateStr + 'T12:00:00Z')
    const locale = contentLocale === 'es' ? 'es-419' : 'en-US'
    return date.toLocaleDateString(locale, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })
  } catch {
    return dateStr
  }
}

function phaseLabel(phase: string, contentLocale: Locale): string {
  const labels: Record<string, { es: string; en: string }> = {
    group_stage: { es: 'Fase de grupos', en: 'Group Stage' },
    round_of_32: { es: 'Ronda de 32', en: 'Round of 32' },
    round_of_16: { es: 'Octavos de final', en: 'Round of 16' },
    quarter_final: { es: 'Cuartos de final', en: 'Quarter-finals' },
    semi_final: { es: 'Semifinales', en: 'Semi-finals' },
    third_place: { es: 'Tercer lugar', en: 'Third Place' },
    final: { es: 'Final', en: 'Final' },
  }
  return labels[phase]?.[contentLocale] ?? phase
}

// ---------------------------------------------------------------------------
// generateMetadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; matchId: string }>
}): Promise<Metadata> {
  const { lang, matchId } = await params
  if (!hasLocale(lang)) return {}

  const contentLocale: Locale = toContentLocale(lang)
  const match = getMatches().find((m) => m.id === matchId)
  if (!match) return {}

  const homeTeam = match.homeTeam[contentLocale]
  const awayTeam = match.awayTeam[contentLocale]
  const dateFormatted = formatDateShort(match.date, contentLocale)

  const title =
    contentLocale === 'es'
      ? `${homeTeam} vs ${awayTeam} — ${dateFormatted} | SuperFan`
      : `${homeTeam} vs ${awayTeam} — ${dateFormatted} | SuperFan`

  const description =
    contentLocale === 'es'
      ? `Partido ${homeTeam} vs ${awayTeam} el ${dateFormatted} en ${match.venue}, ${match.cityName.es}. ${phaseLabel(match.phase, 'es')}${match.group ? ` Grupo ${match.group}` : ''}. Guia completa: sede, transporte y dia de partido.`
      : `Match ${homeTeam} vs ${awayTeam} on ${dateFormatted} at ${match.venue}, ${match.cityName.en}. ${phaseLabel(match.phase, 'en')}${match.group ? ` Group ${match.group}` : ''}. Full guide: venue, transport and match day tips.`

  return buildPageMetadata({
    title,
    description,
    lang: contentLocale,
    path: `/${lang}/partidos/${matchId}`,
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/partidos/${matchId}`,
        en: `${SITE_URL}/en/partidos/${matchId}`,
        'x-default': `${SITE_URL}/es/partidos/${matchId}`,
      },
    },
  })
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function MatchPage({
  params,
}: {
  params: Promise<{ lang: string; matchId: string }>
}) {
  const { lang, matchId } = await params
  if (!hasLocale(lang)) notFound()

  const locale = lang as import('@/app/[lang]/dictionaries').Locale
  const contentLocale: Locale = toContentLocale(lang)

  const match = getMatches().find((m) => m.id === matchId)
  if (!match) notFound()

  const dict = await getDictionary(locale)

  // Resolve related entities
  const city = getCityById(match.city)
  const stadium = city ? getStadiumById(city.stadium) : undefined
  const matchDayGuide = getMatchDayGuide(match.city)

  const homeTeam = match.homeTeam[contentLocale]
  const awayTeam = match.awayTeam[contentLocale]
  const cityName = match.cityName[contentLocale]
  const dateFormatted = formatDate(match.date, contentLocale)
  const dateShort = formatDateShort(match.date, contentLocale)

  const matchTitle = `${homeTeam} vs ${awayTeam}`
  const canonicalUrl = `${SITE_URL}/${lang}/partidos/${matchId}`

  // Path translations for cross-links
  const citiesPath = contentLocale === 'es' ? 'ciudades' : 'cities'
  const stadiumsPath = contentLocale === 'es' ? 'estadios' : 'stadiums'
  const matchDayPath = contentLocale === 'es' ? 'dia-de-partido' : 'dia-de-partido'
  const calendarioLabel = contentLocale === 'es' ? 'Calendario' : 'Schedule'

  // Breadcrumbs: Home > Calendario > Match
  const breadcrumbs = [
    { label: dict.breadcrumbs.home, href: `/${lang}` },
    { label: calendarioLabel, href: `/${lang}/calendario` },
    { label: matchTitle, href: `/${lang}/partidos/${matchId}` },
  ]

  // SportsEvent JSON-LD
  const sportsEventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${homeTeam} vs ${awayTeam} — FIFA World Cup 2026`,
    startDate: match.time !== 'TBD' ? `${match.date}T${match.time}` : match.date,
    location: {
      '@type': 'StadiumOrArena',
      name: match.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: cityName,
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'FIFA',
    },
    competitor: [
      { '@type': 'SportsTeam', name: homeTeam },
      { '@type': 'SportsTeam', name: awayTeam },
    ],
    superEvent: {
      '@type': 'SportsEvent',
      name: 'FIFA World Cup 2026',
      startDate: '2026-06-11',
      endDate: '2026-07-19',
    },
    url: canonicalUrl,
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLdScript(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLdScript(sportsEventJsonLd) }}
      />

      <Breadcrumbs items={breadcrumbs} />

      <article className="mx-auto max-w-4xl space-y-8 py-6">

        {/* Hero */}
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent px-8 py-12 text-center">
          {/* Phase / group badge */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <Trophy className="h-3 w-3" />
              {phaseLabel(match.phase, contentLocale)}
              {match.group && ` — ${contentLocale === 'es' ? 'Grupo' : 'Group'} ${match.group}`}
            </span>
            {match.matchday && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/40 px-3 py-1 text-xs font-medium text-muted">
                {contentLocale === 'es' ? `Jornada ${match.matchday}` : `Matchday ${match.matchday}`}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            {homeTeam}
            <span className="mx-3 font-light text-muted">vs</span>
            {awayTeam}
          </h1>

          {/* Info pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm">
              <Calendar className="h-4 w-4 text-primary" />
              {dateFormatted}
            </span>
            {match.time !== 'TBD' ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm">
                <Clock className="h-4 w-4 text-primary" />
                {match.time}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm">
                <Clock className="h-4 w-4 text-muted" />
                {contentLocale === 'es' ? 'Hora por confirmar' : 'Time TBC'}
              </span>
            )}
            <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm">
              <Building2 className="h-4 w-4 text-primary" />
              {match.venue}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm">
              <MapPin className="h-4 w-4 text-primary" />
              {cityName}
            </span>
          </div>
        </header>

        {/* Direct-answer summary block */}
        <section className="rounded-lg border-l-4 border-primary bg-primary/5 p-6">
          <p className="text-base font-medium leading-relaxed">
            {contentLocale === 'es'
              ? `${homeTeam} se enfrentará a ${awayTeam} el ${dateShort} en ${match.venue}, ${cityName}. Este partido corresponde a la ${phaseLabel(match.phase, 'es').toLowerCase()}${match.group ? ` del Grupo ${match.group}` : ''} del Mundial FIFA 2026.`
              : `${homeTeam} will face ${awayTeam} on ${dateShort} at ${match.venue}, ${cityName}. This match is part of the ${phaseLabel(match.phase, 'en').toLowerCase()}${match.group ? ` Group ${match.group}` : ''} of the 2026 FIFA World Cup.`}
          </p>
        </section>

        {/* Match facts card */}
        <aside className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <p className="mb-4 text-xs font-bold uppercase tracking-wide text-muted">
            {contentLocale === 'es' ? 'Datos del partido' : 'Match details'}
          </p>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <div>
                <dt className="text-xs text-muted">{contentLocale === 'es' ? 'Fecha' : 'Date'}</dt>
                <dd className="text-sm font-semibold">{dateFormatted}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <div>
                <dt className="text-xs text-muted">{contentLocale === 'es' ? 'Hora' : 'Time'}</dt>
                <dd className="text-sm font-semibold">
                  {match.time !== 'TBD' ? match.time : (contentLocale === 'es' ? 'Por confirmar' : 'To be confirmed')}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <div>
                <dt className="text-xs text-muted">{contentLocale === 'es' ? 'Estadio' : 'Stadium'}</dt>
                <dd className="text-sm font-semibold">{match.venue}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <div>
                <dt className="text-xs text-muted">{contentLocale === 'es' ? 'Ciudad' : 'City'}</dt>
                <dd className="text-sm font-semibold">{cityName}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Trophy className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <div>
                <dt className="text-xs text-muted">{contentLocale === 'es' ? 'Fase' : 'Phase'}</dt>
                <dd className="text-sm font-semibold">
                  {phaseLabel(match.phase, contentLocale)}
                  {match.group && ` — ${contentLocale === 'es' ? 'Grupo' : 'Group'} ${match.group}`}
                </dd>
              </div>
            </div>
            {stadium && (
              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <div>
                  <dt className="text-xs text-muted">{contentLocale === 'es' ? 'Capacidad' : 'Capacity'}</dt>
                  <dd className="text-sm font-semibold">{stadium.capacity.toLocaleString()}</dd>
                </div>
              </div>
            )}
          </dl>
        </aside>

        {/* Cross-link cards */}
        <section>
          <h2 className="mb-4 text-xl font-bold">
            {contentLocale === 'es' ? 'Guias relacionadas' : 'Related guides'}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* City guide */}
            {city && (
              <Link
                href={`/${lang}/${citiesPath}/${city.slugs[contentLocale]}`}
                className="group flex items-center gap-4 rounded-xl border border-border p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    {contentLocale === 'es' ? 'Ciudad sede' : 'Host city'}
                  </p>
                  <p className="truncate text-base font-bold group-hover:text-primary transition-colors">
                    {city.name[contentLocale]}
                  </p>
                  <p className="text-xs text-muted">
                    {contentLocale === 'es' ? 'Guia completa de la ciudad' : 'Complete city guide'}
                  </p>
                </div>
              </Link>
            )}

            {/* Stadium guide */}
            {stadium && (
              <Link
                href={`/${lang}/${stadiumsPath}/${stadium.slugs[contentLocale]}`}
                className="group flex items-center gap-4 rounded-xl border border-border p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    {contentLocale === 'es' ? 'Estadio sede' : 'Host stadium'}
                  </p>
                  <p className="truncate text-base font-bold group-hover:text-primary transition-colors">
                    {stadium.name[contentLocale]}
                  </p>
                  <p className="text-xs text-muted">
                    {contentLocale === 'es'
                      ? `Capacidad: ${stadium.capacity.toLocaleString()}`
                      : `Capacity: ${stadium.capacity.toLocaleString()}`}
                  </p>
                </div>
              </Link>
            )}

            {/* Match day guide */}
            {matchDayGuide && (
              <Link
                href={`/${lang}/${matchDayPath}/${matchDayGuide.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-border p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    {contentLocale === 'es' ? 'Dia de partido' : 'Match day guide'}
                  </p>
                  <p className="truncate text-base font-bold group-hover:text-primary transition-colors">
                    {contentLocale === 'es'
                      ? `Guia del dia de partido en ${cityName}`
                      : `Match day guide for ${cityName}`}
                  </p>
                  <p className="text-xs text-muted">
                    {contentLocale === 'es'
                      ? 'Transporte, zonas de fans, que llevar'
                      : 'Transport, fan zones, what to bring'}
                  </p>
                </div>
              </Link>
            )}

          </div>
        </section>

        {/* Affiliate monetization stack — high-intent page, the user is
            literally researching attending this match. Show them how to
            get there, where to sleep, and how to book transfers. */}
        {city && (
          <section>
            <h2 className="mb-4 text-xl font-bold">
              {contentLocale === 'es'
                ? `Planea tu viaje a ${cityName}`
                : `Plan your trip to ${cityName}`}
            </h2>
            <FlightPrices
              cityId={city.id}
              cityName={city.name[contentLocale]}
              lang={contentLocale}
            />
            <BookingWidget
              cityName={city.name[contentLocale]}
              citySlug={city.slugs[contentLocale]}
              lang={contentLocale}
              dict={dict.affiliate}
            />
            {stadium && CITY_IATA[city.id] && (
              <AirportTransfers
                fromLabel={`${CITY_IATA[city.id]} (${city.name[contentLocale]})`}
                fromIata={CITY_IATA[city.id]}
                toName={stadium.name[contentLocale]}
                lang={contentLocale}
              />
            )}
            <CityActivities
              cityName={city.name[contentLocale]}
              citySlug={city.slugs[contentLocale]}
              lang={contentLocale}
            />
          </section>
        )}

        {/* Disclaimer */}
        <p className="rounded-lg border border-border bg-muted/10 p-4 text-xs text-muted">
          {contentLocale === 'es'
            ? 'Equipos, fechas y horarios sujetos a confirmacion oficial. Fuente: FIFA.com. Este sitio no esta afiliado con la FIFA ni con organizacion oficial alguna del Mundial.'
            : 'Teams, dates and times subject to official confirmation. Source: FIFA.com. This site is not affiliated with FIFA or any official World Cup organization.'}
        </p>

        {/* Back to schedule */}
        <footer className="flex items-center justify-between border-t border-border pt-6">
          <Link
            href={`/${lang}/calendario`}
            className="inline-flex items-center gap-1.5 text-sm text-primary underline hover:text-primary/80"
          >
            <ChevronLeft className="h-4 w-4" />
            {contentLocale === 'es' ? 'Volver al calendario' : 'Back to schedule'}
          </Link>
          <p className="text-xs text-muted">ID: {match.id}</p>
        </footer>
      </article>
    </>
  )
}
