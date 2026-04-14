import { AlertTriangle, Info } from 'lucide-react'
import { buildAirHelpUrl } from '@/lib/travelpayouts/partners'
import { AffiliateLink } from './AffiliateLink'
import type { Locale } from '@/lib/content/schemas'

interface AirHelpBannerProps {
  lang: Locale
}

/**
 * AirHelp claim CTA. Pays 15-16.6% with a 45-day cookie. Natural fit for
 * flight guides — readers researching flights are precisely the audience
 * that just experienced a delay or cancellation. EU regulation 261/2004
 * applies to most flights to/from Europe and many Mexico/USA carriers
 * voluntarily honor similar compensation.
 */
export function AirHelpBanner({ lang }: AirHelpBannerProps) {
  const localeKey: 'es' | 'en' = lang === 'es' ? 'es' : 'en'
  const title =
    localeKey === 'es'
      ? '¿Tu vuelo se retrasó o canceló? Reclama hasta €600'
      : 'Flight delayed or cancelled? Claim up to €600'
  const body =
    localeKey === 'es'
      ? 'Bajo la regulación europea EU 261, los pasajeros pueden recibir hasta €600 por retrasos de más de 3 horas, cancelaciones o overbooking. AirHelp gestiona el reclamo por ti — solo cobran si ganas.'
      : 'Under EU 261 regulation, passengers can receive up to €600 for delays over 3 hours, cancellations, or overbooking. AirHelp handles the claim — they only charge if you win.'
  const cta = localeKey === 'es' ? 'Verificar mi vuelo gratis' : 'Check my flight for free'
  const disclosure =
    localeKey === 'es'
      ? 'Enlace de afiliado (AirHelp) — sin costo extra para ti.'
      : 'Affiliate link (AirHelp) — no extra cost to you.'

  return (
    <aside className="mx-auto max-w-prose my-8 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/3 p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15">
          <AlertTriangle className="size-5 text-amber-600" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold">{title}</h3>
          <p className="mt-1.5 text-sm text-muted">{body}</p>
          <div className="mt-4">
            <AffiliateLink
              href={buildAirHelpUrl(localeKey)}
              partner="airhelp"
              disclosure={disclosure}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700"
            >
              {cta}
            </AffiliateLink>
          </div>
        </div>
      </div>
      <p className="mt-3 flex items-start gap-1.5 pl-12 text-xs italic text-muted">
        <Info className="mt-px size-3 shrink-0 opacity-60" aria-hidden="true" />
        {localeKey === 'es'
          ? 'Aplica para vuelos hacia/desde la UE y vuelos operados por aerolíneas europeas a nivel mundial.'
          : 'Applies to flights to/from the EU and flights operated by European airlines worldwide.'}
      </p>
    </aside>
  )
}
