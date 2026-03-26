---
phase: 09-lead-capture-engagement
plan: 01
subsystem: engagement
tags: [newsletter, exit-intent, countdown, search, pagefind, analytics]
dependency_graph:
  requires: [06-01, 06-02]
  provides: [LEAD-01, LEAD-02, LEAD-03]
  affects: [src/app/[lang]/page.tsx, src/components/layout/Header.tsx]
tech_stack:
  added: [pagefind]
  patterns: [portal-overlay, exit-intent, debounced-search, countdown-timer, client-island]
key_files:
  created:
    - src/components/engagement/NewsletterSignup.tsx
    - src/components/engagement/ExitIntentWrapper.tsx
    - src/components/engagement/CountdownTimer.tsx
    - src/components/engagement/SearchModal.tsx
    - src/components/engagement/SearchButton.tsx
  modified:
    - src/app/[lang]/page.tsx
    - src/components/layout/Header.tsx
    - src/app/[lang]/dictionaries/es.json
    - src/app/[lang]/dictionaries/en.json
    - package.json
decisions:
  - "No backend email submission for newsletter — GA4 event only, TODO comment for Resend/Buttondown"
  - "Pagefind invoked via npx (not installed in node_modules) to avoid large binary dependency"
  - "SearchModal is self-contained with trigger button — avoids state-sharing between Server Component Header and client modal"
  - "exit-intent-shown sessionStorage key prevents repeat popup within same session"
  - "CountdownTimer hydrates from server-rendered initialDays to prevent layout shift"
metrics:
  duration: 4min
  completed_date: "2026-03-26"
  tasks_completed: 3
  files_changed: 10
requirements_satisfied: [LEAD-01, LEAD-02, LEAD-03]
---

# Phase 09 Plan 01: Lead Capture + Engagement Summary

**One-liner:** Newsletter signup with exit-intent popup, live countdown timer replacing static hero day count, and Pagefind-powered site search triggered from header on desktop and mobile.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | NewsletterSignup + ExitIntentWrapper + dictionary keys | f3be88e | NewsletterSignup.tsx, ExitIntentWrapper.tsx, es.json, en.json |
| 2 | CountdownTimer + homepage integration | 1b4b6bc | CountdownTimer.tsx, page.tsx |
| 3 | Pagefind search — SearchModal, Header, postbuild script | 6c41ffb | SearchModal.tsx, SearchButton.tsx, Header.tsx, package.json |

## What Was Built

### NewsletterSignup (inline + popup)
- `'use client'` component with controlled form state (name, email, status)
- Validates name non-empty and email contains '@' before submission
- Calls `trackNewsletterSignup()` from `src/lib/analytics.ts` on valid submit
- No backend POST — GA4 event only, TODO comment for future email provider wiring
- Shows green checkmark + success message on submission
- Two variants: `'inline'` (on homepage) and `'popup'` (rendered by ExitIntentWrapper)
- Optional `dismissLabel` and `onDismiss` prop for popup variant

### ExitIntentWrapper
- `'use client'` component using `React.createPortal` into `document.body`
- Desktop trigger: `mouseleave` on `document` where `e.clientY < 10`
- Mobile trigger: `scroll` on `window` where `scrollY / body.scrollHeight >= 0.6`
- Mobile detection: `window.innerWidth < 768`
- Session deduplication: `sessionStorage.getItem('exit-intent-shown')` prevents repeat
- Overlay: `fixed inset-0 bg-black/50 z-50` with backdrop-click dismiss
- Inner container: `bg-white dark:bg-neutral-900 rounded-xl max-w-md` with shadow
- Escape key closes the popup

### CountdownTimer
- `'use client'` component with `setInterval(1000)` for live ticking
- Props: `targetDate` (ISO string), `initialDays` (SSR value), `dict`
- Initialized from `initialDays` to prevent layout shift before hydration
- 4-column grid layout with colon dividers (hidden on smallest breakpoint)
- When `diff <= 0`: renders `dict.started` text instead of countdown
- No date-fns dependency — plain `Date` arithmetic per Phase 04 decision

### SearchModal (Pagefind-powered)
- Self-contained component: includes both trigger button and modal
- Dynamic import of `/pagefind/pagefind.js` on first open (`webpackIgnore: true` comment)
- Gracefully shows `notAvailableInDev` message when pagefind index not found (dev mode)
- Module-level caching (`pagefindModule`, `pagefindLoadAttempted`) avoids repeat loading
- 300ms debounced search via `setTimeout`/`clearTimeout` pattern
- Top-10 results rendered as links with title + excerpt
- Portal overlay: `fixed inset-0 bg-black/60 z-[100]`
- Escape key and backdrop-click close; input auto-focuses on open
- Inline `PagefindModule` type declaration (no @types/pagefind)

### Pagefind Integration
- `postbuild` script in `package.json`: `npx pagefind --site .next/server/app --output-path public/pagefind`
- Runs automatically after `npm run build`
- Indexed 175 pages across 2 languages (ES/EN) in 0.266 seconds
- Generates `/public/pagefind/pagefind.js` served statically by Next.js

### Dictionary Keys Added
Both `es.json` and `en.json` received three new top-level keys:
- `newsletter`: heading, subheading, placeholders, button, success, dismiss, privacy note
- `countdown`: days, hours, minutes, seconds, label, started
- `search`: label, placeholder, noResults, loading, notAvailableInDev, closeLabel

### Header Updates
- Extended `HeaderProps.dict` to include `search` key
- Added `<SearchModal dict={dict.search} />` to desktop nav (after language switcher)
- Added `<SearchModal dict={dict.search} />` to mobile section (before MobileNav)
- Mobile section changed from single element to `flex items-center gap-2` wrapper

## Build Verification

Build completed successfully:
- TypeScript: no errors
- Static pages generated: 181
- Pagefind index: 175 pages indexed, 8216 words
- `public/pagefind/pagefind.js`: created

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| No backend email submission | Per D-01: collect in Google Form/Sheets. GA4 event fires immediately, backend wiring deferred to Resend/Buttondown when ready |
| Pagefind via npx, not dependency | Avoids large binary in node_modules. `npx pagefind` downloads on first use, then cached |
| SearchModal self-contained with trigger button | Header is a Server Component — cannot hold `isOpen` state. Self-contained modal avoids creating a separate client context provider |
| SearchButton.tsx as pass-through shim | Keeps clean Header import path while SearchModal remains the single source of truth |
| Module-level pagefind caching | Prevents re-downloading/re-initializing pagefind on every modal open within the same page session |
| `initialDays` prop on CountdownTimer | Server renders day count as SSR prop, client hydrates exactly to it — no flash of "0 days" |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None. All components are fully functional:
- NewsletterSignup fires a real GA4 event on submit and shows success state
- CountdownTimer ticks live with accurate date math
- SearchModal queries the real Pagefind index (after build) or shows dev warning

## Self-Check: PASSED

Files confirmed created:
- `src/components/engagement/NewsletterSignup.tsx` - EXISTS
- `src/components/engagement/ExitIntentWrapper.tsx` - EXISTS
- `src/components/engagement/CountdownTimer.tsx` - EXISTS
- `src/components/engagement/SearchModal.tsx` - EXISTS
- `src/components/engagement/SearchButton.tsx` - EXISTS
- `public/pagefind/pagefind.js` - EXISTS

Commits confirmed:
- `f3be88e` - feat(09-01): newsletter signup + exit-intent wrapper + dictionary keys
- `1b4b6bc` - feat(09-01): countdown timer component + homepage integration
- `6c41ffb` - feat(09-01): pagefind search modal + header integration + postbuild script
