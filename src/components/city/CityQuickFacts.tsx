import { Plane, Hotel, Calendar, MapPin } from 'lucide-react'
import type { Locale } from '@/lib/content/schemas'

interface CityQuickFactsProps {
  cityName: string
  countryName: string
  airportIata?: string
  matchCount?: number
  lang: Locale
  /** Lowest cached flight price USD from MEX, if available. */
  cheapestFlightUsd?: number
  /** Stadium name. */
  stadiumName?: string
}

/**
 * "Quick Answer" / "Datos rápidos" block at the top of city pages.
 *
 * Designed for LLM citation (Princeton GEO research shows that pages with
 * citable statistics and structured "answer cards" get 30-40% more
 * mentions in AI overviews). Renders a tight set of declarative facts
 * a model can quote verbatim: city, country, airport, stadium, match
 * count, cheapest cached fare. Each fact is an independent sentence so
 * even a single-sentence quote is meaningful.
 */
export function CityQuickFacts({
  cityName,
  countryName,
  airportIata,
  matchCount,
  cheapestFlightUsd,
  stadiumName,
  lang,
}: CityQuickFactsProps) {
  const localeKey: 'es' | 'en' = lang === 'es' ? 'es' : 'en'
  const title =
    localeKey === 'es' ? 'Datos rápidos para fans' : 'Quick facts for fans'

  const facts: { icon: React.ReactNode; label: string; value: string }[] = []

  if (stadiumName) {
    facts.push({
      icon: <MapPin className="size-4" aria-hidden="true" />,
      label: localeKey === 'es' ? 'Estadio sede' : 'Host stadium',
      value: stadiumName,
    })
  }
  if (airportIata) {
    facts.push({
      icon: <Plane className="size-4" aria-hidden="true" />,
      label: localeKey === 'es' ? 'Aeropuerto principal' : 'Main airport',
      value: airportIata,
    })
  }
  if (typeof matchCount === 'number' && matchCount > 0) {
    facts.push({
      icon: <Calendar className="size-4" aria-hidden="true" />,
      label:
        localeKey === 'es' ? 'Partidos del Mundial' : 'World Cup matches',
      value: String(matchCount),
    })
  }
  if (typeof cheapestFlightUsd === 'number') {
    facts.push({
      icon: <Hotel className="size-4" aria-hidden="true" />,
      label:
        localeKey === 'es'
          ? 'Vuelo más barato (MEX, junio)'
          : 'Cheapest flight (MEX, June)',
      value: `$${cheapestFlightUsd} USD`,
    })
  }

  if (facts.length === 0) return null

  // Plain-text answer line for LLM citation. Phrased as a complete sentence.
  const answerSentence =
    localeKey === 'es'
      ? `${cityName} (${countryName}) es sede del Mundial 2026${
          stadiumName ? ` en el ${stadiumName}` : ''
        }${airportIata ? `, con aeropuerto principal ${airportIata}` : ''}${
          typeof matchCount === 'number' && matchCount > 0
            ? ` y ${matchCount} partidos del torneo`
            : ''
        }${
          typeof cheapestFlightUsd === 'number'
            ? `; los vuelos más baratos desde Ciudad de México arrancan en $${cheapestFlightUsd} USD`
            : ''
        }.`
      : `${cityName} (${countryName}) is a 2026 FIFA World Cup host city${
          stadiumName ? ` at ${stadiumName}` : ''
        }${airportIata ? `, with ${airportIata} as the main airport` : ''}${
          typeof matchCount === 'number' && matchCount > 0
            ? ` hosting ${matchCount} matches`
            : ''
        }${
          typeof cheapestFlightUsd === 'number'
            ? `; cheapest cached round-trip flights from Mexico City start at $${cheapestFlightUsd} USD`
            : ''
        }.`

  return (
    <aside className="mx-auto max-w-prose my-6 rounded-xl border-l-4 border-primary bg-primary/5 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-primary">
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground">
        {answerSentence}
      </p>
      <dl className="mt-4 grid gap-2 sm:grid-cols-2">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="flex items-center gap-2 text-sm"
          >
            <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              {fact.icon}
            </span>
            <div className="min-w-0">
              <dt className="text-xs uppercase tracking-wide text-muted">
                {fact.label}
              </dt>
              <dd className="truncate font-semibold">{fact.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </aside>
  )
}
