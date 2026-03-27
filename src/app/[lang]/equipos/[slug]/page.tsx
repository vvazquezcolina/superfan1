import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTeam, getTeamSlugs } from '@/lib/content/teams'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildAlternates } from '@/lib/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { buildSportsTeamJsonLd } from '@/lib/jsonld'
import { TeamHero } from '@/components/team/TeamHero'
import { TeamSection } from '@/components/team/TeamSection'
import { TeamFAQ } from '@/components/team/TeamFAQ'
import type { Locale, TeamPlayer } from '@/lib/content/schemas'
import { toContentLocale } from '@/lib/content/cities'

export async function generateStaticParams() {
  return getTeamSlugs().map(({ slug, lang }) => ({ lang, slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  if (!hasLocale(lang)) return {}
  const contentLocale: Locale = toContentLocale(lang)
  const team = getTeam(slug, lang)
  if (!team) return {}

  const { pathTranslations } = await import('@/lib/i18n')
  const section = pathTranslations.equipos[lang as import('@/app/[lang]/dictionaries').Locale] ?? 'teams'
  return buildPageMetadata({
    title: team.name[contentLocale],
    description: team.description[contentLocale],
    lang: contentLocale,
    path: `/${lang}/${section}/${slug}`,
    alternates: buildAlternates('equipos', team.slugs),
  })
}

function PlayerCard({ player, lang }: { player: TeamPlayer; lang: Locale }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="font-bold">{player.name}</p>
      <p className="text-sm text-muted">{player.position[lang]} &middot; {player.club}</p>
      <p className="mt-2 text-sm leading-relaxed">{player.note[lang]}</p>
    </div>
  )
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as import('@/app/[lang]/dictionaries').Locale
  const contentLocale: Locale = toContentLocale(lang)
  const team = getTeam(slug, lang)
  if (!team) notFound()

  const dict = await getDictionary(locale)
  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/equipos/${slug}`,
    contentLocale,
    dict.breadcrumbs,
    team.name[contentLocale],
  )
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)
  const sportsTeamJsonLd = buildSportsTeamJsonLd(team, contentLocale)

  const lastUpdatedLabel = contentLocale === 'es' ? 'Ultima actualizacion' : 'Last updated'
  const playersHeading = team.content?.keyPlayers.title[contentLocale] ??
    (contentLocale === 'es' ? 'Jugadores Clave' : 'Key Players')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsTeamJsonLd) }}
      />
      <Breadcrumbs items={breadcrumbs} />

      <TeamHero team={team} lang={contentLocale} />

      {team.content ? (
        <article className="mx-auto max-w-4xl space-y-10 py-8">

          <TeamSection
            section={team.content.worldCupHistory}
            lang={contentLocale}
            id="historia"
          />

          <section id="jugadores" className="mx-auto max-w-prose scroll-mt-20">
            <h2 className="text-2xl font-bold md:text-3xl">{playersHeading}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {team.content.keyPlayers.players.map((player, index) => (
                <PlayerCard key={index} player={player} lang={contentLocale} />
              ))}
            </div>
          </section>

          <TeamSection
            section={team.content.qualifyingPath}
            lang={contentLocale}
            id="clasificacion"
          />

          <TeamSection
            section={team.content.matchSchedule}
            lang={contentLocale}
            id="calendario"
          />

          <TeamFAQ faqs={team.content.faq} lang={contentLocale} />

          <footer className="mt-8 border-t border-border pt-4">
            <p className="text-sm text-muted">
              {lastUpdatedLabel}: {team.lastUpdated}
            </p>
          </footer>
        </article>
      ) : (
        <article className="mx-auto max-w-4xl py-8">
          <section className="rounded-lg border-l-4 border-primary bg-primary/5 p-6">
            <p className="text-lg font-medium leading-relaxed">
              {team.description[contentLocale]}
            </p>
          </section>
          <footer className="mt-8 border-t border-border pt-4">
            <p className="text-sm text-muted">
              {lastUpdatedLabel}: {team.lastUpdated}
            </p>
          </footer>
        </article>
      )}
    </>
  )
}
