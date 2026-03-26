---
phase: 06-monetization-analytics
plan: 01
subsystem: monetization
tags: [ga4, analytics, affiliate, booking.com, disclosure, revenue]
dependency_graph:
  requires: []
  provides:
    - GA4 analytics infrastructure (G-HMRJTYPDPP)
    - Centralized affiliate data layer (affiliates.json + affiliates.ts)
    - AffiliateLink client component with FTC compliance
    - BookingWidget server component on all 16 city pages
    - Affiliate disclosure pages (ES + EN)
  affects:
    - src/app/[lang]/layout.tsx (GA4 in root layout)
    - src/app/[lang]/ciudades/[slug]/page.tsx (BookingWidget after neighborhoods)
tech_stack:
  added:
    - "@next/third-parties/google (GA4 script injection)"
    - "Booking.com affiliate program (aid 304142)"
  patterns:
    - "Cookie-consent-gated GA4 via localStorage 'cookie-consent' key"
    - "Zod-validated affiliate partner config at module-level import"
    - "rel=nofollow sponsored noopener on all outbound affiliate links"
    - "Visible FTC disclosure text adjacent to every affiliate link"
    - "BookingWidget as server component with AffiliateLink client island"
key_files:
  created:
    - src/lib/analytics.ts
    - src/components/analytics/GoogleAnalytics.tsx
    - content/affiliates.json
    - src/lib/content/affiliates.ts
    - src/components/affiliate/AffiliateLink.tsx
    - src/components/affiliate/BookingWidget.tsx
    - src/app/[lang]/divulgacion/page.tsx
    - src/app/[lang]/disclosure/page.tsx
  modified:
    - src/app/[lang]/layout.tsx (added GoogleAnalytics component)
    - src/app/[lang]/ciudades/[slug]/page.tsx (added BookingWidget, React import)
    - src/app/[lang]/dictionaries/es.json (added affiliate keys)
    - src/app/[lang]/dictionaries/en.json (added affiliate keys)
    - src/lib/i18n.ts (added divulgacion/disclosure path translations)
decisions:
  - "Cookie-consent-gated GA4: reads localStorage 'cookie-consent' key on mount; defaults to false (renders nothing) until Plan 02 wires the cookie banner UI"
  - "Booking.com aid 304142 used as the standard public affiliate tracking ID"
  - "BookingWidget is a server component wrapping AffiliateLink client component for optimal RSC/hydration split"
  - "Default Booking.com search dates set to World Cup week 1 (June 11-18, 2026) for maximum relevance"
  - "Disclosure pages use generateStaticParams with single locale each (divulgacion=es only, disclosure=en only)"
metrics:
  duration: "2 minutes"
  completed: "2026-03-26"
  tasks_completed: 2
  files_created: 8
  files_modified: 5
---

# Phase 06 Plan 01: GA4 + Affiliate System + BookingWidget Summary

**One-liner:** GA4 analytics (G-HMRJTYPDPP) with cookie-consent gating, Booking.com affiliate system via Zod-validated affiliates.json, AffiliateLink with FTC disclosure, BookingWidget on all 16 city pages, and bilingual disclosure pages.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | GA4 integration + affiliate data layer + AffiliateLink component | 485450c | analytics.ts, GoogleAnalytics.tsx, affiliates.json, affiliates.ts, AffiliateLink.tsx, layout.tsx, es.json, en.json |
| 2 | Booking.com widgets on city pages + affiliate disclosure page | 6db264c | BookingWidget.tsx, ciudades/[slug]/page.tsx, divulgacion/page.tsx, disclosure/page.tsx, i18n.ts |

## What Was Built

### GA4 Analytics Infrastructure

