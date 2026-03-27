import { z } from 'zod'
import matchesJson from '@content/schedule/matches.json'

const MatchSchema = z.object({
  id: z.string(),
  phase: z.enum(['group_stage', 'round_of_32', 'round_of_16', 'quarter_final', 'semi_final', 'third_place', 'final']),
  group: z.string().optional(),
  matchday: z.number().int().positive(),
  date: z.string(),
  time: z.string(),
  venue: z.string(),
  city: z.string(),
  cityName: z.object({ es: z.string(), en: z.string() }),
  homeTeam: z.object({ es: z.string(), en: z.string() }),
  awayTeam: z.object({ es: z.string(), en: z.string() }),
})

const ScheduleFileSchema = z.object({
  lastUpdated: z.string(),
  disclaimer: z.string(),
  matches: z.array(MatchSchema).min(1),
})

export type Match = z.infer<typeof MatchSchema>

// Validate at import time -- if this throws, next build fails (same pattern as cities.ts)
const { matches, lastUpdated, disclaimer } = ScheduleFileSchema.parse(matchesJson)

export function getMatches(): Match[] {
  return matches
}

export function getMatchesByCity(citySlug: string): Match[] {
  return matches.filter((m) => m.city === citySlug)
}

export function getMatchesByGroup(group: string): Match[] {
  return matches.filter((m) => m.group === group)
}

export function getScheduleLastUpdated(): string {
  return lastUpdated
}

export function getScheduleDisclaimer(): string {
  return disclaimer
}
