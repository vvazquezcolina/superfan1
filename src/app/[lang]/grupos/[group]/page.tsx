import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTeams } from '@/lib/content/teams'
import { getMatchesByGroup } from '@/lib/content/schedule'
import { getCityById } from '@/lib/content/cities'
import { getStadiumById } from '@/lib/content/stadiums'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { buildItemListJsonLd } from '@/lib/jsonld'
import type { Locale, Team } from '@/lib/content/schemas'
import { toContentLocale } from '@/lib/content/locale'
import { pathTranslations, SITE_URL } from '@/lib/i18n'
import { Users, Trophy, Calendar, MapPin, Building2, ChevronLeft, ChevronRight } from 'lucide-react'

const LOCALES = ['es', 'en', 'pt', 'fr', 'de', 'ar'] as const
const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'] as const

const CONFEDERATION_FLAGS: Record<string, string> = {
  UEFA: '\u{1F1EA}\u{1F1FA}',
  CONMEBOL: '\u{1F30E}',
  CONCACAF: '\u{1F30E}',
  CAF: '\u{1F30D}',
  AFC: '\u{1F30F}',
  OFC: '\u{1F1F3}\u{1F1FF}',
}

const CONFEDERATION_COLORS: Record<string, string> = {
  UEFA: 'border-l-blue-500',
  CONMEBOL: 'border-l-yellow-500',
  CONCACAF: 'border-l-green-500',
  CAF: 'border-l-orange-500',
  AFC: 'border-l-red-500',
  OFC: 'border-l-cyan-500',
}

export async function generateStaticParams() {
  const teams = getTeams()
  const groupSet = new Set<string>()
  for (const team of teams) {
    if (team.group) groupSet.add(team.group)
  }
  // Ensure all expected groups are covered even if some teams lack group assignment
  for (const g of GROUPS) groupSet.add(g)

  const params: Array<{ lang: string; group: string }> = []
  for (const locale of LOCALES) {
    for (const group of groupSet) {
      params.push({ lang: locale, group })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; group: string }>
}): Promise<Metadata> {
  const { lang, group } = await params
  if (!hasLocale(lang)) return {}
  const contentLocale: Locale = toContentLocale(lang)
  const locale = lang as import('@/app/[lang]/dictionaries').Locale

  const groupLabel = contentLocale === 'es' ? 'Grupo' : 'Group'
  const title =
    contentLocale === 'es'
      ? `${groupLabel} ${group} - Mundial 2026 | SuperFan`
      : `${groupLabel} ${group} - World Cup 2026 | SuperFan`
  const description =
    contentLocale === 'es'
      ? `Equipos, partidos, sedes y estadios del Grupo ${group} del Mundial FIFA 2026. Guia completa con calendario de partidos y informacion de viaje.`
      : `Teams, matches, venues, and stadiums in Group ${group} of the FIFA World Cup 2026. Complete guide with match schedule and travel information.`

  const gruposPath = pathTranslations.grupos[locale] ?? 'groups'

  const languages: Record<string, string> = {}
  for (const loc of LOCALES) {
    const locPath = pathTranslations.grupos[loc] ?? 'groups'
    const hreflang =
      loc === 'es' ? 'es-419' :
      loc === 'pt' ? 'pt-BR' :
      loc
    languages[hreflang] = `${SITE_URL}/${loc}/${locPath}/${group}`
  }
  const esPath = pathTranslations.grupos.es ?? 'grupos'
  languages['x-default'] = `${SITE_URL}/es/${esPath}/${group}`

  return buildPageMetadata({
    title,
    description,
    lang: contentLocale,
    path: `/${lang}/${gruposPath}/${group}`,
    alternates: { languages },
  })
}

