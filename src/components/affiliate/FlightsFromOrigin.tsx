import { Plane, Info, MapPin } from 'lucide-react'
import {
  CITY_IATA,
  getCheapestFlightToCity,
  buildAviasalesUrl,
} from '@/lib/travelpayouts/flights'
import { getCities } from '@/lib/content/cities'
import { AffiliateLink } from './AffiliateLink'
import type { Locale } from '@/lib/content/schemas'

interface FlightsFromOriginProps {
  /** IATA code, e.g. 'MEX' / 'JFK' / 'MAD' */
  origin: string
  /** Display label, e.g. "Ciudad de México" */
  originLabel: string
  lang: Locale
}

/**
 * Server component: shows the cheapest cached flights from one origin to
 * every World Cup host city, sorted by price ascending. Used on the
 * "Vuelos desde México / desde Europa / desde USA" sub-pages, where users
 * arrive with high purchase intent for that specific origin.
 *
 * Each row is a tracked Aviasales deep-link with origin/destination/dates
 * pre-filled. Silently filters out routes with no cached data.
 */
export async function FlightsFromOrigin({
  origin,
  originLabel,
  lang,
}: FlightsFromOriginProps) {
  const localeKey: 'es' | 'en' = lang === 'es' ? 'es' : 'en'
  const cities = getCities()

  const offers = await Promise.all(
    cities.map(async (city) => {
      const offer = await getCheapestFlightToCity(origin, city.id)
      if (!offer) return null
      return {
        cityId: city.id,
        cityName: city.name[localeKey],
        countryCode: city.country,
        destinationIata: CITY_IATA[city.id],
        offer,
      }
    }),
  )

  const validOffers = offers
    .filter((o): o is NonNullable<typeof o> => o !== null)
    .sort((a, b) => a.offer.price - b.offer.price)

  if (validOffers.length === 0) return null

  const title =
    localeKey === 'es'
      ? `Vuelos baratos desde ${originLabel} a las sedes del Mundial`
      : `Cheap flights from ${originLabel} to the World Cup host cities`
  const subtitle =
    localeKey === 'es'
      ? 'Precios reales en cache de Aviasales para junio 2026, ordenados de más barato a más caro. Click para ver disponibilidad y reservar.'
      : 'Real Aviasales cached prices for June 2026, sorted cheapest first. Click to see availability and book.'
  const ctaLabel = localeKey === 'es' ? 'Buscar' : 'Search'
  const disclosure =
    localeKey === 'es'
      ? 'Enlace de afiliado (Aviasales) — sin costo extra para ti.'
      : 'Affiliate link (Aviasales) — no extra cost to you.'

  const flagFor: Record<string, string> = {
    mexico: '🇲🇽',
    usa: '🇺🇸',
    canada: '🇨🇦',
  }

  return (
    <aside className="mx-auto max-w-prose my-8 rounded-xl border border-blue-500/25 bg-gradient-to-br from-blue-500/8 to-blue-500/3 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/15">
          <Plane className="size-5 text-blue-600" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="mt-2 pl-12 text-sm text-muted leading-relaxed">{subtitle}</p>
      <ol className="mt-4 divide-y divide-blue-500/15 rounded-lg border border-blue-500/15 bg-white/60">
        {validOffers.map(({ cityId, cityName, countryCode, destinationIata, offer }) => {
          const url = buildAviasalesUrl(
            origin,
            destinationIata,
            offer.departureAt,
            offer.returnAt,
          )
          return (
            <li
              key={cityId}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  <span aria-hidden="true">{flagFor[countryCode] ?? '🏳️'}</span>
                  {cityName}
                  <span className="ml-1 rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                    {destinationIata}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {offer.airlineName} ·{' '}
                  {new Date(offer.departureAt).toLocaleDateString(
                    localeKey === 'es' ? 'es-MX' : 'en-US',
                    { day: 'numeric', month: 'short' },
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-blue-700">
                  ${offer.price}
                </span>
                <AffiliateLink
                  href={url}
                  partner="aviasales"
                  citySlug={destinationIata}
                  disclosure={disclosure}
                  className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  {ctaLabel}
                </AffiliateLink>
              </div>
            </li>
          )
        })}
      </ol>
      <p className="mt-3 flex items-start gap-1.5 text-xs italic text-muted">
        <Info className="mt-px size-3 shrink-0 opacity-60" aria-hidden="true" />
        {localeKey === 'es'
          ? 'Precios indicativos del cache de Aviasales actualizados cada 24h. Click en "Buscar" para precios en tiempo real.'
          : 'Indicative prices from the Aviasales cache, updated every 24h. Click "Search" for live prices.'}
      </p>
    </aside>
  )
}
