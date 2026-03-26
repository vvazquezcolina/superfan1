import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getStadium, getStadiumSlugs } from '@/lib/content/stadiums'
import { hasLocale } from '@/app/[lang]/dictionaries'
import { buildAlternates, SITE_URL } from '@/lib/i18n'
import type { Locale } from '@/lib/content/schemas'

export async function generateStaticParams() {
  return getStadiumSlugs().map(({ slug, lang }) => ({ lang, slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  if (!hasLocale(lang)) return {}
  const stadium = getStadium(slug, lang as Locale)
  if (!stadium) return {}

  const alternates = buildAlternates('estadios', stadium.slugs)

  return {
    title: stadium.name[lang as Locale],
    description: stadium.description[lang as Locale],
    alternates: {
      ...alternates,
      canonical: `${SITE_URL}/${lang}/${lang === 'es' ? 'estadios' : 'stadiums'}/${slug}`,
    },
  }
}

export default async function StadiumPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const stadium = getStadium(slug, lang as Locale)
  if (!stadium) notFound()

  return (
    <main>
      <h1>{stadium.name[lang as Locale]}</h1>
      <p>{stadium.description[lang as Locale]}</p>
      <dl>
        <dt>{lang === 'es' ? 'Ciudad' : 'City'}</dt>
        <dd>{stadium.city}</dd>
        <dt>{lang === 'es' ? 'Capacidad' : 'Capacity'}</dt>
        <dd>{stadium.capacity.toLocaleString()}</dd>
      </dl>
    </main>
  )
}
