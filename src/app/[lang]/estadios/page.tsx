import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStadiums, getStadiumsByCountry } from '@/lib/content/stadiums'
import { getCityById } from '@/lib/content/cities'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildIndexAlternates } from '@/lib/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { buildItemListJsonLd } from '@/lib/jsonld'
import type { Stadium, Locale } from '@/lib/content/schemas'
import { toContentLocale } from '@/lib/content/locale'
import { Building2, MapPin, Users, ChevronRight } from 'lucide-react'

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

  const section = contentLocale === 'es' ? 'estadios' : 'stadiums'
  return buildPageMetadata({
    title: dict.stadium.indexTitle,
    description: dict.stadium.indexDescription,
    lang: contentLocale,
    path: `/${lang}/${section}`,
    alternates: buildIndexAlternates('estadios'),
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

function StadiumCard({ stadium, lang, country }: { stadium: Stadium; lang: string; country: string }) {
  const contentLang = toContentLocale(lang) as Locale
  const section = contentLang === 'es' ? 'estadios' : 'stadiums'
  const slug = stadium.slugs[contentLang] ?? stadium.slugs.es
  const overview = stadium.content?.overview?.[contentLang] ?? stadium.content?.overview?.es ?? ''
  const excerpt = overview.length > 120 ? overview.slice(0, 117) + '...' : overview
  const readMore = contentLang === 'es' ? 'Ver guia completa' : 'View full guide'
  const borderColor = countryBorderColors[country] ?? 'border-l-primary'

  const city = getCityById(stadium.city)
  const cityName = city?.name[contentLang] ?? stadium.city

  return (
    <Link
      href={`/${lang}/${section}/${slug}`}
      className={`group block rounded-lg border border-border border-l-4 ${borderColor} p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
              {stadium.name[contentLang]}
            </h3>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {cityName}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {stadium.capacity.toLocaleString()}
            </span>
          </div>
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

export default async function StadiumIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as import('@/app/[lang]/dictionaries').Locale
  const contentLocale: Locale = toContentLocale(lang)
  const dict = await getDictionary(locale)
  const allStadiums = getStadiums()
  const stadiumsByCountry = getStadiumsByCountry()

  const section = contentLocale === 'es' ? 'estadios' : 'stadiums'
  const stadiumListItems = allStadiums.map((stadium) => ({
    name: stadium.name[contentLocale] ?? stadium.name.es,
    url: `https://www.superfaninfo.com/${lang}/${section}/${stadium.slugs[contentLocale] ?? stadium.slugs.es}`,
  }))
  const itemListJsonLd = buildItemListJsonLd(stadiumListItems, contentLocale)

  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/estadios`,
    contentLocale,
    dict.breadcrumbs,
  )
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const intro = contentLocale === 'es'
    ? 'Conoce los 16 estadios que seran sede del Mundial 2026 en Mexico, Estados Unidos y Canada. Cada guia incluye informacion sobre capacidad, transporte, asientos, hoteles cercanos y accesibilidad para que planifiques tu experiencia al maximo.'
    : 'Discover the 16 stadiums hosting the 2026 World Cup in Mexico, the United States, and Canada. Each guide includes information about capacity, transport, seating, nearby hotels, and accessibility so you can plan your experience to the fullest.'

  const countryOrder = [
    { key: 'mexico', label: dict.stadium.countryMexico, desc: contentLocale === 'es' ? '3 estadios' : '3 stadiums', bg: countryBgColors.mexico },
    { key: 'usa', label: dict.stadium.countryUSA, desc: contentLocale === 'es' ? '11 estadios' : '11 stadiums', bg: countryBgColors.usa },
    { key: 'canada', label: dict.stadium.countryCanada, desc: contentLocale === 'es' ? '2 estadios' : '2 stadiums', bg: countryBgColors.canada },
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
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-full bg-primary/10 p-2">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold md:text-4xl">{dict.stadium.indexTitle}</h1>
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

        {countryOrder.map(({ key, label, desc, bg }) => {
          const countryStadiums = stadiumsByCountry[key] ?? []
          if (countryStadiums.length === 0) return null

          return (
            <section key={key} className="mt-10">
              <div className={`inline-flex items-center gap-2 rounded-lg ${bg} px-4 py-2 mb-4`}>
                <h2 className="text-2xl font-bold">
                  {countryFlags[key]} {label}
                </h2>
                <span className="text-sm text-muted">({desc})</span>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {countryStadiums.map((stadium) => (
                  <StadiumCard key={stadium.id} stadium={stadium} lang={lang} country={key} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
