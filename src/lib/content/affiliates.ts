import { z } from 'zod'
import { LocalizedText, type Locale } from './schemas'
import affiliatesJson from '@content/affiliates.json'

// Zod schema for affiliate partner configuration
const AffiliatePartnerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  baseUrl: z.string().url(),
  searchUrlTemplate: z.string().min(1),
  aid: z.string().min(1),
  disclosure: LocalizedText,
  active: z.boolean(),
})

const AffiliatesFileSchema = z.object({
  partners: z.array(AffiliatePartnerSchema),
})

export type AffiliatePartner = z.infer<typeof AffiliatePartnerSchema>

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
