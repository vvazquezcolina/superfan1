import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCities, getCitiesByCountry } from '@/lib/content/cities'
import { getStadiumById } from '@/lib/content/stadiums'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildIndexAlternates } from '@/lib/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { buildItemListJsonLd } from '@/lib/jsonld'
import type { City, Locale } from '@/lib/content/schemas'
import { toContentLocale } from '@/lib/content/locale'
import { MapPin, Building2, ChevronRight, Users } from 'lucide-react'

export async function generateStaticParams() {
  return [
    { lang: 'es' },
    { lang: 'en' },
    { lang: 'pt' },
    { lang: 'fr' },
    { lang: 'de' },
    { lang: 'ar' },
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as import('@/app/[lang]/dictionaries').Locale)
  const contentLocale: Locale = toContentLocale(lang)
  const { pathTranslations } = await import('@/lib/i18n')
  const section = pathTranslations.ciudades[lang as import('@/app/[lang]/dictionaries').Locale] ?? 'cities'

  return buildPageMetadata({
    title: dict.city.indexTitle,
    description: dict.city.indexDescription,
    lang: contentLocale,
    path: `/${lang}/${section}`,
    alternates: buildIndexAlternates('ciudades'),
  })
}

const countryFlags: Record<string, string> = {
  mexico: '\u{1F1F2}\u{1F1FD}',
  usa: '\u{1F1FA}\u{1F1F8}',
  canada: '\u{1F1E8}\u{1F1E6}',
}

const countryBorderColors: Record<string, string> = {
  mexico: 'border-l-green-600',
  usa: 'border-l-blue-600',
  canada: 'border-l-red-600',
}

const countryBgColors: Record<string, string> = {
  mexico: 'bg-green-50',
  usa: 'bg-blue-50',
  canada: 'bg-red-50',
}

function CityCard({ city, lang, contentLocale, citiesPath }: { city: City; lang: string; contentLocale: Locale; citiesPath: string }) {
  const slug = city.slugs[contentLocale]
  const overview = city.content.overview[contentLocale]
  const excerpt = overview.length > 120 ? overview.slice(0, 117) + '...' : overview
  const flag = countryFlags[city.country] ?? ''
  const borderColor = countryBorderColors[city.country] ?? 'border-l-primary'
  const readMore = contentLocale === 'es' ? 'Ver guia completa' : 'View full guide'
  const stadium = getStadiumById(city.stadium)

  return (
    <Link
      href={`/${lang}/${citiesPath}/${slug}`}
      className={`group block rounded-lg border border-border border-l-4 ${borderColor} p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
            {flag} {city.name[contentLocale]}
          </h3>
          {stadium && (
            <p className="mt-1 flex items-center gap-1 text-sm text-muted">
              <Building2 className="h-3 w-3" />
              {stadium.name[contentLocale]}
            </p>
          )}
        </div>
        <ChevronRight className="h-5 w-5 text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {excerpt}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
        {readMore}
      </span>
    </Link>
  )
}

export default async function CityIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as import('@/app/[lang]/dictionaries').Locale
  const contentLocale: Locale = toContentLocale(lang)
  const dict = await getDictionary(locale)
  const allCities = getCities()
  const citiesByCountry = getCitiesByCountry()

  const { pathTranslations: pt2 } = await import('@/lib/i18n')
  const citiesPath = pt2.ciudades[locale] ?? 'cities'
  const cityListItems = allCities.map((city) => ({
    name: city.name[contentLocale],
    url: `https://www.superfaninfo.com/${lang}/${citiesPath}/${city.slugs[contentLocale]}`,
  }))
  const itemListJsonLd = buildItemListJsonLd(cityListItems, contentLocale)

  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/ciudades`,
    contentLocale,
    dict.breadcrumbs,
  )
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const intro = contentLocale === 'es'
    ? 'Descubre las 16 ciudades que seran sede del Mundial 2026 en Mexico, Estados Unidos y Canada. Cada guia incluye informacion sobre transporte, hospedaje, comida, seguridad y consejos culturales para fans latinoamericanos.'
    : 'Discover the 16 cities that will host the 2026 World Cup in Mexico, the United States, and Canada. Each guide includes information about transportation, accommodation, food, safety, and cultural tips for Latin American fans.'

  const countryOrder = [
    { key: 'mexico', label: dict.city.countryMexico, desc: contentLocale === 'es' ? '3 ciudades sede' : '3 host cities', color: 'text-green-700', bg: countryBgColors.mexico },
    { key: 'usa', label: dict.city.countryUSA, desc: contentLocale === 'es' ? '11 ciudades sede' : '11 host cities', color: 'text-blue-700', bg: countryBgColors.usa },
    { key: 'canada', label: dict.city.countryCanada, desc: contentLocale === 'es' ? '2 ciudades sede' : '2 host cities', color: 'text-red-700', bg: countryBgColors.canada },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mx-auto max-w-6xl py-6">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-full bg-primary/10 p-2">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold md:text-4xl">{dict.city.indexTitle}</h1>
        </div>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">
          {intro}
        </p>

        {/* Stats summary */}
        <div className="mt-6 flex flex-wrap gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            {countryFlags.mexico} Mexico: 3
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            {countryFlags.usa} USA: 11
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
            {countryFlags.canada} Canada: 2
          </span>
        </div>

        {countryOrder.map(({ key, label, desc, color, bg }) => {
          const countryCities = citiesByCountry[key] ?? []
          if (countryCities.length === 0) return null

          return (
            <section key={key} className="mt-10">
              <div className={`inline-flex items-center gap-2 rounded-lg ${bg} px-4 py-2 mb-4`}>
                <h2 className={`text-2xl font-bold ${color}`}>
                  {countryFlags[key]} {label}
                </h2>
                <span className="text-sm text-muted">({desc})</span>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {countryCities.map((city) => (
                  <CityCard key={city.id} city={city} lang={lang} contentLocale={contentLocale} citiesPath={citiesPath} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
