import type { Metadata } from 'next'
import { getDictionary, hasLocale } from './dictionaries'
import { notFound } from 'next/navigation'
import { buildPageMetadata } from '@/lib/seo'
import { buildHomeAlternates } from '@/lib/i18n'
import { getCities } from '@/lib/content/cities'
import { getStadiums } from '@/lib/content/stadiums'
import { getCityById } from '@/lib/content/cities'
import { buildOrganizationJsonLd, buildItemListJsonLd } from '@/lib/jsonld'
import type { Locale, City, Stadium } from '@/lib/content/schemas'
import { CountdownTimer } from '@/components/engagement/CountdownTimer'
import { NewsletterSignup } from '@/components/engagement/NewsletterSignup'
import { ExitIntentWrapper } from '@/components/engagement/ExitIntentWrapper'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)

  return buildPageMetadata({
    title: dict.site.tagline,
    description: dict.home.description,
    lang: lang as Locale,
    path: `/${lang}`,
    alternates: buildHomeAlternates(),
  })
}

const countryFlags: Record<string, string> = {
  mexico: '\u{1F1F2}\u{1F1FD}',
  usa: '\u{1F1FA}\u{1F1F8}',
  canada: '\u{1F1E8}\u{1F1E6}',
}

function FeaturedCityCard({ city, lang }: { city: City; lang: Locale }) {
  const section = lang === 'es' ? 'ciudades' : 'cities'
  const slug = city.slugs[lang]
  const overview = city.content.overview[lang]
  const excerpt = overview.length > 140 ? overview.slice(0, 137) + '...' : overview
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
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {excerpt}
      </p>
      <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:underline">
        {readMore} &rarr;
      </span>
    </a>
  )
}

