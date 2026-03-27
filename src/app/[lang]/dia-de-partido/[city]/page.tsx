import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMatchDayGuide, getMatchDayGuideSlugs } from '@/lib/content/programmatic'
import { getCityById } from '@/lib/content/cities'
import { getStadiumById } from '@/lib/content/stadiums'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { buildArticleJsonLd, buildFAQPageJsonLd } from '@/lib/jsonld'
import type { Locale } from '@/lib/content/schemas'

const SITE_URL = 'https://www.superfaninfo.com'

export async function generateStaticParams() {
  return getMatchDayGuideSlugs().map(({ city, lang }) => ({ lang, city }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; city: string }>
}): Promise<Metadata> {
  const { lang, city } = await params
  if (!hasLocale(lang)) return {}
  const guide = getMatchDayGuide(city)
  if (!guide) return {}

  const locale = lang as Locale
  const cityData = getCityById(guide.cityId)
  if (!cityData) return {}

  const cityName = cityData.name[locale]
  const section = locale === 'es' ? 'dia-de-partido' : 'match-day'

  const title =
    locale === 'es'
      ? `Guia del dia de partido en ${cityName} — Mundial 2026`
      : `Match Day Guide for ${cityName} — World Cup 2026`

  const description =
    locale === 'es'
      ? `Todo lo que necesitas para el dia de partido en ${cityName}: cuando llegar, transporte, donde comer, que llevar y zonas de fans.`
      : `Everything you need for match day in ${cityName}: when to arrive, transport, where to eat, what to bring and fan zones.`

  return buildPageMetadata({
    title,
    description,
    lang: locale,
    path: `/${lang}/${section}/${city}`,
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/dia-de-partido/${guide.slug}`,
        en: `${SITE_URL}/en/match-day/${guide.slug}`,
        'x-default': `${SITE_URL}/es/dia-de-partido/${guide.slug}`,
      },
    },
  })
}

export default async function MatchDayPage({
  params,
}: {
  params: Promise<{ lang: string; city: string }>
}) {
  const { lang, city } = await params
  if (!hasLocale(lang)) notFound()
  const guide = getMatchDayGuide(city)
  if (!guide) notFound()

  const locale = lang as Locale
  const cityData = getCityById(guide.cityId)
  const stadium = getStadiumById(guide.stadium)
  if (!cityData) notFound()

  const dict = await getDictionary(locale)
  const section = locale === 'es' ? 'dia-de-partido' : 'match-day'
  const cityName = cityData.name[locale]
  const stadiumName = stadium?.name[locale] ?? guide.stadium

  const pageTitle =
    locale === 'es'
      ? `Guia del dia de partido en ${cityName} — Mundial 2026`
      : `Match Day Guide for ${cityName} — World Cup 2026`

  const canonicalUrl = `${SITE_URL}/${lang}/${section}/${guide.slug}`

  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/${section}/${guide.slug}`,
    locale,
    dict.breadcrumbs,
    cityName,
  )

  const faqs = [
    {
      question: {
        es: `Cuanto antes debo llegar al estadio en ${cityName}?`,
        en: `How early should I arrive at the stadium in ${cityName}?`,
      },
      answer: {
        es: `Se recomienda llegar al menos ${guide.arriveHours} horas antes del partido al ${stadiumName}. Los accesos se saturan y los controles de seguridad toman tiempo. Llega antes si no conoces bien la zona.`,
        en: `It is recommended to arrive at least ${guide.arriveHours} hours before the match at ${stadiumName}. Entry points get saturated and security checks take time. Arrive earlier if you are unfamiliar with the area.`,
      },
    },
    {
      question: {
        es: `Como llegar al estadio en dia de partido en ${cityName}?`,
        en: `How to get to the stadium on match day in ${cityName}?`,
      },
      answer: {
        es: guide.transport.es,
        en: guide.transport.en,
      },
    },
    {
      question: {
        es: `Que debo llevar al partido en ${cityName}?`,
        en: `What should I bring to the match in ${cityName}?`,
      },
      answer: {
        es: guide.whatToBring.es,
        en: guide.whatToBring.en,
      },
    },
    {
      question: {
        es: `Donde puedo ver partidos sin boleto en ${cityName}?`,
        en: `Where can I watch matches without a ticket in ${cityName}?`,
      },
      answer: {
        es: `Las zonas de fans oficiales en ${cityName} incluyen: ${guide.fanZones.es}. Muchos bares y restaurantes tambien transmiten los partidos.`,
        en: `Official fan zones in ${cityName} include: ${guide.fanZones.en}. Many bars and restaurants also show the matches.`,
      },
    },
  ]

  const articleJsonLd = buildArticleJsonLd({
    headline: pageTitle,
    description: locale === 'es' ? guide.food.es : guide.food.en,
    url: canonicalUrl,
    dateModified: guide.lastUpdated,
    lang: locale,
  })

  const faqJsonLd = buildFAQPageJsonLd(faqs, locale)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const sections = [
    {
      id: 'cuando-llegar',
      icon: '⏰',
      title: locale === 'es' ? 'Cuando llegar' : 'When to Arrive',
      content:
        locale === 'es'
          ? `Llega al menos ${guide.arriveHours} horas antes del partido al ${stadiumName}. Los controles de seguridad son rigurosos y las filas en los accesos pueden ser largas. Si llegas en transporte publico, suma al menos 30-45 minutos extra al trayecto por el trafico en dias de partido.`
          : `Arrive at least ${guide.arriveHours} hours before the match at ${stadiumName}. Security checks are thorough and entry queues can be long. If using public transport, add at least 30-45 minutes to your journey for match day traffic.`,
    },
    {
      id: 'transporte',
      icon: '🚇',
      title: locale === 'es' ? 'Transporte el dia del partido' : 'Match Day Transport',
      content: guide.transport[locale],
    },
    {
      id: 'donde-comer',
      icon: '🍽',
      title: locale === 'es' ? 'Donde comer antes del partido' : 'Where to Eat Before the Match',
      content: guide.food[locale],
    },
    {
      id: 'zonas-fans',
      icon: '📍',
      title: locale === 'es' ? 'Zonas de fans' : 'Fan Zones',
      content:
        locale === 'es'
          ? `Las principales zonas de fans y lugares para ver los partidos en ${cityName}: ${guide.fanZones.es}.`
          : `Main fan zones and viewing areas in ${cityName}: ${guide.fanZones.en}.`,
    },
    {
      id: 'que-llevar',
      icon: '🎒',
      title: locale === 'es' ? 'Que llevar al estadio' : 'What to Bring to the Stadium',
      content: guide.whatToBring[locale],
    },
    {
      id: 'clima',
      icon: '🌤',
      title: locale === 'es' ? 'Preparacion para el clima' : 'Weather Preparation',
      content: guide.weatherWarning[locale],
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Breadcrumbs items={breadcrumbs} />

      <article className="mx-auto max-w-4xl space-y-12 py-6">
        {/* Hero */}
        <header className="space-y-4">
          <h1 className="text-3xl font-bold md:text-4xl">{pageTitle}</h1>
          <p className="text-muted-foreground">
            {stadiumName} &bull; {locale === 'es' ? 'Mundial FIFA 2026' : 'FIFA World Cup 2026'}
          </p>
        </header>

        {/* Quick info card */}
        <aside className="rounded-lg border border-border p-6">
          <p className="font-semibold mb-3">{locale === 'es' ? 'Datos clave' : 'Key facts'}</p>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="font-medium">{locale === 'es' ? 'Estadio: ' : 'Stadium: '}</span>
              <a
                href={`/${lang}/${locale === 'es' ? 'estadios' : 'stadiums'}/${stadium?.slugs[locale] ?? guide.stadium}`}
                className="text-primary underline"
              >
                {stadiumName}
              </a>
            </li>
            <li>
              <span className="font-medium">
                {locale === 'es' ? 'Llega con anticipacion: ' : 'Arrive early: '}
              </span>
              {locale === 'es'
                ? `${guide.arriveHours} horas antes del partido`
                : `${guide.arriveHours} hours before the match`}
            </li>
          </ul>
        </aside>

        {/* Sections */}
        {sections.map((sec) => (
          <section key={sec.id} id={sec.id}>
            <h2 className="text-2xl font-bold mb-4">
              {sec.icon} {sec.title}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">{sec.content}</p>
          </section>
        ))}

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {locale === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions'}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="rounded-lg border border-border p-4">
                <summary className="cursor-pointer font-semibold">{faq.question[locale]}</summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{faq.answer[locale]}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Cross links */}
        <section className="rounded-lg bg-muted/20 p-6">
          <h3 className="font-bold mb-3">
            {locale === 'es' ? 'Mas informacion sobre ' : 'More about '}{cityName}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={`/${lang}/${locale === 'es' ? 'ciudades' : 'cities'}/${cityData.slugs[locale]}`}
                className="text-primary underline"
              >
                {locale === 'es' ? `Guia completa de ${cityName}` : `Complete guide to ${cityName}`}
              </a>
            </li>
            {stadium && (
              <li>
                <a
                  href={`/${lang}/${locale === 'es' ? 'estadios' : 'stadiums'}/${stadium.slugs[locale]}`}
                  className="text-primary underline"
                >
                  {locale === 'es' ? `Guia del ${stadiumName}` : `${stadiumName} Guide`}
                </a>
              </li>
            )}
          </ul>
        </section>

        <footer className="border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            {locale === 'es' ? 'Datos actualizados: ' : 'Data updated: '}{guide.lastUpdated}
            {' | '}
            {locale === 'es'
              ? 'Este sitio no esta afiliado con la FIFA.'
              : 'This site is not affiliated with FIFA.'}
          </p>
        </footer>
      </article>
    </>
  )
}
