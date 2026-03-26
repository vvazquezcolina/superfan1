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
  const team = getTeam(slug, lang as Locale)
  if (!team) return {}

  const section = lang === 'es' ? 'equipos' : 'teams'
  return buildPageMetadata({
    title: team.name[lang as Locale],
    description: team.description[lang as Locale],
    lang: lang as Locale,
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
  const locale = lang as Locale
  const team = getTeam(slug, locale)
  if (!team) notFound()

  const dict = await getDictionary(locale)
  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/equipos/${slug}`,
    locale,
    dict.breadcrumbs,
    team.name[locale],
  )
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)
  const sportsTeamJsonLd = buildSportsTeamJsonLd(team, locale)

  const lastUpdatedLabel = locale === 'es' ? 'Ultima actualizacion' : 'Last updated'
  const playersHeading = team.content?.keyPlayers.title[locale] ??
    (locale === 'es' ? 'Jugadores Clave' : 'Key Players')

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

      <TeamHero team={team} lang={locale} />

      {team.content ? (
        <article className="mx-auto max-w-4xl space-y-10 py-8">

          <TeamSection
            section={team.content.worldCupHistory}
            lang={locale}
            id="historia"
          />

          <section id="jugadores" className="mx-auto max-w-prose scroll-mt-20">
            <h2 className="text-2xl font-bold md:text-3xl">{playersHeading}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {team.content.keyPlayers.players.map((player, index) => (
                <PlayerCard key={index} player={player} lang={locale} />
              ))}
            </div>
          </section>

          <TeamSection
            section={team.content.qualifyingPath}
            lang={locale}
            id="clasificacion"
          />

          <TeamSection
            section={team.content.matchSchedule}
            lang={locale}
            id="calendario"
          />

          <TeamFAQ faqs={team.content.faq} lang={locale} />

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
              {team.description[locale]}
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
