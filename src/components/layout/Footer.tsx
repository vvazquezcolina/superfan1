import Link from 'next/link'
import {
  MapPin, Building2, Users, Plane, Calendar, Wrench,
  Ticket, Globe, Trophy
} from 'lucide-react'

interface FooterProps {
  lang: string
  dict: {
    site: { name: string }
    nav: {
      home: string
      cities: string
      stadiums: string
      teams: string
      travel: string
      tools: string
    }
    footer: {
      disclaimer: string
      copyright: string
      sections: { explore: string; info: string; legal: string }
      links: { about: string; privacy: string; disclosure: string }
    }
  }
}

function getNavPath(lang: string, section: string): string {
  const isEn = lang === 'en'
  const paths: Record<string, Record<string, string>> = {
    cities: { es: 'ciudades', en: 'cities' },
    stadiums: { es: 'estadios', en: 'stadiums' },
    teams: { es: 'equipos', en: 'teams' },
    travel: { es: 'viajes', en: 'travel' },
    tools: { es: 'herramientas', en: 'tools' },
  }
  const langKey = isEn ? 'en' : 'es'
  return `/${lang}/${paths[section]?.[langKey] ?? section}`
}

function getLegalPath(lang: string, page: string): string {
  const paths: Record<string, Record<string, string>> = {
    about: { es: 'acerca', en: 'about' },
    privacy: { es: 'privacidad', en: 'privacy' },
    disclosure: { es: 'divulgacion', en: 'disclosure' },
  }
  return `/${lang}/${paths[page]?.[lang] ?? page}`
}

const calendarLabels: Record<string, string> = { es: 'Calendario', en: 'Schedule' }
const fanLabels: Record<string, string> = { es: 'Fan Zone', en: 'Fan Zone' }

export function Footer({ lang, dict }: FooterProps) {
  const switchLang = lang === 'es' ? 'en' : 'es'
  const calLabel = calendarLabels[lang] ?? calendarLabels.en
  const fnLabel = fanLabels[lang] ?? fanLabels.en

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Brand + tagline */}
        <div className="flex items-center gap-2 mb-8">
          <Trophy className="h-6 w-6 text-accent" />
          <span className="text-xl font-bold">{dict.site.name}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Explore */}
          <div>
            <h3 className="text-accent font-bold text-sm uppercase tracking-wider mb-4">
              {dict.footer.sections.explore}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href={getNavPath(lang, 'cities')}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {dict.nav.cities}
                </Link>
              </li>
              <li>
                <Link
                  href={getNavPath(lang, 'stadiums')}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  {dict.nav.stadiums}
                </Link>
              </li>
              <li>
                <Link
                  href={getNavPath(lang, 'teams')}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                >
                  <Users className="h-3.5 w-3.5" />
                  {dict.nav.teams}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/calendario`}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  {calLabel}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Information */}
          <div>
            <h3 className="text-accent font-bold text-sm uppercase tracking-wider mb-4">
              {dict.footer.sections.info}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href={getNavPath(lang, 'travel')}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                >
                  <Plane className="h-3.5 w-3.5" />
                  {dict.nav.travel}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/fan`}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                >
                  <Ticket className="h-3.5 w-3.5" />
                  {fnLabel}
                </Link>
              </li>
              <li>
                <Link
                  href={getNavPath(lang, 'tools')}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                >
                  <Wrench className="h-3.5 w-3.5" />
                  {dict.nav.tools}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-accent font-bold text-sm uppercase tracking-wider mb-4">
              {dict.footer.sections.legal}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href={getLegalPath(lang, 'about')}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {dict.footer.links.about}
                </Link>
              </li>
              <li>
                <Link
                  href={getLegalPath(lang, 'privacy')}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {dict.footer.links.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={getLegalPath(lang, 'disclosure')}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {dict.footer.links.disclosure}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Countries */}
          <div>
            <h3 className="text-accent font-bold text-sm uppercase tracking-wider mb-4">
              {lang === 'es' ? 'Paises sede' : 'Host Countries'}
            </h3>
            <div className="flex flex-col gap-2.5 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-green-500" />
                Mexico
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-blue-500" />
                {lang === 'es' ? 'Estados Unidos' : 'United States'}
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-red-500" />
                Canada
              </span>
            </div>
          </div>
        </div>

        {/* FIFA Disclaimer */}
        <p className="text-sm text-white/60 border-t border-white/10 pt-6 mt-8">
          {dict.footer.disclaimer}
        </p>

        {/* Copyright and language switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-4">
          <p className="text-xs text-white/50">
            &copy; 2026 SuperFan Info. {dict.footer.copyright}
          </p>
          <Link
            href={`/${switchLang}`}
            className="flex items-center gap-1 text-accent text-xs font-medium hover:text-accent-light transition-colors"
          >
            <Globe className="h-3 w-3" />
            {switchLang === 'en' ? 'English' : 'Espanol'}
          </Link>
        </div>
      </div>
    </footer>
  )
}
