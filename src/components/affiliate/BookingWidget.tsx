import { Hotel } from 'lucide-react'
import {
  getAffiliatePartner,
  buildBookingUrl,
  buildTravelpayoutsBookingUrl,
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
 * Hotel search CTA for city pages.
 * Uses Travelpayouts' tracked tp.media/r redirect to Booking.com when active
 * (proper marker attribution), falls back to the direct Booking.com partner
 * URL otherwise. Avoids embedded widgets — those turned out to be a flight
 * search template in our Travelpayouts account and the embed form_action was
 * blocked by CSP.
 */
export function BookingWidget({ cityName, citySlug, lang, dict }: BookingWidgetProps) {
  const travelpayoutsPartner = getAffiliatePartner('travelpayouts')
  const bookingPartner = getAffiliatePartner('booking')

  const useTravelpayouts = travelpayoutsPartner?.active === true

  const href = useTravelpayouts
    ? buildTravelpayoutsBookingUrl(cityName, lang)
    : bookingPartner?.active
      ? buildBookingUrl(cityName, lang)
      : null

  if (!href) return null

  const disclosure = useTravelpayouts
    ? (dict.disclosureTravelpayouts ?? travelpayoutsPartner!.disclosure[lang])
    : bookingPartner!.disclosure[lang]

  const poweredByLabel = useTravelpayouts
    ? (dict.poweredByTravelpayouts ??
      (lang === 'es'
        ? 'Resultados via Travelpayouts (Booking.com / Agoda)'
        : 'Results via Travelpayouts (Booking.com / Agoda)'))
    : dict.poweredBy

  const partnerId = useTravelpayouts ? 'travelpayouts' : 'booking'

  const headline =
    lang === 'es'
      ? `Hospedaje en ${cityName} para el Mundial 2026`
      : `Where to stay in ${cityName} for the 2026 World Cup`
  const urgency =
    lang === 'es'
      ? 'Las reservas durante el Mundial son limitadas y los precios suben semana a semana — los hoteles cerca del estadio suelen agotarse 2-3 meses antes del partido.'
      : 'World Cup bookings are limited and prices climb weekly — hotels near the stadium typically sell out 2-3 months before kickoff.'
  const ctaLabel =
    lang === 'es'
      ? 'Ver hoteles disponibles para el Mundial'
      : 'See hotels available for the World Cup'

  return (
    <aside className="mx-auto max-w-prose my-8 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
          <Hotel className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold">{headline}</h3>
      </div>
      <p className="mt-2 text-sm text-muted pl-12 leading-relaxed">
        {urgency}
      </p>
      <div className="mt-5 pl-12">
        <AffiliateLink
          href={href}
          partner={partnerId}
          citySlug={citySlug}
          disclosure={disclosure}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary/90 hover:shadow-md transition-all"
        >
          {ctaLabel}
        </AffiliateLink>
      </div>
      <p className="mt-3 pl-12 text-xs text-muted">{poweredByLabel}</p>
    </aside>
  )
}
