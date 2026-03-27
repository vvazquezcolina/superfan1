'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  MapPin,
  Activity,
  ListChecks,
  Printer,
  RefreshCw,
  Settings2,
  CheckCircle2,
  ClipboardList,
  Shirt,
  Trophy,
  HeartPulse,
  Smartphone,
  Package,
} from 'lucide-react'
import { trackToolUsage } from '@/lib/analytics'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ActivityType = 'match' | 'sightseeing' | 'nightlife' | 'beach'

interface PackingItem {
  id: string
  label: { es: string; en: string }
  categories: string[]          // which categories this item belongs to
  activities?: ActivityType[]   // only show if one of these activities selected (undefined = always)
  cities?: string[]             // only show for specific cities (undefined = all)
  checked: boolean
}

// ---------------------------------------------------------------------------
// Master packing list data
// ---------------------------------------------------------------------------

const ALL_ITEMS: Omit<PackingItem, 'checked'>[] = [
  // DOCUMENTS & ESSENTIALS
  { id: 'passport', label: { es: 'Pasaporte (vigencia minima 6 meses)', en: 'Passport (valid for at least 6 months)' }, categories: ['essentials'] },
  { id: 'visa', label: { es: 'Visa (si aplica para tu pais)', en: 'Visa (if required for your country)' }, categories: ['essentials'] },
  { id: 'match_ticket', label: { es: 'Entradas al partido (impresa o digital)', en: 'Match tickets (printed or digital)' }, categories: ['essentials'], activities: ['match'] },
  { id: 'travel_insurance', label: { es: 'Seguro de viaje', en: 'Travel insurance' }, categories: ['essentials'] },
  { id: 'flight_confirmation', label: { es: 'Confirmacion de vuelo', en: 'Flight confirmation' }, categories: ['essentials'] },
  { id: 'hotel_confirmation', label: { es: 'Reserva de hotel', en: 'Hotel reservation' }, categories: ['essentials'] },
  { id: 'copies_id', label: { es: 'Copias de documentos (nube y fisicas)', en: 'Document copies (cloud and physical)' }, categories: ['essentials'] },
  { id: 'cash_local', label: { es: 'Efectivo en moneda local', en: 'Local currency cash' }, categories: ['essentials'] },
  { id: 'credit_card', label: { es: 'Tarjeta de credito (sin cobro en extranjero)', en: 'Credit card (no foreign transaction fees)' }, categories: ['essentials'] },
  { id: 'emergency_contacts', label: { es: 'Contactos de emergencia escritos', en: 'Written emergency contacts' }, categories: ['essentials'] },

  // CLOTHING
  { id: 'national_jersey', label: { es: 'Camiseta de tu seleccion nacional', en: 'National team jersey' }, categories: ['clothing'], activities: ['match'] },
  { id: 'casual_shirts', label: { es: 'Camisas/camisetas casuales (3-4)', en: 'Casual shirts/t-shirts (3-4)' }, categories: ['clothing'] },
  { id: 'pants_jeans', label: { es: 'Pantalones o jeans (2)', en: 'Pants or jeans (2)' }, categories: ['clothing'] },
  { id: 'shorts', label: { es: 'Shorts (2)', en: 'Shorts (2)' }, categories: ['clothing'] },
  { id: 'dress_outfit', label: { es: 'Ropa para salir de noche (1-2 conjuntos)', en: 'Going-out outfit(s) for nightlife (1-2)' }, categories: ['clothing'], activities: ['nightlife'] },
  { id: 'light_jacket', label: { es: 'Chaqueta ligera (para estadio o noches frescas)', en: 'Light jacket (for stadium or cool evenings)' }, categories: ['clothing'] },
  { id: 'rain_jacket', label: { es: 'Impermeable o poncho', en: 'Rain jacket or poncho' }, categories: ['clothing'], cities: ['seattle', 'vancouver', 'toronto', 'boston'] },
  { id: 'swimsuit', label: { es: 'Traje de bano', en: 'Swimsuit' }, categories: ['clothing'], activities: ['beach'] },
  { id: 'comfortable_shoes', label: { es: 'Zapatos comodos para caminar', en: 'Comfortable walking shoes' }, categories: ['clothing'] },
  { id: 'dress_shoes', label: { es: 'Zapatos formales para salidas nocturnas', en: 'Dress shoes for nightlife' }, categories: ['clothing'], activities: ['nightlife'] },
  { id: 'flip_flops', label: { es: 'Sandalias o chanclas', en: 'Sandals or flip-flops' }, categories: ['clothing'], activities: ['beach'] },
  { id: 'socks_underwear', label: { es: 'Calcetines y ropa interior (1 por dia)', en: 'Socks and underwear (1 per day)' }, categories: ['clothing'] },
  { id: 'hat_cap', label: { es: 'Gorra o sombrero para el sol', en: 'Hat or cap for the sun' }, categories: ['clothing'] },

  // MATCH DAY
  { id: 'fan_scarf', label: { es: 'Bufanda o bandera de tu seleccion', en: 'Fan scarf or flag' }, categories: ['match'], activities: ['match'] },
  { id: 'face_paint', label: { es: 'Pintura facial (colores de tu seleccion)', en: 'Face paint (your team colors)' }, categories: ['match'], activities: ['match'] },
  { id: 'small_backpack', label: { es: 'Mochila pequena (revisada por el estadio)', en: 'Small backpack (stadium-approved)' }, categories: ['match'], activities: ['match'] },
  { id: 'sunscreen_match', label: { es: 'Protector solar para el partido', en: 'Sunscreen for the match' }, categories: ['match'], activities: ['match'] },
  { id: 'earplugs', label: { es: 'Tapones para los oidos (estadios muy ruidosos)', en: 'Earplugs (very loud stadiums)' }, categories: ['match'], activities: ['match'] },
  { id: 'portable_charger_match', label: { es: 'Cargador portatil (para la entrada digital)', en: 'Portable charger (for digital tickets)' }, categories: ['match'], activities: ['match'] },
  { id: 'cash_stadium', label: { es: 'Efectivo para comida en el estadio', en: 'Cash for stadium food' }, categories: ['match'], activities: ['match'] },

  // HEALTH & HYGIENE
  { id: 'medications', label: { es: 'Medicamentos personales (con receta en ingles)', en: 'Personal medications (with prescription in English)' }, categories: ['health'] },
  { id: 'pain_reliever', label: { es: 'Analgesico (ibuprofeno, acetaminofeno)', en: 'Pain reliever (ibuprofen, acetaminophen)' }, categories: ['health'] },
  { id: 'antidiarrheal', label: { es: 'Antidiarreico (cambio de agua y comida)', en: 'Antidiarrheal (new food and water adjustment)' }, categories: ['health'] },
  { id: 'sunscreen', label: { es: 'Protector solar FPS 50+', en: 'Sunscreen SPF 50+' }, categories: ['health'] },
  { id: 'insect_repellent', label: { es: 'Repelente de insectos', en: 'Insect repellent' }, categories: ['health'], cities: ['houston', 'miami', 'atlanta', 'ciudad-de-mexico', 'guadalajara'] },
  { id: 'hand_sanitizer', label: { es: 'Gel antibacterial', en: 'Hand sanitizer' }, categories: ['health'] },
  { id: 'first_aid', label: { es: 'Botiquin basico (curitas, vendas, antiseptico)', en: 'Basic first aid kit (bandages, antiseptic)' }, categories: ['health'] },
  { id: 'toothbrush_paste', label: { es: 'Cepillo y pasta de dientes', en: 'Toothbrush and toothpaste' }, categories: ['health'] },
  { id: 'deodorant', label: { es: 'Desodorante', en: 'Deodorant' }, categories: ['health'] },
  { id: 'razors', label: { es: 'Rasuradora o maquinilla de afeitar', en: 'Razor or electric shaver' }, categories: ['health'] },
  { id: 'shampoo', label: { es: 'Shampoo y acondicionador (tamano viaje)', en: 'Shampoo and conditioner (travel size)' }, categories: ['health'] },

  // TECHNOLOGY
  { id: 'phone_charger', label: { es: 'Cargador de telefono', en: 'Phone charger' }, categories: ['tech'] },
  { id: 'power_adapter', label: { es: 'Adaptador de corriente (si vienes de fuera de NA)', en: 'Power adapter (if traveling from outside NA)' }, categories: ['tech'] },
  { id: 'portable_battery', label: { es: 'Bateria portatil / power bank', en: 'Portable battery / power bank' }, categories: ['tech'] },
  { id: 'sim_esim', label: { es: 'SIM local o eSIM internacional', en: 'Local SIM or international eSIM' }, categories: ['tech'] },
  { id: 'vpn_app', label: { es: 'App de VPN instalada', en: 'VPN app installed' }, categories: ['tech'] },
  { id: 'translation_app', label: { es: 'App de traduccion descargada (modo sin internet)', en: 'Translation app downloaded (offline mode)' }, categories: ['tech'] },
  { id: 'maps_offline', label: { es: 'Mapas descargados sin conexion (Google Maps / Maps.me)', en: 'Offline maps downloaded (Google Maps / Maps.me)' }, categories: ['tech'] },
  { id: 'camera', label: { es: 'Camara fotografica o gopro', en: 'Camera or GoPro' }, categories: ['tech'], activities: ['match', 'sightseeing'] },
  { id: 'laptop', label: { es: 'Laptop (si necesitas trabajar)', en: 'Laptop (if you need to work)' }, categories: ['tech'] },

  // MISCELLANEOUS
  { id: 'luggage_lock', label: { es: 'Candado para maleta (TSA si vas a USA)', en: 'Luggage lock (TSA-approved for USA)' }, categories: ['misc'] },
  { id: 'reusable_bag', label: { es: 'Bolsa reutilizable', en: 'Reusable bag' }, categories: ['misc'] },
  { id: 'snacks', label: { es: 'Snacks de viaje para el avion', en: 'Travel snacks for the flight' }, categories: ['misc'] },
  { id: 'neck_pillow', label: { es: 'Almohada de viaje', en: 'Travel pillow' }, categories: ['misc'] },
  { id: 'sleep_mask', label: { es: 'Antifaz para dormir', en: 'Sleep mask' }, categories: ['misc'] },
  { id: 'laundry_bag', label: { es: 'Bolsa para ropa sucia', en: 'Laundry bag' }, categories: ['misc'] },
  { id: 'small_umbrella', label: { es: 'Paraguas compacto', en: 'Compact umbrella' }, categories: ['misc'], cities: ['seattle', 'vancouver', 'toronto', 'boston', 'new-york-new-jersey'] },
  { id: 'phrasebook', label: { es: 'Guia de frases en ingles/frances (Canada)', en: 'Spanish phrasebook (Mexico / Latin fans)' }, categories: ['misc'] },
  { id: 'notebook_pen', label: { es: 'Cuaderno y lapiz', en: 'Notebook and pen' }, categories: ['misc'] },
]

