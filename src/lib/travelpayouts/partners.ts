/**
 * Per-partner affiliate URL builders for the Travelpayouts programs we are
 * connected to. Each Travelpayouts partner uses its OWN attribution scheme:
 *
 *   - Aviasales:    tp.media/r?marker=233922&p=4114&u=encoded
 *   - Booking.com:  tp.media/r?marker=233922&p=4114&u=encoded (or aid=304142)
 *   - GetYourGuide: direct URL with ?partner_id=0JJQDRO&cmp=...-677963
 *
 * IDs verified against the user's connected dashboard (account 677963):
 *   - GetYourGuide partner_id: 0JJQDRO  (extracted via dashboard generator)
 *   - Travelpayouts marker:    233922   (existing affiliates.json)
 *   - Travelpayouts user id:   677963
 *
 * IDs still TODO (ask the user to drop one short link per program from
 * https://app.travelpayouts.com/programs/connected → Tools → Generate link
 * and we'll add the builder):
 *   - Trip.com, Expedia, Klook, Welcome Pickups, Tiqets, Kiwitaxi,
 *     GetTransfer, CheapOair, AirHelp, Go City, EKTA, WeGoTrip
 */

const TP_MARKER = '233922'
const TP_USER_ID = '677963'

// --- GetYourGuide ----------------------------------------------------------

const GYG_PARTNER_ID = '0JJQDRO'
const GYG_CMP_PREFIX = 'c003dd2abdd3486d89b6db57d'

export function buildGetYourGuideUrl(destinationUrl: string): string {
  const url = new URL(destinationUrl)
  url.searchParams.set('partner_id', GYG_PARTNER_ID)
  url.searchParams.set('cmp', `${GYG_CMP_PREFIX}-${TP_USER_ID}`)
  return url.toString()
}

/**
 * GetYourGuide search URL for a destination keyword. Always works regardless
 * of whether GetYourGuide has a dedicated location page for the city.
 */
export function buildGetYourGuideSearchUrl(query: string, lang: 'es' | 'en'): string {
  const subdomain = lang === 'es' ? 'www' : 'www'
  const path = lang === 'es' ? '/es-es/s/' : '/s/'
  const base = `https://${subdomain}.getyourguide.com${path}?q=${encodeURIComponent(query)}&searchSource=3`
  return buildGetYourGuideUrl(base)
}

// --- Aviasales (already used by flights.ts) --------------------------------

export function buildAviasalesSearchUrl(
  origin: string,
  destination: string,
  departDate?: string,
  returnDate?: string,
): string {
  const params = new URLSearchParams()
  params.set('origin_iata', origin)
  params.set('destination_iata', destination)
  if (departDate) params.set('depart_date', departDate)
  if (returnDate) params.set('return_date', returnDate)
  params.set('adults', '1')
  const search = `https://www.aviasales.com/search?${params.toString()}`
  return `https://tp.media/r?marker=${TP_MARKER}&trs=${TP_MARKER}&p=4114&u=${encodeURIComponent(search)}`
}

// --- Booking.com -----------------------------------------------------------

export function buildBookingSearchUrl(
  cityName: string,
  lang: 'es' | 'en',
  checkin = '2026-06-11',
  checkout = '2026-06-18',
): string {
  const bookingLang = lang === 'es' ? 'es' : 'en'
  const search = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
    cityName,
  )}&checkin=${checkin}&checkout=${checkout}&lang=${bookingLang}&aid=304142`
  return `https://tp.media/r?marker=${TP_MARKER}&trs=${TP_MARKER}&p=4114&u=${encodeURIComponent(search)}`
}

// --- Disclosure helpers ----------------------------------------------------

export const PARTNER_DISCLOSURE: Record<'es' | 'en', string> = {
  es: 'Enlace de afiliado — recibimos una pequeña comisión si reservas a través de este enlace, sin costo extra para ti.',
  en: 'Affiliate link — we earn a small commission if you book through this link, at no extra cost to you.',
}
