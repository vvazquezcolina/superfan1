import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google'
import { GA_MEASUREMENT_ID } from '@/lib/analytics'

/**
 * GA4 loader. Loads unconditionally so pageviews are always counted.
 * Cookie consent is still surfaced via <CookieConsent /> for transparency,
 * but analytics tracking is not gated behind it — previously the gate meant
 * 0 sessions were ever reported because most visitors never interacted with
 * the banner.
 */
export function GoogleAnalytics() {
  return <NextGoogleAnalytics gaId={GA_MEASUREMENT_ID} />
}
