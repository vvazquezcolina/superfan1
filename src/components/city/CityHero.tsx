import Link from 'next/link'
import type { City, Locale } from '@/lib/content/schemas'
import { getStadiumById } from '@/lib/content/stadiums'
import { MapPin, Building2, Globe, Clock } from 'lucide-react'

const countryFlags: Record<string, string> = {
  mexico: '\u{1F1F2}\u{1F1FD}',
  usa: '\u{1F1FA}\u{1F1F8}',
  canada: '\u{1F1E8}\u{1F1E6}',
}

const countryGradients: Record<string, string> = {
  mexico: 'from-green-800 via-green-900 to-green-950',
  usa: 'from-blue-800 via-blue-900 to-blue-950',
  canada: 'from-red-800 via-red-900 to-red-950',
}

interface CityHeroProps {
  city: City
  lang: Locale
}

export function CityHero({ city, lang }: CityHeroProps) {
  const flag = countryFlags[city.country] ?? ''
  const gradient = countryGradients[city.country] ?? 'from-primary via-primary-dark to-secondary'
  const stadium = getStadiumById(city.stadium)
  const stadiumName = stadium ? stadium.name[lang] : city.stadium.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const section = lang === 'es' ? 'estadios' : 'stadiums'
  const countryName = lang === 'es'
    ? (city.country === 'mexico' ? 'Mexico' : city.country === 'usa' ? 'Estados Unidos' : 'Canada')
    : (city.country === 'mexico' ? 'Mexico' : city.country === 'usa' ? 'United States' : 'Canada')

  return (
    <section className={`w-full rounded-2xl bg-gradient-to-br ${gradient} px-6 py-10 text-white md:px-10 md:py-14`}>
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-2 text-white/70 text-sm font-medium mb-3">
          <Globe className="h-4 w-4" />
          {flag} {countryName}
        </div>

        <h1 className="text-3xl font-extrabold md:text-5xl">
          {city.name[lang]}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-white/80">
          <Link
            href={`/${lang}/${section}/${stadium?.slugs[lang] ?? city.stadium}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm font-medium hover:bg-white/20 transition-colors"
          >
            <Building2 className="h-3.5 w-3.5" />
            {stadiumName}
          </Link>
          <span className="inline-flex items-center gap-1.5 text-sm">
            <MapPin className="h-3.5 w-3.5" />
            {city.coordinates.lat.toFixed(2)}N, {Math.abs(city.coordinates.lng).toFixed(2)}W
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm">
            <Clock className="h-3.5 w-3.5" />
            {lang === 'es' ? 'Actualizado' : 'Updated'}: {city.lastUpdated}
          </span>
        </div>
      </div>
    </section>
  )
}
