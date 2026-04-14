import { Ticket, Camera, Info } from 'lucide-react'
import {
  buildTiqetsSearchUrl,
  buildGetYourGuideSearchUrl,
} from '@/lib/travelpayouts/partners'
import { AffiliateLink } from './AffiliateLink'
import type { Locale } from '@/lib/content/schemas'

interface StadiumTicketsProps {
  stadiumName: string
  cityName: string
  lang: Locale
}

/**
 * Stadium tour and attraction tickets CTA. Used on stadium pages — most
 * iconic World Cup venues (Azteca, MetLife, Levi's, Wembley equivalents)
 * have bookable behind-the-scenes tours that fans want pre-tournament.
 *
 * Surfaces both Tiqets (3.5-8%, 30d) and GetYourGuide (8%, 31d) so users
 * can compare. Both are search-based deep links so they work regardless
 * of whether the partner has a dedicated venue page.
 */
export function StadiumTickets({ stadiumName, cityName, lang }: StadiumTicketsProps) {
  const localeKey: 'es' | 'en' = lang === 'es' ? 'es' : 'en'
  const title =
    localeKey === 'es'
      ? `Tour del estadio y tickets`
      : `Stadium tour & tickets`
  const subtitle =
    localeKey === 'es'
      ? `Reserva un tour guiado del ${stadiumName} o entradas a atracciones cercanas en ${cityName}. Cancelación gratis hasta 24h antes en la mayoría.`
      : `Book a guided tour of ${stadiumName} or tickets to nearby attractions in ${cityName}. Free cancellation up to 24h before on most options.`
  const ctaTiqets = localeKey === 'es' ? 'Ver en Tiqets' : 'View on Tiqets'
  const ctaGyg = localeKey === 'es' ? 'Ver en GetYourGuide' : 'View on GetYourGuide'
  const disclosure =
    localeKey === 'es'
      ? 'Enlace de afiliado — sin costo extra para ti.'
      : 'Affiliate link — no extra cost to you.'

  const stadiumQuery = `${stadiumName} ${cityName}`
  const tiqetsUrl = buildTiqetsSearchUrl(stadiumQuery, localeKey)
  const gygUrl = buildGetYourGuideSearchUrl(`${stadiumName} tour`, localeKey)

  return (
    <aside className="mx-auto max-w-prose my-8 rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/8 to-violet-500/3 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/15">
          <Ticket className="size-4.5 text-violet-600" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="mt-2 pl-11 text-sm text-muted">{subtitle}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <AffiliateLink
          href={tiqetsUrl}
          partner="tiqets"
          disclosure={disclosure}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
        >
          <Ticket className="size-4" aria-hidden="true" />
          {ctaTiqets}
        </AffiliateLink>
        <AffiliateLink
          href={gygUrl}
          partner="getyourguide"
          disclosure={disclosure}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-violet-600 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 shadow-sm hover:bg-violet-50"
        >
          <Camera className="size-4" aria-hidden="true" />
          {ctaGyg}
        </AffiliateLink>
      </div>
      <p className="mt-4 flex items-start gap-1.5 text-xs italic text-muted">
        <Info className="mt-px size-3 shrink-0 opacity-60" aria-hidden="true" />
        {localeKey === 'es'
          ? 'Disponibilidad sujeta al calendario del estadio durante el Mundial.'
          : 'Availability is subject to the stadium schedule during the World Cup.'}
      </p>
    </aside>
  )
}
