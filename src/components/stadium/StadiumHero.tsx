import Link from 'next/link'
import type { Stadium, Locale } from '@/lib/content/schemas'
import { getCityById } from '@/lib/content/cities'
import { Building2, MapPin, Users, Clock } from 'lucide-react'

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

  return (
    <section className="w-full rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-secondary px-6 py-10 text-white md:px-10 md:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-2 text-white/70 text-sm font-medium mb-3">
          <Building2 className="h-4 w-4" />
          {lang === 'es' ? 'Estadio sede' : 'Host Stadium'}
        </div>

        <h1 className="text-3xl font-extrabold md:text-5xl">
          {stadium.name[lang]}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-white/80">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
            <Users className="h-3.5 w-3.5" />
            {stadium.capacity.toLocaleString()} {lang === 'es' ? 'asientos' : 'seats'}
          </span>
          <Link
            href={`/${lang}/${citySection}/${citySlug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm font-medium hover:bg-white/20 transition-colors"
          >
            <MapPin className="h-3.5 w-3.5" />
            {flag} {cityName}
          </Link>
          <span className="inline-flex items-center gap-1.5 text-sm">
            <Clock className="h-3.5 w-3.5" />
            {lang === 'es' ? 'Actualizado' : 'Updated'}: {stadium.lastUpdated}
          </span>
        </div>
      </div>
    </section>
  )
}
