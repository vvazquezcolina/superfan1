import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCityComparison, getComparisonSlugs } from '@/lib/content/programmatic'
import { getCityById } from '@/lib/content/cities'
import { getStadiumById } from '@/lib/content/stadiums'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { buildArticleJsonLd, buildFAQPageJsonLd } from '@/lib/jsonld'
import type { Locale } from '@/lib/content/schemas'
import { toContentLocale } from '@/lib/content/locale'

const SITE_URL = 'https://www.superfaninfo.com'

export async function generateStaticParams() {
  return getComparisonSlugs().map(({ pair, lang }) => ({ lang, pair }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; pair: string }>
}): Promise<Metadata> {
  const { lang, pair } = await params
  if (!hasLocale(lang)) return {}
  const comparison = getCityComparison(pair)
  if (!comparison) return {}

  const locale: Locale = toContentLocale(lang)
  const city1 = getCityById(comparison.city1)
  const city2 = getCityById(comparison.city2)
  if (!city1 || !city2) return {}

  const c1Name = city1.name[locale]
  const c2Name = city2.name[locale]

  const title =
    locale === 'es'
      ? `${c1Name} vs ${c2Name}: Comparacion completa para el Mundial 2026`
      : `${c1Name} vs ${c2Name}: Complete World Cup 2026 Comparison`

  const description =
    locale === 'es'
      ? `Compara ${c1Name} y ${c2Name} para el Mundial 2026: costos, transporte, clima, gastronomia y seguridad. Todo lo que necesitas para elegir tu destino.`
      : `Compare ${c1Name} and ${c2Name} for the 2026 World Cup: costs, transport, weather, food and safety. Everything you need to choose your destination.`

  const slug = comparison.slugs.es

  return buildPageMetadata({
    title,
    description,
    lang: locale,
    path: `/${lang}/comparar/${slug}`,
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/comparar/${comparison.slugs.es}`,
        en: `${SITE_URL}/en/comparar/${comparison.slugs.es}`,
        'x-default': `${SITE_URL}/es/comparar/${comparison.slugs.es}`,
      },
    },
  })
}

function WinnerBadge({ winner, cityId, locale }: { winner: string; cityId: string; locale: Locale }) {
  if (winner === 'empate') {
    return (
      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
        {locale === 'es' ? 'Empate' : 'Tie'}
      </span>
    )
  }
  if (winner === cityId) {
    return (
      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
        {locale === 'es' ? 'Mejor opcion' : 'Better option'}
      </span>
    )
  }
  return null
}

export default async function CityComparisonPage({
  params,
}: {
  params: Promise<{ lang: string; pair: string }>
}) {
  const { lang, pair } = await params
  if (!hasLocale(lang)) notFound()
  const comparison = getCityComparison(pair)
  if (!comparison) notFound()

  const dictLocale = lang as import('@/app/[lang]/dictionaries').Locale
  const locale: Locale = toContentLocale(lang)
  const city1 = getCityById(comparison.city1)
  const city2 = getCityById(comparison.city2)
  if (!city1 || !city2) notFound()

  const dict = await getDictionary(dictLocale)
  const slug = comparison.slugs.es

  const c1Name = city1.name[locale]
  const c2Name = city2.name[locale]

  const stadium1 = getStadiumById(city1.stadium)
  const stadium2 = getStadiumById(city2.stadium)

  const pageTitle =
    locale === 'es'
      ? `${c1Name} vs ${c2Name}: Comparacion completa para el Mundial 2026`
      : `${c1Name} vs ${c2Name}: Complete World Cup 2026 Comparison`

  const canonicalUrl = `${SITE_URL}/${lang}/comparar/${slug}`

  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/comparar/${slug}`,
    locale,
    dict.breadcrumbs,
    `${c1Name} vs ${c2Name}`,
  )

  const faqs = [
    {
      question: {
        es: `Cual ciudad es mas barata para el Mundial: ${c1Name} o ${c2Name}?`,
        en: `Which city is cheaper for the World Cup: ${c1Name} or ${c2Name}?`,
      },
      answer: {
        es: `${comparison.recommendation.budget === comparison.city1 ? c1Name : comparison.recommendation.budget === comparison.city2 ? c2Name : 'Ambas ciudades tienen costos similares'}. El hotel promedio en ${c1Name} cuesta alrededor de $${comparison.metrics.costPerNight.city1} USD/noche, mientras que en ${c2Name} ronda los $${comparison.metrics.costPerNight.city2} USD/noche.`,
        en: `${comparison.recommendation.budget === comparison.city1 ? c1Name : comparison.recommendation.budget === comparison.city2 ? c2Name : 'Both cities have similar costs'}. The average hotel in ${c1Name} costs around $${comparison.metrics.costPerNight.city1} USD/night, while ${c2Name} averages $${comparison.metrics.costPerNight.city2} USD/night.`,
      },
    },
    {
      question: {
        es: `Cual ciudad tiene mejor transporte publico para llegar al estadio?`,
        en: `Which city has better public transport to reach the stadium?`,
      },
      answer: {
        es: `${comparison.recommendation.transport === comparison.city1 ? c1Name : comparison.recommendation.transport === comparison.city2 ? c2Name : 'Ambas ciudades tienen buen transporte'} tiene mejor puntuacion de transporte (${comparison.recommendation.transport === comparison.city1 ? comparison.metrics.transportScore.city1 : comparison.metrics.transportScore.city2}/10 vs ${comparison.recommendation.transport === comparison.city1 ? comparison.metrics.transportScore.city2 : comparison.metrics.transportScore.city1}/10).`,
        en: `${comparison.recommendation.transport === comparison.city1 ? c1Name : comparison.recommendation.transport === comparison.city2 ? c2Name : 'Both cities have good transport'} scores higher for transport (${comparison.recommendation.transport === comparison.city1 ? comparison.metrics.transportScore.city1 : comparison.metrics.transportScore.city2}/10 vs ${comparison.recommendation.transport === comparison.city1 ? comparison.metrics.transportScore.city2 : comparison.metrics.transportScore.city1}/10).`,
      },
    },
    {
      question: {
        es: `Cual ciudad tiene mejor clima en junio para el Mundial?`,
        en: `Which city has better weather in June for the World Cup?`,
      },
      answer: {
        es: `${comparison.recommendation.weather === comparison.city1 ? c1Name : comparison.recommendation.weather === comparison.city2 ? c2Name : 'Ambas tienen clima similar'}. En junio, ${c1Name} tiene una temperatura promedio de ${comparison.metrics.weatherJuneAvg.city1}°C y ${c2Name} de ${comparison.metrics.weatherJuneAvg.city2}°C.`,
        en: `${comparison.recommendation.weather === comparison.city1 ? c1Name : comparison.recommendation.weather === comparison.city2 ? c2Name : 'Both have similar weather'}. In June, ${c1Name} has an average temperature of ${comparison.metrics.weatherJuneAvg.city1}°C and ${c2Name} averages ${comparison.metrics.weatherJuneAvg.city2}°C.`,
      },
    },
    {
      question: {
        es: `Cual ciudad es mejor para familias con ninos durante el Mundial 2026?`,
        en: `Which city is better for families with children during the 2026 World Cup?`,
      },
      answer: {
        es: `Para familias con ninos, recomendamos ${comparison.recommendation.families === comparison.city1 ? c1Name : comparison.recommendation.families === comparison.city2 ? c2Name : 'ambas ciudades'} por su mayor indice de seguridad turistica y facilidad de transporte familiar.`,
        en: `For families with children, we recommend ${comparison.recommendation.families === comparison.city1 ? c1Name : comparison.recommendation.families === comparison.city2 ? c2Name : 'both cities'} for its higher tourist safety index and ease of family transport.`,
      },
    },
  ]

  const articleJsonLd = buildArticleJsonLd({
    headline: pageTitle,
    description: `Comparacion de ${c1Name} vs ${c2Name} para el Mundial 2026`,
    url: canonicalUrl,
    dateModified: comparison.lastUpdated,
    lang: locale,
  })

  const faqJsonLd = buildFAQPageJsonLd(faqs, locale)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const metricRows = [
    {
      label: locale === 'es' ? 'Hotel (precio/noche)' : 'Hotel (price/night)',
      v1: `$${comparison.metrics.costPerNight.city1} USD`,
      v2: `$${comparison.metrics.costPerNight.city2} USD`,
      winner:
        comparison.metrics.costPerNight.city1 < comparison.metrics.costPerNight.city2
          ? comparison.city1
          : comparison.city2,
    },
    {
      label: locale === 'es' ? 'Comida economica' : 'Budget meal',
      v1: `$${comparison.metrics.metroBudgetMeal.city1} USD`,
      v2: `$${comparison.metrics.metroBudgetMeal.city2} USD`,
      winner:
        comparison.metrics.metroBudgetMeal.city1 < comparison.metrics.metroBudgetMeal.city2
          ? comparison.city1
          : comparison.city2,
    },
    {
      label: locale === 'es' ? 'Transporte publico (0-10)' : 'Public transport (0-10)',
      v1: `${comparison.metrics.transportScore.city1}/10`,
      v2: `${comparison.metrics.transportScore.city2}/10`,
      winner:
        comparison.metrics.transportScore.city1 > comparison.metrics.transportScore.city2
          ? comparison.city1
          : comparison.metrics.transportScore.city1 < comparison.metrics.transportScore.city2
            ? comparison.city2
            : 'empate',
    },
    {
      label: locale === 'es' ? 'Seguridad turistica (0-10)' : 'Tourist safety (0-10)',
      v1: `${comparison.metrics.safetyIndex.city1}/10`,
      v2: `${comparison.metrics.safetyIndex.city2}/10`,
      winner:
        comparison.metrics.safetyIndex.city1 > comparison.metrics.safetyIndex.city2
          ? comparison.city1
          : comparison.metrics.safetyIndex.city1 < comparison.metrics.safetyIndex.city2
            ? comparison.city2
            : 'empate',
    },
    {
      label: locale === 'es' ? 'Temperatura junio (°C)' : 'June temperature (°C)',
      v1: `${comparison.metrics.weatherJuneAvg.city1}°C`,
      v2: `${comparison.metrics.weatherJuneAvg.city2}°C`,
      winner: 'empate',
    },
    {
      label: locale === 'es' ? 'Capacidad estadio' : 'Stadium capacity',
      v1: comparison.metrics.stadiumCapacity.city1.toLocaleString(),
      v2: comparison.metrics.stadiumCapacity.city2.toLocaleString(),
      winner:
        comparison.metrics.stadiumCapacity.city1 > comparison.metrics.stadiumCapacity.city2
          ? comparison.city1
          : comparison.city2,
    },
    {
      label: locale === 'es' ? 'Altitud (metros)' : 'Altitude (meters)',
      v1: `${comparison.metrics.altitude.city1}m`,
      v2: `${comparison.metrics.altitude.city2}m`,
      winner: 'empate',
    },
    {
      label: locale === 'es' ? 'Codigo aeropuerto' : 'Airport code',
      v1: comparison.metrics.airportCode.city1,
      v2: comparison.metrics.airportCode.city2,
      winner: 'empate',
    },
  ]

  const recommendationCategories = [
    { key: 'budget', label: locale === 'es' ? 'Presupuesto' : 'Budget', winner: comparison.recommendation.budget },
    {
      key: 'transport',
      label: locale === 'es' ? 'Transporte' : 'Transport',
      winner: comparison.recommendation.transport,
    },
    { key: 'weather', label: locale === 'es' ? 'Clima' : 'Weather', winner: comparison.recommendation.weather },
    { key: 'nightlife', label: locale === 'es' ? 'Vida nocturna' : 'Nightlife', winner: comparison.recommendation.nightlife },
    { key: 'families', label: locale === 'es' ? 'Familias' : 'Families', winner: comparison.recommendation.families },
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
        <header className="text-center space-y-4">
          <h1 className="text-3xl font-bold md:text-4xl">{pageTitle}</h1>
          <p className="text-lg text-muted-foreground">
            {locale === 'es'
              ? `Guia completa para elegir entre ${c1Name} y ${c2Name} en el Mundial 2026`
              : `Complete guide to choosing between ${c1Name} and ${c2Name} at the 2026 World Cup`}
          </p>
        </header>

        {/* Direct answer block */}
        <section className="rounded-lg border-l-4 border-primary bg-primary/5 p-6">
          <p className="font-semibold text-lg mb-2">
            {locale === 'es' ? 'Respuesta directa' : 'Quick answer'}
          </p>
          <p className="text-base leading-relaxed">
            {locale === 'es'
              ? `Para fans con presupuesto ajustado, ${comparison.recommendation.budget === comparison.city1 ? c1Name : comparison.recommendation.budget === comparison.city2 ? c2Name : `ambas ciudades son similares en costo`} es la mejor opcion. Si priorizas el transporte publico, ${comparison.recommendation.transport === comparison.city1 ? c1Name : comparison.recommendation.transport === comparison.city2 ? c2Name : `las dos ofrecen buena conectividad`} gana. Para familias con ninos, recomendamos ${comparison.recommendation.families === comparison.city1 ? c1Name : comparison.recommendation.families === comparison.city2 ? c2Name : `cualquiera de las dos`}.`
              : `For budget-conscious fans, ${comparison.recommendation.budget === comparison.city1 ? c1Name : comparison.recommendation.budget === comparison.city2 ? c2Name : `both cities have similar costs`} is the best option. If public transport is your priority, ${comparison.recommendation.transport === comparison.city1 ? c1Name : comparison.recommendation.transport === comparison.city2 ? c2Name : `both offer good connectivity`} wins. For families with children, we recommend ${comparison.recommendation.families === comparison.city1 ? c1Name : comparison.recommendation.families === comparison.city2 ? c2Name : `either city`}.`}
          </p>
        </section>

        {/* Comparison table */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {locale === 'es' ? `Comparacion: ${c1Name} vs ${c2Name}` : `Comparison: ${c1Name} vs ${c2Name}`}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-3 px-4 font-semibold">
                    {locale === 'es' ? 'Criterio' : 'Criteria'}
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">{c1Name}</th>
                  <th className="text-center py-3 px-4 font-semibold">{c2Name}</th>
                </tr>
              </thead>
              <tbody>
                {metricRows.map((row) => (
                  <tr key={row.label} className="border-b border-border hover:bg-muted/20">
                    <td className="py-3 px-4 text-muted-foreground">{row.label}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={row.winner === comparison.city1 ? 'font-bold text-green-700' : ''}>
                        {row.v1}
                      </span>
                      {row.winner === comparison.city1 && (
                        <span className="ml-2 text-green-600 text-xs">✓</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={row.winner === comparison.city2 ? 'font-bold text-green-700' : ''}>
                        {row.v2}
                      </span>
                      {row.winner === comparison.city2 && (
                        <span className="ml-2 text-green-600 text-xs">✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recommendations by category */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {locale === 'es' ? 'Recomendaciones por perfil de viajero' : 'Recommendations by traveler profile'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendationCategories.map((cat) => {
              const winnerName =
                cat.winner === comparison.city1
                  ? c1Name
                  : cat.winner === comparison.city2
                    ? c2Name
                    : locale === 'es'
                      ? 'Empate'
                      : 'Tie'
              return (
                <div key={cat.key} className="rounded-lg border border-border p-4">
                  <p className="font-semibold text-sm text-muted-foreground mb-1">{cat.label}</p>
                  <p className="font-bold text-lg">{winnerName}</p>
                  <WinnerBadge winner={cat.winner} cityId={comparison.city1} locale={locale} />
                </div>
              )
            })}
          </div>
        </section>

        {/* City overviews */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-border p-6 space-y-3">
            <h3 className="text-xl font-bold">{c1Name}</h3>
            <p className="text-sm text-muted-foreground">{city1.description[locale]}</p>
            <dl className="text-sm space-y-1">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{locale === 'es' ? 'Estadio' : 'Stadium'}</dt>
                <dd className="font-medium">{stadium1?.name[locale] ?? city1.stadium}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{locale === 'es' ? 'Capacidad' : 'Capacity'}</dt>
                <dd className="font-medium">{comparison.metrics.stadiumCapacity.city1.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{locale === 'es' ? 'Hotel desde' : 'Hotel from'}</dt>
                <dd className="font-medium">${comparison.metrics.costPerNight.city1} USD/noche</dd>
              </div>
            </dl>
            <Link
              href={`/${lang}/${locale === 'es' ? 'ciudades' : 'cities'}/${city1.slugs[locale]}`}
              className="inline-block text-sm text-primary underline"
            >
              {locale === 'es' ? `Guia completa de ${c1Name}` : `Complete guide to ${c1Name}`}
            </Link>
          </div>

          <div className="rounded-lg border border-border p-6 space-y-3">
            <h3 className="text-xl font-bold">{c2Name}</h3>
            <p className="text-sm text-muted-foreground">{city2.description[locale]}</p>
            <dl className="text-sm space-y-1">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{locale === 'es' ? 'Estadio' : 'Stadium'}</dt>
                <dd className="font-medium">{stadium2?.name[locale] ?? city2.stadium}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{locale === 'es' ? 'Capacidad' : 'Capacity'}</dt>
                <dd className="font-medium">{comparison.metrics.stadiumCapacity.city2.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{locale === 'es' ? 'Hotel desde' : 'Hotel from'}</dt>
                <dd className="font-medium">${comparison.metrics.costPerNight.city2} USD/noche</dd>
              </div>
            </dl>
            <Link
              href={`/${lang}/${locale === 'es' ? 'ciudades' : 'cities'}/${city2.slugs[locale]}`}
              className="inline-block text-sm text-primary underline"
            >
              {locale === 'es' ? `Guia completa de ${c2Name}` : `Complete guide to ${c2Name}`}
            </Link>
          </div>
        </section>

        {/* FAQ section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {locale === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions'}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="rounded-lg border border-border p-4">
                <summary className="cursor-pointer font-semibold">{faq.question[locale]}</summary>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{faq.answer[locale]}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Back link */}
        <footer className="border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            {locale === 'es' ? 'Datos actualizados: ' : 'Data updated: '}{comparison.lastUpdated}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {locale === 'es'
              ? 'Este sitio no esta afiliado con la FIFA. Los precios son estimados y pueden variar.'
              : 'This site is not affiliated with FIFA. Prices are estimates and may vary.'}
          </p>
        </footer>
      </article>
    </>
  )
}
