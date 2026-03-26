---
phase: 04-stadium-pages-homepage
plan: 01
subsystem: content
tags: [stadium, zod, next.js, ssg, bilingual, json-ld, sitemap]

# Dependency graph
requires:
  - phase: 03-city-guides
    provides: CityContentSchema pattern, city components, getCityById for cross-linking
  - phase: 02-layout-seo
    provides: buildPageMetadata, Breadcrumbs, buildAlternates, sitemap structure
provides:
  - StadiumContentSchema with 5 editorial sections, FAQ, sources
  - StadiumHero, StadiumSection, StadiumFAQ components
  - Stadium index page at /es/estadios/ and /en/stadiums/
  - Full stadium detail pages with all content sections
  - getStadiumsByCountry() loader function
  - 8 stadiums with full bilingual editorial content (3 Mexico + 5 USA)
  - 8 stadiums with valid placeholder content
affects: [04-02 (remaining 8 stadiums), homepage]

# Tech tracking
tech-stack:
  added: []
  patterns: [stadium content schema mirroring city pattern, stadium component namespace]

key-files:
  created:
    - src/components/stadium/StadiumHero.tsx
    - src/components/stadium/StadiumSection.tsx
    - src/components/stadium/StadiumFAQ.tsx
    - src/app/[lang]/estadios/page.tsx
  modified:
    - src/lib/content/schemas.ts
    - src/lib/content/stadiums.ts
    - content/stadiums.json
    - src/app/[lang]/estadios/[slug]/page.tsx
    - src/app/[lang]/dictionaries/es.json
    - src/app/[lang]/dictionaries/en.json
    - src/app/sitemap.ts

key-decisions:
  - "Reused CitySectionSchema/CityFAQSchema/CitySourceSchema directly in StadiumContentSchema -- same shape, no need for separate stadium sub-schemas"
  - "Stadium components in separate /stadium/ namespace despite being structurally identical to city components -- clearer code organization for future divergence"
  - "Added placeholder content to all 16 stadiums in Task 1 to satisfy Zod validation at build time before Task 2 populated full content"

patterns-established:
  - "Stadium content mirrors city content: overview + N sections + FAQ + sources"
  - "Stadium index page groups by country using getStadiumsByCountry() which looks up city.country"

requirements-completed: [STAD-01, STAD-02, STAD-03]

# Metrics
duration: 17min
completed: 2026-03-26
---

# Phase 04 Plan 01: Stadium Pages Summary

**StadiumContentSchema with 5 editorial sections, 3 stadium components, index page, and full bilingual content for 8 stadiums (Azteca, BBVA, Akron, MetLife, SoFi, AT&T, NRG, Mercedes-Benz)**

## Performance

- **Duration:** 17 min
- **Started:** 2026-03-26T21:01:24Z
- **Completed:** 2026-03-26T21:18:34Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- Extended StadiumSchema with StadiumContentSchema (overview, gettingThere, seatingGuide, nearbyHotels, accessibility, matchSchedule, faq, sources)
- Created 3 stadium components (StadiumHero, StadiumSection, StadiumFAQ) following city component patterns
- Built stadium index page at /es/estadios/ grouping 16 stadiums by country (Mexico, USA, Canada)
- Rewrote stadium detail page with full component rendering, cross-link to host city, breadcrumbs, JSON-LD
- Wrote full bilingual editorial content (~800-1200 words each) for 8 stadiums: 3 Mexico (Azteca, BBVA, Akron) + 5 USA (MetLife, SoFi, AT&T, NRG, Mercedes-Benz)
- Added valid placeholder content for remaining 8 stadiums passing Zod schema validation
- Updated sitemap with stadium index page entries including hreflang alternates
- Build produces 171 static pages including 34 stadium routes (16 x 2 locales + 2 index pages)

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend StadiumSchema, create stadium components, add dictionary labels, update loader** - `3cb0883` (feat)
2. **Task 2: Populate 8 stadium contents, update stadium page and index, update sitemap** - `b57ee23` (feat)

## Files Created/Modified
- `src/lib/content/schemas.ts` - Added StadiumContentSchema, StadiumContent type
- `src/lib/content/stadiums.ts` - Added getStadiumsByCountry() with city country lookup
- `src/components/stadium/StadiumHero.tsx` - Stadium hero with name, capacity, host city link
- `src/components/stadium/StadiumSection.tsx` - Reusable section with paragraph splitting
- `src/components/stadium/StadiumFAQ.tsx` - FAQ accordion with details/summary
- `src/app/[lang]/estadios/page.tsx` - Stadium index page with country grouping
- `src/app/[lang]/estadios/[slug]/page.tsx` - Full stadium detail page with all sections
- `src/app/[lang]/dictionaries/es.json` - Added stadium dictionary labels (17 keys)
- `src/app/[lang]/dictionaries/en.json` - Added stadium dictionary labels (17 keys)
- `src/app/sitemap.ts` - Added stadium index entries with hreflang
- `content/stadiums.json` - Added content field to all 16 stadiums (8 full + 8 placeholder)

## Decisions Made
- Reused CitySectionSchema, CityFAQSchema, CitySourceSchema directly in StadiumContentSchema since they have identical shape -- avoids duplication
- Created separate stadium component files (StadiumHero, StadiumSection, StadiumFAQ) despite being structurally similar to city components -- keeps namespace clean and allows future divergence
- Added placeholder content to all 16 stadiums during Task 1 so schema validation passes at build time -- needed because StadiumSchema now requires content field

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added placeholder content to stadiums.json in Task 1**
- **Found during:** Task 1 (Schema extension)
- **Issue:** Adding content field to StadiumSchema causes Zod validation to fail at import time because stadiums.json doesn't have content fields yet. Task 2 was supposed to add content, but TypeScript/Zod won't compile without it.
- **Fix:** Added minimal placeholder content to all 16 stadiums during Task 1 so schema validation passes. Task 2 then replaced with full editorial content.
- **Files modified:** content/stadiums.json
- **Verification:** npx tsc --noEmit passes cleanly
- **Committed in:** 3cb0883 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary to satisfy build-time Zod validation. No scope creep -- content was replaced in Task 2 as planned.

## Issues Encountered
None beyond the deviation documented above.

## User Setup Required
None - no external service configuration required.

## Known Stubs
The following 8 stadiums have placeholder content that will be replaced in Plan 04-02:
- Lincoln Financial Field (content/stadiums.json)
- Hard Rock Stadium (content/stadiums.json)
- Lumen Field (content/stadiums.json)
- Levi's Stadium (content/stadiums.json)
- Arrowhead Stadium (content/stadiums.json)
- Gillette Stadium (content/stadiums.json)
- BMO Field (content/stadiums.json)
- BC Place (content/stadiums.json)

These stubs are intentional -- Plan 04-02 will replace them with full editorial content. They pass Zod schema validation and render valid (if brief) pages.

## Next Phase Readiness
- Stadium content architecture fully established -- Plan 04-02 can add remaining 8 stadium contents without any schema/component changes
- All 16 stadium routes render correctly with valid content
- Cross-linking between stadium pages and city guides works bidirectionally
- Homepage (Plan 04-02) can now link to the stadium index page

## Self-Check: PASSED

All 9 key files verified present. Both task commits (3cb0883, b57ee23) verified in git log. Build succeeds with 171 static pages.

---
*Phase: 04-stadium-pages-homepage*
*Completed: 2026-03-26*