function FeaturedStadiumCard({
  stadium,
  lang,
  dict,
}: {
  stadium: Stadium
  lang: Locale
  dict: { stadiumCapacity: string }
}) {
  const section = lang === 'es' ? 'estadios' : 'stadiums'
  const slug = stadium.slugs[lang]
  const overview = stadium.content.overview[lang]
  const excerpt = overview.length > 140 ? overview.slice(0, 137) + '...' : overview
  const city = getCityById(stadium.city)
  const cityName = city ? city.name[lang] : ''
  const readMore = lang === 'es' ? 'Leer mas' : 'Read more'

  return (
    <a
      href={`/${lang}/${section}/${slug}`}
      className="group block rounded-lg border border-border p-6 shadow-sm transition-shadow hover:shadow-md hover:border-primary/50"
    >
      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
        {stadium.name[lang]}
      </h3>
      <p className="mt-1 text-sm text-muted">
        {cityName} &middot; {dict.stadiumCapacity}: {stadium.capacity.toLocaleString()}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {excerpt}
      </p>
      <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:underline">
        {readMore} &rarr;
      </span>
    </a>
  )
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale
  const dict = await getDictionary(locale)

  // WebSite JSON-LD (per D-09)
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: dict.site.name,
    url: `https://www.superfaninfo.com/${lang}`,
    description: dict.home.description,
    inLanguage: lang === 'es' ? 'es-419' : 'en',
  }

  // Countdown: days until June 11, 2026
  const targetDate = new Date('2026-06-11T00:00:00Z')
  const now = new Date()
  const daysUntil = Math.max(0, Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

  // Featured cities: one from each country (CDMX, LA, Toronto)
  const cities = getCities()
  const featuredCityIds = ['ciudad-de-mexico', 'los-angeles', 'toronto']
  const featuredCities = featuredCityIds
    .map((id) => cities.find((c) => c.id === id))
    .filter((c): c is City => c !== undefined)

  // Featured stadiums: one from each country (Azteca, SoFi, BC Place)
  const stadiums = getStadiums()
  const featuredStadiumIds = ['estadio-azteca', 'sofi-stadium', 'bc-place']
  const featuredStadiums = featuredStadiumIds
    .map((id) => stadiums.find((s) => s.id === id))
    .filter((s): s is Stadium => s !== undefined)

  // Organization + ItemList JSON-LD
  const organizationJsonLd = buildOrganizationJsonLd(locale)
  const itemListItems = [
    ...featuredCities.map((city) => ({
      name: city.name[locale],
      url: `https://www.superfaninfo.com/${lang}/${lang === 'es' ? 'ciudades' : 'cities'}/${city.slugs[locale]}`,
    })),
    ...featuredStadiums.map((stadium) => ({
      name: stadium.name[locale],
      url: `https://www.superfaninfo.com/${lang}/${lang === 'es' ? 'estadios' : 'stadiums'}/${stadium.slugs[locale]}`,
    })),
  ]
  const itemListJsonLd = buildItemListJsonLd(itemListItems, locale)

  // Section paths
  const citiesPath = lang === 'es' ? 'ciudades' : 'cities'
  const stadiumsPath = lang === 'es' ? 'estadios' : 'stadiums'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <div className="mx-auto max-w-6xl py-6">
        {/* Hero Section */}
        <section className="rounded-lg bg-primary/10 px-6 py-12 text-center md:px-12 md:py-16">
          <h1 className="text-3xl font-bold md:text-5xl">
            {dict.home.heading}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted md:text-xl">
            {dict.home.subheading}
          </p>

          {/* Countdown */}
          <CountdownTimer
            targetDate="2026-06-11T00:00:00Z"
            initialDays={daysUntil}
            dict={dict.countdown}
          />

          {/* Hero CTA */}
          <a
            href={`/${lang}/${citiesPath}`}
            className="mt-8 inline-block rounded-md bg-primary px-8 py-3 text-base font-semibold text-white shadow-sm transition-shadow hover:shadow-md"
          >
            {dict.home.heroCta}
          </a>
        </section>

        {/* Stats Bar */}
        <section className="mt-8 grid grid-cols-3 gap-4 rounded-lg border border-border p-6 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">16</p>
            <p className="mt-1 text-sm text-muted">{dict.home.citiesCount}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">16</p>
            <p className="mt-1 text-sm text-muted">{dict.home.stadiumsCount}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">3</p>
            <p className="mt-1 text-sm text-muted">{dict.home.countriesCount}</p>
          </div>
        </section>

        {/* Featured Cities */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold md:text-3xl">{dict.home.featuredCities}</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCities.map((city) => (
              <FeaturedCityCard key={city.id} city={city} lang={locale} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <a
              href={`/${lang}/${citiesPath}`}
              className="inline-block text-base font-semibold text-primary hover:underline"
            >
              {dict.home.viewAllCities} &rarr;
            </a>
          </div>
        </section>

        {/* Featured Stadiums */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold md:text-3xl">{dict.home.featuredStadiums}</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredStadiums.map((stadium) => (
              <FeaturedStadiumCard
                key={stadium.id}
                stadium={stadium}
                lang={locale}
                dict={{ stadiumCapacity: dict.home.stadiumCapacity }}
              />
            ))}
          </div>
          <div className="mt-6 text-center">
            <a
              href={`/${lang}/${stadiumsPath}`}
              className="inline-block text-base font-semibold text-primary hover:underline"
            >
              {dict.home.viewAllStadiums} &rarr;
            </a>
          </div>
        </section>

        {/* Why SuperFan */}
        <section className="mt-12 mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold md:text-3xl">{dict.home.whySuperfan}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {dict.home.whyText}
          </p>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-12">
          <NewsletterSignup dict={dict.newsletter} variant="inline" />
        </section>

        {/* CTA Links Section */}
        <section className="mt-12">
          <h2 className="sr-only">{dict.home.exploreMore}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <a
              href={`/${lang}/${citiesPath}`}
              className="group rounded-lg border border-border p-6 text-center shadow-sm transition-shadow hover:shadow-md hover:border-primary/50"
            >
              <p className="text-lg font-bold group-hover:text-primary transition-colors">
                {dict.nav.cities}
              </p>
              <p className="mt-1 text-sm text-muted">{dict.home.citiesCount}</p>
            </a>
            <a
              href={`/${lang}/${stadiumsPath}`}
              className="group rounded-lg border border-border p-6 text-center shadow-sm transition-shadow hover:shadow-md hover:border-primary/50"
            >
              <p className="text-lg font-bold group-hover:text-primary transition-colors">
                {dict.nav.stadiums}
              </p>
              <p className="mt-1 text-sm text-muted">{dict.home.stadiumsCount}</p>
            </a>
            <div className="relative rounded-lg border border-border p-6 text-center opacity-60">
              <p className="text-lg font-bold">{dict.nav.teams}</p>
              <span className="mt-1 inline-block rounded-full bg-muted/20 px-3 py-0.5 text-xs font-medium text-muted">
                {dict.home.comingSoon}
              </span>
            </div>
            <div className="relative rounded-lg border border-border p-6 text-center opacity-60">
              <p className="text-lg font-bold">{dict.nav.travel}</p>
              <span className="mt-1 inline-block rounded-full bg-muted/20 px-3 py-0.5 text-xs font-medium text-muted">
                {dict.home.comingSoon}
              </span>
            </div>
          </div>
        </section>

        <p className="mt-8 text-center text-sm text-muted">
          {locale === 'es' ? 'Ultima actualizacion' : 'Last updated'}: {new Date().toISOString().split('T')[0]}
        </p>
      </div>

      <ExitIntentWrapper dict={dict.newsletter} />
    </>
  )
}
