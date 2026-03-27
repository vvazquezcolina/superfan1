import type { Metadata } from 'next'
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

function TeamCard({ team, lang, contentLocale }: { team: Team; lang: string; contentLocale: Locale }) {
  const flag = CONFEDERATION_FLAGS[team.confederation] ?? ''
  const groupLabel = contentLocale === 'es' ? 'Grupo' : 'Group'
  const readMore = contentLocale === 'es' ? 'Leer mas' : 'Read more'
  const description = team.description[contentLocale]
  const excerpt = description.length > 100 ? description.slice(0, 97) + '...' : description

  return (
    <a
      href={`/${lang}/equipos/${team.slugs[contentLocale]}`}
      className="group block rounded-lg border border-border p-5 shadow-sm transition-shadow hover:border-primary/50 hover:shadow-md"
    >
      <h3 className="text-base font-bold transition-colors group-hover:text-primary">
        {flag} {team.name[contentLocale]}
      </h3>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        {team.group && (
          <span className="inline-block rounded bg-primary px-1.5 py-0.5 text-xs font-semibold text-white">
            {groupLabel} {team.group}
          </span>
        )}
        <span className="text-xs text-muted">{team.confederation}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{excerpt}</p>
      <span className="mt-3 inline-block text-sm font-medium text-primary group-hover:underline">
        {readMore} &rarr;
      </span>
    </a>
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

  // Build item list for JSON-LD
  const teamListItems = allTeams.map((team) => ({
    name: team.name[contentLocale],
    url: `https://www.superfaninfo.com/${lang}/equipos/${team.slugs[contentLocale]}`,
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
        <h1 className="text-3xl font-bold md:text-4xl">{pageTitle}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">{intro}</p>

        {sortedGroups.map((group) => {
          const teams = groupedTeams[group] ?? []
          return (
            <section key={group} className="mt-10">
              <h2 className="text-2xl font-bold">
                {groupHeading} {group}
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {teams.map((team) => (
                  <TeamCard key={team.id} team={team} lang={lang} contentLocale={contentLocale} />
                ))}
              </div>
            </section>
          )
        })}

        {ungrouped.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold">{ungroupedHeading}</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {ungrouped.map((team) => (
                <TeamCard key={team.id} team={team} lang={lang} contentLocale={contentLocale} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
