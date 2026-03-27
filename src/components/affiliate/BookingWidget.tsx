import { Hotel, ExternalLink, Info } from 'lucide-react'
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
      <aside className="mx-auto max-w-prose my-8 rounded-xl border border-primary/25 bg-gradient-to-br from-primary/8 to-primary/3 p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15">
            <Hotel className="size-4.5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-bold">
            {dict.searchHotels} {cityName}
          </h3>
        </div>
        <p className="mt-2 text-sm text-muted pl-11">
          {dict.hotelsNear} {cityName}{' '}
          {lang === 'es' ? 'para el Mundial 2026' : 'for the 2026 World Cup'}
        </p>
        {widgetSrc && (
          <div className="mt-4 overflow-hidden rounded-lg border border-primary/15 shadow-sm">
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
        <div className="mt-3 flex items-start gap-1.5 text-xs text-muted">
          <Info className="mt-px size-3 shrink-0 opacity-60" aria-hidden="true" />
          <span className="italic">{disclosure}</span>
        </div>
        <p className="mt-1 pl-4.5 text-xs text-muted">{poweredByLabel}</p>
      </aside>
    )
  }

  // Fallback: Booking.com affiliate text link
  if (!bookingPartner || !bookingPartner.active) return null

  const bookingUrl = buildBookingUrl(cityName, lang)

  return (
    <aside className="mx-auto max-w-prose my-8 rounded-xl border border-sky-500/25 bg-gradient-to-br from-sky-500/8 to-sky-500/3 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sky-500/15">
          <Hotel className="size-4.5 text-sky-600" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold">
          {dict.searchHotels} {cityName}
        </h3>
      </div>
      <p className="mt-2 text-sm text-muted pl-11">
        {dict.hotelsNear} {cityName}{' '}
        {lang === 'es' ? 'para el Mundial 2026' : 'for the 2026 World Cup'}
      </p>
      <div className="mt-5">
        <AffiliateLink
          href={bookingUrl}
          partner="booking"
          citySlug={citySlug}
          disclosure={bookingPartner.disclosure[lang]}
          className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 hover:shadow-md transition-all"
        >
          {dict.bookNow}
        </AffiliateLink>
      </div>
      <p className="mt-3 text-xs text-muted">{dict.poweredBy}</p>
    </aside>
  )
}
