import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCitiesByCountry } from '@/lib/content/cities'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildIndexAlternates } from '@/lib/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import type { City, Locale } from '@/lib/content/schemas'

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)

  const section = lang === 'es' ? 'ciudades' : 'cities'
  return buildPageMetadata({
    title: dict.city.indexTitle,
    description: dict.city.indexDescription,
    lang: lang as Locale,
    path: `/${lang}/${section}`,
    alternates: buildIndexAlternates('ciudades'),
  })
}

const countryFlags: Record<string, string> = {
  mexico: '\u{1F1F2}\u{1F1FD}',
  usa: '\u{1F1FA}\u{1F1F8}',
  canada: '\u{1F1E8}\u{1F1E6}',
}

function CityCard({ city, lang }: { city: City; lang: Locale }) {
  const section = lang === 'es' ? 'ciudades' : 'cities'
  const slug = city.slugs[lang]
  const overview = city.content.overview[lang]
  const excerpt = overview.length > 120 ? overview.slice(0, 117) + '...' : overview
  const flag = countryFlags[city.country] ?? ''
  const readMore = lang === 'es' ? 'Leer mas' : 'Read more'

  return (
    <a
      href={`/${lang}/${section}/${slug}`}
      className="group block rounded-lg border border-border p-6 shadow-sm transition-shadow hover:shadow-md hover:border-primary/50"
    >
      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
        {flag} {city.name[lang]}
      </h3>
      <p className="mt-1 text-sm text-muted">
        {city.stadium.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
      </p>
      <p className="mt-3 text-sm leading-relaxed">
        {excerpt}
      </p>
      <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:underline">
        {readMore} &rarr;
      </span>
    </a>
  )
}

export default async function CityIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const citiesByCountry = getCitiesByCountry()

  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/ciudades`,
    locale,
    dict.breadcrumbs,
  )
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const intro = locale === 'es'
    ? 'Descubre las 16 ciudades que seran sede del Mundial 2026 en Mexico, Estados Unidos y Canada. Cada guia incluye informacion sobre transporte, hospedaje, comida, seguridad y consejos culturales para fans latinoamericanos.'
    : 'Discover the 16 cities that will host the 2026 World Cup in Mexico, the United States, and Canada. Each guide includes information about transportation, accommodation, food, safety, and cultural tips for Latin American fans.'

  const countryOrder = [
    { key: 'mexico', label: dict.city.countryMexico },
    { key: 'usa', label: dict.city.countryUSA },
    { key: 'canada', label: dict.city.countryCanada },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mx-auto max-w-6xl py-6">
        <h1 className="text-3xl font-bold md:text-4xl">{dict.city.indexTitle}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">
          {intro}
        </p>

        {countryOrder.map(({ key, label }) => {
          const countryCities = citiesByCountry[key] ?? []
          if (countryCities.length === 0) return null

          return (
            <section key={key} className="mt-10">
              <h2 className="text-2xl font-bold">
                {countryFlags[key]} {label}
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {countryCities.map((city) => (
                  <CityCard key={city.id} city={city} lang={locale} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
