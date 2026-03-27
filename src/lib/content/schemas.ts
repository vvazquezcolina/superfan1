import { z } from 'zod'

// Reusable schema for bilingual text fields (per D-07)
export const LocalizedText = z.object({
  es: z.string().min(1, 'Spanish text required'),
  en: z.string().min(1, 'English text required'),
})

// Reusable schema for bilingual URL slugs (per D-08, D-09)
export const LocalizedSlug = z.object({
  es: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid Spanish slug'),
  en: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid English slug'),
})

// Coordinates for map features (Phase 10)
export const Coordinates = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

// City content sub-schemas for rich editorial pages
export const CitySectionSchema = z.object({
  title: LocalizedText,
  content: LocalizedText, // HTML-free markdown-style paragraphs, separated by \n\n
})

export const CityFAQSchema = z.object({
  question: LocalizedText,
  answer: LocalizedText,
})

export const CitySourceSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
})

export const CityContentSchema = z.object({
  overview: LocalizedText,
  gettingThere: CitySectionSchema,
  gettingAround: CitySectionSchema,
  neighborhoods: CitySectionSchema,
  foodAndDrink: CitySectionSchema,
  safety: CitySectionSchema,
  weather: CitySectionSchema,
  culturalContext: CitySectionSchema,
  faq: z.array(CityFAQSchema).min(3).max(7),
  sources: z.array(CitySourceSchema).min(1),
})

export const CitySchema = z.object({
  id: z.string().min(1),
  slugs: LocalizedSlug,
  name: LocalizedText,
  country: z.enum(['mexico', 'usa', 'canada']),
  description: LocalizedText,
  stadium: z.string().min(1), // Reference to stadium id
  coordinates: Coordinates,
  lastUpdated: z.string(), // ISO date string for freshness signals
  content: CityContentSchema,
})

export const StadiumContentSchema = z.object({
  overview: LocalizedText,
  gettingThere: CitySectionSchema,   // Transport from city center to stadium
  seatingGuide: CitySectionSchema,   // Seating sections, capacity, tips
  nearbyHotels: CitySectionSchema,   // Hotels and food near stadium
  accessibility: CitySectionSchema,  // ADA/wheelchair, family services
  matchSchedule: CitySectionSchema,  // Placeholder for future match data (ISR-ready)
  faq: z.array(CityFAQSchema).min(3).max(7),
  sources: z.array(CitySourceSchema).min(1),
})

export const StadiumSchema = z.object({
  id: z.string().min(1),
  slugs: LocalizedSlug,
  name: LocalizedText,
  city: z.string().min(1), // Reference to city id
  capacity: z.number().int().positive(),
  coordinates: Coordinates,
  description: LocalizedText,
  lastUpdated: z.string(),
  content: StadiumContentSchema,
})

export const TeamPlayerSchema = z.object({
  name: z.string().min(1),
  position: LocalizedText,    // e.g. { es: "Delantero", en: "Forward" }
  club: z.string().min(1),    // Current club
  note: LocalizedText,        // Short note on the player
})

export const TeamFAQSchema = z.object({
  question: LocalizedText,
  answer: LocalizedText,
})

export const TeamSourceSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
})

export const TeamContentSchema = z.object({
  overview: LocalizedText,            // 2-3 paragraphs, first answers "quien es este equipo"
  worldCupHistory: CitySectionSchema, // Apariciones, mejor resultado, records notables
  keyPlayers: z.object({
    title: LocalizedText,
    players: z.array(TeamPlayerSchema).min(5).max(8),
  }),
  qualifyingPath: CitySectionSchema,  // How they qualified, performance in qualifying
  matchSchedule: CitySectionSchema,   // Placeholder — "Calendario de partidos proximamente"
  faq: z.array(TeamFAQSchema).min(3).max(5),
  sources: z.array(TeamSourceSchema).min(1),
})

export const TeamSchema = z.object({
  id: z.string().min(1),
  slugs: LocalizedSlug,
  name: LocalizedText,
  confederation: z.enum(['UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC']),
  group: z.string().optional(), // May not be assigned yet
  description: LocalizedText,
  lastUpdated: z.string(),
  content: TeamContentSchema.optional(),
})

// File-level schemas for validating entire JSON files
export const CitiesFileSchema = z.object({
  cities: z.array(CitySchema).min(1),
})
export const StadiumsFileSchema = z.object({
  stadiums: z.array(StadiumSchema).min(1),
})
export const TeamsFileSchema = z.object({
  teams: z.array(TeamSchema).min(1),
})

// Inferred TypeScript types -- these ARE the interfaces
export type City = z.infer<typeof CitySchema>
export type CityContent = z.infer<typeof CityContentSchema>
export type CitySection = z.infer<typeof CitySectionSchema>
export type CityFAQ = z.infer<typeof CityFAQSchema>
export type Stadium = z.infer<typeof StadiumSchema>
export type StadiumContent = z.infer<typeof StadiumContentSchema>
export type Team = z.infer<typeof TeamSchema>
export type TeamContent = z.infer<typeof TeamContentSchema>
export type TeamPlayer = z.infer<typeof TeamPlayerSchema>
export type TeamFAQ = z.infer<typeof TeamFAQSchema>
export type Locale = 'es' | 'en'

// ---------------------------------------------------------------------------
// Guide page schemas -- used by travel guides and fan experience guides (Phase 8)
// ---------------------------------------------------------------------------

export const GuideSectionSchema = z.object({
  title: LocalizedText,
  content: LocalizedText, // paragraphs separated by \n\n, HTML-free
})

export const GuideFAQSchema = z.object({
  question: LocalizedText,
  answer: LocalizedText,
})

export const GuideAffiliateCTASchema = z.object({
  label: LocalizedText,       // button/link label
  url: z.string().url(),      // full affiliate URL
  partner: z.string().min(1), // partner id for GA4 (e.g. 'booking')
  disclosure: LocalizedText,  // FTC disclosure text
})

export const GuidePageSchema = z.object({
  id: z.string().min(1),
  slugs: LocalizedSlug,
  category: z.enum(['viajes', 'fan']),  // determines URL prefix
  title: LocalizedText,
  description: LocalizedText,  // 120-155 chars, used as meta description
  overview: LocalizedText,     // first 200 words -- direct answer to primary query
  sections: z.array(GuideSectionSchema).min(1),
  faq: z.array(GuideFAQSchema).min(3).max(7),
  affiliateCTAs: z.array(GuideAffiliateCTASchema).default([]),
  lastUpdated: z.string(),  // ISO date e.g. "2026-03-26"
  sources: z.array(z.object({ name: z.string(), url: z.string().url() })).min(1),
})

export const GuidesFileSchema = z.object({
  guides: z.array(GuidePageSchema).min(1),
})

export type GuidePage = z.infer<typeof GuidePageSchema>
export type GuideSection = z.infer<typeof GuideSectionSchema>
export type GuideFAQ = z.infer<typeof GuideFAQSchema>
export type GuideAffiliateCTA = z.infer<typeof GuideAffiliateCTASchema>
