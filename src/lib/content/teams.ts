import { TeamsFileSchema, type Team, type Locale } from './schemas'
import teamsJson from '@content/teams.json'

// Validate at import time -- if this throws, next build fails (D-05)
const { teams } = TeamsFileSchema.parse(teamsJson)

export function getTeams(): Team[] {
  return teams
}

export function getTeam(slug: string, lang: Locale): Team | undefined {
  return teams.find((team) => team.slugs[lang] === slug)
}

export function getTeamById(id: string): Team | undefined {
  return teams.find((team) => team.id === id)
}

/**
 * Returns all slug + lang combinations for generateStaticParams.
 * Output: [{ lang: 'es', slug: 'mexico' }, { lang: 'en', slug: 'mexico' }, ...]
 */
export function getTeamSlugs(): Array<{ slug: string; lang: Locale }> {
  return teams.flatMap((team) => [
    { slug: team.slugs.es, lang: 'es' as const },
    { slug: team.slugs.en, lang: 'en' as const },
  ])
}
