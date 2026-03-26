'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
    { href: `/${lang}`, key: 'home' as const },
    { href: `/${lang}/${isEn ? 'cities' : 'ciudades'}`, key: 'cities' as const },
    { href: `/${lang}/${isEn ? 'stadiums' : 'estadios'}`, key: 'stadiums' as const },
    { href: `/${lang}/${isEn ? 'teams' : 'equipos'}`, key: 'teams' as const },
    { href: `/${lang}/${isEn ? 'travel' : 'viajes'}`, key: 'travel' as const },
    { href: `/${lang}/${isEn ? 'tools' : 'herramientas'}`, key: 'tools' as const },
  ]
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="py-3 px-6 text-white text-lg border-b border-white/10 hover:bg-primary-dark transition-colors"
                >
                  {dict.nav[link.key]}
                </Link>
              ))}
            </div>

            <div className="mt-auto px-6 py-4 border-t border-white/10 absolute bottom-0 left-0 right-0">
              <Link
                href={`/${switchLang}`}
                className="text-accent font-medium hover:text-accent-light transition-colors"
              >
                {switchLang === 'en' ? 'English' : 'Espanol'}
              </Link>
            </div>
          </nav>
        </>
      )}
    </>
  )
}
