---
phase: 02-base-layout-technical-seo
plan: 02
subsystem: seo
tags: [sitemap, robots, open-graph, twitter-cards, canonical-urls, metadata, hreflang]

# Dependency graph
requires:
  - phase: 01-data-foundation
    provides: "Content data loaders (getCities, getStadiums, getTeams) and i18n helpers (buildAlternates, buildHomeAlternates)"
provides:
  - "Dynamic sitemap.xml with hreflang alternates for all pages"
  - "Programmatic robots.txt allowing all crawlers including AI bots"
  - "buildPageMetadata helper for consistent OG, Twitter Card, and canonical URL metadata"
  - "All existing pages enhanced with canonical URLs, Open Graph, and Twitter Cards"
affects: [03-city-content, 04-stadium-content, 05-team-content, 07-llm-optimization]

# Tech tracking
tech-stack:
  added: []
  patterns: [buildPageMetadata for consistent per-page SEO metadata, Next.js built-in sitemap.ts and robots.ts conventions]

key-files:
  created:
    - src/app/sitemap.ts
    - src/app/robots.ts
    - src/lib/seo.ts
  modified:
    - src/app/[lang]/page.tsx
    - src/app/[lang]/ciudades/[slug]/page.tsx
    - src/app/[lang]/estadios/[slug]/page.tsx
    - src/app/[lang]/equipos/[slug]/page.tsx

key-decisions:
  - "Homepage title uses tagline instead of dict.home.title to avoid redundant site name duplication with layout template"
  - "Priority levels: 1.0 homepage, 0.9 cities, 0.8 stadiums, 0.7 teams per D-16"
  - "robots.txt has wildcard allow with no AI crawler restrictions per PITFALLS.md recommendation"
  - "Description truncated to 155 chars in buildPageMetadata per D-20"

patterns-established:
  - "buildPageMetadata pattern: all pages import from @/lib/seo and pass title, description, lang, path, alternates"
  - "New pages must call buildPageMetadata in generateMetadata for consistent OG/Twitter/canonical metadata"

requirements-completed: [SEO-01, SEO-02, SEO-04]

# Metrics
duration: 3min
completed: 2026-03-26
---

# Phase 02 Plan 02: Technical SEO Summary

**Dynamic sitemap.xml with hreflang alternates, robots.txt for all crawlers, and buildPageMetadata helper producing canonical URLs, Open Graph, and Twitter Cards across all pages**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-26T19:27:06Z
- **Completed:** 2026-03-26T19:30:16Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Dynamic sitemap.ts generates entries for all 167 pages with hreflang alternates (es-419 + en) and priority levels (1.0/0.9/0.8/0.7)
- Programmatic robots.ts allows all crawlers including AI bots (GPTBot, ClaudeBot, PerplexityBot) with sitemap reference
- Shared buildPageMetadata helper produces canonical URLs, Open Graph tags (with locale-specific site name), and Twitter Cards (summary_large_image)
- All 4 existing page types now use buildPageMetadata for consistent SEO metadata

## Task Commits

Each task was committed atomically:

1. **Task 1: Create sitemap.ts, robots.ts, and seo.ts metadata helper** - `34f40bd` (feat)
2. **Task 2: Update all existing pages to use buildPageMetadata** - `3aa5c50` (feat)

## Files Created/Modified
- `src/app/sitemap.ts` - Dynamic sitemap generation for all pages with hreflang alternates and priority levels
- `src/app/robots.ts` - Programmatic robots.txt allowing all crawlers, referencing sitemap.xml
- `src/lib/seo.ts` - Shared buildPageMetadata helper producing canonical, OG, and Twitter Card metadata
- `src/app/[lang]/page.tsx` - Homepage now exports generateMetadata with full SEO metadata
- `src/app/[lang]/ciudades/[slug]/page.tsx` - City pages use buildPageMetadata instead of manual metadata
- `src/app/[lang]/estadios/[slug]/page.tsx` - Stadium pages use buildPageMetadata instead of manual metadata
- `src/app/[lang]/equipos/[slug]/page.tsx` - Team pages use buildPageMetadata instead of manual metadata

## Decisions Made
- Used `dict.site.tagline` for homepage title instead of `dict.home.title` to avoid redundant "SuperFan Mundial 2026" duplication when layout template appends site name
- Priority levels match D-16: homepage 1.0, cities 0.9, stadiums 0.8, teams 0.7
- robots.txt uses wildcard allow (`*`) with no AI crawler restrictions per PITFALLS.md
- Description truncated to 155 chars with "..." suffix in buildPageMetadata per D-20
- Unused `imageAlt` parameter prefixed with underscore in seo.ts to avoid lint warning (prepared for future OG image implementation)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed homepage title duplication**
- **Found during:** Task 2 (Update homepage metadata)
- **Issue:** Plan prescribed `dict.home.title` ("SuperFan Mundial 2026 - Guia Independiente") which would produce "SuperFan Mundial 2026 - Guia Independiente | SuperFan Mundial 2026" after layout template application
- **Fix:** Used `dict.site.tagline` ("Tu guia independiente del Mundial 2026") instead, producing clean "Tu guia independiente del Mundial 2026 | SuperFan Mundial 2026"
- **Files modified:** src/app/[lang]/page.tsx
- **Verification:** Build passes, title format is correct
- **Committed in:** 3aa5c50 (Task 2 commit, picked up by parallel executor)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Minor title source change for correctness. No scope creep.

## Issues Encountered
- Homepage page.tsx modifications were committed by the parallel 02-01 executor due to shared working directory. All changes are properly committed, just split across two executor commits.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All technical SEO infrastructure is in place (sitemap, robots, metadata helpers)
- Any new page type added in future phases should import buildPageMetadata from @/lib/seo and follow the established pattern
- Ready for 02-03 (if applicable) or Phase 03 city content

## Self-Check: PASSED

- All 3 created files exist (sitemap.ts, robots.ts, seo.ts)
- All 2 task commits found (34f40bd, 3aa5c50)
- SUMMARY.md exists at expected path

---
*Phase: 02-base-layout-technical-seo*
*Completed: 2026-03-26*
