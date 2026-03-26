import type { MetadataRoute } from 'next'
import { getCities } from '@/lib/content/cities'
import { getStadiums } from '@/lib/content/stadiums'
import { getTeams } from '@/lib/content/teams'

const SITE_URL = 'https://www.superfaninfo.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const cities = getCities()
  const stadiums = getStadiums()
  const teams = getTeams()

  const entries: MetadataRoute.Sitemap = []

  // Homepage (both locales) -- highest priority
  entries.push(
    {
      url: `${SITE_URL}/es`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          'es-419': `${SITE_URL}/es`,
          en: `${SITE_URL}/en`,
        },
      },
    },
    {
      url: `${SITE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          'es-419': `${SITE_URL}/es`,
          en: `${SITE_URL}/en`,
        },
      },
    }
  )

  // City pages -- high priority (main content)
  for (const city of cities) {
    entries.push(
      {
        url: `${SITE_URL}/es/ciudades/${city.slugs.es}`,
        lastModified: new Date(city.lastUpdated),
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: {
          languages: {
            'es-419': `${SITE_URL}/es/ciudades/${city.slugs.es}`,
            en: `${SITE_URL}/en/cities/${city.slugs.en}`,
          },
        },
      },
      {
        url: `${SITE_URL}/en/cities/${city.slugs.en}`,
        lastModified: new Date(city.lastUpdated),
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: {
          languages: {
            'es-419': `${SITE_URL}/es/ciudades/${city.slugs.es}`,
            en: `${SITE_URL}/en/cities/${city.slugs.en}`,
          },
        },
      }
    )
  }

  // Stadium pages -- high priority
  for (const stadium of stadiums) {
    entries.push(
      {
        url: `${SITE_URL}/es/estadios/${stadium.slugs.es}`,
        lastModified: new Date(stadium.lastUpdated),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            'es-419': `${SITE_URL}/es/estadios/${stadium.slugs.es}`,
            en: `${SITE_URL}/en/stadiums/${stadium.slugs.en}`,
          },
        },
      },
      {
        url: `${SITE_URL}/en/stadiums/${stadium.slugs.en}`,
        lastModified: new Date(stadium.lastUpdated),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            'es-419': `${SITE_URL}/es/estadios/${stadium.slugs.es}`,
            en: `${SITE_URL}/en/stadiums/${stadium.slugs.en}`,
          },
        },
      }
    )
  }

  // Team pages -- medium priority
  for (const team of teams) {
    entries.push(
      {
        url: `${SITE_URL}/es/equipos/${team.slugs.es}`,
        lastModified: new Date(team.lastUpdated),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            'es-419': `${SITE_URL}/es/equipos/${team.slugs.es}`,
            en: `${SITE_URL}/en/teams/${team.slugs.en}`,
          },
        },
      },
      {
        url: `${SITE_URL}/en/teams/${team.slugs.en}`,
        lastModified: new Date(team.lastUpdated),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            'es-419': `${SITE_URL}/es/equipos/${team.slugs.es}`,
            en: `${SITE_URL}/en/teams/${team.slugs.en}`,
          },
        },
      }
    )
  }

  return entries
}
