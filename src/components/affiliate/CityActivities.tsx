import { Ticket, Camera, Star, Info } from 'lucide-react'
import { buildGetYourGuideSearchUrl } from '@/lib/travelpayouts/partners'
import { AffiliateLink } from './AffiliateLink'
import type { Locale } from '@/lib/content/schemas'

interface CityActivitiesProps {
  cityName: string
  citySlug: string
  lang: Locale
}

interface ActivityIdea {
  icon: 'ticket' | 'camera' | 'star'
  title: { es: string; en: string }
  query: (cityName: string) => string
}

const ACTIVITY_IDEAS: ActivityIdea[] = [
  {
    icon: 'ticket',
    title: {
      es: 'Tours guiados de la ciudad',
      en: 'Guided city tours',
    },
    query: (city) => `${city} city tour`,
  },
  {
    icon: 'star',
    title: {
      es: 'Atracciones imperdibles',
      en: 'Top attractions',
    },
    query: (city) => `${city} top attractions`,
  },
  {
    icon: 'camera',
    title: {
      es: 'Experiencias gastronómicas',
      en: 'Food experiences',
    },
    query: (city) => `${city} food tour`,
  },
]

const ICONS = {
  ticket: Ticket,
  camera: Camera,
  star: Star,
} as const

/**
 * Cross-sell GetYourGuide activities on city pages. GetYourGuide pays 8%
 * with a 31-day cookie — best margin for tours/activities of all the
 * connected partners. Uses search URLs with our verified partner_id so
 * even cities GetYourGuide hasn't catalogued resolve to a real page.
 */
export function CityActivities({ cityName, citySlug, lang }: CityActivitiesProps) {
  const localeKey: 'es' | 'en' = lang === 'es' ? 'es' : 'en'
  const title =
    localeKey === 'es'
      ? `Qué hacer en ${cityName} durante el Mundial`
      : `Things to do in ${cityName} during the World Cup`
  const subtitle =
    localeKey === 'es'
      ? 'Tours, tickets a atracciones y experiencias reservables al instante. Aprovecha los días antes y después de los partidos.'
      : 'Tours, attraction tickets, and instantly bookable experiences. Make the most of the days before and after the matches.'
  const ctaLabel = localeKey === 'es' ? 'Ver disponibilidad' : 'Check availability'
  const disclosure =
    localeKey === 'es'
      ? 'Enlace de afiliado (GetYourGuide) — recibimos comisión si reservas, sin costo extra.'
      : 'Affiliate link (GetYourGuide) — we earn a commission if you book, at no extra cost.'
  const footer =
    localeKey === 'es'
      ? 'Las experiencias son reservables vía GetYourGuide, con cancelación gratis hasta 24 horas antes en la mayoría de tours.'
      : 'Experiences are bookable via GetYourGuide with free cancellation up to 24 hours in advance on most tours.'

  return (
    <aside className="mx-auto max-w-prose my-8 rounded-xl border border-rose-500/25 bg-gradient-to-br from-rose-500/8 to-rose-500/3 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex size-8 items-center justify-center rounded-lg bg-rose-500/15">
          <Ticket className="size-4.5 text-rose-600" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="mt-2 pl-11 text-sm text-muted">{subtitle}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {ACTIVITY_IDEAS.map((idea) => {
          const Icon = ICONS[idea.icon]
          const url = buildGetYourGuideSearchUrl(idea.query(cityName), localeKey)
          return (
            <li
              key={idea.icon}
              className="flex flex-col gap-3 rounded-lg border border-rose-500/15 bg-white/60 p-4"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-rose-500/10">
                <Icon className="size-4 text-rose-600" aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                {idea.title[localeKey]}
              </p>
              <AffiliateLink
                href={url}
                partner="getyourguide"
                citySlug={citySlug}
                disclosure={disclosure}
                className="mt-auto inline-flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
              >
                {ctaLabel}
              </AffiliateLink>
            </li>
          )
        })}
      </ul>
      <p className="mt-4 flex items-start gap-1.5 text-xs italic text-muted">
        <Info className="mt-px size-3 shrink-0 opacity-60" aria-hidden="true" />
        {footer}
      </p>
    </aside>
  )
}
