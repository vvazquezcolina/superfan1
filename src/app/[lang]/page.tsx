import type { Metadata } from 'next'
import Link from 'next/link'
import { getDictionary, hasLocale } from './dictionaries'
import { notFound } from 'next/navigation'
import { buildPageMetadata } from '@/lib/seo'
import { buildHomeAlternates } from '@/lib/i18n'
import { getCities } from '@/lib/content/cities'
import { getStadiums } from '@/lib/content/stadiums'
import { getCityById } from '@/lib/content/cities'
import { buildOrganizationJsonLd, buildItemListJsonLd, buildSiteNavigationJsonLd, buildFAQPageJsonLd } from '@/lib/jsonld'
import type { Locale, City, Stadium } from '@/lib/content/schemas'
import { toContentLocale } from '@/lib/content/locale'
import { CountdownTimer } from '@/components/engagement/CountdownTimer'
import { NewsletterSignup } from '@/components/engagement/NewsletterSignup'
import { ExitIntentWrapper } from '@/components/engagement/ExitIntentWrapper'
import {
  MapPin, Building2, Users, Plane, Calendar, Wrench,
  ChevronRight, Trophy, Globe, Ticket
} from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)

  const { toContentLocale: getContentLocale } = await import('@/lib/content/cities')
  return buildPageMetadata({
    title: dict.site.tagline,
    description: dict.home.description,
    lang: getContentLocale(lang),
    path: `/${lang}`,
    alternates: buildHomeAlternates(),
  })
}

const countryFlags: Record<string, string> = {
  mexico: '\u{1F1F2}\u{1F1FD}',
  usa: '\u{1F1FA}\u{1F1F8}',
  canada: '\u{1F1E8}\u{1F1E6}',
}

const countryColors: Record<string, string> = {
  mexico: 'border-t-green-600',
  usa: 'border-t-blue-600',
  canada: 'border-t-red-600',
}

function FeaturedCityCard({ city, lang, contentLocale, citiesPath }: { city: City; lang: string; contentLocale: Locale; citiesPath: string }) {
  const slug = city.slugs[contentLocale]
  const overview = city.content.overview[contentLocale]
  const excerpt = overview.length > 140 ? overview.slice(0, 137) + '...' : overview
  const flag = countryFlags[city.country] ?? ''
  const colorClass = countryColors[city.country] ?? 'border-t-primary'
  const readMore = contentLocale === 'es' ? 'Leer mas' : 'Read more'

  return (
    <Link
      href={`/${lang}/${citiesPath}/${slug}`}
      className={`group block rounded-lg border border-border border-t-4 ${colorClass} p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5`}
    >
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
          {flag} {city.name[contentLocale]}
        </h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {excerpt}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
        {readMore} <ChevronRight className="h-3 w-3" />
      </span>
    </Link>
  )
}

