import { Plane, Clock, TrendingDown, Info } from 'lucide-react'
import {
  getCheapestFlightsFromOrigins,
  buildAviasalesUrl,
  formatDuration,
  type FlightOffer,
} from '@/lib/travelpayouts/flights'
import { AffiliateLink } from './AffiliateLink'
import { getAffiliatePartner } from '@/lib/content/affiliates'
import type { Locale } from '@/lib/content/schemas'

interface FlightPricesProps {
  cityId: string
  cityName: string
  lang: Locale
  /** Origin IATA codes, in display order. Defaults cover LATAM + Iberia. */
  origins?: string[]
}

const DEFAULT_ORIGINS = ['MEX', 'MIA', 'MAD', 'BOG']

const ORIGIN_LABEL: Record<string, Record<Locale, string>> = {
  MEX: { es: 'Ciudad de México', en: 'Mexico City' },
  GDL: { es: 'Guadalajara', en: 'Guadalajara' },
  MTY: { es: 'Monterrey', en: 'Monterrey' },
  MIA: { es: 'Miami', en: 'Miami' },
  MAD: { es: 'Madrid', en: 'Madrid' },
  BOG: { es: 'Bogotá', en: 'Bogotá' },
  LIM: { es: 'Lima', en: 'Lima' },
  BUE: { es: 'Buenos Aires', en: 'Buenos Aires' },
  SCL: { es: 'Santiago', en: 'Santiago' },
}

function formatDate(iso: string, lang: Locale): string {
  try {
    return new Date(iso).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', {
      day: 'numeric',
      month: 'short',
    })
  } catch {
    return iso.slice(0, 10)
  }
}

function formatPrice(price: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(price)
  } catch {
    return `$${price} ${currency.toUpperCase()}`
  }
}

function OfferRow({
  offer,
  lang,
  bookLabel,
}: {
  offer: FlightOffer
  lang: Locale
  bookLabel: string
}) {
  const originLabel =
    ORIGIN_LABEL[offer.origin]?.[lang] ?? offer.origin
  const url = buildAviasalesUrl(
    offer.origin,
    offer.destination,
    offer.departureAt,
    offer.returnAt,
  )
  const partner = getAffiliatePartner('travelpayouts')
  const disclosure =
    partner?.disclosure[lang] ??
    (lang === 'es'
      ? 'Enlace de afiliado (Travelpayouts)'
      : 'Affiliate link (Travelpayouts)')

  const departure = formatDate(offer.departureAt, lang)
  const ret = formatDate(offer.returnAt, lang)
  const duration = formatDuration(offer.durationMinutes)
  const price = formatPrice(offer.price, offer.currency)

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-blue-500/15 bg-white/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {lang === 'es' ? 'Desde' : 'From'} {originLabel}
          </span>
          <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-700">
            {offer.airlineName}
          </span>
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
          <Clock className="size-3" aria-hidden="true" />
          {departure} → {ret} · {duration}
        </p>
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-wide text-muted">
            {lang === 'es' ? 'Desde' : 'from'}
          </span>
          <span className="text-lg font-bold text-blue-700">{price}</span>
        </div>
        <AffiliateLink
          href={url}
          partner="travelpayouts"
          citySlug={offer.destination}
          disclosure={disclosure}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          {bookLabel}
        </AffiliateLink>
      </div>
    </li>
  )
}

/**
 * Server component: fetches cached flight prices from several origins to a
 * city and renders a small offers list. Silent if no origin has data.
 * Uses Next.js fetch cache (revalidate=86400) so the API is only hit once
 * per day per origin/destination pair.
 */
export async function FlightPrices({
  cityId,
  cityName,
  lang,
  origins = DEFAULT_ORIGINS,
}: FlightPricesProps) {
  const offers = await getCheapestFlightsFromOrigins(origins, cityId)
  if (offers.length === 0) return null

  const title =
    lang === 'es'
      ? `Vuelos baratos a ${cityName}`
      : `Cheap flights to ${cityName}`
  const subtitle =
    lang === 'es'
      ? `Precios recientes en cache de Aviasales. Haz clic para buscar tus fechas exactas.`
      : `Recent cached prices from Aviasales. Click to search your exact dates.`
  const bookLabel = lang === 'es' ? 'Buscar' : 'Search'
  const footer =
    lang === 'es'
      ? 'Los precios provienen del cache público de Travelpayouts (Aviasales) y cambian constantemente. Haz clic en "Buscar" para ver disponibilidad y precios en tiempo real.'
      : 'Prices come from the public Travelpayouts/Aviasales cache and change constantly. Click "Search" for real-time availability and prices.'

  return (
    <aside className="mx-auto max-w-prose my-8 rounded-xl border border-blue-500/25 bg-gradient-to-br from-blue-500/8 to-blue-500/3 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/15">
          <Plane className="size-4.5 text-blue-600" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="mt-2 flex items-center gap-1.5 pl-11 text-sm text-muted">
        <TrendingDown className="size-3.5 text-green-600" aria-hidden="true" />
        {subtitle}
      </p>
      <ul className="mt-4 flex flex-col gap-3">
        {offers.map((offer) => (
          <OfferRow
            key={`${offer.origin}-${offer.destination}`}
            offer={offer}
            lang={lang}
            bookLabel={bookLabel}
          />
        ))}
      </ul>
      <p className="mt-4 flex items-start gap-1.5 text-xs italic text-muted">
        <Info className="mt-px size-3 shrink-0 opacity-60" aria-hidden="true" />
        {footer}
      </p>
    </aside>
  )
}
