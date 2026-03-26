# Phase 6: Monetization & Analytics - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

GA4 integration, centralized affiliate link system, Booking.com hotel widgets on city pages, affiliate disclosure page, privacy policy, cookie consent, and About page. Get revenue flowing.

</domain>

<decisions>
## Implementation Decisions

### GA4 Analytics
- **D-01:** GA4 Measurement ID: G-HMRJTYPDPP. Use @next/third-parties GoogleAnalytics component.
- **D-02:** Track: page views (auto), affiliate clicks (custom event), newsletter signups (custom event), tool usage (custom event).
- **D-03:** GA4 script loads only after cookie consent.

### Affiliate System
- **D-04:** Centralized `affiliates.json` config with partner URLs, IDs, and disclosure text.
- **D-05:** `<AffiliateLink>` client component with: rel="nofollow sponsored", GA4 event tracking, adjacent disclosure text.
- **D-06:** Primary partner: Booking.com (instant approval). Deep links to city-specific hotel searches.
- **D-07:** Booking.com search widgets embedded contextually in city guide pages (in "Where to Stay" sections).

### Legal Compliance
- **D-08:** Affiliate disclosure page at `/es/divulgacion/` and `/en/disclosure/` with FTC-compliant language in both languages.
- **D-09:** Privacy policy page at `/es/privacidad/` and `/en/privacy/` covering GA4, cookies, affiliate data.
- **D-10:** Cookie consent banner — simple banner at bottom, accept/reject, stores preference in localStorage.
- **D-11:** About page with project description, editorial independence, contact info.

### Claude's Discretion
- Exact Booking.com widget configuration
- Cookie consent banner styling
- Privacy policy content details
- GA4 custom event naming conventions

</decisions>

<canonical_refs>
## Canonical References

- `.planning/research/PITFALLS.md` — FTC compliance ($51K/violation), affiliate disclosure requirements
- `.planning/research/FEATURES.md` — Affiliate monetization features
- `src/app/[lang]/ciudades/[slug]/page.tsx` — City pages to add affiliate widgets
- `src/lib/seo.ts` — SEO helpers
- `.planning/REQUIREMENTS.md` — MON-01 through MON-08, LEGAL-02

</canonical_refs>

<specifics>
## Specific Ideas

- Affiliate links should feel helpful, not spammy — "Hotels near Estadio Azteca from $X/night"
- Disclosure must be clear and honest — "We may earn a commission"

</specifics>

<deferred>
## Deferred Ideas

None

</deferred>

---
*Phase: 06-monetization-analytics*
*Context gathered: 2026-03-26*
