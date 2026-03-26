import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTeam, getTeamSlugs } from '@/lib/content/teams'
import { hasLocale } from '@/app/[lang]/dictionaries'
import { buildAlternates, SITE_URL } from '@/lib/i18n'
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

  const alternates = buildAlternates('equipos', team.slugs)

  return {
    title: team.name[lang as Locale],
    description: team.description[lang as Locale],
    alternates: {
      ...alternates,
      canonical: `${SITE_URL}/${lang}/${lang === 'es' ? 'equipos' : 'teams'}/${slug}`,
    },
  }
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

  return (
    <main>
      <h1>{team.name[lang as Locale]}</h1>
      <p>{team.description[lang as Locale]}</p>
      <dl>
        <dt>{lang === 'es' ? 'Confederacion' : 'Confederation'}</dt>
        <dd>{team.confederation}</dd>
      </dl>
    </main>
  )
}
