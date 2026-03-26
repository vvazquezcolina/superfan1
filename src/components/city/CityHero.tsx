import type { City, Locale } from '@/lib/content/schemas'

const countryFlags: Record<string, string> = {
  mexico: '\u{1F1F2}\u{1F1FD}',
  usa: '\u{1F1FA}\u{1F1F8}',
  canada: '\u{1F1E8}\u{1F1E6}',
}

interface CityHeroProps {
  city: City
  lang: Locale
}

export function CityHero({ city, lang }: CityHeroProps) {
  const flag = countryFlags[city.country] ?? ''
  const overviewText = city.content.overview[lang]
  // Show only the first paragraph as the hero overview
  const firstParagraph = overviewText.split('\n\n')[0]

  const section = lang === 'es' ? 'estadios' : 'stadiums'
  const stadiumLabel = lang === 'es' ? 'Estadio' : 'Stadium'
  const lastUpdatedLabel = lang === 'es' ? 'Ultima actualizacion' : 'Last updated'

  return (
    <section className="w-full rounded-lg bg-primary/10 px-6 py-10 md:px-10 md:py-14">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold md:text-5xl">
          {flag} {city.name[lang]}
        </h1>

        <p className="mt-4 text-lg text-muted md:text-xl">
          {stadiumLabel}:{' '}
          <a
            href={`/${lang}/${section}/${city.stadium}`}
            className="font-medium text-primary underline hover:text-primary/80"
          >
            {city.stadium.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </a>
        </p>

        <p className="mt-6 text-base leading-relaxed md:text-lg">
          {firstParagraph}
        </p>

        <p className="mt-4 text-sm text-muted">
          {lastUpdatedLabel}: {city.lastUpdated}
        </p>
      </div>
    </section>
  )
}
