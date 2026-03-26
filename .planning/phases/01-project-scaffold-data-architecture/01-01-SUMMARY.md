---
phase: 01-project-scaffold-data-architecture
plan: 01
subsystem: infra
tags: [next.js, typescript, tailwind, i18n, proxy, hreflang, ssr, ssg]

# Dependency graph
requires: []
provides:
  - "Next.js 16 project skeleton with build passing"
  - "Bilingual [lang] routing with /es/ and /en/ prefixes"
  - "proxy.ts locale detection and redirect"
  - "getDictionary/hasLocale pattern for server-only translations"
  - "buildAlternates/buildIndexAlternates/buildHomeAlternates hreflang helpers"
  - "English URL rewrites in next.config.ts (cities/stadiums/teams)"
  - "TypeScript strict mode with @content/* path alias"
  - "content/ directory ready for JSON data files"
  - "Legacy files archived in legacy/"
affects: [01-02, 02-city-content, 03-stadium-team-content, 04-seo-structured-data]

# Tech tracking
tech-stack:
  added: [next@16.2.1, react@19, typescript, tailwindcss@4, zod@3.24.4, "@formatjs/intl-localematcher", negotiator, clsx, tailwind-merge, server-only, prettier, prettier-plugin-tailwindcss]
  patterns: [getDictionary-server-only, proxy-locale-detection, async-params-in-nextjs16, es-419-hreflang, english-url-rewrites]

key-files:
  created:
    - src/proxy.ts
    - src/app/[lang]/layout.tsx
    - src/app/[lang]/page.tsx
    - src/app/[lang]/not-found.tsx
    - src/app/[lang]/dictionaries.ts
    - src/app/[lang]/dictionaries/es.json
    - src/app/[lang]/dictionaries/en.json
    - src/lib/i18n.ts
    - next.config.ts
    - .prettierrc
    - content/.gitkeep
  modified:
    - package.json
    - tsconfig.json
    - src/app/layout.tsx

key-decisions:
  - "Used getDictionary pattern with server-only guard instead of next-intl (per D-01)"
  - "proxy.ts exports proxy() function for Next.js 16 locale detection (per D-02)"
  - "es-419 for Spanish hreflang, x-default points to /es/ (per D-03)"
  - "English URL rewrites in next.config.ts for cities/stadiums/teams (per D-10)"
  - "Pinned Zod to 3.24.x for ecosystem compatibility per STACK.md"

patterns-established:
  - "getDictionary pattern: import 'server-only', async loader per locale from JSON files"
  - "Async params: always await params before accessing .lang or .slug in Next.js 16"
  - "Hreflang builder: buildAlternates/buildIndexAlternates/buildHomeAlternates in src/lib/i18n.ts"
  - "Locale validation: hasLocale type guard before getDictionary calls"
  - "Root layout passthrough: src/app/layout.tsx returns children only, [lang]/layout.tsx owns html/body"

requirements-completed: [INFRA-01, INFRA-02, INFRA-06]

# Metrics
duration: 6min
completed: 2026-03-26
---

# Phase 01 Plan 01: Project Scaffold Summary

**Next.js 16 bilingual skeleton with proxy.ts locale detection, getDictionary i18n, es-419/en hreflang alternates, and English URL rewrites for cities/stadiums/teams**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-26T18:27:22Z
- **Completed:** 2026-03-26T18:33:39Z
- **Tasks:** 2
- **Files modified:** 75

## Accomplishments

- Bootstrapped Next.js 16 project with TypeScript strict mode, Tailwind CSS v4, and all Phase 1 dependencies
- Implemented bilingual routing with proxy.ts locale detection redirecting bare URLs to /es/ by default
- Created getDictionary/hasLocale pattern with server-only guard and ES/EN dictionary JSON files
- Built hreflang helper functions producing es-419, en, and x-default alternates per D-03
- Configured English URL rewrites in next.config.ts for /en/cities, /en/stadiums, /en/teams
- Archived all legacy HTML/Python/CSV files into legacy/ directory for content reference
- Build produces SSG pages for both /es and /en with proxy recognized

## Task Commits

