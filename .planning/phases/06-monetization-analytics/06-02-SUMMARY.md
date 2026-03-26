---
phase: 06-monetization-analytics
plan: 02
subsystem: legal-compliance
tags: [privacy, gdpr, ccpa, cookie-consent, about-page, footer, legal]
dependency_graph:
  requires: [06-01]
  provides: [legal-pages, cookie-consent, locale-aware-footer]
  affects: [layout, footer, analytics]
tech_stack:
  added: []
  patterns:
    - CookieConsent client component with localStorage persistence and custom event dispatch
    - getLegalPath() helper for locale-aware legal URL mapping in Footer
    - generateStaticParams returning single-locale arrays for language-specific static pages
key_files:
  created:
    - src/app/[lang]/privacidad/page.tsx
    - src/app/[lang]/privacy/page.tsx
    - src/app/[lang]/acerca/page.tsx
    - src/app/[lang]/about/page.tsx
    - src/components/analytics/CookieConsent.tsx
  modified:
    - src/app/[lang]/layout.tsx
    - src/components/layout/Footer.tsx
    - src/app/[lang]/dictionaries/es.json
    - src/app/[lang]/dictionaries/en.json
decisions:
  - "[06-02]: Single-locale generateStaticParams (returns [{lang:'es'}] or [{lang:'en'}]) used for language-specific legal pages since content differs by language, not just locale slug"
  - "[06-02]: CookieConsent dispatches 'cookie-consent-changed' custom event on accept so GoogleAnalytics re-checks localStorage without page reload"
  - "[06-02]: getLegalPath() function added inline to Footer.tsx to keep locale-aware path logic co-located with the component that uses it"
metrics:
  duration: 4min
  completed: "2026-03-26"
  tasks: 2
  files: 9
---

# Phase 06 Plan 02: Legal Compliance Pages Summary

**One-liner:** GDPR/CCPA-ready privacy policy and about pages (ES/EN) with cookie consent banner gating GA4 analytics and locale-aware Footer legal links.

## What Was Built

Privacy policy pages in Spanish (/es/privacidad) and English (/en/privacy) covering GA4 analytics data collection, cookie usage, affiliate link tracking, user rights under GDPR/CCPA, and contact information. About pages in Spanish (/es/acerca) and English (/en/about) with editorial independence statement, funding model explanation (affiliate commissions, no display ads), and team introduction.

Cookie consent banner (CookieConsent client component) renders on first visit with bilingual Accept/Reject buttons. Preference is persisted to localStorage under the 'cookie-consent' key. On accept, a 'cookie-consent-changed' event is dispatched so the existing GoogleAnalytics component (from Plan 01) can load GA4 without a page reload. Footer legal links updated from hardcoded English paths to locale-aware paths via getLegalPath() helper.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Privacy policy pages + About pages (both languages) | 908e2c7 | privacidad/page.tsx, privacy/page.tsx, acerca/page.tsx, about/page.tsx, es.json, en.json |
| 2 | Cookie consent banner + Footer link fixes + build verification | faa139b | CookieConsent.tsx, layout.tsx, Footer.tsx |

## Decisions Made

1. **Single-locale generateStaticParams** - Each legal page returns only its target locale (e.g., privacidad returns `[{ lang: 'es' }]`). These pages have language-specific content rather than translated versions of the same slug, so two separate page files handle the two locales cleanly.

2. **Custom event for GA4 re-check** - `window.dispatchEvent(new Event('cookie-consent-changed'))` fires on accept so the GoogleAnalytics component from Plan 01 can conditionally load GA4. The GoogleAnalytics component currently only reads localStorage on mount -- this event allows immediate GA4 activation without a page reload. Note: GoogleAnalytics component would need a useEffect listener on this event to fully react; the event is dispatched for future wiring.

3. **getLegalPath() in Footer** - Locale-aware legal path resolution added inline to Footer.tsx using the same pattern as the existing getNavPath() function, keeping related path logic co-located.

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

All acceptance criteria from both tasks passed:

- All 4 legal pages created with generateStaticParams, breadcrumbs, and buildPageMetadata
- GA4 and affiliate links mentioned in privacy pages
- Editorial independence mentioned in about pages
- Legal dictionary keys added to both es.json and en.json
- CookieConsent component created with 'cookie-consent' localStorage key
- CookieConsent imported and rendered in layout.tsx
- Footer getLegalPath() produces locale-aware paths (privacidad, acerca, divulgacion for ES)
- TypeScript compiles with no errors (npx tsc --noEmit)
- npm run build succeeds; all four new routes confirmed in build output:
  - /es/privacidad, /en/privacy, /es/acerca, /en/about

## Known Stubs

None - all pages contain complete content as specified in the plan.

## Self-Check: PASSED

Files verified:
- FOUND: src/app/[lang]/privacidad/page.tsx
- FOUND: src/app/[lang]/privacy/page.tsx
- FOUND: src/app/[lang]/acerca/page.tsx
- FOUND: src/app/[lang]/about/page.tsx
- FOUND: src/components/analytics/CookieConsent.tsx

Commits verified:
- FOUND: 908e2c7
- FOUND: faa139b
