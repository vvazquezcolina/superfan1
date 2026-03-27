'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MapPin, Building2, Users, Plane, Calendar, Wrench,
  Home, Globe, X, Menu, Ticket
} from 'lucide-react'

interface MobileNavProps {
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
  }
}

function getNavLinks(lang: string) {
  const isEn = lang === 'en'
  return [
    { href: `/${lang}`, key: 'home' as const, icon: Home },
    { href: `/${lang}/${isEn ? 'cities' : 'ciudades'}`, key: 'cities' as const, icon: MapPin },
    { href: `/${lang}/${isEn ? 'stadiums' : 'estadios'}`, key: 'stadiums' as const, icon: Building2 },
    { href: `/${lang}/${isEn ? 'teams' : 'equipos'}`, key: 'teams' as const, icon: Users },
    { href: `/${lang}/${isEn ? 'travel' : 'viajes'}`, key: 'travel' as const, icon: Plane },
    { href: `/${lang}/calendario`, key: 'calendar' as const, icon: Calendar },
    { href: `/${lang}/fan`, key: 'fan' as const, icon: Ticket },
    { href: `/${lang}/${isEn ? 'tools' : 'herramientas'}`, key: 'tools' as const, icon: Wrench },
  ]
}

const extraLabels: Record<string, Record<string, string>> = {
  calendar: { es: 'Calendario', en: 'Schedule' },
  fan: { es: 'Fan Zone', en: 'Fan Zone' },
}

export function MobileNav({ lang, dict }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const switchLang = lang === 'es' ? 'en' : 'es'
  const navLinks = getNavLinks(lang)

  // Close on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-white p-2"
        aria-label="Open navigation menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-in panel */}
          <nav className="fixed top-0 right-0 z-50 h-full w-72 bg-primary shadow-xl">
            <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
              <span className="text-white font-bold text-lg">
                {dict.site.name}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white p-2"
                aria-label="Close navigation menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col py-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                const label = link.key === 'calendar' || link.key === 'fan'
                  ? extraLabels[link.key]?.[lang] ?? extraLabels[link.key]?.en ?? link.key
                  : dict.nav[link.key as keyof typeof dict.nav]
                const isActive = pathname === link.href || (link.key !== 'home' && pathname?.startsWith(link.href))
                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    className={`flex items-center gap-3 py-3 px-6 text-white text-base border-b border-white/5 hover:bg-primary-dark transition-colors ${
                      isActive ? 'bg-primary-dark text-accent' : ''
                    }`}
                  >
                    <Icon className="h-5 w-5 text-accent/80" />
                    {label}
                  </Link>
                )
              })}
            </div>

            <div className="mt-auto px-6 py-4 border-t border-white/10 absolute bottom-0 left-0 right-0">
              <Link
                href={`/${switchLang}`}
                className="flex items-center gap-2 text-accent font-medium hover:text-accent-light transition-colors"
              >
                <Globe className="h-4 w-4" />
                {switchLang === 'en' ? 'English' : 'Espanol'}
              </Link>
            </div>
          </nav>
        </>
      )}
    </>
  )
}
