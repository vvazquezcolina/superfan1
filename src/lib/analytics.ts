// GA4 analytics helper functions
// Usable from any client component -- plain TypeScript, no React

export const GA_MEASUREMENT_ID = 'G-HMRJTYPDPP'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Send a custom event to GA4.
 * Guards against SSR and missing gtag.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string>,
): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}

/**
 * Track an affiliate link click with partner, destination, and optional city context.
 */
export function trackAffiliateClick(
  partner: string,
  destination: string,
  citySlug?: string,
): void {
  trackEvent('affiliate_click', {
    affiliate_partner: partner,
    affiliate_destination: destination,
    city_slug: citySlug ?? '',
  })
}

/**
 * Track a newsletter signup conversion.
 */
export function trackNewsletterSignup(): void {
  trackEvent('newsletter_signup')
}

/**
 * Track interactive tool usage (budget calculator, trip planner, etc.).
 */
export function trackToolUsage(toolName: string): void {
  trackEvent('tool_usage', { tool_name: toolName })
}
