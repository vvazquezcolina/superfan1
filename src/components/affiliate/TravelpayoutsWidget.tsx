import { Hotel, Plane, Info } from 'lucide-react'
import {
  getAffiliatePartner,
  buildTravelpayoutsHotelWidgetSrc,
  buildTravelpayoutsFlightWidgetSrc,
} from '@/lib/content/affiliates'
import type { Locale } from '@/lib/content/schemas'

interface TravelpayoutsWidgetDict {
  searchHotels: string
  searchFlights: string
  hotelsNear: string
  flightsTo: string
  poweredByHotels: string
  poweredByFlights: string
  disclosure: string
}

interface TravelpayoutsHotelWidgetProps {
  cityName: string
  lang: Locale
  dict: TravelpayoutsWidgetDict
}

interface TravelpayoutsFlightWidgetProps {
  cityName: string
  lang: Locale
  dict: TravelpayoutsWidgetDict
}

/**
 * Server component that embeds a Travelpayouts hotel search widget.
 * Placed after the neighborhoods ("Where to Stay") section on city pages.
 * Uses an iframe to load the Travelpayouts white-label hotel search.
 */
export function TravelpayoutsHotelWidget({
  cityName,
  lang,
  dict,
}: TravelpayoutsHotelWidgetProps) {
  const partner = getAffiliatePartner('travelpayouts')
  if (!partner || !partner.active) return null

  const widgetSrc = buildTravelpayoutsHotelWidgetSrc(lang)
  if (!widgetSrc) return null

  const disclosure = partner.disclosure[lang]

  return (
    <aside className="mx-auto max-w-prose my-8 rounded-xl border border-amber-500/25 bg-gradient-to-br from-amber-500/8 to-amber-500/3 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/15">
          <Hotel className="size-4.5 text-amber-600" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold">
          {dict.searchHotels} {cityName}
        </h3>
      </div>
      <p className="mt-2 text-sm text-muted pl-11">
        {dict.hotelsNear} {cityName}{' '}
        {lang === 'es' ? 'para el Mundial 2026' : 'for the 2026 World Cup'}
      </p>
      <div className="mt-4 overflow-hidden rounded-lg border border-amber-500/15 shadow-sm">
        <iframe
          src={widgetSrc}
          width="100%"
          height="440"
          className="border-0 w-full"
          title={lang === 'es' ? `Buscar hoteles en ${cityName}` : `Search hotels in ${cityName}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="mt-3 flex items-start gap-1.5 text-xs text-muted">
        <Info className="mt-px size-3 shrink-0 opacity-60" aria-hidden="true" />
        <span className="italic">{disclosure}</span>
      </div>
      <p className="mt-1 pl-4.5 text-xs text-muted">{dict.poweredByHotels}</p>
    </aside>
  )
}

/**
 * Server component that embeds a Travelpayouts flight search widget.
 * Can be used on travel pages, city pages, or any page that promotes flight booking.
 */
export function TravelpayoutsFlightWidget({
  cityName,
  lang,
  dict,
}: TravelpayoutsFlightWidgetProps) {
  const partner = getAffiliatePartner('travelpayouts')
  if (!partner || !partner.active) return null

  const widgetSrc = buildTravelpayoutsFlightWidgetSrc(lang)
  if (!widgetSrc) return null

  const disclosure = partner.disclosure[lang]

  return (
    <aside className="mx-auto max-w-prose my-8 rounded-xl border border-blue-500/25 bg-gradient-to-br from-blue-500/8 to-blue-500/3 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/15">
          <Plane className="size-4.5 text-blue-600" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold">
          {dict.searchFlights} {cityName}
        </h3>
      </div>
      <p className="mt-2 text-sm text-muted pl-11">
        {dict.flightsTo} {cityName}{' '}
        {lang === 'es' ? 'para el Mundial 2026' : 'for the 2026 World Cup'}
      </p>
      <div className="mt-4 overflow-hidden rounded-lg border border-blue-500/15 shadow-sm">
        <iframe
          src={widgetSrc}
          width="100%"
          height="440"
          className="border-0 w-full"
          title={lang === 'es' ? `Buscar vuelos a ${cityName}` : `Search flights to ${cityName}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="mt-3 flex items-start gap-1.5 text-xs text-muted">
        <Info className="mt-px size-3 shrink-0 opacity-60" aria-hidden="true" />
        <span className="italic">{disclosure}</span>
      </div>
      <p className="mt-1 pl-4.5 text-xs text-muted">{dict.poweredByFlights}</p>
    </aside>
  )
}
