import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTeam, getTeamSlugs } from '@/lib/content/teams'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildAlternates } from '@/lib/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Breadcrumbs items={breadcrumbs} />
      <article>
        <h1>{team.name[lang as Locale]}</h1>
        <p>{team.description[lang as Locale]}</p>
        <dl>
          <dt>{lang === 'es' ? 'Confederacion' : 'Confederation'}</dt>
          <dd>{team.confederation}</dd>
        </dl>
      </article>
    </>
  )
}
