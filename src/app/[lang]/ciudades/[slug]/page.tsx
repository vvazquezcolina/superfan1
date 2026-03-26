import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCity, getCitySlugs } from '@/lib/content/cities'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildAlternates } from '@/lib/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
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

  const section = lang === 'es' ? 'ciudades' : 'cities'
  return buildPageMetadata({
    title: city.name[lang as Locale],
    description: city.description[lang as Locale],
    lang: lang as Locale,
    path: `/${lang}/${section}/${slug}`,
    alternates: buildAlternates('ciudades', city.slugs),
  })
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

  const dict = await getDictionary(lang as Locale)
  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/ciudades/${slug}`,
    lang as Locale,
    dict.breadcrumbs,
    city.name[lang as Locale],
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
        <h1>{city.name[lang as Locale]}</h1>
        <p>{city.description[lang as Locale]}</p>
        <dl>
          <dt>{lang === 'es' ? 'Pais' : 'Country'}</dt>
          <dd>{city.country}</dd>
          <dt>{lang === 'es' ? 'Estadio' : 'Stadium'}</dt>
          <dd>{city.stadium}</dd>
        </dl>
      </article>
    </>
  )
}
