import { Car, Info } from 'lucide-react'
import {
  buildKiwitaxiSearchUrl,
  buildWelcomePickupsSearchUrl,
} from '@/lib/travelpayouts/partners'
import { AffiliateLink } from './AffiliateLink'
import type { Locale } from '@/lib/content/schemas'

interface AirportTransfersProps {
  /** Visible "from" location label, e.g. "LAX Airport". */
  fromLabel: string
  /** IATA code of the origin airport. */
  fromIata: string
  /** Destination location, typically the stadium or city name. */
  toName: string
  lang: Locale
}

/**
 * Side-by-side CTA for airport-to-stadium transfers.
 * Shows two providers (Welcome Pickups + Kiwitaxi) so users can compare
 * before booking. Both pay >8% with multi-week cookies.
 */
export function AirportTransfers({
  fromLabel,
  fromIata,
  toName,
  lang,
}: AirportTransfersProps) {
  const localeKey: 'es' | 'en' = lang === 'es' ? 'es' : 'en'
  const title =
    localeKey === 'es'
      ? `Traslado desde ${fromLabel} a ${toName}`
      : `Transfer from ${fromLabel} to ${toName}`
  const subtitle =
    localeKey === 'es'
      ? 'Reserva tu traslado privado con anticipación. Precio fijo, conductor en inglés/español, sin sorpresas en horas pico.'
      : 'Book your private transfer in advance. Fixed price, English/Spanish driver, no surprises during rush hour.'
  const ctaWelcome = localeKey === 'es' ? 'Reservar con Welcome Pickups' : 'Book with Welcome Pickups'
  const ctaKiwi = localeKey === 'es' ? 'Reservar con Kiwitaxi' : 'Book with Kiwitaxi'
  const disclosure =
    localeKey === 'es'
      ? 'Enlace de afiliado — sin costo extra para ti.'
      : 'Affiliate link — no extra cost to you.'
  const footer =
    localeKey === 'es'
      ? 'Welcome Pickups paga 8-9% y mantiene cookie 45 días; Kiwitaxi paga 9-11% con cookie 30 días. Compara y elige.'
      : 'Welcome Pickups pays 8-9% with a 45-day cookie; Kiwitaxi pays 9-11% with a 30-day cookie.'

  const welcomeUrl = buildWelcomePickupsSearchUrl(toName)
  const kiwiUrl = buildKiwitaxiSearchUrl(fromIata, toName, localeKey)

  return (
    <aside className="mx-auto max-w-prose my-8 rounded-xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/8 to-emerald-500/3 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/15">
          <Car className="size-4.5 text-emerald-600" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="mt-2 pl-11 text-sm text-muted">{subtitle}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <AffiliateLink
          href={welcomeUrl}
          partner="welcome-pickups"
          disclosure={disclosure}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          {ctaWelcome}
        </AffiliateLink>
        <AffiliateLink
          href={kiwiUrl}
          partner="kiwitaxi"
          disclosure={disclosure}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-600 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50"
        >
          {ctaKiwi}
        </AffiliateLink>
      </div>
      <p className="mt-4 flex items-start gap-1.5 text-xs italic text-muted">
        <Info className="mt-px size-3 shrink-0 opacity-60" aria-hidden="true" />
        {footer}
      </p>
    </aside>
  )
}
