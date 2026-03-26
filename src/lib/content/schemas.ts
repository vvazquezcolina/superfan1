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

export const StadiumSchema = z.object({
  id: z.string().min(1),
  slugs: LocalizedSlug,
  name: LocalizedText,
  city: z.string().min(1), // Reference to city id
  capacity: z.number().int().positive(),
  coordinates: Coordinates,
  description: LocalizedText,
  lastUpdated: z.string(),
})

export const TeamSchema = z.object({
  id: z.string().min(1),
  slugs: LocalizedSlug,
  name: LocalizedText,
  confederation: z.enum(['UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC']),
  group: z.string().optional(), // May not be assigned yet
  description: LocalizedText,
  lastUpdated: z.string(),
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
export type Team = z.infer<typeof TeamSchema>
export type Locale = 'es' | 'en'