Each task was committed atomically:

1. **Task 1: Bootstrap Next.js 16 project, install dependencies, archive legacy files, configure TypeScript** - `ce788ad` (chore)
2. **Task 2: Implement i18n routing with proxy, dictionaries, layout, and hreflang helpers** - `df53bb3` (feat)

## Files Created/Modified

- `src/proxy.ts` - Locale detection via Accept-Language header, redirects to /es/ or /en/
- `src/app/[lang]/layout.tsx` - Root lang layout with generateStaticParams, async params, es-419 html lang
- `src/app/[lang]/page.tsx` - Homepage rendering locale-specific dictionary content
- `src/app/[lang]/not-found.tsx` - Bilingual 404 page
- `src/app/[lang]/dictionaries.ts` - Server-only dictionary loader with getDictionary and hasLocale
- `src/app/[lang]/dictionaries/es.json` - Spanish translations (site, nav, home, footer, notFound)
- `src/app/[lang]/dictionaries/en.json` - English translations (site, nav, home, footer, notFound)
- `src/lib/i18n.ts` - Locale config, path translations, hreflang builders (buildAlternates, buildIndexAlternates, buildHomeAlternates)
- `next.config.ts` - English URL rewrites mapping /en/cities to /en/ciudades etc.
- `tsconfig.json` - Added @content/* path alias, strict mode confirmed
- `src/app/layout.tsx` - Simplified to passthrough wrapper (html/body moved to [lang] layout)
- `package.json` - All Phase 1 dependencies installed
- `.prettierrc` - Prettier config with tailwindcss plugin
- `content/.gitkeep` - Empty content directory ready for Plan 02 data files
- `legacy/` - All archived legacy files (HTML, Python, CSV, etc.)

## Decisions Made

- Used getDictionary pattern with server-only guard instead of next-intl (per D-01 user decision)
- proxy.ts exports `proxy()` function (not `middleware()`) for Next.js 16 compatibility
- Hreflang uses es-419 for Latin American Spanish, x-default points to /es/ (per D-03)
- English URL rewrites handle both index and slug routes (/en/cities and /en/cities/:slug)
- Pinned Zod to 3.24.x via `~3.24` semver range for ecosystem compatibility per STACK.md
- Used temp directory scaffold approach since create-next-app refuses non-empty directories

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] create-next-app refused non-empty directory**
- **Found during:** Task 1 (Project bootstrap)
- **Issue:** create-next-app exits with error when target directory contains files (.planning/, CLAUDE.md, legacy/)
- **Fix:** Scaffolded into /tmp/superfan-scaffold, then copied files back to project root
- **Files modified:** None additional (same end result)
- **Verification:** All scaffold files present, npm install succeeds, build passes
- **Committed in:** ce788ad (Task 1 commit)

**2. [Rule 3 - Blocking] node_modules copy from temp dir had broken symlinks**
- **Found during:** Task 2 (Build verification)
- **Issue:** Copied node_modules from /tmp had invalid internal paths causing MODULE_NOT_FOUND
- **Fix:** Deleted node_modules and ran clean npm install
- **Files modified:** node_modules/ (not tracked)
- **Verification:** npm run build succeeds
- **Committed in:** df53bb3 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both were expected workarounds for scaffolding into a non-empty directory. No scope creep.

## Issues Encountered

- create-next-app does not support scaffolding into directories with existing files -- used temp directory approach as planned in the fallback strategy
- Zod `^3.24` resolved to 3.25.76 initially; had to use `~3.24` to pin to 3.24.x per STACK.md recommendation

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Application skeleton is complete and building with both /es and /en routes
- content/ directory ready for Plan 02 to add Zod schemas and JSON data files
- Path alias @content/* configured for importing from content/ directory
- getDictionary pattern established for all future page components
- Hreflang helpers ready for use in generateMetadata across all content pages
- English URL rewrites configured for cities/stadiums/teams routes

## Self-Check: PASSED

All 14 created files verified present. Both task commits (ce788ad, df53bb3) verified in git log.

---
*Phase: 01-project-scaffold-data-architecture*
*Completed: 2026-03-26*
