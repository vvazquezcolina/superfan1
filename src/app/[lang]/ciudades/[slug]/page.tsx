import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCity, getCitySlugs } from '@/lib/content/cities'
import { hasLocale } from '@/app/[lang]/dictionaries'
import { buildAlternates, SITE_URL } from '@/lib/i18n'
import type { Locale } from '@/lib/content/schemas'

export async function generateStaticParams() {
  return getCitySlugs().map(({ slug, lang }) => ({ lang, slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  if (!hasLocale(lang)) return {}
  const city = getCity(slug, lang as Locale)
  if (!city) return {}

  const alternates = buildAlternates('ciudades', city.slugs)

  return {
    title: city.name[lang as Locale],
    description: city.description[lang as Locale],
    alternates: {
      ...alternates,
      canonical: `${SITE_URL}/${lang}/${lang === 'es' ? 'ciudades' : 'cities'}/${slug}`,
    },
  }
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const city = getCity(slug, lang as Locale)
  if (!city) notFound()

  return (
    <main>
      <h1>{city.name[lang as Locale]}</h1>
      <p>{city.description[lang as Locale]}</p>
      <dl>
        <dt>{lang === 'es' ? 'Pais' : 'Country'}</dt>
        <dd>{city.country}</dd>
        <dt>{lang === 'es' ? 'Estadio' : 'Stadium'}</dt>
        <dd>{city.stadium}</dd>
      </dl>
    </main>
  )
}
