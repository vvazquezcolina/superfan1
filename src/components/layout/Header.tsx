import Link from 'next/link'
import { MobileNav } from './MobileNav'
import { SearchModal } from '@/components/engagement/SearchButton'
import {
  MapPin, Building2, Users, Plane, Calendar, Wrench, Globe
} from 'lucide-react'

interface HeaderProps {
  lang: string
  dict: {
    site: { name: string; tagline: string }
    nav: {
      home: string
      cities: string
      stadiums: string
      teams: string
      travel: string
      tools: string
    }
    search: {
      label: string
      placeholder: string
      noResults: string
      loading: string
      notAvailableInDev: string
      closeLabel: string
    }
  }
}

const navIcons = {
  cities: MapPin,
  stadiums: Building2,
  teams: Users,
  travel: Plane,
  calendar: Calendar,
  tools: Wrench,
}

function getNavLinks(lang: string) {
  const isEn = lang === 'en'
  return [
    { href: `/${lang}/${isEn ? 'cities' : 'ciudades'}`, key: 'cities' as const },
    { href: `/${lang}/${isEn ? 'stadiums' : 'estadios'}`, key: 'stadiums' as const },
    { href: `/${lang}/${isEn ? 'teams' : 'equipos'}`, key: 'teams' as const },
    { href: `/${lang}/${isEn ? 'travel' : 'viajes'}`, key: 'travel' as const },
    { href: `/${lang}/calendario`, key: 'calendar' as const },
    { href: `/${lang}/${isEn ? 'tools' : 'herramientas'}`, key: 'tools' as const },
  ]
}

const navLabels: Record<string, Record<string, string>> = {
  calendar: { es: 'Calendario', en: 'Schedule', pt: 'Calendario', fr: 'Calendrier', de: 'Spielplan', ar: 'Schedule' },
}

export function Header({ lang, dict }: HeaderProps) {
  const navLinks = getNavLinks(lang)
  const switchLang = lang === 'es' ? 'en' : 'es'
  const calendarLabel = navLabels.calendar[lang] ?? navLabels.calendar.en

  return (
    <header className="sticky top-0 z-50 bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link
          href={`/${lang}`}
          className="flex items-center gap-2 font-bold text-lg hover:text-accent transition-colors"
        >
          <span className="border-b-2 border-accent pb-0.5">
            {dict.site.name}
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-5">
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = navIcons[link.key]
              const label = link.key === 'calendar'
                ? calendarLabel
                : dict.nav[link.key as keyof typeof dict.nav]
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-white/90 hover:text-accent hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {label}
                </Link>
              )
            })}
          </nav>
          <div className="flex items-center gap-3 border-l border-white/20 pl-4">
            <Link
              href={`/${switchLang}`}
              className="flex items-center gap-1 text-accent text-sm font-medium hover:text-accent-light transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              {switchLang.toUpperCase()}
            </Link>
            <SearchModal dict={dict.search} />
          </div>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <SearchModal dict={dict.search} />
          <MobileNav lang={lang} dict={dict} />
        </div>
      </div>
    </header>
  )
}
