import {
  getAffiliatePartner,
  buildBookingUrl,
  buildTravelpayoutsHotelWidgetSrc,
} from '@/lib/content/affiliates'
import { AffiliateLink } from './AffiliateLink'
import type { Locale } from '@/lib/content/schemas'

interface BookingWidgetDict {
  hotelsNear: string
  searchHotels: string
  bookNow: string
  poweredBy: string
  poweredByTravelpayouts?: string
  disclosureTravelpayouts?: string
}

interface BookingWidgetProps {
  cityName: string
  citySlug: string
  lang: Locale
  dict: BookingWidgetDict
}

/**
 * Server component that renders a hotel search widget on city pages.
 * Primary: Travelpayouts embedded iframe widget (Booking.com/Agoda inventory).
 * Fallback: Booking.com affiliate text link (when Travelpayouts is inactive).
 * Placed after the neighborhoods ("Where to Stay") section on city pages.
 */
export function BookingWidget({ cityName, citySlug, lang, dict }: BookingWidgetProps) {
  const travelpayoutsPartner = getAffiliatePartner('travelpayouts')
  const bookingPartner = getAffiliatePartner('booking')

  // Primary: Travelpayouts hotel widget
  if (travelpayoutsPartner?.active) {
    const widgetSrc = buildTravelpayoutsHotelWidgetSrc(lang)
    const disclosure =
      dict.disclosureTravelpayouts ?? travelpayoutsPartner.disclosure[lang]
    const poweredByLabel =
      dict.poweredByTravelpayouts ??
      (lang === 'es' ? 'Resultados via Travelpayouts (Booking.com / Agoda)' : 'Results via Travelpayouts (Booking.com / Agoda)')

    return (
      <aside className="mx-auto max-w-prose my-8 rounded-lg border border-primary/20 bg-primary/5 p-6">
        <h3 className="text-lg font-bold">
          {dict.searchHotels} {cityName}
        </h3>
        <p className="mt-2 text-sm text-muted">
          {dict.hotelsNear} {cityName}{' '}
          {lang === 'es' ? 'para el Mundial 2026' : 'for the 2026 World Cup'}
        </p>
        {widgetSrc && (
          <div className="mt-4 overflow-hidden rounded-md">
            <iframe
              src={widgetSrc}
              width="100%"
              height="440"
              className="border-0 w-full"
              title={
                lang === 'es'
                  ? `Buscar hoteles en ${cityName}`
                  : `Search hotels in ${cityName}`
              }
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
        <p className="mt-3 text-xs text-muted italic">{disclosure}</p>
        <p className="mt-1 text-xs text-muted">{poweredByLabel}</p>
      </aside>
    )
  }

  // Fallback: Booking.com affiliate text link
  if (!bookingPartner || !bookingPartner.active) return null

  const bookingUrl = buildBookingUrl(cityName, lang)

  return (
    <aside className="mx-auto max-w-prose my-8 rounded-lg border border-primary/20 bg-primary/5 p-6">
      <h3 className="text-lg font-bold">
        {dict.searchHotels} {cityName}
      </h3>
      <p className="mt-2 text-sm text-muted">
        {dict.hotelsNear} {cityName}{' '}
        {lang === 'es' ? 'para el Mundial 2026' : 'for the 2026 World Cup'}
      </p>
      <AffiliateLink
        href={bookingUrl}
        partner="booking"
        citySlug={citySlug}
        disclosure={bookingPartner.disclosure[lang]}
        className="mt-4 inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-shadow"
      >
        {dict.bookNow} &rarr;
      </AffiliateLink>
      <p className="mt-3 text-xs text-muted">{dict.poweredBy}</p>
    </aside>
  )
}
