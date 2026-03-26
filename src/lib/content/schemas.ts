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

export const CitySchema = z.object({
  id: z.string().min(1),
  slugs: LocalizedSlug,
  name: LocalizedText,
  country: z.enum(['mexico', 'usa', 'canada']),
  description: LocalizedText,
  stadium: z.string().min(1), // Reference to stadium id
  coordinates: Coordinates,
  lastUpdated: z.string(), // ISO date string for freshness signals
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
export type Stadium = z.infer<typeof StadiumSchema>
export type Team = z.infer<typeof TeamSchema>
export type Locale = 'es' | 'en'
