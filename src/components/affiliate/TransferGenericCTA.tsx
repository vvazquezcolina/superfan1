import { Car, Info } from 'lucide-react'
import {
  buildKiwitaxiHomeUrl,
  buildWelcomePickupsSearchUrl,
} from '@/lib/travelpayouts/partners'
import { AffiliateLink } from './AffiliateLink'
import type { Locale } from '@/lib/content/schemas'

interface TransferGenericCTAProps {
  lang: Locale
}

/**
 * Generic transfers CTA for guides that aren't tied to a single city
 * (e.g. /viajes/transporte). Surfaces both Welcome Pickups and Kiwitaxi
 * homepages so the user picks based on coverage. Same provider mix as
 * AirportTransfers but without a hardcoded origin/destination.
 */
export function TransferGenericCTA({ lang }: TransferGenericCTAProps) {
  const localeKey: 'es' | 'en' = lang === 'es' ? 'es' : 'en'
  const title =
    localeKey === 'es'
      ? 'Reserva tu traslado desde el aeropuerto'
      : 'Book your airport transfer'
  const body =
    localeKey === 'es'
      ? 'Llegar al hotel después de un vuelo internacional con maletas, cansancio y sin hablar el idioma local es estresante. Reservar el traslado por adelantado fija el precio, garantiza el conductor y elimina las negociaciones con taxistas.'
      : 'Getting to your hotel after an international flight with luggage, jet lag, and no local language is stressful. Booking transfer in advance locks the price, guarantees the driver, and avoids haggling with cabs.'
  const ctaWelcome = localeKey === 'es' ? 'Welcome Pickups' : 'Welcome Pickups'
  const ctaKiwi = localeKey === 'es' ? 'Kiwitaxi' : 'Kiwitaxi'
  const disclosure =
    localeKey === 'es'
      ? 'Enlace de afiliado — sin costo extra para ti.'
      : 'Affiliate link — no extra cost to you.'

  return (
    <aside className="mx-auto max-w-prose my-8 rounded-xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/8 to-emerald-500/3 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/15">
          <Car className="size-4.5 text-emerald-600" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="mt-2 pl-11 text-sm text-muted leading-relaxed">{body}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <AffiliateLink
          href={buildWelcomePickupsSearchUrl('')}
          partner="welcome-pickups"
          disclosure={disclosure}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          {ctaWelcome}
        </AffiliateLink>
        <AffiliateLink
          href={buildKiwitaxiHomeUrl(localeKey)}
          partner="kiwitaxi"
          disclosure={disclosure}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-600 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50"
        >
          {ctaKiwi}
        </AffiliateLink>
      </div>
      <p className="mt-4 flex items-start gap-1.5 text-xs italic text-muted">
        <Info className="mt-px size-3 shrink-0 opacity-60" aria-hidden="true" />
        {localeKey === 'es'
          ? 'Cobertura en las 16 sedes del Mundial 2026. Conductores en español/inglés.'
          : 'Coverage at all 16 World Cup 2026 host cities. English/Spanish drivers.'}
      </p>
    </aside>
  )
}
