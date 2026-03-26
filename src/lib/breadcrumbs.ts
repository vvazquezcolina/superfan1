import type { Locale } from '@/lib/content/schemas'

const SITE_URL = 'https://www.superfaninfo.com'

export interface BreadcrumbItem {
  label: string
  href: string
}

// Map from filesystem path segments to dictionary keys
const SEGMENT_TO_DICT_KEY: Record<string, string> = {
  ciudades: 'cities',
  estadios: 'stadiums',
  equipos: 'teams',
  viajes: 'travel',
  herramientas: 'tools',
  // English segments map to the same dict keys
  cities: 'cities',
  stadiums: 'stadiums',
  teams: 'teams',
  travel: 'travel',
  tools: 'tools',
}

/**
 * Generate breadcrumb items from a URL path.
 *
 * @param path - The full URL path (e.g., '/es/ciudades/ciudad-de-mexico')
 * @param lang - The current locale
 * @param breadcrumbLabels - The breadcrumb labels from the dictionary (dict.breadcrumbs)
 * @param entityName - Optional name for the leaf item (e.g., 'Ciudad de Mexico')
 * @returns Array of BreadcrumbItem with label and href
 */
export function generateBreadcrumbs(
  path: string,
  lang: Locale,
  breadcrumbLabels: Record<string, string>,
  entityName?: string,
): BreadcrumbItem[] {
  const segments = path.split('/').filter(Boolean)

  // Remove the lang prefix (first segment)
  const pathSegments = segments.slice(1)

  // Always start with Home
  const breadcrumbs: BreadcrumbItem[] = [
    { label: breadcrumbLabels.home, href: `/${lang}` },
  ]

  if (pathSegments.length === 0) {
    return breadcrumbs
  }

  // Build intermediate breadcrumbs
  const lastIndex = pathSegments.length - 1

  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i]
    const href = `/${lang}/${pathSegments.slice(0, i + 1).join('/')}`

    if (i === lastIndex && entityName) {
      // Last segment with an entity name -- use the entity name as label
      breadcrumbs.push({ label: entityName, href })
    } else {
      // Category segment -- look up label from dictionary
      const dictKey = SEGMENT_TO_DICT_KEY[segment]
      const label = dictKey ? breadcrumbLabels[dictKey] || segment : segment
      breadcrumbs.push({ label, href })
    }
  }

  return breadcrumbs
}

/**
 * Build Schema.org BreadcrumbList JSON-LD from breadcrumb items.
 *
 * Per Schema.org convention, the last item does NOT include an `item` (URL)
 * property since it represents the current page. All other URLs are absolute.
 *
 * @param breadcrumbs - Array of BreadcrumbItem from generateBreadcrumbs
 * @returns Schema.org BreadcrumbList JSON-LD object
 */
export function buildBreadcrumbJsonLd(
  breadcrumbs: BreadcrumbItem[],
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => {
      const isLast = index === breadcrumbs.length - 1
      const item: Record<string, unknown> = {
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.label,
      }
      // Last item does NOT include item (URL) per Schema.org convention
      if (!isLast) {
        item.item = `${SITE_URL}${crumb.href}`
      }
      return item
    }),
  }
}