// ---------------------------------------------------------------------------
// Category config with lucide-react icon components
// ---------------------------------------------------------------------------

const CATEGORY_CONFIG: Array<{
  key: string
  labelKey: keyof PackingListDict
  emoji: string
  Icon: React.ComponentType<{ className?: string }>
}> = [
  { key: 'essentials', labelKey: 'packingCategoryEssentials', emoji: '📋', Icon: ClipboardList },
  { key: 'clothing', labelKey: 'packingCategoryClothing', emoji: '👕', Icon: Shirt },
  { key: 'match', labelKey: 'packingCategoryMatch', emoji: '⚽', Icon: Trophy },
  { key: 'health', labelKey: 'packingCategoryHealth', emoji: '💊', Icon: HeartPulse },
  { key: 'tech', labelKey: 'packingCategoryTech', emoji: '📱', Icon: Smartphone },
  { key: 'misc', labelKey: 'packingCategoryMisc', emoji: '🎒', Icon: Package },
]

const STORAGE_KEY = 'superfan_packing_checked'

// ---------------------------------------------------------------------------
// Dict type
// ---------------------------------------------------------------------------

interface PackingListDict {
  packingSelectCity: string
  packingActivities: string
  packingActivityMatch: string
  packingActivitySightseeing: string
  packingActivityNightlife: string
  packingActivityBeach: string
  packingGenerate: string
  packingPrint: string
  packingReset: string
  packingCategoryEssentials: string
  packingCategoryClothing: string
  packingCategoryMatch: string
  packingCategoryHealth: string
  packingCategoryTech: string
  packingCategoryMisc: string
  packingProgress: string
}

