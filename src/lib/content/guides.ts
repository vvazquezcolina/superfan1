import { GuidesFileSchema, type GuidePage, type Locale } from './schemas'
import travelJson from '@content/guides/travel.json'

// Validate at import time -- if this throws, next build fails (same pattern as cities.ts)
const { guides } = GuidesFileSchema.parse(travelJson)

/**
 * Get a single guide by its unique id.
 */
export function getGuide(id: string): GuidePage | undefined {
  return guides.find((guide) => guide.id === id)
}

/**
 * Get all guides in a given category.
 */
export function getGuidesByCategory(category: 'viajes' | 'fan'): GuidePage[] {
  return guides.filter((guide) => guide.category === category)
}

/**
 * Get a guide by its locale-specific slug.
 * Matches guide where guide.slugs[lang] === slug.
 */
export function getGuideBySlug(slug: string, lang: Locale): GuidePage | undefined {
  return guides.find((guide) => guide.slugs[lang] === slug)
}
