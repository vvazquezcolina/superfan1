---
phase: 03-city-guides
plan: 01
subsystem: content
tags: [zod, city-guides, i18n, next.js, ssg, json-content, seo]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "City data schema, JSON loaders, i18n helpers, SSG infrastructure"
  - phase: 02-layout-seo
    provides: "Layout, Header, Footer, Breadcrumbs, SEO helpers, sitemap"
provides:
  - "Extended CitySchema with CityContentSchema (overview, 7 sections, faq, sources)"
  - "CityHero, CitySection, CityFAQ reusable server components"
  - "Ciudad de Mexico reference implementation with ~1500 words ES + EN"
  - "City index page with country grouping and responsive grid"
  - "getCitiesByCountry() helper function"
  - "Dictionary city labels in both languages"
  - "15 placeholder cities with valid content passing schema validation"
affects: [03-city-guides, 04-stadiums, 06-monetization, 07-llm-optimization]

# Tech tracking
tech-stack:
  added: []
  patterns: [city-content-sections, native-html-accordion, server-component-cards]

key-files:
  created:
    - src/components/city/CityHero.tsx
    - src/components/city/CitySection.tsx
    - src/components/city/CityFAQ.tsx
    - src/app/[lang]/ciudades/page.tsx
  modified:
    - src/lib/content/schemas.ts
    - src/lib/content/cities.ts
    - content/cities.json
    - src/app/[lang]/ciudades/[slug]/page.tsx
    - src/app/[lang]/dictionaries/es.json
    - src/app/[lang]/dictionaries/en.json
    - src/app/sitemap.ts

key-decisions:
  - "Native HTML details/summary for FAQ accordion - zero client JS, accessible by default"
  - "CitySection splits content by double newline for paragraph rendering - simple, no markdown parser needed"
  - "Stadium name displayed by converting slug to title case - avoids needing a separate stadium lookup in city pages"
  - "City index uses country grouping order: Mexico first, then USA, then Canada - natural for Spanish-first audience"

patterns-established:
  - "City content sections pattern: JSON content -> CitySection component with id for anchor linking"
  - "Country flag emoji mapping via Record<string, string> object"
  - "Placeholder content pattern: brief but valid content passing Zod schema, to be replaced by subsequent plans"

requirements-completed: [CITY-01, CITY-03, CITY-04, LEGAL-03]

# Metrics
duration: 9min
completed: 2026-03-26
---

# Phase 03 Plan 01: City Guides Foundation Summary

**Extended CitySchema with 7 content sections, built 3 reusable city components, CDMX reference implementation with ~1500 words native Spanish, city index page grouping 16 cities by country**

## Performance

- **Duration:** 9 min
- **Started:** 2026-03-26T19:50:41Z
- **Completed:** 2026-03-26T20:00:09Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- Extended CitySchema with CityContentSchema containing overview, 7 editorial sections, FAQ array, and sources array with full Zod validation
- Ciudad de Mexico populated with ~1500 words of native Spanish editorial content covering transport, neighborhoods, food, safety, weather, cultural context, 5 FAQs, and cited sources
- City index page at /es/ciudades groups 16 cities by country (Mexico 3, USA 11, Canada 2) in responsive 3-column grid with city cards
- Full city detail page renders CityHero, 7 CitySection components, CityFAQ accordion, sources list, and navigation
- 15 non-CDMX cities have valid placeholder content passing schema validation
- Build produces 34 static routes (16 cities x 2 locales + 2 index pages)

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend CitySchema, create city components, update dictionaries** - `8bab0ff` (feat)
2. **Task 2: Populate CDMX content, placeholders, city page, index page** - `c602079` (feat)

## Files Created/Modified
- `src/lib/content/schemas.ts` - Added CitySectionSchema, CityFAQSchema, CitySourceSchema, CityContentSchema; extended CitySchema with content field
- `src/components/city/CityHero.tsx` - Hero banner with city name, flag, stadium link, overview excerpt, last updated
- `src/components/city/CitySection.tsx` - Reusable section component splitting content by paragraphs with anchor id
- `src/components/city/CityFAQ.tsx` - FAQ accordion using native HTML details/summary elements
- `content/cities.json` - All 16 cities with content field; CDMX with full editorial, 15 with placeholders
- `src/lib/content/cities.ts` - Added getCitiesByCountry() helper
- `src/app/[lang]/ciudades/[slug]/page.tsx` - Full city page with all components, sources, navigation
- `src/app/[lang]/ciudades/page.tsx` - City index page with country grouping and responsive grid
- `src/app/[lang]/dictionaries/es.json` - Added city section labels in Spanish
- `src/app/[lang]/dictionaries/en.json` - Added city section labels in English
- `src/app/sitemap.ts` - Added city index page entries with hreflang alternates

## Decisions Made
- Used native HTML `<details>/<summary>` for FAQ accordion instead of a client-side library -- zero JS, accessible, works without hydration
- Stadium name in CityHero derived from slug with title-case conversion rather than loading stadium data -- avoids circular dependency, sufficient for display
- Content paragraphs split by `\n\n` delimiter -- simpler than markdown parsing, sufficient for structured editorial text
- City index ordered Mexico -> USA -> Canada to match the Spanish-first audience priority

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

The 15 non-CDMX cities have intentional placeholder content (1-2 sentences per section) that passes schema validation. These are explicitly planned to be replaced by:
- **03-02-PLAN**: Monterrey and Guadalajara full content
- **03-03-PLAN**: US cities group 1 full content
- **03-04-PLAN**: US cities group 2 full content
- **03-05-PLAN**: Canadian cities full content

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Content architecture fully established -- plans 02-05 write content against this schema
- CitySection and CityFAQ components reusable for all 16 cities
- CDMX serves as exemplar showing expected content depth and quality
- City index page will automatically display content as cities are populated

## Self-Check: PASSED

- All 11 created/modified files verified on disk
- Commit 8bab0ff (Task 1) verified in git log
- Commit c602079 (Task 2) verified in git log

---
*Phase: 03-city-guides*
*Completed: 2026-03-26*
