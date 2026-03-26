import Link from 'next/link'
import { MobileNav } from './MobileNav'
import { SearchModal } from '@/components/engagement/SearchButton'

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

function getNavLinks(lang: string) {
  const isEn = lang === 'en'
  return [
    { href: `/${lang}/${isEn ? 'cities' : 'ciudades'}`, key: 'cities' as const },
    { href: `/${lang}/${isEn ? 'stadiums' : 'estadios'}`, key: 'stadiums' as const },
    { href: `/${lang}/${isEn ? 'teams' : 'equipos'}`, key: 'teams' as const },
    { href: `/${lang}/${isEn ? 'travel' : 'viajes'}`, key: 'travel' as const },
    { href: `/${lang}/${isEn ? 'tools' : 'herramientas'}`, key: 'tools' as const },
  ]
}

export function Header({ lang, dict }: HeaderProps) {
  const navLinks = getNavLinks(lang)
  const switchLang = lang === 'es' ? 'en' : 'es'

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

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <Link
              href={`/${lang}`}
              className="text-white/90 hover:text-accent transition-colors text-sm font-medium"
            >
              {dict.nav.home}
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="text-white/90 hover:text-accent transition-colors text-sm font-medium"
              >
                {dict.nav[link.key]}
              </Link>
            ))}
          </nav>
          <Link
            href={`/${switchLang}`}
            className="text-accent text-sm font-medium hover:text-accent-light transition-colors uppercase"
          >
            {switchLang.toUpperCase()}
          </Link>
          <SearchModal dict={dict.search} />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <SearchModal dict={dict.search} />
          <MobileNav lang={lang} dict={dict} />
        </div>
      </div>
    </header>
  )
}
