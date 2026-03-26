# Phase 9: Lead Capture & Engagement - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Newsletter signup forms (inline + exit-intent), countdown timer to tournament start, and site-wide search functionality.

</domain>

<decisions>
## Implementation Decisions

### Newsletter
- **D-01:** Simple form: name + email. No backend — use Resend or Buttondown free tier, or just collect in a Google Form/Sheets for now.
- **D-02:** Inline signup in content pages (after main content, before footer).
- **D-03:** Exit-intent popup on desktop. Scroll-triggered on mobile.
- **D-04:** GA4 event on successful signup via trackNewsletterSignup().
- **D-05:** Spanish/English copy localized.

### Countdown Timer
- **D-06:** Countdown to June 11, 2026 (tournament start).
- **D-07:** Server-rendered initial state (days calculation), client hydration for live updates.
- **D-08:** Shows on homepage hero and can be embedded on other pages.

### Search
- **D-09:** Client-side search using Pagefind (free, static site search).
- **D-10:** Search indexes all content pages at build time.
- **D-11:** Search UI: modal triggered from header nav search icon.

### Claude's Discretion
- Newsletter form styling and placement details
- Countdown timer visual design
- Search index configuration
- Whether to use Pagefind or a simpler custom search

</decisions>

<canonical_refs>
## Canonical References

- `src/components/layout/Header.tsx` — Add search trigger
- `src/app/[lang]/page.tsx` — Homepage for countdown
- `src/lib/analytics.ts` — trackNewsletterSignup, trackToolUsage
- `.planning/REQUIREMENTS.md` — LEAD-01, LEAD-02, LEAD-03

</canonical_refs>

<deferred>
## Deferred Ideas

None

</deferred>

---
*Phase: 09-lead-capture-engagement*
*Context gathered: 2026-03-26*
