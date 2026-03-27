import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTeams } from '@/lib/content/teams'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildIndexAlternates } from '@/lib/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { buildItemListJsonLd } from '@/lib/jsonld'
import type { Team, Locale } from '@/lib/content/schemas'
import { toContentLocale } from '@/lib/content/locale'
import { Users, Shield, ChevronRight } from 'lucide-react'

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
  const contentLocale: Locale = toContentLocale(lang)

  const title =
    contentLocale === 'es'
      ? 'Equipos del Mundial 2026 | SuperFan'
      : '2026 World Cup Teams | SuperFan'
  const description =
    contentLocale === 'es'
      ? 'Conoce los 48 equipos clasificados al Mundial FIFA 2026. Historia, jugadores clave, trayectoria clasificatoria y guias para seguir a tu seleccion en Mexico, Estados Unidos y Canada.'
      : 'Discover all 48 teams qualified for the FIFA World Cup 2026. History, key players, qualifying path, and guides for following your team in Mexico, the United States, and Canada.'

  return buildPageMetadata({
    title,
    description,
    lang: contentLocale,
    path: `/${lang}/equipos`,
    alternates: buildIndexAlternates('equipos'),
  })
}

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

function TeamCard({ team, lang, contentLocale, teamsPath }: { team: Team; lang: string; contentLocale: Locale; teamsPath: string }) {
  const flag = CONFEDERATION_FLAGS[team.confederation] ?? ''
  const groupLabel = contentLocale === 'es' ? 'Grupo' : 'Group'
  const description = team.description[contentLocale]
  const excerpt = description.length > 80 ? description.slice(0, 77) + '...' : description
  const borderColor = CONFEDERATION_COLORS[team.confederation] ?? 'border-l-primary'

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
      <div className="mt-1.5 flex flex-wrap items-center gap-2">
        {team.group && (
          <span className="inline-block rounded bg-primary px-1.5 py-0.5 text-xs font-semibold text-white">
            {groupLabel} {team.group}
          </span>
        )}
        <span className="text-xs text-muted">{team.confederation}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{excerpt}</p>
    </Link>
  )
}

export default async function TeamIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as import('@/app/[lang]/dictionaries').Locale
  const contentLocale: Locale = toContentLocale(lang)
  const dict = await getDictionary(locale)
  const allTeams = getTeams()

  const { pathTranslations } = await import('@/lib/i18n')
  const teamsPath = pathTranslations.equipos[locale] ?? 'teams'

  // Build item list for JSON-LD
  const teamListItems = allTeams.map((team) => ({
    name: team.name[contentLocale],
    url: `https://www.superfaninfo.com/${lang}/${teamsPath}/${team.slugs[contentLocale]}`,
  }))
  const itemListJsonLd = buildItemListJsonLd(teamListItems, contentLocale)

  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/equipos`,
    contentLocale,
    dict.breadcrumbs,
  )
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  // Group teams by their group field (A-L), ungrouped last
  const groupedTeams: Record<string, Team[]> = {}
  const ungrouped: Team[] = []

  for (const team of allTeams) {
    if (team.group) {
      if (!groupedTeams[team.group]) groupedTeams[team.group] = []
      groupedTeams[team.group].push(team)
    } else {
      ungrouped.push(team)
    }
  }

  const sortedGroups = Object.keys(groupedTeams).sort()

  const intro =
    contentLocale === 'es'
      ? 'Conoce los 48 equipos clasificados al Mundial FIFA 2026. Encuentra la historia, jugadores clave, trayectoria clasificatoria y guias de viaje para seguir a tu seleccion en Mexico, Estados Unidos y Canada.'
      : 'Discover all 48 teams qualified for the FIFA World Cup 2026. Find the history, key players, qualifying path, and travel guides to follow your team in Mexico, the United States, and Canada.'

  const groupHeading = contentLocale === 'es' ? 'Grupo' : 'Group'
  const ungroupedHeading = contentLocale === 'es' ? 'Sin grupo asignado' : 'Group Not Yet Assigned'
  const pageTitle = contentLocale === 'es' ? 'Equipos del Mundial 2026' : '2026 World Cup Teams'

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
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-full bg-primary/10 p-2">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold md:text-4xl">{pageTitle}</h1>
        </div>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">{intro}</p>

        {/* Quick stats */}
        <div className="mt-6 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Shield className="h-3.5 w-3.5" />
            48 {contentLocale === 'es' ? 'selecciones' : 'teams'}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {sortedGroups.length} {contentLocale === 'es' ? 'grupos' : 'groups'}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            6 {contentLocale === 'es' ? 'confederaciones' : 'confederations'}
          </span>
        </div>

        {sortedGroups.map((group) => {
          const teams = groupedTeams[group] ?? []
          return (
            <section key={group} className="mt-10">
              <div className="inline-flex items-center gap-2 rounded-lg bg-primary/5 px-4 py-2 mb-4">
                <h2 className="text-xl font-bold text-primary">
                  {groupHeading} {group}
                </h2>
                <span className="text-sm text-muted">({teams.length} {contentLocale === 'es' ? 'equipos' : 'teams'})</span>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                {teams.map((team) => (
                  <TeamCard key={team.id} team={team} lang={lang} contentLocale={contentLocale} teamsPath={teamsPath} />
                ))}
              </div>
            </section>
          )
        })}

        {ungrouped.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold">{ungroupedHeading}</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              {ungrouped.map((team) => (
                <TeamCard key={team.id} team={team} lang={lang} contentLocale={contentLocale} teamsPath={teamsPath} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
