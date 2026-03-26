'use client'

import { useEffect, useState } from 'react'
import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google'
import { GA_MEASUREMENT_ID } from '@/lib/analytics'

/**
 * GA4 script loader conditioned on cookie consent.
 * Reads localStorage key 'cookie-consent' on mount.
 * Only renders the GA4 script when consent is 'accepted'.
 * Cookie consent UI will be wired in Plan 02.
 */
export function GoogleAnalytics() {
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie-consent')
      if (consent === 'accepted') {
        setConsentGiven(true)
      }
    } catch {
      // localStorage not available (SSR, incognito restrictions)
    }
  }, [])

  if (!consentGiven) return null

  return <NextGoogleAnalytics gaId={GA_MEASUREMENT_ID} />
}
