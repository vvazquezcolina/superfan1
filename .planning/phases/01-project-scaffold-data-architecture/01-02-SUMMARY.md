---
phase: 01-project-scaffold-data-architecture
plan: 02
subsystem: infra
tags: [zod, json, data-layer, ssg, generateStaticParams, hreflang, content-validation, bilingual]

# Dependency graph
requires:
  - phase: 01-01
    provides: "Next.js 16 project skeleton with @content/* path alias, buildAlternates hreflang helpers, hasLocale guard"
provides:
  - "Zod schemas for City, Stadium, Team with build-time JSON validation"
  - "16 cities, 16 stadiums, 48 teams in typed bilingual JSON files"
  - "Data loader functions (getCities/getCity/getCityById/getCitySlugs pattern)"
  - "Stub pages with generateStaticParams producing 160 content routes across es/en"
  - "generateMetadata with hreflang alternates (es-419, en, x-default) on all content pages"
affects: [02-city-content, 03-stadium-team-content, 04-seo-structured-data, 05-sitemap]

# Tech tracking
tech-stack:
  added: []
  patterns: [zod-build-time-validation, json-content-layer, data-loader-accessor-pattern, content-page-stub-with-ssg]

key-files:
  created:
    - src/lib/content/schemas.ts
    - src/lib/content/cities.ts
    - src/lib/content/stadiums.ts
    - src/lib/content/teams.ts
    - content/cities.json
    - content/stadiums.json
    - content/teams.json
    - src/app/[lang]/ciudades/[slug]/page.tsx
    - src/app/[lang]/estadios/[slug]/page.tsx
    - src/app/[lang]/equipos/[slug]/page.tsx
  modified: []

key-decisions:
  - "All 48 teams included with bilingual names and confederation assignments"
  - "Stadium slugs are the same in both languages since stadium names are proper nouns"
  - "Data loaders validate JSON at module-level import time (not per-request)"

patterns-established:
  - "Zod build-time validation: CitiesFileSchema.parse() at module level breaks build on invalid data"
  - "Data loader pattern: getCities/getCity/getCityById/getCitySlugs -- never expose raw JSON"
  - "Content page pattern: generateStaticParams from getSlugs(), async params, hasLocale guard, notFound()"
  - "Metadata pattern: generateMetadata with buildAlternates(section, entity.slugs) for hreflang"
  - "JSON import via @content/* path alias with resolveJsonModule: true"

requirements-completed: [INFRA-03, INFRA-04, INFRA-07]

# Metrics
duration: 5min
completed: 2026-03-26
---

# Phase 01 Plan 02: Content Data Layer Summary

**Zod-validated bilingual content layer with 16 cities, 16 stadiums, 48 teams, data loader functions, and 160 SSG routes across es/en locales**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-26T18:36:34Z
- **Completed:** 2026-03-26T18:42:23Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Created Zod schemas (CitySchema, StadiumSchema, TeamSchema) with LocalizedText, LocalizedSlug, and Coordinates reusable schemas
- Built 3 content JSON files with real bilingual data: 16 host cities (3 Mexico + 11 USA + 2 Canada), 16 stadiums with capacity/coordinates, 48 teams across 6 confederations
- Implemented data loader functions with build-time Zod validation that breaks the build on invalid data
- Created stub pages for cities, stadiums, and teams with generateStaticParams producing 160 content routes
- All pages include generateMetadata with hreflang alternates (es-419, en, x-default) per D-03
- Verified Zod rejection: invalid `country: "brazil"` correctly causes build failure

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Zod schemas, content JSON files, and data loader functions** - `bf5efaa` (feat)
2. **Task 2: Create stub content pages with generateStaticParams, generateMetadata, and hreflang** - `55a0d51` (feat)

## Files Created/Modified

- `src/lib/content/schemas.ts` - Zod schemas for City, Stadium, Team with inferred TypeScript types
- `src/lib/content/cities.ts` - Data loader for cities with getCities, getCity, getCityById, getCitySlugs
- `src/lib/content/stadiums.ts` - Data loader for stadiums with getStadiums, getStadium, getStadiumById, getStadiumSlugs
- `src/lib/content/teams.ts` - Data loader for teams with getTeams, getTeam, getTeamById, getTeamSlugs
- `content/cities.json` - 16 host cities with bilingual names, descriptions, coordinates, country, stadium ref
- `content/stadiums.json` - 16 stadiums with bilingual names, capacity, coordinates, city ref
- `content/teams.json` - 48 teams with bilingual names, confederation, descriptions
- `src/app/[lang]/ciudades/[slug]/page.tsx` - City stub page with SSG and hreflang metadata
- `src/app/[lang]/estadios/[slug]/page.tsx` - Stadium stub page with SSG and hreflang metadata
- `src/app/[lang]/equipos/[slug]/page.tsx` - Team stub page with SSG and hreflang metadata

## Decisions Made

- All 48 teams included with bilingual names and confederation assignments using confirmed + highly likely qualifiers
- Stadium slugs use same value in both languages since stadium names are proper nouns (e.g., "estadio-azteca" in both es and en)
- Data loaders validate JSON at module-level import time, not per-request -- this means invalid data fails fast during build
- Removed content/.gitkeep since real JSON files now populate the directory

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered

None -- build passed on first attempt, Zod validation rejection test confirmed, all 165 static pages generated.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Content data layer complete: schemas, JSON files, and typed data loaders ready for all future content pages
- 160 content routes generating as static HTML via SSG across both locales
- Stub pages ready to be enriched with full content in Phase 2 (city content) and Phase 3 (stadium/team content)
- Data loader pattern established: all future content access goes through lib/content/ functions
- hreflang alternates pattern proven for all content page types

## Self-Check: PASSED

All 10 created files verified present. Both task commits (bf5efaa, 55a0d51) verified in git log.

---
*Phase: 01-project-scaffold-data-architecture*
*Completed: 2026-03-26*
