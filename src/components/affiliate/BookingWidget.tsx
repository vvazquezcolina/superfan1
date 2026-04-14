import { Hotel } from 'lucide-react'
import { buildKlookHotelsUrl } from '@/lib/travelpayouts/partners'
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
 * Hotel search CTA for city / stadium / match / dia-de-partido pages.
 *
 * Originally pointed at Booking.com via the Travelpayouts redirect, but
 * Booking.com declined the Superfaninfo project connection (sites under
 * 2 months old aren't accepted). To keep hotel monetization working
 * before the World Cup, swapped the destination to Klook hotels — Klook
 * is instant-connect approved on the Superfaninfo project and has
 * bookable global hotel inventory at 2-5% commission with a 30-day
 * cookie. Reapply Booking after launch when the site has aged.
 *
 * Component name and surrounding copy stay the same so the CTA reads
 * naturally to the user.
 */
export function BookingWidget({ cityName, citySlug, lang }: BookingWidgetProps) {
  const localeKey: 'es' | 'en' = lang === 'es' ? 'es' : 'en'
  const href = buildKlookHotelsUrl(cityName, localeKey)

  const headline =
    localeKey === 'es'
      ? `Hospedaje en ${cityName} para el Mundial 2026`
      : `Where to stay in ${cityName} for the 2026 World Cup`
  const urgency =
    localeKey === 'es'
      ? 'Las reservas durante el Mundial son limitadas y los precios suben semana a semana — los hoteles cerca del estadio suelen agotarse 2-3 meses antes del partido.'
      : 'World Cup bookings are limited and prices climb weekly — hotels near the stadium typically sell out 2-3 months before kickoff.'
  const ctaLabel =
    localeKey === 'es'
      ? 'Ver hoteles disponibles para el Mundial'
      : 'See hotels available for the World Cup'
  const poweredByLabel =
    localeKey === 'es'
      ? 'Resultados via Klook (inventario global de hoteles)'
      : 'Results via Klook (global hotel inventory)'
  const disclosure =
    localeKey === 'es'
      ? 'Enlace de afiliado (Klook) — recibimos una pequeña comisión si reservas, sin costo extra para ti.'
      : 'Affiliate link (Klook) — we earn a small commission if you book, at no extra cost to you.'

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
          partner="klook-hotels"
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
