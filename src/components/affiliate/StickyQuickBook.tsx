'use client'

import { useEffect, useState } from 'react'
import { X, Plane, Hotel, Car } from 'lucide-react'
import type { Locale } from '@/lib/content/schemas'

interface StickyQuickBookProps {
  flightHref?: string
  hotelHref: string
  transferHref?: string
  cityName: string
  lang: Locale
}

/**
 * Sticky top-of-page quick-book bar. Appears after the user scrolls past
 * the hero so it doesn't intrude on first impression, stays visible while
 * they read the rest of the page. Three one-tap CTAs: flights / hotels /
 * transfers. Dismissable per-session.
 *
 * This is a pure conversion lift: the user is already on a city page
 * researching a trip, the bar makes it a single click to get to the
 * booking surface from anywhere on the page.
 */
export function StickyQuickBook({
  flightHref,
  hotelHref,
  transferHref,
  cityName,
  lang,
}: StickyQuickBookProps) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Per-session dismissal only — reset on next visit so urgency stays.
    const wasDismissed = sessionStorage.getItem('sticky-quickbook-dismissed')
    if (wasDismissed === '1') {
      setDismissed(true)
      return
    }
    function onScroll() {
      setVisible(window.scrollY > 600)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (dismissed || !visible) return null

  const localeKey: 'es' | 'en' = lang === 'es' ? 'es' : 'en'
  const flightLabel = localeKey === 'es' ? 'Vuelos' : 'Flights'
  const hotelLabel = localeKey === 'es' ? 'Hoteles' : 'Hotels'
  const transferLabel = localeKey === 'es' ? 'Traslados' : 'Transfers'
  const planLabel =
    localeKey === 'es'
      ? `Planea tu viaje a ${cityName}`
      : `Plan your trip to ${cityName}`

  function dismiss() {
    sessionStorage.setItem('sticky-quickbook-dismissed', '1')
    setDismissed(true)
  }

  function trackClick(partner: string) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'sticky_quickbook_click', {
        affiliate_partner: partner,
        city: cityName,
      })
    }
  }

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 border-b border-primary/30 bg-white/95 shadow-lg backdrop-blur-md"
      role="complementary"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <span className="hidden shrink-0 text-xs font-semibold uppercase tracking-wide text-primary sm:block">
          {planLabel}
        </span>
        <div className="flex flex-1 items-center justify-center gap-2 sm:justify-start">
          {flightHref && (
            <a
              href={flightHref}
              target="_blank"
              rel="nofollow sponsored noopener"
              onClick={() => trackClick('aviasales')}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
            >
              <Plane className="size-3.5" aria-hidden="true" />
              {flightLabel}
            </a>
          )}
          <a
            href={hotelHref}
            target="_blank"
            rel="nofollow sponsored noopener"
            onClick={() => trackClick('klook-hotels')}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary/90"
          >
            <Hotel className="size-3.5" aria-hidden="true" />
            {hotelLabel}
          </a>
          {transferHref && (
            <a
              href={transferHref}
              target="_blank"
              rel="nofollow sponsored noopener"
              onClick={() => trackClick('welcome-pickups')}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
            >
              <Car className="size-3.5" aria-hidden="true" />
              {transferLabel}
            </a>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={localeKey === 'es' ? 'Cerrar' : 'Close'}
          className="shrink-0 rounded-md p-1 text-muted hover:bg-muted/20"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
