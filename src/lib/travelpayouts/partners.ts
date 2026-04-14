/**
 * Per-partner affiliate URL builders for the Travelpayouts programs we are
 * connected to. Each partner uses its OWN attribution scheme — direct query
 * parameters on the partner's own URL, NOT a unified tp.media/r redirect.
 *
 * All identifiers below were extracted via the Travelpayouts Tools link
 * generator on the Superfaninfo project (id 518576), account 677963.
 *
 * Status of each connection (as of project creation date):
 *   - Aviasales        ✅ instant connect
 *   - Welcome Pickups  ✅ instant connect
 *   - Kiwitaxi         ✅ instant connect
 *   - Tiqets           ✅ instant connect
 *   - EKTA             ✅ instant connect
 *   - AirHelp          ✅ instant connect
 *   - Klook            ✅ instant connect
 *   - GetYourGuide     ⏳ in review (using legacy Travelreport partner_id)
 *   - Booking.com      ❌ declined for Superfaninfo, fallback to legacy
 *                         Travelreport marker for that one partner only
 */

const TP_USER_ID = '677963'

// Aviasales marker (Superfaninfo project) — long format with project hash.
const AVIASALES_MARKER = '677963.Zz415029e6833748d7bcaba2c-677963'

// Per-partner attribution hashes (Superfaninfo project).
const KLOOK_AID = `api|13694|a4236e1a61264f6a979abf80a-${TP_USER_ID}|pid|${TP_USER_ID}`
const AIRHELP_DATA1 = `e2ab326072bc4f87b4855048c-${TP_USER_ID}`
const WELCOME_PICKUPS_TRACK = `7c02c399cf3144dd91da3d363-${TP_USER_ID}`
const EKTA_SUB_ID = `983ff6b7e98a4eca9ea09e54a-${TP_USER_ID}`
const TIQETS_CAMPAIGN = `7d80805efdc8447282ec6a53f-${TP_USER_ID}`
const KIWITAXI_TPO = `2e0b9affc08d471d90cceaa84-${TP_USER_ID}`

// Legacy Travelreport marker — only used for partners where Superfaninfo
// is not yet connected (GetYourGuide in review, Booking declined).
const LEGACY_MARKER = '233922'
const LEGACY_GYG_PARTNER_ID = '0JJQDRO'
const LEGACY_GYG_CMP_PREFIX = 'c003dd2abdd3486d89b6db57d'

/** Append (or merge) query parameters to any URL safely. */
function withParams(rawUrl: string, params: Record<string, string>): string {
  const url = new URL(rawUrl)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }
  return url.toString()
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
  params.set('marker', AVIASALES_MARKER)
  return `https://www.aviasales.com/search?${params.toString()}`
}

// --- Booking.com (LEGACY Travelreport marker — Superfaninfo declined) ------

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
  return `https://tp.media/r?marker=${LEGACY_MARKER}&trs=${LEGACY_MARKER}&p=4114&u=${encodeURIComponent(search)}`
}

// --- GetYourGuide (LEGACY Travelreport partner_id — in review) -------------

export function buildGetYourGuideUrl(destinationUrl: string): string {
  return withParams(destinationUrl, {
    partner_id: LEGACY_GYG_PARTNER_ID,
    cmp: `${LEGACY_GYG_CMP_PREFIX}-${TP_USER_ID}`,
  })
}

export function buildGetYourGuideSearchUrl(
  query: string,
  lang: 'es' | 'en',
): string {
  const path = lang === 'es' ? '/es-es/s/' : '/s/'
  const base = `https://www.getyourguide.com${path}?q=${encodeURIComponent(
    query,
  )}&searchSource=3`
  return buildGetYourGuideUrl(base)
}

// --- Welcome Pickups (8-9% reward, 45d cookie) -----------------------------

export function buildWelcomePickupsUrl(citySlug: string): string {
  return withParams(`https://welcomepickups.com/${citySlug}/`, {
    aff_track_id: WELCOME_PICKUPS_TRACK,
    utm_source: 'travelpayouts',
  })
}

export function buildWelcomePickupsSearchUrl(cityName: string): string {
  const url = cityName
    ? `https://welcomepickups.com?destination=${encodeURIComponent(cityName)}`
    : 'https://welcomepickups.com'
  return withParams(url, {
    aff_track_id: WELCOME_PICKUPS_TRACK,
    utm_source: 'travelpayouts',
  })
}

// --- Kiwitaxi (9-11% reward, 30d cookie) -----------------------------------

export function buildKiwitaxiSearchUrl(
  fromIata: string,
  toName: string,
  lang: 'es' | 'en',
): string {
  const langCode = lang === 'es' ? 'es' : 'en'
  return withParams(`https://kiwitaxi.com/?lang=${langCode}`, {
    from: fromIata,
    to: toName,
    tpo: KIWITAXI_TPO,
    utm_source: 'travelpayouts',
  })
}

export function buildKiwitaxiHomeUrl(lang: 'es' | 'en'): string {
  const langCode = lang === 'es' ? 'es' : 'en'
  return withParams(`https://kiwitaxi.com/?lang=${langCode}`, {
    tpo: KIWITAXI_TPO,
    utm_source: 'travelpayouts',
  })
}

// --- Tiqets (3.5-8% reward, 30d cookie) ------------------------------------

export function buildTiqetsSearchUrl(query: string, lang: 'es' | 'en'): string {
  const langCode = lang === 'es' ? 'es' : 'en'
  return withParams(
    `https://www.tiqets.com/${langCode}/search?q=${encodeURIComponent(query)}`,
    {
      partner: 'travelpayouts.com',
      tq_campaign: TIQETS_CAMPAIGN,
      tq_click_id: TIQETS_CAMPAIGN,
    },
  )
}

// --- Klook (2-5% reward, 30d cookie) ---------------------------------------

export function buildKlookSearchUrl(query: string, lang: 'es' | 'en'): string {
  const langCode = lang === 'es' ? 'es' : 'en-US'
  return withParams(
    `https://www.klook.com/${langCode}/search/?keyword=${encodeURIComponent(query)}`,
    {
      aid: KLOOK_AID,
      aff_pid: TP_USER_ID,
    },
  )
}

// --- EKTA travel insurance (25% reward, 30d cookie) ------------------------

export function buildEktaInsuranceUrl(lang: 'es' | 'en'): string {
  const langCode = lang === 'es' ? 'es' : 'en'
  return withParams(`https://ektatraveling.com/${langCode}/`, {
    sub_id: EKTA_SUB_ID,
    utm_source: 'travelpayouts',
  })
}

// --- AirHelp (15-16.6% reward, 45d cookie) ---------------------------------

export function buildAirHelpUrl(lang: 'es' | 'en'): string {
  const langCode = lang === 'es' ? 'es' : 'en'
  return withParams(`https://www.airhelp.com/${langCode}/`, {
    a_aid: 'Travelpayouts',
    data1: AIRHELP_DATA1,
    utm_campaign: 'aff-Travelpayouts',
    utm_medium: 'affiliate',
    utm_source: 'pap',
  })
}

// --- Disclosure helpers ----------------------------------------------------

export const PARTNER_DISCLOSURE: Record<'es' | 'en', string> = {
  es: 'Enlace de afiliado — recibimos una pequeña comisión si reservas a través de este enlace, sin costo extra para ti.',
  en: 'Affiliate link — we earn a small commission if you book through this link, at no extra cost to you.',
}
