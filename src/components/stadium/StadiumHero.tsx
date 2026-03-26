import type { Stadium, Locale } from '@/lib/content/schemas'
import { getCityById } from '@/lib/content/cities'

const countryFlags: Record<string, string> = {
  mexico: '\u{1F1F2}\u{1F1FD}',
  usa: '\u{1F1FA}\u{1F1F8}',
  canada: '\u{1F1E8}\u{1F1E6}',
}

interface StadiumHeroProps {
  stadium: Stadium
  lang: Locale
}

export function StadiumHero({ stadium, lang }: StadiumHeroProps) {
  const city = getCityById(stadium.city)
  const citySection = lang === 'es' ? 'ciudades' : 'cities'
  const citySlug = city?.slugs[lang] ?? stadium.city

  const flag = city ? (countryFlags[city.country] ?? '') : ''
  const cityName = city?.name[lang] ?? stadium.city

  const overviewText = stadium.content.overview[lang]
  const firstParagraph = overviewText.split('\n\n')[0]

  const capacityLabel = lang === 'es' ? 'Capacidad' : 'Capacity'
  const hostCityLabel = lang === 'es' ? 'Ciudad sede' : 'Host City'
  const lastUpdatedLabel = lang === 'es' ? 'Ultima actualizacion' : 'Last updated'

  return (
    <section className="w-full rounded-lg bg-primary/10 px-6 py-10 md:px-10 md:py-14">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold md:text-5xl">
          {stadium.name[lang]}
        </h1>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-lg text-muted md:text-xl">
          <p>
            {capacityLabel}:{' '}
            <span className="font-medium">{stadium.capacity.toLocaleString()}</span>
          </p>
          <p>
            {hostCityLabel}:{' '}
            <a
              href={`/${lang}/${citySection}/${citySlug}`}
              className="font-medium text-primary underline hover:text-primary/80"
            >
              {flag} {cityName}
            </a>
          </p>
        </div>

        <p className="mt-6 text-base leading-relaxed md:text-lg">
          {firstParagraph}
        </p>

        <p className="mt-4 text-sm text-muted">
          {lastUpdatedLabel}: {stadium.lastUpdated}
        </p>
      </div>
    </section>
  )
}
