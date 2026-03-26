import { getAffiliatePartner, buildBookingUrl } from '@/lib/content/affiliates'
import { AffiliateLink } from './AffiliateLink'
import type { Locale } from '@/lib/content/schemas'

interface BookingWidgetDict {
  hotelsNear: string
  searchHotels: string
  bookNow: string
  poweredBy: string
}

interface BookingWidgetProps {
  cityName: string
  citySlug: string
  lang: Locale
  dict: BookingWidgetDict
}

/**
 * Server component that renders a Booking.com hotel search widget.
 * Placed after the neighborhoods ("Where to Stay") section on city pages.
 * Uses AffiliateLink client component for GA4 tracking and FTC disclosure.
 */
export function BookingWidget({ cityName, citySlug, lang, dict }: BookingWidgetProps) {
  const partner = getAffiliatePartner('booking')
  if (!partner || !partner.active) return null

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
        disclosure={partner.disclosure[lang]}
        className="mt-4 inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-shadow"
      >
        {dict.bookNow} &rarr;
      </AffiliateLink>
      <p className="mt-3 text-xs text-muted">{dict.poweredBy}</p>
    </aside>
  )
}
