import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTeam, getTeams, getTeamSlugs } from '@/lib/content/teams'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildAlternates } from '@/lib/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { buildSportsTeamJsonLd, buildFAQPageJsonLd, buildArticleJsonLd } from '@/lib/jsonld'
import { TeamHero } from '@/components/team/TeamHero'
import { TeamSection } from '@/components/team/TeamSection'
import { TeamFAQ } from '@/components/team/TeamFAQ'
import { TableOfContents, type TocItem } from '@/components/layout/TableOfContents'
import type { Locale, TeamPlayer } from '@/lib/content/schemas'
import { toContentLocale } from '@/lib/content/locale'
import { History, Users, Trophy, Calendar, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react'

const SITE_URL = 'https://www.superfaninfo.com'

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

  const { pathTranslations } = await import('@/lib/i18n')
  const section = pathTranslations.equipos[lang as import('@/app/[lang]/dictionaries').Locale] ?? 'teams'
  const canonicalUrl = `${SITE_URL}/${lang}/${section}/${slug}`

  const articleJsonLd = buildArticleJsonLd({
    headline: team.name[contentLocale],
    description: team.description[contentLocale],
    url: canonicalUrl,
    dateModified: team.lastUpdated,
    lang: contentLocale,
  })

  const faqJsonLd = team.content?.faq
    ? buildFAQPageJsonLd(
        team.content.faq as Array<{ question: { es: string; en: string }; answer: { es: string; en: string } }>,
        contentLocale,
      )
    : null

  const lastUpdatedLabel = contentLocale === 'es' ? 'Ultima actualizacion' : 'Last updated'
  const playersHeading = team.content?.keyPlayers.title[contentLocale] ??
    (contentLocale === 'es' ? 'Jugadores Clave' : 'Key Players')

  // Build TOC items
  const tocTitle = contentLocale === 'es' ? 'En esta guia' : 'In this guide'
  const tocItems: TocItem[] = team.content ? [
    {
      id: 'historia',
      label: team.content.worldCupHistory.title[contentLocale],
      icon: <History className="h-3.5 w-3.5" />,
    },
    {
      id: 'jugadores',
      label: playersHeading,
      icon: <Users className="h-3.5 w-3.5" />,
    },
    {
      id: 'clasificacion',
      label: team.content.qualifyingPath.title[contentLocale],
      icon: <Trophy className="h-3.5 w-3.5" />,
    },
    {
      id: 'calendario',
      label: team.content.matchSchedule.title[contentLocale],
      icon: <Calendar className="h-3.5 w-3.5" />,
    },
    {
      id: 'faq',
      label: contentLocale === 'es' ? 'Preguntas frecuentes' : 'FAQ',
      icon: <HelpCircle className="h-3.5 w-3.5" />,
    },
  ] : []

  // Prev/Next team navigation
  const allTeams = getTeams()
  const currentIndex = allTeams.findIndex((t) => t.id === team.id)
  const prevTeam = currentIndex > 0 ? allTeams[currentIndex - 1] : null
  const nextTeam = currentIndex < allTeams.length - 1 ? allTeams[currentIndex + 1] : null

  const indexPath = `/${lang}/${section}`
  const backLabel = contentLocale === 'es' ? 'Volver a equipos' : 'Back to teams'

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <Breadcrumbs items={breadcrumbs} />

      <TeamHero team={team} lang={contentLocale} />

      {team.content ? (
        <article className="mx-auto max-w-4xl space-y-10 py-8">

          {/* Table of Contents */}
          <TableOfContents items={tocItems} title={tocTitle} />

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

          <div id="faq">
            <TeamFAQ faqs={team.content.faq} lang={contentLocale} />
          </div>

          {/* Prev/Next Navigation */}
          <nav className="mx-auto max-w-prose grid grid-cols-2 gap-4 border-t border-border pt-6">
            {prevTeam ? (
              <Link
                href={`/${lang}/${section}/${prevTeam.slugs[contentLocale]}`}
                className="group flex items-center gap-2 rounded-lg border border-border p-4 transition-all hover:border-primary/50 hover:shadow-sm"
              >
                <ChevronLeft className="h-5 w-5 text-muted group-hover:text-primary" />
                <div className="text-left">
                  <span className="text-xs text-muted">{contentLocale === 'es' ? 'Anterior' : 'Previous'}</span>
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors">{prevTeam.name[contentLocale]}</p>
                </div>
              </Link>
            ) : <div />}
            {nextTeam ? (
              <Link
                href={`/${lang}/${section}/${nextTeam.slugs[contentLocale]}`}
                className="group flex items-center justify-end gap-2 rounded-lg border border-border p-4 transition-all hover:border-primary/50 hover:shadow-sm"
              >
                <div className="text-right">
                  <span className="text-xs text-muted">{contentLocale === 'es' ? 'Siguiente' : 'Next'}</span>
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors">{nextTeam.name[contentLocale]}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted group-hover:text-primary" />
              </Link>
            ) : <div />}
          </nav>

          <footer className="mx-auto max-w-prose border-t border-border pt-4">
            <p className="text-sm text-muted">
              {lastUpdatedLabel}: {team.lastUpdated}
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
            <Link
              href={indexPath}
              className="mt-4 inline-flex items-center gap-1 text-primary underline hover:text-primary/80"
            >
              <ChevronLeft className="h-4 w-4" />
              {backLabel}
            </Link>
          </footer>
        </article>
      )}
    </>
  )
}
