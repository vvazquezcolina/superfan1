'use client'

import { useState, useCallback } from 'react'
import { trackToolUsage, trackAffiliateClick } from '@/lib/analytics'
import {
  Plane, Bus, Map, Trophy, MapPin, Hotel, Share2, Check,
  Calendar as CalendarIcon, DollarSign, Sparkles
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Static cost data (mirrors BudgetCalculator)
// ---------------------------------------------------------------------------

const HOTEL_COSTS: Record<string, Record<string, number>> = {
  'ciudad-de-mexico': { budget: 35, mid: 75, luxury: 180 },
  monterrey: { budget: 40, mid: 80, luxury: 200 },
  guadalajara: { budget: 38, mid: 78, luxury: 190 },
  'new-york-new-jersey': { budget: 120, mid: 220, luxury: 450 },
  'los-angeles': { budget: 100, mid: 180, luxury: 380 },
  dallas: { budget: 80, mid: 150, luxury: 300 },
  houston: { budget: 75, mid: 140, luxury: 280 },
  atlanta: { budget: 85, mid: 155, luxury: 320 },
  philadelphia: { budget: 90, mid: 165, luxury: 340 },
  miami: { budget: 95, mid: 175, luxury: 360 },
  seattle: { budget: 100, mid: 185, luxury: 390 },
  'san-francisco': { budget: 110, mid: 200, luxury: 420 },
  boston: { budget: 95, mid: 175, luxury: 360 },
  'kansas-city': { budget: 70, mid: 130, luxury: 260 },
  toronto: { budget: 90, mid: 160, luxury: 330 },
  vancouver: { budget: 85, mid: 155, luxury: 310 },
}

const MEALS_COSTS: Record<string, number> = { budget: 25, mid: 60, luxury: 120 }

// Attractions per city (bilingual)
const CITY_ATTRACTIONS: Record<string, { es: string[]; en: string[] }> = {
  'ciudad-de-mexico': {
    es: ['Zocalo y Centro Historico', 'Museo Nacional de Antropologia', 'Bosque de Chapultepec', 'Teotihuacan (excursion de dia)'],
    en: ['Zocalo & Historic Center', 'National Museum of Anthropology', 'Chapultepec Forest', 'Teotihuacan (day trip)'],
  },
  monterrey: {
    es: ['Macroplaza', 'Barrio Antiguo', 'Cerro de la Silla', 'Grutas de Garcia'],
    en: ['Macroplaza', 'Barrio Antiguo', 'Cerro de la Silla', 'Garcia Caves'],
  },
  guadalajara: {
    es: ['Centro Historico', 'Tlaquepaque', 'Tequila (excursion de dia)', 'Teatro Degollado'],
    en: ['Historic Center', 'Tlaquepaque', 'Tequila (day trip)', 'Degollado Theater'],
  },
  'los-angeles': {
    es: ['Hollywood Boulevard', 'Venice Beach', 'The Getty Center', 'Santa Monica Pier'],
    en: ['Hollywood Boulevard', 'Venice Beach', 'The Getty Center', 'Santa Monica Pier'],
  },
  dallas: {
    es: ['Deep Ellum', 'Sixth Floor Museum', 'Dallas Arboretum', 'AT&T Stadium Tour'],
    en: ['Deep Ellum', 'Sixth Floor Museum', 'Dallas Arboretum', 'AT&T Stadium Tour'],
  },
  houston: {
    es: ['Space Center Houston', 'Museum District', 'Hermann Park', 'The Galleria'],
    en: ['Space Center Houston', 'Museum District', 'Hermann Park', 'The Galleria'],
  },
  miami: {
    es: ['South Beach', 'Wynwood Walls', 'Little Havana', 'Art Deco Historic District'],
    en: ['South Beach', 'Wynwood Walls', 'Little Havana', 'Art Deco Historic District'],
  },
  'new-york-new-jersey': {
    es: ['Central Park', 'Times Square', 'Estatua de la Libertad', 'Brooklyn Bridge'],
    en: ['Central Park', 'Times Square', 'Statue of Liberty', 'Brooklyn Bridge'],
  },
  atlanta: {
    es: ['World of Coca-Cola', 'Georgia Aquarium', 'Martin Luther King Jr. NHS', 'Piedmont Park'],
    en: ['World of Coca-Cola', 'Georgia Aquarium', 'Martin Luther King Jr. NHS', 'Piedmont Park'],
  },
  philadelphia: {
    es: ['Liberty Bell', 'Independence Hall', 'Philadelphia Museum of Art', 'Reading Terminal Market'],
    en: ['Liberty Bell', 'Independence Hall', 'Philadelphia Museum of Art', 'Reading Terminal Market'],
  },
  seattle: {
    es: ['Space Needle', 'Pike Place Market', 'Chihuly Garden and Glass', 'Mount Rainier (excursion)'],
    en: ['Space Needle', 'Pike Place Market', 'Chihuly Garden and Glass', 'Mount Rainier (day trip)'],
  },
  'san-francisco': {
    es: ['Golden Gate Bridge', 'Alcatraz', 'Fisherman\'s Wharf', 'Chinatown'],
    en: ['Golden Gate Bridge', 'Alcatraz', 'Fisherman\'s Wharf', 'Chinatown'],
  },
  boston: {
    es: ['Freedom Trail', 'Fenway Park', 'Harvard Square', 'Boston Harbor'],
    en: ['Freedom Trail', 'Fenway Park', 'Harvard Square', 'Boston Harbor'],
  },
  'kansas-city': {
    es: ['Country Club Plaza', 'Nelson-Atkins Museum', 'Power & Light District', 'Negro Leagues Baseball Museum'],
    en: ['Country Club Plaza', 'Nelson-Atkins Museum', 'Power & Light District', 'Negro Leagues Baseball Museum'],
  },
  toronto: {
    es: ['CN Tower', 'Distillery District', 'Kensington Market', 'Niagara Falls (excursion)'],
    en: ['CN Tower', 'Distillery District', 'Kensington Market', 'Niagara Falls (day trip)'],
  },
  vancouver: {
    es: ['Stanley Park', 'Granville Island', 'Gastown', 'Whistler (excursion)'],
    en: ['Stanley Park', 'Granville Island', 'Gastown', 'Whistler (day trip)'],
  },
}

// Transport tips between countries
const INTER_CITY_TRANSPORT: Record<string, { es: string; en: string }> = {
  mexico: { es: 'Vuelo interno ~1-2h o autobus de primera clase', en: 'Domestic flight ~1-2h or first-class bus' },
  usa: { es: 'Vuelo interno ~2-4h o tren Amtrak en el noreste', en: 'Domestic flight ~2-4h or Amtrak train in Northeast' },
  canada: { es: 'Vuelo interno ~4h o VIA Rail para rutas cortas', en: 'Domestic flight ~4h or VIA Rail for short routes' },
}

const CITY_COUNTRY: Record<string, string> = {
  'ciudad-de-mexico': 'mexico',
  monterrey: 'mexico',
  guadalajara: 'mexico',
  'los-angeles': 'usa',
  dallas: 'usa',
  houston: 'usa',
  miami: 'usa',
  'new-york-new-jersey': 'usa',
  atlanta: 'usa',
  philadelphia: 'usa',
  seattle: 'usa',
  'san-francisco': 'usa',
  boston: 'usa',
  'kansas-city': 'usa',
  toronto: 'canada',
  vancouver: 'canada',
}

const AFFILIATE_MARKER = '9a350c3ebd492165ade7135359165af9'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CityOption {
  id: string
  name: string
}

interface ItineraryDay {
  dayNumber: number
  cityId: string
  cityName: string
  type: 'arrival' | 'sightseeing' | 'match' | 'departure' | 'transit'
  hotelCost: number
  mealCost: number
  attractions: string[]
  transportNote?: string
  isMatchDay?: boolean
}

interface ItineraryPlannerDict {
  itinerarySelectCities: string
  itinerarySelectDates: string
  itineraryBudgetTier: string
  itineraryGenerate: string
  itineraryDayLabel: string
  itineraryArrival: string
  itineraryDeparture: string
  itineraryMatch: string
  itineraryHotel: string
  itineraryTransport: string
  itinerarySightseeing: string
  itineraryCostEstimate: string
  itineraryShareLabel: string
  itineraryShareCopied: string
  itineraryNoCities: string
  itineraryBudgetEco: string
  itineraryBudgetMid: string
  itineraryBudgetLux: string
  itineraryBookHotel: string
  itineraryBookFlight: string
  itineraryTotalCost: string
  itineraryNights: string
  itineraryPerNight: string
}

interface ItineraryPlannerProps {
  cities: CityOption[]
  lang: 'es' | 'en'
  dict: ItineraryPlannerDict
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function formatDate(date: Date, lang: 'es' | 'en'): string {
  return date.toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ItineraryPlanner({ cities, lang, dict }: ItineraryPlannerProps) {
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [startDate, setStartDate] = useState('')
  const [budgetTier, setBudgetTier] = useState<'budget' | 'mid' | 'luxury'>('mid')
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const toggleCity = useCallback((cityId: string) => {
    setSelectedCities((prev) =>
      prev.includes(cityId) ? prev.filter((c) => c !== cityId) : [...prev, cityId],
    )
  }, [])

  function buildItinerary() {
    if (selectedCities.length === 0) {
      setError(dict.itineraryNoCities)
      return
    }
    setError('')

    const mealCost = MEALS_COSTS[budgetTier]
    const start = startDate ? new Date(startDate + 'T12:00:00') : new Date('2026-06-11T12:00:00')
    const days: ItineraryDay[] = []
    let dayOffset = 0

    selectedCities.forEach((cityId, cityIndex) => {
      const cityOption = cities.find((c) => c.id === cityId)
      const cityName = cityOption?.name ?? cityId
      const attractions = (CITY_ATTRACTIONS[cityId]?.[lang] ?? ['Explorar la ciudad']).slice(0)
      const hotelCost = HOTEL_COSTS[cityId]?.[budgetTier] ?? 90
      const country = CITY_COUNTRY[cityId] ?? 'usa'

      // Transit/arrival day
      if (cityIndex > 0) {
        const prevCountry = CITY_COUNTRY[selectedCities[cityIndex - 1]] ?? 'usa'
        days.push({
          dayNumber: dayOffset + 1,
          cityId,
          cityName,
          type: 'transit',
          hotelCost,
          mealCost,
          attractions: [],
          transportNote:
            prevCountry !== country
              ? `${lang === 'es' ? 'Vuelo internacional a' : 'International flight to'} ${cityName}`
              : (INTER_CITY_TRANSPORT[country]?.[lang] ?? ''),
        })
        dayOffset++
      }

      // Arrival day
      days.push({
        dayNumber: dayOffset + 1,
        cityId,
        cityName,
        type: 'arrival',
        hotelCost,
        mealCost,
        attractions: [attractions[0] ?? 'Check-in'],
        transportNote: cityIndex === 0 ? (lang === 'es' ? 'Llegada al destino' : 'Arrival at destination') : undefined,
      })
      dayOffset++

      // Sightseeing days (2 days per city minimum)
      const sightseeingDays = Math.min(2, attractions.length)
      for (let s = 0; s < sightseeingDays; s++) {
        days.push({
          dayNumber: dayOffset + 1,
          cityId,
          cityName,
          type: s === 0 ? 'match' : 'sightseeing',
          hotelCost,
          mealCost,
          attractions: [attractions[s + 1] ?? attractions[0], attractions[s + 2] ?? ''],
          isMatchDay: s === 0,
        })
        dayOffset++
      }
    })

    // Departure day
    const lastCity = selectedCities[selectedCities.length - 1]
    const lastCityName = cities.find((c) => c.id === lastCity)?.name ?? lastCity
    days.push({
      dayNumber: dayOffset + 1,
      cityId: lastCity,
      cityName: lastCityName,
      type: 'departure',
      hotelCost: 0,
      mealCost: MEALS_COSTS[budgetTier],
      attractions: [],
    })

    trackToolUsage('itinerary_planner')
    setItinerary(days)
  }

  function handleShare() {
    const params = new URLSearchParams({
      cities: selectedCities.join(','),
      budget: budgetTier,
      ...(startDate ? { start: startDate } : {}),
    })
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const totalCost = itinerary
    ? itinerary.reduce((sum, d) => sum + d.hotelCost + d.mealCost, 0)
    : 0

  const inputClass =
    'w-full rounded-lg border border-gray-200 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-2'
  const btnPrimary =
    'inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors'
  const btnSecondary =
    'inline-flex items-center gap-2 rounded-lg border border-primary px-5 py-2.5 text-primary font-semibold hover:bg-primary/5 transition-colors text-sm'

  const DayTypeIconComponents: Record<ItineraryDay['type'], typeof Plane> = {
    arrival: Plane,
    transit: Bus,
    sightseeing: Map,
    match: Trophy,
    departure: Plane,
  }
  const dayTypeLabel: Record<ItineraryDay['type'], string> = {
    arrival: dict.itineraryArrival,
    transit: dict.itineraryTransport,
    sightseeing: dict.itinerarySightseeing,
    match: dict.itineraryMatch,
    departure: dict.itineraryDeparture,
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* STEP 1 - City selection */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">{dict.itinerarySelectCities}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {cities.map((city) => {
            const active = selectedCities.includes(city.id)
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => toggleCity(city.id)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium text-left transition-colors ${
                  active
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary/60 hover:bg-primary/5'
                }`}
              >
                {city.name}
              </button>
            )
          })}
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </section>

      {/* STEP 2 - Dates */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">{dict.itinerarySelectDates}</h2>
        <div className="max-w-xs">
          <label htmlFor="startDate" className={labelClass}>
            {lang === 'es' ? 'Fecha de llegada' : 'Arrival date'}
          </label>
          <input
            id="startDate"
            type="date"
            min="2026-06-10"
            max="2026-07-19"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClass}
          />
        </div>
      </section>

      {/* STEP 3 - Budget */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">{dict.itineraryBudgetTier}</h2>
        <div className="flex gap-3 flex-wrap">
          {(['budget', 'mid', 'luxury'] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setBudgetTier(tier)}
              className={`rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors ${
                budgetTier === tier
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-primary/60'
              }`}
            >
              {tier === 'budget' ? dict.itineraryBudgetEco : tier === 'mid' ? dict.itineraryBudgetMid : dict.itineraryBudgetLux}
            </button>
          ))}
        </div>
      </section>

      <button type="button" onClick={buildItinerary} className={btnPrimary}>
        <Sparkles className="h-4 w-4" />
        {dict.itineraryGenerate}
      </button>

      {/* Results */}
      {itinerary && (
        <div className="mt-10">
          {/* Total cost summary */}
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <p className="text-sm text-gray-600">{dict.itineraryTotalCost}</p>
              <p className="text-3xl font-bold text-primary mt-1">
                ${totalCost.toLocaleString()} USD
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {itinerary.length} {lang === 'es' ? 'dias' : 'days'} &bull;{' '}
                {selectedCities.length}{' '}
                {lang === 'es' ? 'ciudades' : 'cities'}
              </p>
            </div>
            <button type="button" onClick={handleShare} className={btnSecondary}>
              {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {copied ? dict.itineraryShareCopied : dict.itineraryShareLabel}
            </button>
          </div>

          {/* Day-by-day */}
          <div className="space-y-4">
            {itinerary.map((day) => {
              const currentDate = startDate
                ? addDays(new Date(startDate + 'T12:00:00'), day.dayNumber - 1)
                : null

              return (
                <div
                  key={`day-${day.dayNumber}`}
                  className={`rounded-xl border p-5 ${
                    day.isMatchDay
                      ? 'border-primary/40 bg-primary/3'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const DayIcon = DayTypeIconComponents[day.type]
                          return <DayIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                        })()}
                        <span className="font-semibold text-gray-900">
                          {dict.itineraryDayLabel} {day.dayNumber}
                          {currentDate ? ` — ${formatDate(currentDate, lang)}` : ''}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                          {dayTypeLabel[day.type]}
                        </span>
                      </div>
                      <p className="text-primary font-medium mt-1">{day.cityName}</p>
                    </div>
                    {day.hotelCost > 0 && (
                      <div className="text-right text-sm">
                        <p className="font-semibold text-gray-900">
                          ${day.hotelCost + day.mealCost} USD
                        </p>
                        <p className="text-xs text-gray-500">{dict.itineraryCostEstimate}</p>
                      </div>
                    )}
                  </div>

                  {day.transportNote && (
                    <p className="mt-2 text-sm text-gray-600 flex items-center gap-1.5">
                      <span className="text-gray-400">→</span>
                      {day.transportNote}
                    </p>
                  )}

                  {day.attractions.filter(Boolean).length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        {dict.itinerarySightseeing}
                      </p>
                      <ul className="space-y-0.5">
                        {day.attractions.filter(Boolean).map((attr, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-center gap-1.5">
                            <span className="text-primary">•</span>
                            {attr}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {day.hotelCost > 0 && (
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <a
                        href={`https://tp.media/r?marker=${AFFILIATE_MARKER}&trs=233922&p=4114&u=https%3A%2F%2Fwww.booking.com%2Fsearch.html%3Fss%3D${encodeURIComponent(day.cityName)}`}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        className="text-xs inline-flex items-center gap-1 rounded-md border border-primary/40 px-3 py-1.5 text-primary hover:bg-primary/5 transition-colors"
                        onClick={() => trackAffiliateClick('travelpayouts', 'hotel', day.cityId)}
                      >
                        {dict.itineraryBookHotel} — {day.cityName}
                        <span className="font-semibold">
                          ${day.hotelCost} USD / {dict.itineraryPerNight}
                        </span>
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <p className="mt-4 text-xs text-gray-400">
            {lang === 'es'
              ? 'Enlace de afiliado - podemos recibir una comision sin costo adicional para ti.'
              : 'Affiliate link - we may earn a commission at no extra cost to you.'}
          </p>
        </div>
      )}
    </div>
  )
}
