import { ShieldCheck, Info } from 'lucide-react'
import { buildEktaInsuranceUrl } from '@/lib/travelpayouts/partners'
import { AffiliateLink } from './AffiliateLink'
import type { Locale } from '@/lib/content/schemas'

interface TravelInsuranceProps {
  lang: Locale
}

/**
 * EKTA travel insurance CTA. EKTA pays 25% commission with a 30-day cookie
 * — the highest reward rate of any program in the connected list, and a
 * natural fit for visa/travel guides since insurance is a documented
 * requirement for many entry types into the host countries.
 */
export function TravelInsurance({ lang }: TravelInsuranceProps) {
  const localeKey: 'es' | 'en' = lang === 'es' ? 'es' : 'en'
  const title =
    localeKey === 'es'
      ? 'Seguro de viaje para el Mundial 2026'
      : 'Travel insurance for World Cup 2026'
  const body =
    localeKey === 'es'
      ? 'Cobertura médica internacional, cancelación de viaje y equipaje perdido. Necesario para muchos visados y muy recomendado incluso si no es obligatorio. Cotiza en 2 minutos sin registrarte.'
      : 'International medical coverage, trip cancellation, and lost luggage. Required for many visas and strongly recommended even when optional. Get a quote in 2 minutes without signing up.'
  const cta = localeKey === 'es' ? 'Cotizar mi seguro' : 'Get a quote'
  const disclosure =
    localeKey === 'es'
      ? 'Enlace de afiliado (EKTA) — sin costo extra para ti.'
      : 'Affiliate link (EKTA) — no extra cost to you.'
  const bullets =
    localeKey === 'es'
      ? [
          'Cobertura médica de hasta $100,000 USD',
          'Cancelación de viaje y reembolso',
          'Pérdida o retraso de equipaje',
          'Asistencia 24/7 en español',
        ]
      : [
          'Medical coverage up to $100,000 USD',
          'Trip cancellation and refund',
          'Lost or delayed luggage',
          '24/7 assistance',
        ]

  return (
    <aside className="mx-auto max-w-prose my-8 rounded-xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/8 to-cyan-500/3 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/15">
          <ShieldCheck className="size-4.5 text-cyan-600" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="mt-2 pl-11 text-sm text-muted">{body}</p>
      <ul className="mt-3 grid gap-1.5 pl-11 text-sm text-foreground sm:grid-cols-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-cyan-600" aria-hidden="true" />
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-4 pl-11">
        <AffiliateLink
          href={buildEktaInsuranceUrl(localeKey)}
          partner="ekta"
          disclosure={disclosure}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700"
        >
          {cta}
        </AffiliateLink>
      </div>
      <p className="mt-4 flex items-start gap-1.5 text-xs italic text-muted">
        <Info className="mt-px size-3 shrink-0 opacity-60" aria-hidden="true" />
        {localeKey === 'es'
          ? 'EKTA es una aseguradora especializada en viajeros con cobertura en más de 200 países.'
          : 'EKTA is a travel-focused insurer with coverage in 200+ countries.'}
      </p>
    </aside>
  )
}