- `src/lib/analytics.ts`: Exports `GA_MEASUREMENT_ID = 'G-HMRJTYPDPP'`, `trackEvent`, `trackAffiliateClick`, `trackNewsletterSignup`, `trackToolUsage`. All functions guard against SSR and missing `window.gtag`.
- `src/components/analytics/GoogleAnalytics.tsx`: Client component that reads `localStorage['cookie-consent']` on mount. Renders `<NextGoogleAnalytics gaId={GA_MEASUREMENT_ID} />` only when consent is `'accepted'`. Defaults to null until consent is given.
- `src/app/[lang]/layout.tsx`: `<GoogleAnalytics />` added before `</body>` in root layout -- fires on every page.

### Affiliate Data Layer

- `content/affiliates.json`: Single source of truth for partner config. Contains Booking.com with `searchUrlTemplate`, `aid: "304142"`, and bilingual `disclosure` text.
- `src/lib/content/affiliates.ts`: Zod-validated at module level (build fails on invalid data). Exports `getAffiliatePartner`, `getAffiliatePartners`, `buildBookingUrl`. Default search dates: 2026-06-11 to 2026-06-18 (World Cup week 1).

### AffiliateLink Component

- `src/components/affiliate/AffiliateLink.tsx`: `'use client'` component. Renders `<a>` with `rel="nofollow sponsored noopener"`, `target="_blank"`. Fires `trackAffiliateClick` on click. Displays FTC disclosure text in `text-xs italic text-muted` adjacent to the link (not hidden in tooltip).

### Booking.com City Page Widgets

- `src/components/affiliate/BookingWidget.tsx`: Server component. Calls `getAffiliatePartner('booking')` -- returns null if partner not found or inactive. Builds contextual Booking.com search URL for the city. Renders styled card with `AffiliateLink` inside.
- `src/app/[lang]/ciudades/[slug]/page.tsx`: `sectionKeys.map()` replaced with `React.Fragment` pattern. After rendering the `'neighborhoods'` section, inserts `<BookingWidget>` with city name, slug, locale, and `dict.affiliate`. Applies to all 16 city pages.

### Affiliate Disclosure Pages

- `/es/divulgacion/` (`src/app/[lang]/divulgacion/page.tsx`): FTC-compliant Spanish disclosure. Sections: how we fund the site, what are affiliate links, our partners (Booking.com), editorial independence promise, contact.
- `/en/disclosure/` (`src/app/[lang]/disclosure/page.tsx`): FTC-compliant English disclosure. Same structure, English copy.
- Both pages use `generateStaticParams` returning single locale each and `buildPageMetadata` with cross-language `alternates`.

### i18n Updates

- `src/lib/i18n.ts`: Added `divulgacion`, `privacidad`, `acerca` to `pathTranslations` for future hreflang use.
- Dictionary `affiliate` keys added to both `es.json` and `en.json` (hotelsNear, searchHotels, fromPerNight, bookNow, disclosure, poweredBy).

## Deviations from Plan

None -- plan executed exactly as written. All Task 1 files were already present from a prior session; they were staged and committed as part of this plan execution. Task 2 was net-new work.

## Build Verification

- `npx tsc --noEmit`: No errors
- `npm run build`: 175/175 pages generated statically (includes /es/divulgacion and /en/disclosure)
- All acceptance criteria passed for both tasks

## Known Stubs

None. All data is wired: BookingWidget calls real `buildBookingUrl` with live Booking.com affiliate URL. Disclosure pages contain real FTC-compliant content. GA4 fires real events via `window.gtag`. Cookie consent gating defaults to false (correct behavior until Plan 02 adds the cookie banner UI -- this is intentional, not a stub).

## Self-Check: PASSED

Files exist:
- FOUND: src/lib/analytics.ts
- FOUND: src/components/analytics/GoogleAnalytics.tsx
- FOUND: content/affiliates.json
- FOUND: src/lib/content/affiliates.ts
- FOUND: src/components/affiliate/AffiliateLink.tsx
- FOUND: src/components/affiliate/BookingWidget.tsx
- FOUND: src/app/[lang]/divulgacion/page.tsx
- FOUND: src/app/[lang]/disclosure/page.tsx

Commits exist:
- FOUND: 485450c (Task 1 commit)
- FOUND: 6db264c (Task 2 commit)
