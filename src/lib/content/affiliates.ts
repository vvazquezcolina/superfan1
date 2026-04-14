import { z } from 'zod'
import { LocalizedText, type Locale } from './schemas'
import affiliatesJson from '@content/affiliates.json'

// Zod schema for Travelpayouts widget configuration
const WidgetConfigSchema = z.object({
  hotelWidgetId: z.string().min(1),
  flightWidgetId: z.string().min(1),
  currency: z.string().min(1),
  locale: z.record(z.string()),
  embedType: z.enum(['script', 'iframe']).optional(),
})

// Zod schema for affiliate partner configuration
const AffiliatePartnerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  baseUrl: z.string().url(),
  searchUrlTemplate: z.string(),
  aid: z.string().min(1),
  // Travelpayouts-specific fields (optional for Booking.com)
  token: z.string().optional(),
  marker: z.string().optional(),
  widgetConfig: WidgetConfigSchema.optional(),
  disclosure: LocalizedText,
  active: z.boolean(),
})

const AffiliatesFileSchema = z.object({
  partners: z.array(AffiliatePartnerSchema),
})

export type AffiliatePartner = z.infer<typeof AffiliatePartnerSchema>
export type WidgetConfig = z.infer<typeof WidgetConfigSchema>

// Validate at module level -- build fails on invalid data (same pattern as cities.ts)
const { partners } = AffiliatesFileSchema.parse(affiliatesJson)

/**
 * Get a single affiliate partner by ID.
 */
export function getAffiliatePartner(id: string): AffiliatePartner | undefined {
  return partners.find((p) => p.id === id)
}

/**
 * Get all affiliate partners.
 */
export function getAffiliatePartners(): AffiliatePartner[] {
  return partners
}

/**
 * Build a Booking.com search URL for a specific city.
 * Replaces template placeholders with actual values.
 * Default dates: World Cup week 1 (June 11-18, 2026).
 */
export function buildBookingUrl(
  cityName: string,
  lang: Locale,
  checkin?: string,
  checkout?: string,
): string {
  const partner = getAffiliatePartner('booking')
  if (!partner) return 'https://www.booking.com'

  return partner.searchUrlTemplate
    .replace('{city}', encodeURIComponent(cityName))
    .replace('{checkin}', checkin ?? '2026-06-11')
    .replace('{checkout}', checkout ?? '2026-06-18')
    .replace('{lang}', lang === 'es' ? 'es' : 'en')
    .replace('{aid}', partner.aid)
}

/**
 * Build a tracked Booking.com URL that routes through Travelpayouts' redirect
 * (tp.media/r?marker=...) so clicks are attributed to the affiliate marker.
 * Same pattern BudgetCalculator and ItineraryPlanner already use.
 */
export function buildTravelpayoutsBookingUrl(
  cityName: string,
  lang: Locale,
): string {
  const partner = getAffiliatePartner('travelpayouts')
  const marker = partner?.marker ?? partner?.aid ?? '233922'
  const checkin = '2026-06-11'
  const checkout = '2026-06-18'
  const bookingLang = lang === 'es' ? 'es' : 'en'
  const booking = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(cityName)}&checkin=${checkin}&checkout=${checkout}&lang=${bookingLang}&aid=304142`
  return `https://tp.media/r?marker=${marker}&trs=${marker}&p=4114&u=${encodeURIComponent(booking)}`
}

/**
 * Build a tracked Aviasales flight URL for a destination.
 */
export function buildTravelpayoutsFlightUrl(destinationIata: string): string {
  const partner = getAffiliatePartner('travelpayouts')
  const marker = partner?.marker ?? partner?.aid ?? '233922'
  const dest = `https://www.aviasales.com/?destination=${encodeURIComponent(destinationIata)}`
  return `https://tp.media/r?marker=${marker}&trs=${marker}&p=501&u=${encodeURIComponent(dest)}`
}

/**
 * Build a Travelpayouts hotel widget script URL.
 * Returns the iframe/script src for embedding the hotel search widget.
 */
export function buildTravelpayoutsHotelWidgetSrc(lang: Locale): string {
  const partner = getAffiliatePartner('travelpayouts')
  if (!partner || !partner.widgetConfig) return ''

  const { hotelWidgetId, currency } = partner.widgetConfig
  const locale = lang === 'es' ? 'es' : 'en'
  const marker = partner.marker ?? partner.aid

  return (
    `https://tp.media/content?currency=${currency}` +
    `&shmarker=${marker}` +
    `&locale=${locale}` +
    `&with_fallback=1` +
    `&powered_by=1` +
    `&border_radius=0` +
    `&plain=false` +
    `&color_button=%23ff6600` +
    `&color_button_text=%23ffffff` +
    `&promo_id=${hotelWidgetId}` +
    `&campaign_id=100`
  )
}

/**
 * Build a Travelpayouts flight widget script URL.
 * Returns the iframe/script src for embedding the flight search widget.
 */
export function buildTravelpayoutsFlightWidgetSrc(lang: Locale): string {
  const partner = getAffiliatePartner('travelpayouts')
  if (!partner || !partner.widgetConfig) return ''

  const { flightWidgetId, currency } = partner.widgetConfig
  const locale = lang === 'es' ? 'es' : 'en'
  const marker = partner.marker ?? partner.aid

  return (
    `https://tp.media/content?currency=${currency}` +
    `&shmarker=${marker}` +
    `&locale=${locale}` +
    `&with_fallback=1` +
    `&powered_by=1` +
    `&border_radius=0` +
    `&plain=false` +
    `&color_button=%23004080` +
    `&color_button_text=%23ffffff` +
    `&promo_id=${flightWidgetId}` +
    `&campaign_id=100`
  )
}
