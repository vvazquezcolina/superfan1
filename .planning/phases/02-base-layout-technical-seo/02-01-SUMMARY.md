---
phase: 02-base-layout-technical-seo
plan: 01
subsystem: ui
tags: [tailwind-v4, layout, header, footer, mobile-nav, i18n, responsive]

# Dependency graph
requires:
  - phase: 01-nextjs-foundation
    provides: Root layout, dictionary loader, i18n config, locale routing
provides:
  - Sticky Header component with desktop nav and mobile hamburger trigger
  - Footer component with multi-column grid and FIFA disclaimer
  - MobileNav client component with slide-in panel
  - Tailwind v4 green/gold color theme tokens
  - Extended dictionaries with footer sections, links, and breadcrumb labels
affects: [03-city-pages, 04-stadium-pages, 05-team-pages, 06-monetization]

# Tech tracking
tech-stack:
  added: []
  patterns: [server-component-with-client-island, locale-aware-nav-paths, css-custom-properties-to-tailwind-theme]

key-files:
  created:
    - src/components/layout/Header.tsx
    - src/components/layout/Footer.tsx
    - src/components/layout/MobileNav.tsx
  modified:
    - src/app/globals.css
    - src/app/[lang]/layout.tsx
    - src/app/[lang]/dictionaries/es.json
    - src/app/[lang]/dictionaries/en.json
    - src/app/[lang]/page.tsx

key-decisions:
  - "Header is a Server Component with MobileNav as a client island for toggle state"
  - "Nav paths hardcoded with locale-aware mapping (viajes/travel, herramientas/tools) since pathTranslations does not cover all sections yet"
  - "Footer about/privacy/disclosure paths use simple lang-prefixed paths without translation (future pages)"

patterns-established:
  - "Server Component layout with client island: Header renders server-side, MobileNav handles client state"
  - "Locale-aware navigation: getNavLinks helper maps lang to correct path segments"
  - "CSS custom properties in :root consumed by @theme inline for Tailwind v4 utility class generation"

requirements-completed: [INFRA-05, SEO-03, SEO-06, LEGAL-01]

# Metrics
duration: 3min
completed: 2026-03-26
---

# Phase 02 Plan 01: Shared Layout Summary

**Sticky green/gold header with responsive mobile nav, multi-column footer with FIFA disclaimer, and Tailwind v4 theme tokens for the design system**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-26T19:27:04Z
- **Completed:** 2026-03-26T19:29:32Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Configured Tailwind v4 CSS-first theme with green (#1a472a) primary and gold (#d4af37) accent custom properties
- Created Header, Footer, and MobileNav components with full bilingual support
- Integrated layout shell into root layout with sticky header, flex-column body, and bottom-anchored footer
- Extended ES/EN dictionaries with footer section headers, legal links, and breadcrumb labels

## Task Commits

Each task was committed atomically:

1. **Task 1: Configure Tailwind v4 theme, extend dictionaries, create Header, Footer, and MobileNav components** - `d9fd18e` (feat)
2. **Task 2: Integrate Header and Footer into root layout, verify responsive rendering** - `ded0344` (feat)

## Files Created/Modified
- `src/app/globals.css` - Tailwind v4 theme with green/gold CSS custom properties and @theme inline block
- `src/components/layout/Header.tsx` - Sticky header with logo, desktop nav links, language switcher, and mobile hamburger trigger
- `src/components/layout/Footer.tsx` - Multi-column footer with explore/info/legal sections, FIFA disclaimer, and copyright
- `src/components/layout/MobileNav.tsx` - Client component with slide-in panel, route-change auto-close, and body scroll lock
- `src/app/[lang]/layout.tsx` - Root layout integrating Header and Footer with flex column min-h-screen body
- `src/app/[lang]/dictionaries/es.json` - Extended with footer.sections, footer.links, and breadcrumbs keys
- `src/app/[lang]/dictionaries/en.json` - Extended with footer.sections, footer.links, and breadcrumbs keys
- `src/app/[lang]/page.tsx` - Changed main to div to avoid nested main tags

## Decisions Made
- Header is a Server Component; only MobileNav uses `'use client'` for toggle state -- minimizes client JS
- Nav paths include viajes/travel and herramientas/tools which are not yet in `pathTranslations` in i18n.ts -- hardcoded in components for now, will be added to pathTranslations when those routes are created
- Footer about/privacy/disclosure links point to simple `/${lang}/about` etc. -- pages do not exist yet, will be created in later phases

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed nested main tag in page.tsx**
- **Found during:** Task 2 (layout integration)
- **Issue:** page.tsx wrapped content in `<main>` but layout.tsx also wraps children in `<main>`, creating invalid nested main elements
- **Fix:** Changed page.tsx outer element from `<main>` to `<div>`
- **Files modified:** `src/app/[lang]/page.tsx`
- **Verification:** Build passes, valid HTML structure
- **Committed in:** ded0344 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Minor HTML fix necessary for correctness. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Layout shell complete and rendering on all pages
- Breadcrumb component and technical SEO (sitemap, robots, metadata, JSON-LD) ready for Plan 02 and 03
- Footer links to about/privacy/disclosure pages are in place but pages do not exist yet (future phases)

## Self-Check: PASSED

All 8 files verified present. Both task commits (d9fd18e, ded0344) verified in git history.

---
*Phase: 02-base-layout-technical-seo*
*Completed: 2026-03-26*
