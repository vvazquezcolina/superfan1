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
    <aside className="mx-auto max-w-prose my-8 rounded-lg border border-primary/20 bg-primary/5 p-6">
      <h3 className="text-lg font-bold">
        {dict.searchHotels} {cityName}
      </h3>
      <p className="mt-2 text-sm text-muted">
        {dict.hotelsNear} {cityName}{' '}
        {lang === 'es' ? 'para el Mundial 2026' : 'for the 2026 World Cup'}
      </p>
      <div className="mt-4 overflow-hidden rounded-md">
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
      <p className="mt-3 text-xs text-muted italic">{disclosure}</p>
      <p className="mt-1 text-xs text-muted">{dict.poweredByHotels}</p>
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
    <aside className="mx-auto max-w-prose my-8 rounded-lg border border-blue-500/20 bg-blue-500/5 p-6">
      <h3 className="text-lg font-bold">
        {dict.searchFlights} {cityName}
      </h3>
      <p className="mt-2 text-sm text-muted">
        {dict.flightsTo} {cityName}{' '}
        {lang === 'es' ? 'para el Mundial 2026' : 'for the 2026 World Cup'}
      </p>
      <div className="mt-4 overflow-hidden rounded-md">
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
      <p className="mt-3 text-xs text-muted italic">{disclosure}</p>
      <p className="mt-1 text-xs text-muted">{dict.poweredByFlights}</p>
    </aside>
  )
}