function TeamCard({
  team,
  lang,
  contentLocale,
  teamsPath,
}: {
  team: Team
  lang: string
  contentLocale: Locale
  teamsPath: string
}) {
  const flag = CONFEDERATION_FLAGS[team.confederation] ?? ''
  const borderColor = CONFEDERATION_COLORS[team.confederation] ?? 'border-l-primary'
  const description = team.description[contentLocale]
  const excerpt = description.length > 80 ? description.slice(0, 77) + '...' : description

  return (
    <Link
      href={`/${lang}/${teamsPath}/${team.slugs[contentLocale]}`}
      className={`group block rounded-lg border border-border border-l-4 ${borderColor} p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5`}
    >
      <div className="flex items-start justify-between gap-1">
        <h3 className="text-base font-bold transition-colors group-hover:text-primary">
          {flag} {team.name[contentLocale]}
        </h3>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
      <p className="mt-1 text-xs text-muted">{team.confederation}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{excerpt}</p>
    </Link>
  )
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ lang: string; group: string }>
}) {
  const { lang, group } = await params
  if (!hasLocale(lang)) notFound()

  // Validate group
  const upperGroup = group.toUpperCase()
  if (!GROUPS.includes(upperGroup as (typeof GROUPS)[number])) notFound()

  const locale = lang as import('@/app/[lang]/dictionaries').Locale
  const contentLocale: Locale = toContentLocale(lang)
  const dict = await getDictionary(locale)

  const allTeams = getTeams()
  const groupTeams = allTeams.filter((t) => t.group === upperGroup)
  const groupMatches = getMatchesByGroup(upperGroup)

  const teamsPath = pathTranslations.equipos[locale] ?? 'teams'
  const citiesPath = pathTranslations.ciudades[locale] ?? 'cities'
  const stadiumsPath = pathTranslations.estadios[locale] ?? 'stadiums'
  const gruposPath = pathTranslations.grupos[locale] ?? 'groups'
  const equiposIndexPath = pathTranslations.equipos[locale] ?? 'teams'

  // Derive unique cities and stadiums from matches
  const cityIds = [...new Set(groupMatches.map((m) => m.city))]
  const venueNames = [...new Set(groupMatches.map((m) => m.venue))]

  const cities = cityIds
    .map((id) => getCityById(id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined)

  // Derive stadiums via cities
  const stadiums = cities
    .map((c) => getStadiumById(c.stadium))
    .filter((s): s is NonNullable<typeof s> => s !== undefined)

  // Build JSON-LD: item list of teams in this group
  const teamListItems = groupTeams.map((team) => ({
    name: team.name[contentLocale],
    url: `${SITE_URL}/${lang}/${teamsPath}/${team.slugs[contentLocale]}`,
  }))
  const itemListJsonLd = buildItemListJsonLd(teamListItems, contentLocale)

  // Breadcrumbs: Home > Teams > Group X
  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/grupos/${upperGroup}`,
    contentLocale,
    dict.breadcrumbs,
    `${contentLocale === 'es' ? 'Grupo' : 'Group'} ${upperGroup}`,
  )
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  // Labels
  const groupLabel = contentLocale === 'es' ? 'Grupo' : 'Group'
  const teamsHeading = contentLocale === 'es' ? 'Equipos del grupo' : 'Teams in this group'
  const matchesHeading = contentLocale === 'es' ? 'Partidos de fase de grupos' : 'Group stage matches'
  const citiesHeading = contentLocale === 'es' ? 'Ciudades sede' : 'Host cities'
  const stadiumsHeading = contentLocale === 'es' ? 'Estadios' : 'Stadiums'
  const backLabel = contentLocale === 'es' ? 'Volver a selecciones' : 'Back to teams'
  const matchdayLabel = contentLocale === 'es' ? 'Fecha' : 'Matchday'
  const dateLabel = contentLocale === 'es' ? 'Fecha' : 'Date'
  const noTeamsLabel =
    contentLocale === 'es'
      ? 'Los equipos de este grupo se conoceran tras el sorteo oficial de la FIFA.'
      : 'The teams in this group will be announced after the official FIFA draw.'
  const noMatchesLabel =
    contentLocale === 'es'
      ? 'El calendario detallado se publicara tras el sorteo oficial.'
      : 'The detailed schedule will be published after the official draw.'

  const pageTitle = `${groupLabel} ${upperGroup} - Mundial FIFA 2026`
  const intro =
    contentLocale === 'es'
      ? `Toda la informacion sobre el Grupo ${upperGroup} del Mundial FIFA 2026: equipos participantes, calendario de partidos, ciudades sede y estadios donde se disputaran los encuentros.`
      : `All the information about Group ${upperGroup} of the FIFA World Cup 2026: participating teams, match schedule, host cities, and stadiums where matches will be played.`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mx-auto max-w-6xl py-6">
        {/* Hero */}
        <div className="mb-8 rounded-xl bg-primary/5 px-6 py-8 border border-primary/10">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-lg">
              <span className="text-4xl font-black">{upperGroup}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                {groupLabel} {upperGroup}
              </h1>
              <p className="mt-1 text-muted">Mundial FIFA 2026</p>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">{intro}</p>

          {/* Quick stats */}
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Users className="h-3.5 w-3.5" />
              {groupTeams.length > 0
                ? `${groupTeams.length} ${contentLocale === 'es' ? 'equipos' : 'teams'}`
                : contentLocale === 'es' ? 'Equipos por definir' : 'Teams TBD'}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Calendar className="h-3.5 w-3.5" />
              {groupMatches.length > 0
                ? `${groupMatches.length} ${contentLocale === 'es' ? 'partidos' : 'matches'}`
                : contentLocale === 'es' ? 'Partidos por definir' : 'Matches TBD'}
            </span>
            {cities.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <MapPin className="h-3.5 w-3.5" />
                {cities.length} {contentLocale === 'es' ? 'ciudades' : 'cities'}
              </span>
            )}
            {venueNames.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Building2 className="h-3.5 w-3.5" />
                {venueNames.length} {contentLocale === 'es' ? 'estadios' : 'stadiums'}
              </span>
            )}
          </div>
        </div>

        {/* Teams section */}
        <section className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-full bg-primary/10 p-1.5">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold">{teamsHeading}</h2>
          </div>
          {groupTeams.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              {groupTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  lang={lang}
                  contentLocale={contentLocale}
                  teamsPath={teamsPath}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-border bg-muted/20 px-4 py-6 text-sm text-muted">
              {noTeamsLabel}
            </p>
          )}
        </section>

        {/* Matches section */}
        <section className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-full bg-primary/10 p-1.5">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold">{matchesHeading}</h2>
          </div>
          {groupMatches.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-primary/5">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">{matchdayLabel}</th>
                    <th className="px-4 py-3 text-left font-semibold">{dateLabel}</th>
                    <th className="hidden px-4 py-3 text-left font-semibold sm:table-cell">
                      {contentLocale === 'es' ? 'Partido' : 'Match'}
                    </th>
                    <th className="hidden px-4 py-3 text-left font-semibold md:table-cell">
                      {contentLocale === 'es' ? 'Estadio' : 'Venue'}
                    </th>
                    <th className="hidden px-4 py-3 text-left font-semibold lg:table-cell">
                      {contentLocale === 'es' ? 'Ciudad' : 'City'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupMatches.map((match, idx) => (
                    <tr
                      key={match.id}
                      className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
                    >
                      <td className="px-4 py-3 font-medium text-primary">
                        {match.matchday}
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {match.date}
                        {match.time !== 'TBD' && (
                          <span className="ml-1 text-xs text-muted">
                            {match.time}
                          </span>
                        )}
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <span className="font-medium">{match.homeTeam[contentLocale]}</span>
                        <span className="mx-2 text-muted">vs</span>
                        <span className="font-medium">{match.awayTeam[contentLocale]}</span>
                      </td>
                      <td className="hidden px-4 py-3 text-muted md:table-cell">
                        {match.venue}
                      </td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        {(() => {
                          const city = getCityById(match.city)
                          if (!city) return <span className="text-muted">{match.cityName[contentLocale]}</span>
                          return (
                            <Link
                              href={`/${lang}/${citiesPath}/${city.slugs[contentLocale]}`}
                              className="text-primary hover:underline"
                            >
                              {match.cityName[contentLocale]}
                            </Link>
                          )
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-lg border border-border bg-muted/20 px-4 py-6 text-sm text-muted">
              {noMatchesLabel}
            </p>
          )}
        </section>

        {/* Cities section */}
        {cities.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-full bg-primary/10 p-1.5">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold">{citiesHeading}</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((city) => (
                <Link
                  key={city.id}
                  href={`/${lang}/${citiesPath}/${city.slugs[contentLocale]}`}
                  className="group flex items-center gap-3 rounded-lg border border-border p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <MapPin className="h-5 w-5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="font-semibold group-hover:text-primary transition-colors truncate">
                      {city.name[contentLocale]}
                    </p>
                    <p className="text-xs text-muted capitalize">{city.country}</p>
                  </div>
                  <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Stadiums section */}
        {stadiums.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-full bg-primary/10 p-1.5">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold">{stadiumsHeading}</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stadiums.map((stadium) => (
                <Link
                  key={stadium.id}
                  href={`/${lang}/${stadiumsPath}/${stadium.slugs[contentLocale]}`}
                  className="group flex items-center gap-3 rounded-lg border border-border p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <Building2 className="h-5 w-5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="font-semibold group-hover:text-primary transition-colors truncate">
                      {stadium.name[contentLocale]}
                    </p>
                    <p className="text-xs text-muted">
                      {stadium.capacity.toLocaleString()} {contentLocale === 'es' ? 'cap.' : 'cap.'}
                    </p>
                  </div>
                  <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="mt-12 border-t border-border pt-6">
          <Link
            href={`/${lang}/${equiposIndexPath}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </div>
      </div>
    </>
  )
}
