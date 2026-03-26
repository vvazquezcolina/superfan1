import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTeam, getTeamSlugs } from '@/lib/content/teams'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildAlternates } from '@/lib/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { buildSportsTeamJsonLd } from '@/lib/jsonld'
import type { Locale } from '@/lib/content/schemas'

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

export default async function TeamPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const team = getTeam(slug, lang as Locale)
  if (!team) notFound()

  const dict = await getDictionary(lang as Locale)
  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/equipos/${slug}`,
    lang as Locale,
    dict.breadcrumbs,
    team.name[lang as Locale],
  )
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)
  const sportsTeamJsonLd = buildSportsTeamJsonLd(team, lang as Locale)

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
      <article className="mx-auto max-w-4xl space-y-8 py-6">
        <h1 className="text-3xl font-bold md:text-4xl">{team.name[lang as Locale]}</h1>

        <section className="rounded-lg border-l-4 border-primary bg-primary/5 p-6">
          <p className="text-lg font-medium leading-relaxed">
            {team.description[lang as Locale]}
          </p>
        </section>

        <dl className="space-y-2">
          <dt className="font-semibold">{lang === 'es' ? 'Confederacion' : 'Confederation'}</dt>
          <dd>{team.confederation}</dd>
        </dl>

        <footer className="mt-8 border-t border-border pt-4">
          <p className="text-sm text-muted">
            {lang === 'es' ? 'Ultima actualizacion' : 'Last updated'}: {team.lastUpdated}
          </p>
        </footer>
      </article>
    </>
  )
}
