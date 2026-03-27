import comparisonsJson from '@content/programmatic/city-comparisons.json'
import routesJson from '@content/programmatic/routes.json'
import matchDayJson from '@content/programmatic/match-day-guides.json'
import listiclesJson from '@content/programmatic/listicles.json'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CityComparison {
  id: string
  city1: string
  city2: string
  slugs: { es: string; en: string }
  lastUpdated: string
  metrics: {
    costPerNight: { city1: number; city2: number }
    metroBudgetMeal: { city1: number; city2: number }
    altitude: { city1: number; city2: number }
    safetyIndex: { city1: number; city2: number }
    transportScore: { city1: number; city2: number }
    weatherJuneAvg: { city1: number; city2: number }
    stadiumCapacity: { city1: number; city2: number }
    airportCode: { city1: string; city2: string }
  }
  recommendation: {
    budget: string
    transport: string
    weather: string
    nightlife: string
    families: string
  }
}

export interface Route {
  id: string
  from: string
  to: string
  slugs: { es: string; en: string }
  lastUpdated: string
  flightDuration: number
  flightCostMin: number
  flightCostMax: number
  airlines: string[]
  busOperator: string
  busDuration: number | null
  busCostMin: number | null
  busCostMax: number | null
  driveDistance: number
  driveDuration: number | null
  recommendedMode: 'flight' | 'bus' | 'drive'
  travelTip: { es: string; en: string }
}

export interface MatchDayGuide {
  id: string
  cityId: string
  slug: string
  lastUpdated: string
  stadium: string
  arriveHours: number
  fanZones: { es: string; en: string }
  food: { es: string; en: string }
  transport: { es: string; en: string }
  whatToBring: { es: string; en: string }
  weatherWarning: { es: string; en: string }
}

export interface ListicleItem {
  rank: number
  entityId: string
  type: 'city' | 'stadium'
  value: number
  unit: string
  note?: { es: string; en: string }
}

export interface Listicle {
  id: string
  slug: string
  topic: string
  lastUpdated: string
  title: { es: string; en: string }
  description: { es: string; en: string }
  items: ListicleItem[]
}

// ---------------------------------------------------------------------------
// Accessors
// ---------------------------------------------------------------------------

export function getCityComparisons(): CityComparison[] {
  return comparisonsJson.comparisons as CityComparison[]
}

export function getCityComparison(slug: string): CityComparison | undefined {
  return (comparisonsJson.comparisons as CityComparison[]).find(
    (c) => c.slugs.es === slug || c.slugs.en === slug,
  )
}

export function getComparisonSlugs(): Array<{ pair: string; lang: 'es' | 'en' }> {
  return (comparisonsJson.comparisons as CityComparison[]).flatMap((c) => [
    { pair: c.slugs.es, lang: 'es' as const },
    { pair: c.slugs.en, lang: 'en' as const },
  ])
}

export function getRoutes(): Route[] {
  return routesJson.routes as Route[]
}

export function getRoute(slug: string): Route | undefined {
  return (routesJson.routes as Route[]).find(
    (r) => r.slugs.es === slug || r.slugs.en === slug,
  )
}

export function getRouteSlugs(): Array<{ route: string; lang: 'es' | 'en' }> {
  return (routesJson.routes as Route[]).flatMap((r) => [
    { route: r.slugs.es, lang: 'es' as const },
    { route: r.slugs.en, lang: 'en' as const },
  ])
}

export function getMatchDayGuides(): MatchDayGuide[] {
  return matchDayJson.guides as MatchDayGuide[]
}

export function getMatchDayGuide(slug: string): MatchDayGuide | undefined {
  return (matchDayJson.guides as MatchDayGuide[]).find((g) => g.slug === slug)
}

export function getMatchDayGuideSlugs(): Array<{ city: string; lang: 'es' | 'en' }> {
  return (matchDayJson.guides as MatchDayGuide[]).flatMap((g) => [
    { city: g.slug, lang: 'es' as const },
    { city: g.slug, lang: 'en' as const },
  ])
}

export function getListicles(): Listicle[] {
  return listiclesJson.listicles as Listicle[]
}

export function getListicle(slug: string): Listicle | undefined {
  return (listiclesJson.listicles as Listicle[]).find((l) => l.slug === slug)
}

export function getListicleSlugs(): Array<{ topic: string; lang: 'es' | 'en' }> {
  return (listiclesJson.listicles as Listicle[]).flatMap((l) => [
    { topic: l.slug, lang: 'es' as const },
    { topic: l.slug, lang: 'en' as const },
  ])
}