interface CityOption {
  id: string
  name: string
}

interface PackingListProps {
  cities: CityOption[]
  lang: 'es' | 'en'
  dict: PackingListDict
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PackingList({ cities, lang, dict }: PackingListProps) {
  const [selectedCity, setSelectedCity] = useState('')
  const [activities, setActivities] = useState<Set<ActivityType>>(new Set(['match', 'sightseeing']))
  const [items, setItems] = useState<PackingItem[]>([])
  const [generated, setGenerated] = useState(false)

  // Load checked state from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const checkedIds: string[] = JSON.parse(stored)
        setItems((prev) => prev.map((item) => ({ ...item, checked: checkedIds.includes(item.id) })))
      }
    } catch {
      // ignore localStorage errors
    }
  }, [generated])

  // Persist checked state to localStorage
  function persistChecked(updatedItems: PackingItem[]) {
    try {
      const checkedIds = updatedItems.filter((i) => i.checked).map((i) => i.id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedIds))
    } catch {
      // ignore localStorage errors
    }
  }

  function toggleActivity(activity: ActivityType) {
    setActivities((prev) => {
      const next = new Set(prev)
      if (next.has(activity)) {
        next.delete(activity)
      } else {
        next.add(activity)
      }
      return next
    })
  }

  function generateList() {
    const selectedActivities = Array.from(activities)

    // Load previously checked items from localStorage
    let previouslyChecked: string[] = []
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        previouslyChecked = JSON.parse(stored)
      }
    } catch {
      // ignore
    }

    const filtered: PackingItem[] = ALL_ITEMS.filter((item) => {
      // Filter by activity
      if (item.activities && item.activities.length > 0) {
        const hasActivity = item.activities.some((a) => selectedActivities.includes(a))
        if (!hasActivity) return false
      }
      // Filter by city
      if (item.cities && item.cities.length > 0 && selectedCity) {
        return item.cities.includes(selectedCity)
      }
      return true
    }).map((item) => ({
      ...item,
      checked: previouslyChecked.includes(item.id),
    }))

    setItems(filtered)
    setGenerated(true)
    trackToolUsage('packing_list')
  }

  const toggleItem = useCallback((id: string) => {
    setItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
      persistChecked(updated)
      return updated
    })
  }, [])

  function handleReset() {
    setItems((prev) => {
      const updated = prev.map((item) => ({ ...item, checked: false }))
      persistChecked(updated)
      return updated
    })
  }

  const checkedCount = items.filter((i) => i.checked).length
  const totalCount = items.length
  const progressPct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0

  const inputClass =
    'w-full rounded-xl border border-gray-200 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white shadow-sm transition-shadow focus:shadow-md'
  const labelClass = 'flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2'

  const ACTIVITY_OPTIONS: Array<{ value: ActivityType; label: string }> = [
    { value: 'match', label: dict.packingActivityMatch },
    { value: 'sightseeing', label: dict.packingActivitySightseeing },
    { value: 'nightlife', label: dict.packingActivityNightlife },
    { value: 'beach', label: dict.packingActivityBeach },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      {/* Config form */}
      {!generated ? (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 space-y-6">
          {/* City */}
          <div>
            <label htmlFor="packingCity" className={labelClass}>
              <MapPin className="w-4 h-4 text-primary" />
              {dict.packingSelectCity}
            </label>
            <select
              id="packingCity"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className={inputClass}
            >
              <option value="">{lang === 'es' ? 'Cualquier ciudad (lista general)' : 'Any city (general list)'}</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Activities */}
          <div>
            <p className={labelClass}>
              <Activity className="w-4 h-4 text-primary" />
              {dict.packingActivities}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ACTIVITY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all duration-150 ${
                    activities.has(opt.value)
                      ? 'border-primary bg-primary/5 text-primary font-medium shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="accent-primary"
                    checked={activities.has(opt.value)}
                    onChange={() => toggleActivity(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={generateList}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 active:scale-95 transition-all duration-150 shadow-sm"
          >
            <ListChecks className="w-4 h-4" />
            {dict.packingGenerate}
          </button>
        </div>
      ) : (
        <div>
          {/* Progress bar */}
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                {checkedCount} / {totalCount} {dict.packingProgress}
              </span>
              <span className="text-sm font-bold text-primary">{progressPct}%</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 flex-wrap mb-6 print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all duration-150 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              {dict.packingPrint}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all duration-150 shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              {dict.packingReset}
            </button>
            <button
              type="button"
              onClick={() => { setGenerated(false); setItems([]) }}
              className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 active:scale-95 transition-all duration-150 shadow-sm"
            >
              <Settings2 className="w-4 h-4" />
              {lang === 'es' ? 'Cambiar seleccion' : 'Change selection'}
            </button>
          </div>

          {/* Items by category */}
          {CATEGORY_CONFIG.map(({ key, labelKey, Icon }) => {
            const categoryItems = items.filter((item) => item.categories.includes(key))
            if (categoryItems.length === 0) return null

            const catChecked = categoryItems.filter((i) => i.checked).length
            const catTotal = categoryItems.length
            const allCatDone = catChecked === catTotal

            return (
              <section key={key} className="mb-6">
                <div className={`flex items-center gap-2 mb-2 px-1 print:text-lg`}>
                  <Icon className={`w-4 h-4 flex-shrink-0 ${allCatDone ? 'text-green-500' : 'text-primary'}`} />
                  <h2 className="text-sm font-semibold text-gray-800">
                    {dict[labelKey]}
                  </h2>
                  <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
                    allCatDone
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {catChecked}/{catTotal}
                  </span>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  {categoryItems.map((item, index) => (
                    <label
                      key={item.id}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-100 ${
                        index < categoryItems.length - 1 ? 'border-b border-gray-100' : ''
                      } ${item.checked ? 'bg-gray-50/80' : 'bg-white hover:bg-gray-50/60'}`}
                    >
                      <input
                        type="checkbox"
                        className="accent-primary h-4 w-4 rounded flex-shrink-0"
                        checked={item.checked}
                        onChange={() => toggleItem(item.id)}
                      />
                      <span
                        className={`text-sm transition-colors duration-150 ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}
                      >
                        {item.label[lang]}
                      </span>
                      {item.checked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 ml-auto flex-shrink-0" />
                      )}
                    </label>
                  ))}
                </div>
              </section>
            )
          })}

          <p className="mt-4 text-xs text-gray-400 print:hidden">
            {lang === 'es'
              ? 'Tu progreso se guarda automaticamente en este dispositivo.'
              : 'Your progress is automatically saved on this device.'}
          </p>
        </div>
      )}
    </div>
  )
}
