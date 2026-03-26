'use client'

import { useState, useEffect } from 'react'

interface CookieConsentProps {
  lang: string
}

export function CookieConsent({ lang }: CookieConsentProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie-consent')
      if (consent === null) {
        // First visit -- show the banner
        setVisible(true)
      }
      // If 'accepted' or 'rejected' already set, stay hidden
    } catch {
      // localStorage not available (SSR, incognito restrictions)
    }
  }, [])

  function handleAccept() {
    try {
      localStorage.setItem('cookie-consent', 'accepted')
      // Notify GoogleAnalytics component to re-check consent
      window.dispatchEvent(new Event('cookie-consent-changed'))
    } catch {
      // localStorage not available
    }
    setVisible(false)
  }

  function handleReject() {
    try {
      localStorage.setItem('cookie-consent', 'rejected')
    } catch {
      // localStorage not available
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-border shadow-lg p-4 sm:p-6">
      <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium">
            {lang === 'es' ? 'Este sitio usa cookies' : 'This site uses cookies'}
          </p>
          <p className="mt-1 text-xs text-muted">
            {lang === 'es'
              ? 'Usamos cookies de Google Analytics para mejorar tu experiencia. Puedes aceptar o rechazar las cookies de analisis.'
              : 'We use Google Analytics cookies to improve your experience. You can accept or reject analytics cookies.'}
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleReject}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted/10 transition-colors"
          >
            {lang === 'es' ? 'Rechazar' : 'Reject'}
          </button>
          <button
            onClick={handleAccept}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            {lang === 'es' ? 'Aceptar' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  )
}
