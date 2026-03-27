'use client'

import { useState } from 'react'
import { trackToolUsage, trackAffiliateClick } from '@/lib/analytics'

// USD daily averages per destination city per hotel tier
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

// USD daily food per meals tier
const MEALS_COSTS: Record<string, number> = { low: 25, mid: 60, high: 120 }

// USD daily local transport (global average)
const TRANSPORT_DAILY = 15

// USD entertainment estimate per day (museums, activities — not match tickets)
const ENTERTAINMENT_DAILY = 30

interface CityOption {
  id: string
  name: string
}

interface CalculationResult {
  hotelPerDay: number
  mealsPerDay: number
  transportPerDay: number
  entertainmentPerDay: number
  totalPerDay: number
  totalTrip: number
  destinationName: string
  destinationId: string
}

interface BudgetCalculatorDict {
  originLabel: string
  destinationLabel: string
  daysLabel: string
  hotelTierLabel: string
  mealsBudgetLabel: string
  hotelBudget: string
  hotelMid: string
  hotelLuxury: string
  mealsLow: string
  mealsMid: string
  mealsHigh: string
  calculateButton: string
  resultsHeading: string
  perDay: string
  total: string
  accommodation: string
  food: string
  localTransport: string
  entertainment: string
  disclaimer: string
  bookHotel: string
  bookFlight: string
}

interface BudgetCalculatorProps {
  cities: CityOption[]
  lang: 'es' | 'en'
  dict: BudgetCalculatorDict
}

const AFFILIATE_MARKER = '9a350c3ebd492165ade7135359165af9'

export function BudgetCalculator({ cities, lang, dict }: BudgetCalculatorProps) {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState(7)
  const [hotelTier, setHotelTier] = useState<'budget' | 'mid' | 'luxury'>('mid')
  const [mealsBudget, setMealsBudget] = useState<'low' | 'mid' | 'high'>('mid')
  const [results, setResults] = useState<CalculationResult | null>(null)

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault()
    if (!destination) return

    const cityData = HOTEL_COSTS[destination] ?? { budget: 90, mid: 90, luxury: 90 }
    const hotelPerDay = cityData[hotelTier] ?? 90
    const mealsPerDay = MEALS_COSTS[mealsBudget]
    const transportPerDay = TRANSPORT_DAILY
    const entertainmentPerDay = ENTERTAINMENT_DAILY
    const totalPerDay = hotelPerDay + mealsPerDay + transportPerDay + entertainmentPerDay
    const totalTrip = totalPerDay * days

    const destinationCity = cities.find((c) => c.id === destination)
    const destinationName = destinationCity?.name ?? destination

    trackToolUsage('budget_calculator')

    setResults({
      hotelPerDay,
      mealsPerDay,
      transportPerDay,
      entertainmentPerDay,
      totalPerDay,
      totalTrip,
      destinationName,
      destinationId: destination,
    })
  }

  const inputClass =
    'w-full rounded-lg border border-gray-200 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
  const btnClass =
    'inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors'

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleCalculate} className="space-y-5">
        {/* Origin */}
        <div>
          <label htmlFor="origin" className={labelClass}>
            {dict.originLabel}
          </label>
          <input
            id="origin"
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder={lang === 'es' ? 'Ej: Buenos Aires' : 'e.g. Buenos Aires'}
            className={inputClass}
          />
        </div>

        {/* Destination */}
        <div>
          <label htmlFor="destination" className={labelClass}>
            {dict.destinationLabel}
          </label>
          <select
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            className={inputClass}
          >
            <option value="">{lang === 'es' ? 'Selecciona una ciudad' : 'Select a city'}</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Days */}
        <div>
          <label htmlFor="days" className={labelClass}>
            {dict.daysLabel}: <span className="font-bold text-primary">{days}</span>
          </label>
          <input
            id="days"
            type="range"
            min={1}
            max={14}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>14</span>
          </div>
        </div>

        {/* Hotel tier */}
        <div>
          <label htmlFor="hotelTier" className={labelClass}>
            {dict.hotelTierLabel}
          </label>
          <select
            id="hotelTier"
            value={hotelTier}
            onChange={(e) => setHotelTier(e.target.value as 'budget' | 'mid' | 'luxury')}
            className={inputClass}
          >
            <option value="budget">{dict.hotelBudget}</option>
            <option value="mid">{dict.hotelMid}</option>
            <option value="luxury">{dict.hotelLuxury}</option>
          </select>
        </div>

        {/* Meals budget */}
        <div>
          <label htmlFor="mealsBudget" className={labelClass}>
            {dict.mealsBudgetLabel}
          </label>
          <select
            id="mealsBudget"
            value={mealsBudget}
            onChange={(e) => setMealsBudget(e.target.value as 'low' | 'mid' | 'high')}
            className={inputClass}
          >
            <option value="low">{dict.mealsLow}</option>
            <option value="mid">{dict.mealsMid}</option>
            <option value="high">{dict.mealsHigh}</option>
          </select>
        </div>

        <button type="submit" className={btnClass}>
          {dict.calculateButton}
        </button>
      </form>

      {/* Results */}
      {results && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-xl font-bold mb-4">{dict.resultsHeading}</h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-700">{dict.accommodation}</span>
              <span className="font-medium">
                ${results.hotelPerDay} USD / {dict.perDay}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-700">{dict.food}</span>
              <span className="font-medium">
                ${results.mealsPerDay} USD / {dict.perDay}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-700">{dict.localTransport}</span>
              <span className="font-medium">
                ${results.transportPerDay} USD / {dict.perDay}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-700">{dict.entertainment}</span>
              <span className="font-medium">
                ${results.entertainmentPerDay} USD / {dict.perDay}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="text-lg font-bold">{dict.total}</span>
              <span className="text-2xl font-bold text-primary">
                ${results.totalTrip.toLocaleString()} USD
              </span>
            </div>
            <p className="text-xs text-gray-500 pt-2">{dict.disclaimer}</p>
          </div>

          {/* Affiliate CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={`https://tp.media/r?marker=${AFFILIATE_MARKER}&trs=233922&p=4114&u=https%3A%2F%2Fwww.booking.com%2Fsearch.html%3Fss%3D${encodeURIComponent(results.destinationName)}`}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className={btnClass}
              onClick={() => trackAffiliateClick('travelpayouts', 'hotel', results.destinationId)}
            >
              {dict.bookHotel} {results.destinationName}
            </a>
            <a
              href={`https://tp.media/r?marker=${AFFILIATE_MARKER}&trs=233922&p=501&u=https%3A%2F%2Fwww.aviasales.com%2F%3Fdestination%3D${encodeURIComponent(results.destinationId)}`}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className={btnClass}
              onClick={() => trackAffiliateClick('travelpayouts', 'flight', results.destinationId)}
            >
              {dict.bookFlight} {results.destinationName}
            </a>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            {lang === 'es'
              ? 'Enlace de afiliado - podemos recibir una comision sin costo adicional para ti.'
              : 'Affiliate link - we may earn a commission at no extra cost to you.'}
          </p>
        </div>
      )}
    </div>
  )
}