function FeaturedStadiumCard({
  stadium,
  lang,
  contentLocale,
  stadiumsPath,
  dict,
}: {
  stadium: Stadium
  lang: string
  contentLocale: Locale
  stadiumsPath: string
  dict: { stadiumCapacity: string }
}) {
  const slug = stadium.slugs[contentLocale]
  const overview = stadium.content.overview[contentLocale]
  const excerpt = overview.length > 140 ? overview.slice(0, 137) + '...' : overview
  const city = getCityById(stadium.city)
  const cityName = city ? city.name[contentLocale] : ''
  const countryKey = city?.country ?? 'usa'
  const colorClass = countryColors[countryKey] ?? 'border-t-primary'
  const readMore = contentLocale === 'es' ? 'Leer mas' : 'Read more'

  return (
    <Link
      href={`/${lang}/${stadiumsPath}/${slug}`}
      className={`group block rounded-lg border border-border border-t-4 ${colorClass} p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5`}
    >
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-primary" />
        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
          {stadium.name[contentLocale]}
        </h3>
      </div>
      <p className="mt-1 text-sm text-muted">
        {cityName} &middot; {dict.stadiumCapacity}: {stadium.capacity.toLocaleString()}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {excerpt}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
        {readMore} <ChevronRight className="h-3 w-3" />
      </span>
    </Link>
  )
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as import('@/app/[lang]/dictionaries').Locale
  // Content locale maps new locales (pt/fr/de/ar) to 'en' for data field lookups
  const contentLocale: Locale = toContentLocale(lang)
  const dict = await getDictionary(locale)

  // WebSite JSON-LD (per D-09)
  const { hreflangMap } = await import('@/lib/i18n')
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: dict.site.name,
    url: `https://www.superfaninfo.com/${lang}`,
    description: dict.home.description,
    inLanguage: hreflangMap[locale],
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

  // Organization JSON-LD injected in layout.tsx; keep for reference only
  void buildOrganizationJsonLd(contentLocale)
  const { pathTranslations } = await import('@/lib/i18n')
  const citiesPath = pathTranslations.ciudades[locale] ?? 'cities'
  const stadiumsPath = pathTranslations.estadios[locale] ?? 'stadiums'
  const teamsPath = pathTranslations.equipos[locale] ?? 'teams'
  const itemListItems = [
    ...featuredCities.map((city) => ({
      name: city.name[contentLocale],
      url: `https://www.superfaninfo.com/${lang}/${citiesPath}/${city.slugs[contentLocale]}`,
    })),
    ...featuredStadiums.map((stadium) => ({
      name: stadium.name[contentLocale],
      url: `https://www.superfaninfo.com/${lang}/${stadiumsPath}/${stadium.slugs[contentLocale]}`,
    })),
  ]
  const itemListJsonLd = buildItemListJsonLd(itemListItems, contentLocale)
  const siteNavJsonLd = buildSiteNavigationJsonLd(contentLocale)

  const homeFaqs = [
    {
      question: {
        es: '¿Cuándo empieza el Mundial 2026?',
        en: 'When does the 2026 World Cup start?',
      },
      answer: {
        es: 'El Mundial FIFA 2026 comienza el 11 de junio de 2026 con el partido inaugural en la Ciudad de México.',
        en: 'The FIFA World Cup 2026 starts on June 11, 2026 with the opening match in Mexico City.',
      },
    },
    {
      question: {
        es: '¿Qué países organizan el Mundial 2026?',
        en: 'Which countries host the 2026 World Cup?',
      },
      answer: {
        es: 'El Mundial 2026 es organizado conjuntamente por México, Estados Unidos y Canadá. Es la primera Copa del Mundo con tres países anfitriones.',
        en: 'The 2026 World Cup is jointly hosted by Mexico, the United States, and Canada. It is the first World Cup with three host nations.',
      },
    },
    {
      question: {
        es: '¿Cuántos equipos participan en el Mundial 2026?',
        en: 'How many teams play in 2026?',
      },
      answer: {
        es: 'El Mundial 2026 contará con 48 selecciones nacionales, ampliado desde los 32 equipos del formato anterior.',
        en: 'The 2026 World Cup will feature 48 national teams, expanded from the previous 32-team format.',
      },
    },
    {
      question: {
        es: '¿Cuántos estadios albergan partidos del Mundial 2026?',
        en: 'How many stadiums host matches?',
      },
      answer: {
        es: 'El Mundial 2026 se celebrará en 16 estadios distribuidos en 16 ciudades sede de México, Estados Unidos y Canadá.',
        en: 'The 2026 World Cup will be held across 16 stadiums in 16 host cities spread across Mexico, the United States, and Canada.',
      },
    },
    {
      question: {
        es: '¿Dónde es la final del Mundial 2026?',
        en: 'Where is the World Cup 2026 final?',
      },
      answer: {
        es: 'La final del Mundial FIFA 2026 se jugará en el MetLife Stadium en East Rutherford, Nueva Jersey, en el área metropolitana de Nueva York.',
        en: 'The FIFA World Cup 2026 final will be played at MetLife Stadium in East Rutherford, New Jersey, in the New York/New Jersey metropolitan area.',
      },
    },
  ]
  const homeFaqJsonLd = buildFAQPageJsonLd(homeFaqs, contentLocale)

  // Navigation cards with icons for the "Explore" section
  const travelPath = contentLocale === 'es' ? 'viajes' : 'travel'
  const toolsPath = contentLocale === 'es' ? 'herramientas' : 'tools'
  const calendarLabel = contentLocale === 'es' ? 'Calendario' : 'Schedule'
  const calendarDesc = contentLocale === 'es' ? '48 partidos de grupos' : '48 group matches'
  const fanLabel = contentLocale === 'es' ? 'Fan Zone' : 'Fan Zone'
  const fanDesc = contentLocale === 'es' ? 'Entradas y seguridad' : 'Tickets & safety'
  const toolsLabel = contentLocale === 'es' ? 'Herramientas' : 'Tools'
  const toolsDesc = contentLocale === 'es' ? 'Presupuesto, mapa y mas' : 'Budget, map & more'

  const exploreCards = [
    { href: `/${lang}/${citiesPath}`, icon: MapPin, label: dict.nav.cities, desc: dict.home.citiesCount },
    { href: `/${lang}/${stadiumsPath}`, icon: Building2, label: dict.nav.stadiums, desc: dict.home.stadiumsCount },
    { href: `/${lang}/${teamsPath}`, icon: Users, label: dict.nav.teams, desc: contentLocale === 'es' ? '48 selecciones' : '48 teams' },
    { href: `/${lang}/${travelPath}`, icon: Plane, label: dict.nav.travel, desc: contentLocale === 'es' ? 'Vuelos y hospedaje' : 'Flights & hotels' },
    { href: `/${lang}/calendario`, icon: Calendar, label: calendarLabel, desc: calendarDesc },
    { href: `/${lang}/fan`, icon: Ticket, label: fanLabel, desc: fanDesc },
    { href: `/${lang}/${toolsPath}`, icon: Wrench, label: toolsLabel, desc: toolsDesc },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {siteNavJsonLd.map((navItem, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(navItem) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }}
      />

      <div className="mx-auto max-w-6xl py-6">
        {/* Hero Section - Gradient background */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-secondary px-6 py-14 text-center text-white md:px-12 md:py-20">
          {/* Decorative background pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent" />
          </div>

          <div className="relative z-10">
            <div className="mx-auto mb-4 flex items-center justify-center gap-2">
              <Trophy className="h-8 w-8 text-accent" />
              <span className="text-sm font-semibold uppercase tracking-widest text-accent">
                {contentLocale === 'es' ? 'Mexico \u00B7 USA \u00B7 Canada' : 'Mexico \u00B7 USA \u00B7 Canada'}
              </span>
              <Globe className="h-8 w-8 text-accent" />
            </div>

            <h1 className="text-3xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              {dict.home.heading}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80 md:text-xl">
              {dict.home.subheading}
            </p>

            {/* Countdown */}
            <CountdownTimer
              targetDate="2026-06-11T00:00:00Z"
              initialDays={daysUntil}
              dict={dict.countdown}
            />

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/${lang}/${citiesPath}`}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3 text-base font-bold text-primary shadow-lg transition-all hover:bg-accent-light hover:shadow-xl"
              >
                <MapPin className="h-4 w-4" />
                {dict.home.heroCta}
              </Link>
              <Link
                href={`/${lang}/calendario`}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-8 py-3 text-base font-semibold text-white transition-all hover:border-white hover:bg-white/10"
              >
                <Calendar className="h-4 w-4" />
                {calendarLabel}
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="mt-8 grid grid-cols-3 gap-4 rounded-xl border border-border bg-white p-6 text-center shadow-sm">
          <div>
            <p className="text-3xl font-extrabold text-primary md:text-4xl">16</p>
            <p className="mt-1 text-sm font-medium text-muted">{dict.home.citiesCount}</p>
          </div>
          <div className="border-x border-border">
            <p className="text-3xl font-extrabold text-primary md:text-4xl">16</p>
            <p className="mt-1 text-sm font-medium text-muted">{dict.home.stadiumsCount}</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-primary md:text-4xl">48</p>
            <p className="mt-1 text-sm font-medium text-muted">{contentLocale === 'es' ? '48 selecciones' : '48 teams'}</p>
          </div>
        </section>

        {/* Quick Navigation Grid */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold md:text-3xl">{dict.home.exploreMore}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {exploreCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border p-5 text-center shadow-sm transition-all hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5"
              >
                <div className="rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                  <card.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-bold group-hover:text-primary transition-colors">
                  {card.label}
                </p>
                <p className="text-xs text-muted">{card.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Cities */}
        <section className="mt-14">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">{dict.home.featuredCities}</h2>
            <Link
              href={`/${lang}/${citiesPath}`}
              className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex"
            >
              {dict.home.viewAllCities} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCities.map((city) => (
              <FeaturedCityCard key={city.id} city={city} lang={lang} contentLocale={contentLocale} citiesPath={citiesPath} />
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link
              href={`/${lang}/${citiesPath}`}
              className="inline-flex items-center gap-1 text-base font-semibold text-primary hover:underline"
            >
              {dict.home.viewAllCities} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Featured Stadiums */}
        <section className="mt-14">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">{dict.home.featuredStadiums}</h2>
            <Link
              href={`/${lang}/${stadiumsPath}`}
              className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex"
            >
              {dict.home.viewAllStadiums} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredStadiums.map((stadium) => (
              <FeaturedStadiumCard
                key={stadium.id}
                stadium={stadium}
                lang={lang}
                contentLocale={contentLocale}
                stadiumsPath={stadiumsPath}
                dict={{ stadiumCapacity: dict.home.stadiumCapacity }}
              />
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link
              href={`/${lang}/${stadiumsPath}`}
              className="inline-flex items-center gap-1 text-base font-semibold text-primary hover:underline"
            >
              {dict.home.viewAllStadiums} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Why SuperFan */}
        <section className="mt-14 rounded-2xl bg-primary/5 px-6 py-10 md:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <Trophy className="mx-auto h-10 w-10 text-accent" />
            <h2 className="mt-4 text-2xl font-bold md:text-3xl">{dict.home.whySuperfan}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {dict.home.whyText}
            </p>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-14">
          <NewsletterSignup dict={dict.newsletter} variant="inline" />
        </section>

        {/* FAQ Section */}
        <section className="mt-14 mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold md:text-3xl">
            {contentLocale === 'es' ? 'Preguntas frecuentes sobre el Mundial 2026' : 'Frequently Asked Questions About the 2026 World Cup'}
          </h2>
          <div className="mt-6 space-y-3">
            {homeFaqs.map((faq, i) => (
              <details key={i} className="group rounded-lg border border-border p-4 transition-colors open:bg-primary/5">
                <summary className="cursor-pointer font-semibold list-none flex items-center justify-between">
                  {faq.question[contentLocale]}
                  <ChevronRight className="h-4 w-4 text-muted transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{faq.answer[contentLocale]}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="mt-10 text-center text-sm text-muted">
          {contentLocale === 'es' ? 'Ultima actualizacion' : 'Last updated'}: {new Date().toISOString().split('T')[0]}
        </p>
      </div>

      <ExitIntentWrapper dict={dict.newsletter} />
    </>
  )
}
