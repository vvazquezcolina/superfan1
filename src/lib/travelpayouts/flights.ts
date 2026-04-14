import 'server-only'
import { getAffiliatePartner } from '@/lib/content/affiliates'

/**
 * Travelpayouts (Aviasales) Flight Data API client.
 * Hotellook is dead (Oct 2025), but the flight prices API still works and
 * gives us real, indexable price data we can render server-side and cite as
 * structured content. Used by city pages to show "cheapest flights from X
 * to <city>".
 *
 * Endpoint reference:
 *   GET https://api.travelpayouts.com/v1/prices/cheap
 *   ?origin=MEX&destination=LAX&depart_date=2026-06&return_date=2026-06
 *   &currency=usd&token=...
 *
 * Default rate limit is 60 req/min — fine for SSG with 16 cities × 3 origins.
 */

const API_BASE = 'https://api.travelpayouts.com/v1/prices/cheap'

// Map our city ids to a single primary IATA airport/metro code.
// Metro codes (NYC, HOU, YTO) aggregate all airports in the area which
// gives the API more chances to return a cached price.
export const CITY_IATA: Record<string, string> = {
  'ciudad-de-mexico': 'MEX',
  monterrey: 'MTY',
  guadalajara: 'GDL',
  'los-angeles': 'LAX',
  'nueva-york-nueva-jersey': 'NYC',
  dallas: 'DFW',
  'san-francisco': 'SFO',
  houston: 'HOU',
  atlanta: 'ATL',
  filadelfia: 'PHL',
  miami: 'MIA',
  seattle: 'SEA',
  'kansas-city': 'MCI',
  boston: 'BOS',
  toronto: 'YTO',
  vancouver: 'YVR',
}

// Minimal airline IATA → display name lookup. Falls back to the IATA code
// if a code shows up that isn't in this list.
export const AIRLINE_NAMES: Record<string, string> = {
  AA: 'American Airlines',
  AC: 'Air Canada',
  AM: 'Aeroméxico',
  AS: 'Alaska Airlines',
  AV: 'Avianca',
  B6: 'JetBlue',
  CM: 'Copa Airlines',
  DL: 'Delta',
  F9: 'Frontier',
  IB: 'Iberia',
  LA: 'LATAM',
  NK: 'Spirit',
  UA: 'United',
  VB: 'VivaAerobús',
  WN: 'Southwest',
  WS: 'WestJet',
  Y4: 'Volaris',
  '4O': 'Interjet',
}

export interface FlightOffer {
  origin: string
  destination: string
  airline: string
  airlineName: string
  flightNumber: number
  price: number
  currency: string
  departureAt: string
  returnAt: string
  durationMinutes: number
}

interface CheapFlightsResponse {
  success?: boolean
  currency?: string
  data?: Record<
    string,
    Record<
      string,
      {
        airline: string
        flight_number: number
        departure_at: string
        return_at: string
        expires_at: string
        price: number
        duration: number
        duration_to: number
        duration_back: number
      }
    >
  >
}

function getToken(): string | null {
  const fromEnv = process.env.TRAVELPAYOUTS_TOKEN
  if (fromEnv) return fromEnv
  const partner = getAffiliatePartner('travelpayouts')
  return partner?.token ?? null
}

async function fetchCheap(
  origin: string,
  destination: string,
  departMonth?: string,
): Promise<CheapFlightsResponse | null> {
  const token = getToken()
  if (!token) return null

  const url = new URL(API_BASE)
  url.searchParams.set('origin', origin)
  url.searchParams.set('destination', destination)
  url.searchParams.set('currency', 'usd')
  url.searchParams.set('token', token)
  if (departMonth) {
    url.searchParams.set('depart_date', departMonth)
    url.searchParams.set('return_date', departMonth)
  }

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    return (await res.json()) as CheapFlightsResponse
  } catch {
    return null
  }
}

function pickFirstOffer(
  res: CheapFlightsResponse | null,
  origin: string,
  destination: string,
): FlightOffer | null {
  if (!res?.success || !res.data) return null
  const dest = res.data[destination]
  if (!dest) return null
  const firstKey = Object.keys(dest)[0]
  if (!firstKey) return null
  const offer = dest[firstKey]
  if (!offer) return null
  return {
    origin,
    destination,
    airline: offer.airline,
    airlineName: AIRLINE_NAMES[offer.airline] ?? offer.airline,
    flightNumber: offer.flight_number,
    price: offer.price,
    currency: res.currency ?? 'usd',
    departureAt: offer.departure_at,
    returnAt: offer.return_at,
    durationMinutes: offer.duration,
  }
}

// World Cup 2026 runs June 11 - July 19. Allow May 15 - August 15 as the
// "useful" window — if the cheapest cached offer is outside this range it
// becomes misleading instead of helpful (e.g. "vuelos baratos a LA" landing
// on a November fare). Better to suppress than mislead.
const WORLD_CUP_START_MS = Date.parse('2026-05-15')
const WORLD_CUP_END_MS = Date.parse('2026-08-15')

function isWithinWorldCupWindow(iso: string): boolean {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return false
  return t >= WORLD_CUP_START_MS && t <= WORLD_CUP_END_MS
}

/**
 * Fetch the cheapest cached flight from `origin` to a city.
 * Tries June 2026, then May 2026, then July 2026. Only returns an offer
 * if its outbound date falls inside the World Cup-adjacent window.
 */
export async function getCheapestFlightToCity(
  origin: string,
  cityId: string,
): Promise<FlightOffer | null> {
  const destination = CITY_IATA[cityId]
  if (!destination) return null

  for (const month of ['2026-06', '2026-05', '2026-07']) {
    const res = await fetchCheap(origin, destination, month)
    const offer = pickFirstOffer(res, origin, destination)
    if (offer && isWithinWorldCupWindow(offer.departureAt)) return offer
  }
  return null
}

/**
 * Fetch cheapest flights from several origins to a city, in parallel.
 * Returns offers in input order, dropping nulls. Always non-throwing.
 */
export async function getCheapestFlightsFromOrigins(
  origins: string[],
  cityId: string,
): Promise<FlightOffer[]> {
  const results = await Promise.all(
    origins.map((origin) => getCheapestFlightToCity(origin, cityId)),
  )
  return results.filter((o): o is FlightOffer => o !== null)
}

/**
 * Build a tracked Aviasales deep link for an origin → destination route
 * with optional dates. Uses tp.media/r so clicks attribute to our marker.
 */
export function buildAviasalesUrl(
  origin: string,
  destination: string,
  departureAt?: string,
  returnAt?: string,
): string {
  const partner = getAffiliatePartner('travelpayouts')
  const marker = partner?.marker ?? '233922'
  const params = new URLSearchParams()
  params.set('origin_iata', origin)
  params.set('destination_iata', destination)
  if (departureAt) params.set('depart_date', departureAt.slice(0, 10))
  if (returnAt) params.set('return_date', returnAt.slice(0, 10))
  params.set('adults', '1')
  params.set('with_request', 'true')
  const search = `https://www.aviasales.com/search?${params.toString()}`
  return `https://tp.media/r?marker=${marker}&trs=${marker}&p=4114&u=${encodeURIComponent(search)}`
}

/**
 * Format a flight duration in minutes into "Xh Ym".
 */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}
