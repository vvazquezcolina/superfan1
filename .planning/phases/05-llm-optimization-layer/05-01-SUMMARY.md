---
phase: 05-llm-optimization-layer
plan: 01
subsystem: seo
tags: [json-ld, schema-dts, structured-data, schema.org, llm-optimization]

# Dependency graph
requires:
  - phase: 03-city-content-pages
    provides: "City pages with content, FAQ, and breadcrumbs"
  - phase: 04-stadium-content-pages
    provides: "Stadium pages with content, FAQ, and breadcrumbs"
provides:
  - "Centralized JSON-LD factory (src/lib/jsonld.ts) with 7+ type-safe builders"
  - "Stacked JSON-LD schemas on all 6 page types (17 total schema blocks)"
  - "schema-dts dependency for type-safe Schema.org generation"
affects: [05-llm-optimization-layer, seo, llm-citations]

# Tech tracking
tech-stack:
  added: [schema-dts]
  patterns: [json-ld-factory, schema-stacking, type-safe-structured-data]

key-files:
  created:
    - src/lib/jsonld.ts
  modified:
    - package.json
    - src/app/[lang]/ciudades/[slug]/page.tsx
    - src/app/[lang]/estadios/[slug]/page.tsx
    - src/app/[lang]/equipos/[slug]/page.tsx
    - src/app/[lang]/page.tsx
    - src/app/[lang]/ciudades/page.tsx
    - src/app/[lang]/estadios/page.tsx

key-decisions:
  - "Used 'as WithContext<T>' type assertions for JSON-LD objects since schema-dts property types are complex union types that don't accept plain object literals directly"
  - "Kept homepage WebSite JSON-LD inline (uses dict strings) and added Organization + ItemList alongside it"
  - "ItemList on homepage includes both featured cities and featured stadiums as combined list"
  - "Organization description is hardcoded bilingual (not from dict) to keep jsonld.ts self-contained"

patterns-established:
  - "JSON-LD factory pattern: all structured data built via src/lib/jsonld.ts factory functions"
  - "Schema stacking pattern: multiple <script type='application/ld+json'> tags per page, grouped before Breadcrumbs component"
  - "Type-safe JSON-LD: all builders use WithContext<T> from schema-dts"

requirements-completed: [LLM-01, LLM-04]

# Metrics
duration: 4min
completed: 2026-03-26
---

# Phase 05 Plan 01: Structured Data JSON-LD Summary

**Type-safe JSON-LD schema stacking on all 6 page types using schema-dts factory functions (17 total schema blocks across city, stadium, team, homepage, and index pages)**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-26T21:44:44Z
- **Completed:** 2026-03-26T21:49:00Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Installed schema-dts for type-safe Schema.org JSON-LD generation
- Created centralized factory module (src/lib/jsonld.ts) with 7 builder functions + 1 helper
- Stacked JSON-LD on all page types: city detail (4), stadium detail (4), team detail (2), homepage (3), city index (2), stadium index (2)
- Build passes with zero errors on all 200+ statically generated pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Install schema-dts and create centralized JSON-LD factory** - `d86b800` (feat)
2. **Task 2: Stack JSON-LD schemas on all 6 page types** - `be1c0f5` (feat)

## Files Created/Modified
- `src/lib/jsonld.ts` - Centralized JSON-LD factory with 7 builders: Place, StadiumOrArena, SportsTeam, FAQPage, Article, Organization, ItemList
- `package.json` - Added schema-dts dependency
- `src/app/[lang]/ciudades/[slug]/page.tsx` - Added Place + FAQPage + Article JSON-LD
- `src/app/[lang]/estadios/[slug]/page.tsx` - Added StadiumOrArena + FAQPage + Article JSON-LD
- `src/app/[lang]/equipos/[slug]/page.tsx` - Added SportsTeam JSON-LD
- `src/app/[lang]/page.tsx` - Added Organization + ItemList JSON-LD
- `src/app/[lang]/ciudades/page.tsx` - Added ItemList JSON-LD for all 16 cities
- `src/app/[lang]/estadios/page.tsx` - Added ItemList JSON-LD for all 16 stadiums

## Decisions Made
- Used `as WithContext<T>` type assertions for JSON-LD objects since schema-dts property types are complex union types (SchemaValue wrappers) that don't accept plain object literals directly. The runtime output is correct JSON-LD.
- Kept homepage WebSite JSON-LD inline since it depends on dictionary strings; added Organization and ItemList via jsonld.ts factory alongside it.
- Homepage ItemList combines featured cities and featured stadiums into a single list.
- Organization description is hardcoded bilingual in jsonld.ts (not from dictionary) to keep the factory self-contained without async dict loading.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All page types now emit rich stacked JSON-LD for search engines and LLM crawlers
- Ready for Plan 02 (llms.txt / llms-full.txt generation) which builds on the same LLM optimization layer
- FAQPage schema on city and stadium pages drives 3.1x higher answer extraction per research

## Self-Check: PASSED

- FOUND: src/lib/jsonld.ts
- FOUND: 05-01-SUMMARY.md
- FOUND: d86b800 (Task 1 commit)
- FOUND: be1c0f5 (Task 2 commit)

---
*Phase: 05-llm-optimization-layer*
*Completed: 2026-03-26*
