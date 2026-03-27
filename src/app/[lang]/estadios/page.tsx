import type { Metadata } from 'next'
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

function StadiumCard({ stadium, lang }: { stadium: Stadium; lang: string }) {
  const contentLang = toContentLocale(lang) as Locale
  const section = contentLang === 'es' ? 'estadios' : 'stadiums'
  const slug = stadium.slugs[contentLang] ?? stadium.slugs.es
  const overview = stadium.content?.overview?.[contentLang] ?? stadium.content?.overview?.es ?? ''
  const excerpt = overview.length > 120 ? overview.slice(0, 117) + '...' : overview
  const readMore = contentLang === 'es' ? 'Leer mas' : 'Read more'
  const capacityLabel = contentLang === 'es' ? 'Capacidad' : 'Capacity'

  const city = getCityById(stadium.city)
  const cityName = city?.name[contentLang] ?? stadium.city

  return (
    <a
      href={`/${lang}/${section}/${slug}`}
      className="group block rounded-lg border border-border p-6 shadow-sm transition-shadow hover:shadow-md hover:border-primary/50"
    >
      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
        {stadium.name[contentLang]}
      </h3>
      <p className="mt-1 text-sm text-muted">
        {cityName} &middot; {capacityLabel}: {stadium.capacity.toLocaleString()}
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
    { key: 'mexico', label: dict.stadium.countryMexico },
    { key: 'usa', label: dict.stadium.countryUSA },
    { key: 'canada', label: dict.stadium.countryCanada },
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
        <h1 className="text-3xl font-bold md:text-4xl">{dict.stadium.indexTitle}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">
          {intro}
        </p>

        {countryOrder.map(({ key, label }) => {
          const countryStadiums = stadiumsByCountry[key] ?? []
          if (countryStadiums.length === 0) return null

          return (
            <section key={key} className="mt-10">
              <h2 className="text-2xl font-bold">
                {countryFlags[key]} {label}
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {countryStadiums.map((stadium) => (
                  <StadiumCard key={stadium.id} stadium={stadium} lang={lang} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
