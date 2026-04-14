/**
 * Per-partner affiliate URL builders for the Travelpayouts programs we are
 * connected to. Each Travelpayouts partner uses one of two attribution
 * schemes:
 *
 *   1. Direct partner URL with a partner-specific id parameter
 *      (verified via dashboard for GetYourGuide and Booking.com).
 *
 *   2. Travelpayouts unified redirect:
 *        https://tp.media/r?marker=233922&trs=233922&u=ENCODED_DESTINATION
 *      The marker (233922) is what credits the affiliate account on
 *      conversion. Travelpayouts cookies the user, redirects to the
 *      destination, and attributes commission to the marker.
 *
 * Account context (from app.travelpayouts.com, account 677963):
 *   - Travelpayouts user id: 677963
 *   - Marker:                233922
 *   - GetYourGuide partner:  0JJQDRO  (extracted via dashboard generator)
 *   - Booking.com aid:       304142
 */

const TP_MARKER = '233922'
const TP_USER_ID = '677963'

/** Wrap any URL in the unified Travelpayouts tracking redirect. */
function tpRedirect(destinationUrl: string): string {
  return `https://tp.media/r?marker=${TP_MARKER}&trs=${TP_MARKER}&u=${encodeURIComponent(
    destinationUrl,
  )}`
}

// --- GetYourGuide (8% reward, 31d cookie) ----------------------------------

const GYG_PARTNER_ID = '0JJQDRO'
const GYG_CMP_PREFIX = 'c003dd2abdd3486d89b6db57d'

export function buildGetYourGuideUrl(destinationUrl: string): string {
  const url = new URL(destinationUrl)
  url.searchParams.set('partner_id', GYG_PARTNER_ID)
  url.searchParams.set('cmp', `${GYG_CMP_PREFIX}-${TP_USER_ID}`)
  return url.toString()
}

export function buildGetYourGuideSearchUrl(query: string, lang: 'es' | 'en'): string {
  const path = lang === 'es' ? '/es-es/s/' : '/s/'
  const base = `https://www.getyourguide.com${path}?q=${encodeURIComponent(
    query,
  )}&searchSource=3`
  return buildGetYourGuideUrl(base)
}

// --- Aviasales (40% reward, 30d cookie) ------------------------------------

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
  return tpRedirect(`https://www.aviasales.com/search?${params.toString()}`)
}

// --- Booking.com (3-5% reward, session cookie) -----------------------------

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
  return tpRedirect(search)
}

// --- Welcome Pickups (8-9% reward, 45d cookie) -----------------------------

export function buildWelcomePickupsUrl(citySlug: string): string {
  return tpRedirect(`https://welcomepickups.com/${citySlug}/`)
}

export function buildWelcomePickupsSearchUrl(cityName: string): string {
  return tpRedirect(
    `https://welcomepickups.com/?destination=${encodeURIComponent(cityName)}`,
  )
}

// --- Kiwitaxi (9-11% reward, 30d cookie) -----------------------------------

export function buildKiwitaxiSearchUrl(
  fromIata: string,
  toName: string,
  lang: 'es' | 'en',
): string {
  const langCode = lang === 'es' ? 'es' : 'en'
  return tpRedirect(
    `https://kiwitaxi.com/?lang=${langCode}&from=${fromIata}&to=${encodeURIComponent(
      toName,
    )}`,
  )
}

export function buildKiwitaxiHomeUrl(lang: 'es' | 'en'): string {
  const langCode = lang === 'es' ? 'es' : 'en'
  return tpRedirect(`https://kiwitaxi.com/?lang=${langCode}`)
}

// --- Tiqets (3.5-8% reward, 30d cookie) ------------------------------------

export function buildTiqetsSearchUrl(query: string, lang: 'es' | 'en'): string {
  const langCode = lang === 'es' ? 'es' : 'en'
  return tpRedirect(
    `https://www.tiqets.com/${langCode}/search?q=${encodeURIComponent(query)}`,
  )
}

// --- Klook (2-5% reward, 30d cookie) ---------------------------------------

export function buildKlookSearchUrl(query: string, lang: 'es' | 'en'): string {
  const langCode = lang === 'es' ? 'es' : 'en-US'
  return tpRedirect(
    `https://www.klook.com/${langCode}/search/?keyword=${encodeURIComponent(query)}`,
  )
}

// --- EKTA travel insurance (25% reward, 30d cookie) ------------------------

export function buildEktaInsuranceUrl(lang: 'es' | 'en'): string {
  const langCode = lang === 'es' ? 'es' : 'en'
  return tpRedirect(`https://ektatraveling.com/${langCode}/`)
}

// --- AirHelp (15-16.6% reward, 45d cookie) ---------------------------------

export function buildAirHelpUrl(lang: 'es' | 'en'): string {
  const langCode = lang === 'es' ? 'es' : 'en'
  return tpRedirect(`https://www.airhelp.com/${langCode}/`)
}

// --- Trip.com (1-5.5% reward, 7-30d cookie) --------------------------------

export function buildTripComHotelsUrl(cityName: string, lang: 'es' | 'en'): string {
  const langCode = lang === 'es' ? 'es-mx' : 'en-us'
  return tpRedirect(
    `https://www.trip.com/hotels/list?city=${encodeURIComponent(
      cityName,
    )}&locale=${langCode}`,
  )
}

// --- Expedia (1.35-3.6% reward, 7d cookie) ---------------------------------

export function buildExpediaHotelsUrl(cityName: string, lang: 'es' | 'en'): string {
  const langCode = lang === 'es' ? 'es_MX' : 'en_US'
  return tpRedirect(
    `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(
      cityName,
    )}&locale=${langCode}`,
  )
}

// --- Go City (3.4-6% reward, 90d cookie) -----------------------------------

export function buildGoCityUrl(citySlug: string): string {
  return tpRedirect(`https://gocity.com/en/${citySlug}/`)
}

// --- WeGoTrip (6.64-41.5% reward, 30d cookie) ------------------------------

export function buildWeGoTripSearchUrl(query: string, lang: 'es' | 'en'): string {
  const langCode = lang === 'es' ? 'es' : 'en'
  return tpRedirect(
    `https://wegotrip.com/${langCode}/search?q=${encodeURIComponent(query)}`,
  )
}

// --- CheapOair ($5-25 fixed reward, 30d cookie) ----------------------------

export function buildCheapOairUrl(): string {
  return tpRedirect('https://www.cheapoair.com/')
}

// --- Disclosure helpers ----------------------------------------------------

export const PARTNER_DISCLOSURE: Record<'es' | 'en', string> = {
  es: 'Enlace de afiliado — recibimos una pequeña comisión si reservas a través de este enlace, sin costo extra para ti.',
  en: 'Affiliate link — we earn a small commission if you book through this link, at no extra cost to you.',
}
