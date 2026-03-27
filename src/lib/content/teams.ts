import { TeamsFileSchema, type Team, type Locale } from './schemas'
import teamsJson from '@content/teams.json'

// Validate at import time -- if this throws, next build fails (D-05)
const { teams } = TeamsFileSchema.parse(teamsJson)

/** New locales (pt, fr, de, ar) share the Spanish filesystem slugs */
const EXTRA_LOCALES = ['pt', 'fr', 'de', 'ar'] as const
type ExtraLocale = (typeof EXTRA_LOCALES)[number]
type AnyLocale = Locale | ExtraLocale

export function getTeams(): Team[] {
  return teams
}

/**
 * Find a team by slug and language.
 * For extended locales (pt, fr, de, ar), slugs match against the es slug.
 */
export function getTeam(slug: string, lang: AnyLocale): Team | undefined {
  if (lang === 'es' || lang === 'en') {
    return teams.find((team) => team.slugs[lang] === slug)
  }
  // Extended locales use the Spanish slug
  return teams.find((team) => team.slugs.es === slug)
}

export function getTeamById(id: string): Team | undefined {
  return teams.find((team) => team.id === id)
}

/**
 * Returns all slug + lang combinations for generateStaticParams.
 * Includes es/en slugs plus es slugs for each extended locale.
 * Output: [{ lang: 'es', slug: 'mexico' }, { lang: 'en', slug: 'mexico' }, ...]
 */
export function getTeamSlugs(): Array<{ slug: string; lang: string }> {
  return teams.flatMap((team) => [
    { slug: team.slugs.es, lang: 'es' },
    { slug: team.slugs.en, lang: 'en' },
    ...EXTRA_LOCALES.map((locale) => ({ slug: team.slugs.es, lang: locale })),
  ])
}
