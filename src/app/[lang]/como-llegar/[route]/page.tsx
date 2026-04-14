import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getRoute, getRouteSlugs } from '@/lib/content/programmatic'
import { getCityById } from '@/lib/content/cities'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { buildArticleJsonLd } from '@/lib/jsonld'
import { FlightPrices } from '@/components/affiliate/FlightPrices'
import { AirportTransfers } from '@/components/affiliate/AirportTransfers'
import { CITY_IATA } from '@/lib/travelpayouts/flights'
import type { Locale } from '@/lib/content/schemas'
import { toContentLocale } from '@/lib/content/locale'

const SITE_URL = 'https://www.superfaninfo.com'

export async function generateStaticParams() {
  return getRouteSlugs().map(({ route, lang }) => ({ lang, route }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; route: string }>
}): Promise<Metadata> {
  const { lang, route } = await params
  if (!hasLocale(lang)) return {}
  const routeData = getRoute(route)
  if (!routeData) return {}

  const locale: Locale = toContentLocale(lang)
  const fromCity = getCityById(routeData.from)
  const toCity = getCityById(routeData.to)
  if (!fromCity || !toCity) return {}

  const from = fromCity.name[locale]
  const to = toCity.name[locale]
  const slug = routeData.slugs.es

  const title =
    locale === 'es'
      ? `Como llegar de ${from} a ${to} para el Mundial 2026`
      : `How to Get from ${from} to ${to} for the 2026 World Cup`

  const description =
    locale === 'es'
      ? `Vuelos, autobus y ruta en carro de ${from} a ${to}. Precios, duracion y el transporte recomendado para fans del Mundial 2026.`
      : `Flights, bus and driving route from ${from} to ${to}. Prices, duration and the recommended transport for 2026 World Cup fans.`

  return buildPageMetadata({
    title,
    description,
    lang: locale,
    path: `/${lang}/como-llegar/${slug}`,
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/como-llegar/${routeData.slugs.es}`,
        en: `${SITE_URL}/en/como-llegar/${routeData.slugs.es}`,
        'x-default': `${SITE_URL}/es/como-llegar/${routeData.slugs.es}`,
      },
    },
  })
}

const MODE_ICON: Record<string, string> = {
  flight: '✈',
  bus: '🚌',
  drive: '🚗',
}

const MODE_LABEL: Record<string, Record<string, string>> = {
  flight: { es: 'Avion', en: 'Flight' },
  bus: { es: 'Autobus', en: 'Bus' },
  drive: { es: 'Carro', en: 'Drive' },
}

export default async function HowToGetPage({
  params,
}: {
  params: Promise<{ lang: string; route: string }>
}) {
  const { lang, route } = await params
  if (!hasLocale(lang)) notFound()
  const routeData = getRoute(route)
  if (!routeData) notFound()

  const dictLocale = lang as import('@/app/[lang]/dictionaries').Locale
  const locale: Locale = toContentLocale(lang)
  const fromCity = getCityById(routeData.from)
  const toCity = getCityById(routeData.to)
  if (!fromCity || !toCity) notFound()

  const dict = await getDictionary(dictLocale)
  const slug = routeData.slugs.es
  const from = fromCity.name[locale]
  const to = toCity.name[locale]

  const pageTitle =
    locale === 'es'
      ? `Como llegar de ${from} a ${to} para el Mundial 2026`
      : `How to Get from ${from} to ${to} for the 2026 World Cup`

  const canonicalUrl = `${SITE_URL}/${lang}/como-llegar/${slug}`

  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/como-llegar/${slug}`,
    locale,
    dict.breadcrumbs,
    `${from} → ${to}`,
  )

  const articleJsonLd = buildArticleJsonLd({
    headline: pageTitle,
    description: `${locale === 'es' ? 'Guia de viaje de' : 'Travel guide from'} ${from} ${locale === 'es' ? 'a' : 'to'} ${to}`,
    url: canonicalUrl,
    dateModified: routeData.lastUpdated,
    lang: locale,
  })

  // HowTo Schema
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: pageTitle,
    description: routeData.travelTip[locale],
    step: [
      {
        '@type': 'HowToStep',
        name: locale === 'es' ? 'Elige tu medio de transporte' : 'Choose your transport mode',
        text: locale === 'es'
          ? `El modo recomendado es: ${MODE_LABEL[routeData.recommendedMode]?.[locale] ?? routeData.recommendedMode}. ${routeData.travelTip[locale]}`
          : `The recommended mode is: ${MODE_LABEL[routeData.recommendedMode]?.en ?? routeData.recommendedMode}. ${routeData.travelTip[locale]}`,
      },
      {
        '@type': 'HowToStep',
        name: locale === 'es' ? 'Reserva tu transporte' : 'Book your transport',
        text: locale === 'es'
          ? `Para vuelos, usa aereolineas como ${routeData.airlines.join(', ')}. Reserva con 2-3 meses de anticipacion durante el Mundial.`
          : `For flights, use airlines like ${routeData.airlines.join(', ')}. Book 2-3 months in advance during the World Cup.`,
      },
    ],
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const flightMinutes = routeData.flightDuration
  const flightHours = Math.floor(flightMinutes / 60)
  const flightMins = flightMinutes % 60

  const busMinutes = routeData.busDuration
  const busHours = busMinutes ? Math.floor(busMinutes / 60) : null
  const busMins = busMinutes ? busMinutes % 60 : null

  const driveMinutes = routeData.driveDuration
  const driveHours = driveMinutes ? Math.floor(driveMinutes / 60) : null
  const driveMins = driveMinutes ? driveMinutes % 60 : null

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      <Breadcrumbs items={breadcrumbs} />

      <article className="mx-auto max-w-4xl space-y-12 py-6">
        {/* Hero */}
        <header className="space-y-4">
          <h1 className="text-3xl font-bold md:text-4xl">{pageTitle}</h1>
          <p className="text-lg text-muted-foreground">
            {from} → {to}
          </p>
        </header>

        {/* Recommended option highlight */}
        <section className="rounded-lg border-l-4 border-primary bg-primary/5 p-6">
          <p className="font-semibold mb-2">
            {locale === 'es' ? 'Opcion recomendada' : 'Recommended option'}:{' '}
            <span className="text-primary">
              {MODE_ICON[routeData.recommendedMode]} {MODE_LABEL[routeData.recommendedMode]?.[locale]}
            </span>
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">{routeData.travelTip[locale]}</p>
        </section>

        {/* Transport options */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {locale === 'es' ? 'Opciones de transporte' : 'Transport options'}
          </h2>

          <div className="space-y-6">
            {/* Flight */}
            <div className={`rounded-lg border-2 p-6 ${routeData.recommendedMode === 'flight' ? 'border-primary' : 'border-border'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold">
                  ✈ {locale === 'es' ? 'Vuelo' : 'Flight'}
                </h3>
                {routeData.recommendedMode === 'flight' && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {locale === 'es' ? 'Recomendado' : 'Recommended'}
                  </span>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">{locale === 'es' ? 'Duracion' : 'Duration'}</dt>
                  <dd className="font-semibold">
                    {flightHours > 0 ? `${flightHours}h ` : ''}{flightMins > 0 ? `${flightMins}min` : ''}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{locale === 'es' ? 'Precio estimado' : 'Estimated price'}</dt>
                  <dd className="font-semibold">${routeData.flightCostMin}–${routeData.flightCostMax} USD</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-muted-foreground">{locale === 'es' ? 'Aerolineas' : 'Airlines'}</dt>
                  <dd className="font-semibold">{routeData.airlines.join(', ')}</dd>
                </div>
              </dl>
              <div className="mt-4">
                <a
                  href={`https://www.kiwi.com/es/search/results/${routeData.from.replace(/-/g, ' ')}/${routeData.to.replace(/-/g, ' ')}/?utm_source=superfan&utm_medium=affiliate`}
                  target="_blank"
                  rel="nofollow noopener sponsored"
                  className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                >
                  {locale === 'es' ? 'Buscar vuelos' : 'Search flights'}
                </a>
                <p className="mt-1 text-xs text-muted-foreground">
                  {locale === 'es'
                    ? 'Enlace de afiliado (Travelpayouts) — sin costo adicional para ti.'
                    : 'Affiliate link (Travelpayouts) — no extra cost to you.'}
                </p>
              </div>
            </div>

            {/* Bus */}
            {routeData.busDuration && (
              <div className={`rounded-lg border-2 p-6 ${routeData.recommendedMode === 'bus' ? 'border-primary' : 'border-border'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">
                    🚌 {locale === 'es' ? 'Autobus' : 'Bus'}
                  </h3>
                  {routeData.recommendedMode === 'bus' && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {locale === 'es' ? 'Recomendado' : 'Recommended'}
                    </span>
                  )}
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">{locale === 'es' ? 'Duracion' : 'Duration'}</dt>
                    <dd className="font-semibold">
                      {busHours !== null && busHours > 0 ? `${busHours}h ` : ''}{busMins !== null && busMins > 0 ? `${busMins}min` : ''}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{locale === 'es' ? 'Precio estimado' : 'Estimated price'}</dt>
                    <dd className="font-semibold">
                      {routeData.busCostMin && routeData.busCostMax
                        ? `$${routeData.busCostMin}–${routeData.busCostMax} USD`
                        : locale === 'es' ? 'Consultar operador' : 'Check operator'}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-muted-foreground">{locale === 'es' ? 'Operador' : 'Operator'}</dt>
                    <dd className="font-semibold">{routeData.busOperator}</dd>
                  </div>
                </dl>
              </div>
            )}

            {/* Drive */}
            {routeData.driveDuration && (
              <div className={`rounded-lg border-2 p-6 ${routeData.recommendedMode === 'drive' ? 'border-primary' : 'border-border'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">
                    🚗 {locale === 'es' ? 'En carro' : 'Drive'}
                  </h3>
                  {routeData.recommendedMode === 'drive' && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {locale === 'es' ? 'Recomendado' : 'Recommended'}
                    </span>
                  )}
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">{locale === 'es' ? 'Duracion' : 'Duration'}</dt>
                    <dd className="font-semibold">
                      {driveHours !== null && driveHours > 0 ? `${driveHours}h ` : ''}{driveMins !== null && driveMins > 0 ? `${driveMins}min` : ''}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{locale === 'es' ? 'Distancia' : 'Distance'}</dt>
                    <dd className="font-semibold">{routeData.driveDistance} km</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </section>

        {/* Affiliate stack — route research = high commercial intent */}
        <FlightPrices
          cityId={toCity.id}
          cityName={toCity.name[locale]}
          lang={locale}
        />
        {CITY_IATA[toCity.id] && (
          <AirportTransfers
            fromLabel={`${CITY_IATA[toCity.id]} (${toCity.name[locale]})`}
            fromIata={CITY_IATA[toCity.id]}
            toName={toCity.name[locale]}
            lang={locale}
          />
        )}

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {locale === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions'}
          </h2>
          <div className="space-y-4">
            <details className="rounded-lg border border-border p-4">
              <summary className="cursor-pointer font-semibold">
                {locale === 'es'
                  ? `Cual es la forma mas rapida de llegar de ${from} a ${to}?`
                  : `What is the fastest way to get from ${from} to ${to}?`}
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {locale === 'es'
                  ? `El avion es la opcion mas rapida con ${flightHours > 0 ? `${flightHours}h ` : ''}${flightMins > 0 ? `${flightMins}min` : ''} de vuelo. El modo recomendado para el Mundial es: ${MODE_LABEL[routeData.recommendedMode]?.[locale]}.`
                  : `Flying is the fastest option at ${flightHours > 0 ? `${flightHours}h ` : ''}${flightMins > 0 ? `${flightMins}min` : ''}. The recommended mode for the World Cup is: ${MODE_LABEL[routeData.recommendedMode]?.en}.`}
              </p>
            </details>
            <details className="rounded-lg border border-border p-4">
              <summary className="cursor-pointer font-semibold">
                {locale === 'es'
                  ? `Cuanto cuesta el vuelo de ${from} a ${to}?`
                  : `How much does a flight from ${from} to ${to} cost?`}
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {locale === 'es'
                  ? `Los vuelos de ${from} a ${to} cuestan entre $${routeData.flightCostMin} y $${routeData.flightCostMax} USD. Las aerolineas que operan esta ruta incluyen ${routeData.airlines.join(', ')}. Los precios durante el Mundial pueden ser mas altos — reserva con 2-3 meses de anticipacion.`
                  : `Flights from ${from} to ${to} cost between $${routeData.flightCostMin} and $${routeData.flightCostMax} USD. Airlines operating this route include ${routeData.airlines.join(', ')}. Prices during the World Cup may be higher — book 2-3 months in advance.`}
              </p>
            </details>
            <details className="rounded-lg border border-border p-4">
              <summary className="cursor-pointer font-semibold">
                {locale === 'es'
                  ? `Hay autobus directo de ${from} a ${to}?`
                  : `Is there a direct bus from ${from} to ${to}?`}
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {routeData.busDuration
                  ? locale === 'es'
                    ? `Si, ${routeData.busOperator} opera esta ruta. El trayecto dura aproximadamente ${busHours !== null ? `${busHours}h ` : ''}${busMins !== null && busMins > 0 ? `${busMins}min` : ''} y cuesta entre $${routeData.busCostMin} y $${routeData.busCostMax} USD.`
                    : `Yes, ${routeData.busOperator} operates this route. The journey takes approximately ${busHours !== null ? `${busHours}h ` : ''}${busMins !== null && busMins > 0 ? `${busMins}min` : ''} and costs between $${routeData.busCostMin} and $${routeData.busCostMax} USD.`
                  : locale === 'es'
                    ? `No hay autobus directo practico en esta ruta. Se recomienda el avion como unica opcion conveniente.`
                    : `There is no practical direct bus on this route. Flying is recommended as the only convenient option.`}
              </p>
            </details>
          </div>
        </section>

        {/* Cross links */}
        <section className="rounded-lg bg-muted/20 p-6">
          <h3 className="font-bold mb-3">
            {locale === 'es' ? 'Guias relacionadas' : 'Related guides'}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href={`/${lang}/${locale === 'es' ? 'ciudades' : 'cities'}/${fromCity.slugs[locale]}`}
                className="text-primary underline"
              >
                {locale === 'es' ? `Guia completa de ${from}` : `Complete guide to ${from}`}
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/${locale === 'es' ? 'ciudades' : 'cities'}/${toCity.slugs[locale]}`}
                className="text-primary underline"
              >
                {locale === 'es' ? `Guia completa de ${to}` : `Complete guide to ${to}`}
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/dia-de-partido/${toCity.slugs.es}`}
                className="text-primary underline"
              >
                {locale === 'es' ? `Guia del dia de partido en ${to}` : `Match day guide for ${to}`}
              </Link>
            </li>
          </ul>
        </section>

        <footer className="border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            {locale === 'es' ? 'Datos actualizados: ' : 'Data updated: '}{routeData.lastUpdated}
            {' | '}
            {locale === 'es'
              ? 'Los precios son estimados y pueden variar. No estamos afiliados con la FIFA.'
              : 'Prices are estimates and may vary. We are not affiliated with FIFA.'}
          </p>
        </footer>
      </article>
    </>
  )
}
