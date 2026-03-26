import Link from 'next/link'

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

export function Footer({ lang, dict }: FooterProps) {
  const switchLang = lang === 'es' ? 'en' : 'es'

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Explore */}
          <div>
            <h3 className="text-accent font-bold text-sm uppercase tracking-wider mb-4">
              {dict.footer.sections.explore}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={getNavPath(lang, 'cities')}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {dict.nav.cities}
                </Link>
              </li>
              <li>
                <Link
                  href={getNavPath(lang, 'stadiums')}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {dict.nav.stadiums}
                </Link>
              </li>
              <li>
                <Link
                  href={getNavPath(lang, 'teams')}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {dict.nav.teams}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Information */}
          <div>
            <h3 className="text-accent font-bold text-sm uppercase tracking-wider mb-4">
              {dict.footer.sections.info}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={getNavPath(lang, 'travel')}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {dict.nav.travel}
                </Link>
              </li>
              <li>
                <Link
                  href={getNavPath(lang, 'tools')}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {dict.nav.tools}
                </Link>
              </li>
              <li>
                <Link
                  href={getLegalPath(lang, 'about')}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {dict.footer.links.about}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-accent font-bold text-sm uppercase tracking-wider mb-4">
              {dict.footer.sections.legal}
            </h3>
            <ul className="space-y-2">
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
        </div>

        {/* FIFA Disclaimer */}
        <p className="text-sm text-white/80 border-t border-white/20 pt-6 mt-8">
          {dict.footer.disclaimer}
        </p>

        {/* Copyright and language switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-4">
          <p className="text-xs text-white/60">
            &copy; 2026 SuperFan Info. {dict.footer.copyright}
          </p>
          <Link
            href={`/${switchLang}`}
            className="text-accent text-xs font-medium hover:text-accent-light transition-colors"
          >
            {switchLang === 'en' ? 'English' : 'Espanol'}
          </Link>
        </div>
      </div>
    </footer>
  )
}
