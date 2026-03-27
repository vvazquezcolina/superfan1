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
import { toContentLocale } from '@/lib/content/cities'

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

  const contentLocale: Locale = toContentLocale(lang)
  const cityData = getCityById(guide.cityId)
  if (!cityData) return {}

  const cityName = cityData.name[contentLocale]
  const section = contentLocale === 'es' ? 'dia-de-partido' : 'match-day'

  const title =
    contentLocale === 'es'
      ? `Guia del dia de partido en ${cityName} — Mundial 2026`
      : `Match Day Guide for ${cityName} — World Cup 2026`

  const description =
    contentLocale === 'es'
      ? `Todo lo que necesitas para el dia de partido en ${cityName}: cuando llegar, transporte, donde comer, que llevar y zonas de fans.`
      : `Everything you need for match day in ${cityName}: when to arrive, transport, where to eat, what to bring and fan zones.`

  return buildPageMetadata({
    title,
    description,
    lang: contentLocale,
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

  const locale = lang as import('@/app/[lang]/dictionaries').Locale
  const contentLocale: Locale = toContentLocale(lang)
  const cityData = getCityById(guide.cityId)
  const stadium = getStadiumById(guide.stadium)
  if (!cityData) notFound()

  const dict = await getDictionary(locale)
  const section = contentLocale === 'es' ? 'dia-de-partido' : 'match-day'
  const cityName = cityData.name[contentLocale]
  const stadiumName = stadium?.name[contentLocale] ?? guide.stadium

  const pageTitle =
    contentLocale === 'es'
      ? `Guia del dia de partido en ${cityName} — Mundial 2026`
      : `Match Day Guide for ${cityName} — World Cup 2026`

  const canonicalUrl = `${SITE_URL}/${lang}/${section}/${guide.slug}`

  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/${section}/${guide.slug}`,
    contentLocale,
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
    description: contentLocale === 'es' ? guide.food.es : guide.food.en,
    url: canonicalUrl,
    dateModified: guide.lastUpdated,
    lang: contentLocale,
  })

  const faqJsonLd = buildFAQPageJsonLd(faqs, contentLocale)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const sections = [
    {
      id: 'cuando-llegar',
      icon: '⏰',
      title: contentLocale === 'es' ? 'Cuando llegar' : 'When to Arrive',
      content:
        contentLocale === 'es'
          ? `Llega al menos ${guide.arriveHours} horas antes del partido al ${stadiumName}. Los controles de seguridad son rigurosos y las filas en los accesos pueden ser largas. Si llegas en transporte publico, suma al menos 30-45 minutos extra al trayecto por el trafico en dias de partido.`
          : `Arrive at least ${guide.arriveHours} hours before the match at ${stadiumName}. Security checks are thorough and entry queues can be long. If using public transport, add at least 30-45 minutes to your journey for match day traffic.`,
    },
    {
      id: 'transporte',
      icon: '🚇',
      title: contentLocale === 'es' ? 'Transporte el dia del partido' : 'Match Day Transport',
      content: guide.transport[contentLocale],
    },
    {
      id: 'donde-comer',
      icon: '🍽',
      title: contentLocale === 'es' ? 'Donde comer antes del partido' : 'Where to Eat Before the Match',
      content: guide.food[contentLocale],
    },
    {
      id: 'zonas-fans',
      icon: '📍',
      title: contentLocale === 'es' ? 'Zonas de fans' : 'Fan Zones',
      content:
        contentLocale === 'es'
          ? `Las principales zonas de fans y lugares para ver los partidos en ${cityName}: ${guide.fanZones.es}.`
          : `Main fan zones and viewing areas in ${cityName}: ${guide.fanZones.en}.`,
    },
    {
      id: 'que-llevar',
      icon: '🎒',
      title: contentLocale === 'es' ? 'Que llevar al estadio' : 'What to Bring to the Stadium',
      content: guide.whatToBring[contentLocale],
    },
    {
      id: 'clima',
      icon: '🌤',
      title: contentLocale === 'es' ? 'Preparacion para el clima' : 'Weather Preparation',
      content: guide.weatherWarning[contentLocale],
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
            {stadiumName} &bull; {contentLocale === 'es' ? 'Mundial FIFA 2026' : 'FIFA World Cup 2026'}
          </p>
        </header>

        {/* Quick info card */}
        <aside className="rounded-lg border border-border p-6">
          <p className="font-semibold mb-3">{contentLocale === 'es' ? 'Datos clave' : 'Key facts'}</p>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="font-medium">{contentLocale === 'es' ? 'Estadio: ' : 'Stadium: '}</span>
              <a
                href={`/${lang}/${contentLocale === 'es' ? 'estadios' : 'stadiums'}/${stadium?.slugs[contentLocale] ?? guide.stadium}`}
                className="text-primary underline"
              >
                {stadiumName}
              </a>
            </li>
            <li>
              <span className="font-medium">
                {contentLocale === 'es' ? 'Llega con anticipacion: ' : 'Arrive early: '}
              </span>
              {contentLocale === 'es'
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
            {contentLocale === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions'}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="rounded-lg border border-border p-4">
                <summary className="cursor-pointer font-semibold">{faq.question[contentLocale]}</summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{faq.answer[contentLocale]}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Cross links */}
        <section className="rounded-lg bg-muted/20 p-6">
          <h3 className="font-bold mb-3">
            {contentLocale === 'es' ? 'Mas informacion sobre ' : 'More about '}{cityName}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={`/${lang}/${contentLocale === 'es' ? 'ciudades' : 'cities'}/${cityData.slugs[contentLocale]}`}
                className="text-primary underline"
              >
                {contentLocale === 'es' ? `Guia completa de ${cityName}` : `Complete guide to ${cityName}`}
              </a>
            </li>
            {stadium && (
              <li>
                <a
                  href={`/${lang}/${contentLocale === 'es' ? 'estadios' : 'stadiums'}/${stadium.slugs[contentLocale]}`}
                  className="text-primary underline"
                >
                  {contentLocale === 'es' ? `Guia del ${stadiumName}` : `${stadiumName} Guide`}
                </a>
              </li>
            )}
          </ul>
        </section>

        <footer className="border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            {contentLocale === 'es' ? 'Datos actualizados: ' : 'Data updated: '}{guide.lastUpdated}
            {' | '}
            {contentLocale === 'es'
              ? 'Este sitio no esta afiliado con la FIFA.'
              : 'This site is not affiliated with FIFA.'}
          </p>
        </footer>
      </article>
    </>
  )
}
