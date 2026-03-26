---
phase: 02-base-layout-technical-seo
plan: 03
subsystem: seo
tags: [breadcrumbs, json-ld, schema-org, structured-data, navigation]

# Dependency graph
requires:
  - phase: 02-base-layout-technical-seo
    provides: Layout shell with Header/Footer, dictionaries with breadcrumb labels
provides:
  - Breadcrumb utility (generateBreadcrumbs, buildBreadcrumbJsonLd)
  - Breadcrumbs visual component for text-based navigation trail
  - BreadcrumbList JSON-LD on all content pages (cities, stadiums, teams)
  - WebSite JSON-LD on homepage
  - Semantic article elements wrapping content pages
affects: [city-content, stadium-content, team-content, llm-optimization]

# Tech tracking
tech-stack:
  added: []
  patterns: [page-level breadcrumb generation, JSON-LD injection via script tag, dictionary-driven localized labels]

key-files:
  created:
    - src/lib/breadcrumbs.ts
    - src/components/layout/Breadcrumbs.tsx
  modified:
    - src/app/[lang]/ciudades/[slug]/page.tsx
    - src/app/[lang]/estadios/[slug]/page.tsx
    - src/app/[lang]/equipos/[slug]/page.tsx
    - src/app/[lang]/page.tsx

key-decisions:
  - "Breadcrumbs rendered at page level (not layout) because each page knows its entity name and layout Server Components cannot access current URL path"
  - "English URL segments mapped in SEGMENT_TO_DICT_KEY alongside Spanish for bilingual breadcrumb support"
  - "Last JSON-LD BreadcrumbList item omits item URL per Schema.org convention for current page"

patterns-established:
  - "Page-level breadcrumb pattern: each page generates its own breadcrumbs using generateBreadcrumbs + dictionary labels + entity name"
  - "JSON-LD injection pattern: script type=application/ld+json with dangerouslySetInnerHTML in page component"
  - "WebSite JSON-LD on homepage for site-level structured data"

requirements-completed: [SEO-05]

# Metrics
duration: 2min
completed: 2026-03-26
---

# Phase 02 Plan 03: Breadcrumbs and JSON-LD Summary

**Localized text-based breadcrumbs on all content pages with BreadcrumbList JSON-LD for search engine rich results and WebSite JSON-LD on homepage**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-26T19:32:28Z
- **Completed:** 2026-03-26T19:35:06Z
- **Tasks:** 3 (2 auto + 1 auto-approved checkpoint)
- **Files modified:** 6

## Accomplishments
- Breadcrumb utility library generates localized breadcrumb items from URL paths with dictionary-driven labels
- BreadcrumbList JSON-LD schema markup injected on all content pages for Google rich results
- Accessible Breadcrumbs component with aria-label="Breadcrumb" and aria-current="page"
- Homepage has WebSite JSON-LD for site-level structured data (no visual breadcrumbs per spec)
- Content pages wrapped in semantic article elements for improved HTML structure

## Task Commits

Each task was committed atomically:

1. **Task 1: Create breadcrumb utility library and Breadcrumbs component** - `208dc47` (feat)
2. **Task 2: Integrate breadcrumbs and JSON-LD into all content pages** - `3860343` (feat)
3. **Task 3: Visual verification** - auto-approved (auto mode)

## Files Created/Modified
- `src/lib/breadcrumbs.ts` - Breadcrumb generation from URL paths and BreadcrumbList JSON-LD builder
- `src/components/layout/Breadcrumbs.tsx` - Accessible text-based breadcrumb trail component
- `src/app/[lang]/ciudades/[slug]/page.tsx` - City pages with breadcrumbs, JSON-LD, article wrapper
- `src/app/[lang]/estadios/[slug]/page.tsx` - Stadium pages with breadcrumbs, JSON-LD, article wrapper
- `src/app/[lang]/equipos/[slug]/page.tsx` - Team pages with breadcrumbs, JSON-LD, article wrapper
- `src/app/[lang]/page.tsx` - Homepage with WebSite JSON-LD (no visual breadcrumbs)

## Decisions Made
- Breadcrumbs rendered at page level (not layout) because each page knows its entity name and layout Server Components cannot access current URL path
- English URL segments mapped alongside Spanish in SEGMENT_TO_DICT_KEY for bilingual breadcrumb support
- Last JSON-LD BreadcrumbList item omits item URL per Schema.org convention for current page

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Complete Phase 2 layout, navigation, technical SEO, and breadcrumbs are in place
- All content pages have structured data (BreadcrumbList JSON-LD) for search engine rich results
- Homepage has WebSite JSON-LD for site-level identity
- Ready for Phase 3 content development with full SEO infrastructure

## Self-Check: PASSED

All 7 files verified as existing on disk. Both task commits (208dc47, 3860343) found in git history.

---
*Phase: 02-base-layout-technical-seo*
*Completed: 2026-03-26*
