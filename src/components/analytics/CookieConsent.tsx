'use client'

import { useState, useEffect } from 'react'
import { Cookie, X, Check } from 'lucide-react'

interface CookieConsentProps {
  lang: string
}

const translations: Record<string, { title: string; body: string; accept: string; reject: string }> = {
  es: {
    title: 'Este sitio usa cookies',
    body: 'Usamos cookies de Google Analytics para mejorar tu experiencia. Puedes aceptar o rechazar las cookies de análisis.',
    accept: 'Aceptar',
    reject: 'Rechazar',
  },
  en: {
    title: 'This site uses cookies',
    body: 'We use Google Analytics cookies to improve your experience. You can accept or reject analytics cookies.',
    accept: 'Accept',
    reject: 'Reject',
  },
  pt: {
    title: 'Este site usa cookies',
    body: 'Usamos cookies do Google Analytics para melhorar sua experiência. Você pode aceitar ou rejeitar os cookies de análise.',
    accept: 'Aceitar',
    reject: 'Rejeitar',
  },
  fr: {
    title: 'Ce site utilise des cookies',
    body: 'Nous utilisons les cookies Google Analytics pour améliorer votre expérience. Vous pouvez accepter ou refuser les cookies d\'analyse.',
    accept: 'Accepter',
    reject: 'Refuser',
  },
  de: {
    title: 'Diese Website verwendet Cookies',
    body: 'Wir verwenden Google Analytics-Cookies, um Ihre Erfahrung zu verbessern. Sie können Analyse-Cookies akzeptieren oder ablehnen.',
    accept: 'Akzeptieren',
    reject: 'Ablehnen',
  },
  ar: {
    title: 'يستخدم هذا الموقع ملفات تعريف الارتباط',
    body: 'نستخدم ملفات تعريف الارتباط من Google Analytics لتحسين تجربتك. يمكنك قبول أو رفض ملفات تعريف الارتباط التحليلية.',
    accept: 'قبول',
    reject: 'رفض',
  },
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

  const t = translations[lang] ?? translations.es

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-border/60 bg-white/95 backdrop-blur-sm shadow-xl">
      <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Cookie className="size-4.5 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{t.title}</p>
            <p className="mt-0.5 text-xs text-muted leading-relaxed">{t.body}</p>
          </div>
        </div>
        <div className="flex gap-2.5 shrink-0 sm:ml-4">
          <button
            onClick={handleReject}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/10 transition-colors"
          >
            <X className="size-3.5" aria-hidden="true" />
            {t.reject}
          </button>
          <button
            onClick={handleAccept}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Check className="size-3.5" aria-hidden="true" />
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  )
}
