---
phase: 07-team-pages
plan: "01"
subsystem: ui
tags: [zod, typescript, nextjs, jsonld, content, team-pages, concacaf, conmebol]

# Dependency graph
requires:
  - phase: 04-stadium-pages
    provides: CitySectionSchema pattern reused for TeamContentSchema
  - phase: 05-llm-seo
    provides: buildFAQPageJsonLd, buildItemListJsonLd, buildBreadcrumbJsonLd from jsonld.ts
  - phase: 03-city-content
    provides: CitySection, CityFAQ component patterns mirrored in TeamSection, TeamFAQ
provides:
  - TeamContentSchema, TeamPlayerSchema, TeamFAQSchema, TeamSourceSchema in schemas.ts
  - TeamHero, TeamSection, TeamFAQ components in src/components/team/
  - Team index page at src/app/[lang]/equipos/page.tsx grouped by group
  - Updated team detail page with full content rendering
  - 12 priority teams (CONCACAF 8 + CONMEBOL 4) with full Spanish/English content
affects: [07-02-PLAN, 07-03-PLAN, 07-04-PLAN]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - TeamHero/TeamSection/TeamFAQ mirror CityHero/CitySection/CityFAQ — same structural pattern
    - content field optional on TeamSchema allows 36 stub teams to validate without content
    - team index groups by group field (A-L sorted + ungrouped last)
    - PlayerCard inline component in detail page for player rendering

key-files:
  created:
    - src/components/team/TeamHero.tsx
    - src/components/team/TeamSection.tsx
    - src/components/team/TeamFAQ.tsx
    - src/app/[lang]/equipos/page.tsx
  modified:
    - src/lib/content/schemas.ts
    - src/app/[lang]/equipos/[slug]/page.tsx
    - content/teams.json

key-decisions:
  - "TeamContentSchema.content is optional on TeamSchema so 36 non-content teams still validate at build time"
  - "TeamFAQ casts faqs as CityFAQ[] for buildFAQPageJsonLd — same shape, structural compatibility"
  - "Team index groups by group field; ungrouped teams rendered in final section labelled 'Sin grupo asignado'"
  - "PlayerCard implemented as inline component in team detail page — no need for separate file"
  - "Native Spanish content written for overview/history/players with English as secondary field"

patterns-established:
  - "Team component namespace mirrors city/stadium namespaces — TeamHero/TeamSection/TeamFAQ"
  - "Content depth: 12 priority teams (CONCACAF hosts + top CONMEBOL) get full treatment; 36 others placeholder"

requirements-completed:
  - TEAM-01
  - TEAM-02
  - TEAM-03

# Metrics
duration: 15min
completed: 2026-03-26
---

# Phase 07 Plan 01: Team Pages Foundation Summary

**Zod TeamSchema extended with content sub-schemas, TeamHero/TeamSection/TeamFAQ components built, team index page created, and 12 CONCACAF/CONMEBOL priority teams populated with 500-800 words of native Spanish editorial content each**

## Performance

- **Duration:** 15 min
- **Started:** 2026-03-26T23:36:15Z
- **Completed:** 2026-03-26T23:51:18Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments

- Extended TeamSchema with `TeamContentSchema`, `TeamPlayerSchema`, `TeamFAQSchema`, `TeamSourceSchema` — `content` field optional so 36 stub teams validate without content
- Created 3 new team components (TeamHero, TeamSection, TeamFAQ) mirroring the city component pattern with CONFEDERATION_FLAGS map and graceful null handling
- Created team index page at `/es/equipos` and `/en/equipos` grouped by group field (A-L sorted, ungrouped last) with TeamCard inline component, breadcrumb + ItemList JSON-LD
- Updated team detail page to render full content: TeamHero + WorldCupHistory + KeyPlayers (PlayerCard grid) + QualifyingPath + MatchSchedule + TeamFAQ sections
- Populated 12 priority teams: Mexico (w/El Quinto Partido narrative), USA, Canada, Brazil, Argentina, Uruguay, Colombia, Jamaica, Honduras, Costa Rica, Panama, El Salvador — each with 5 players, 3-4 FAQs, sources
- Build passes: 181 static pages, 48 team detail routes x2 locales = 96 team pages + 2 index pages

## Task Commits

Each task was committed atomically:

1. **Task 1: TeamSchema + team components + team index page** - `e5de025` (feat)
2. **Task 2: Populate 12 priority teams in teams.json** - `f5b7f7c` (feat)
3. **Task 3: Smoke-test build** - `b64a946` (chore)

## Files Created/Modified

- `/Users/vvazquez/Desktop/Proyectos/superfan/src/lib/content/schemas.ts` - Added TeamPlayerSchema, TeamFAQSchema, TeamSourceSchema, TeamContentSchema; extended TeamSchema with optional content; exported TeamContent, TeamPlayer, TeamFAQ types
- `/Users/vvazquez/Desktop/Proyectos/superfan/src/components/team/TeamHero.tsx` - Hero section with CONFEDERATION_FLAGS, group badge, overview first paragraph, graceful null content
- `/Users/vvazquez/Desktop/Proyectos/superfan/src/components/team/TeamSection.tsx` - Generic team section (identical to CitySection but in team namespace)
- `/Users/vvazquez/Desktop/Proyectos/superfan/src/components/team/TeamFAQ.tsx` - FAQ accordion with FAQPage JSON-LD, casts TeamFAQ as CityFAQ for buildFAQPageJsonLd compatibility
- `/Users/vvazquez/Desktop/Proyectos/superfan/src/app/[lang]/equipos/page.tsx` - Team index page with group-sorted TeamCards, breadcrumb + ItemList JSON-LD
- `/Users/vvazquez/Desktop/Proyectos/superfan/src/app/[lang]/equipos/[slug]/page.tsx` - Updated team detail with full content sections and PlayerCard inline component
- `/Users/vvazquez/Desktop/Proyectos/superfan/content/teams.json` - 12 teams populated with full content (1156 lines added)

## Decisions Made

- `content` is optional on TeamSchema so the 36 non-priority teams (UEFA, CAF, AFC, OFC) still pass Zod validation without content — avoids a large stub data task blocking the build
- `TeamFAQ` has structurally identical shape to `CityFAQ` (`{ question: LocalizedText, answer: LocalizedText }`), so `buildFAQPageJsonLd` accepts it with a cast; no need to overload the function
- Team index page groups by the `group` field; since groups (A-L) aren't yet assigned to any team, all 48 fall into the "Sin grupo asignado" section — this is correct and will resolve when FIFA announces groups
- PlayerCard is an inline component in the detail page file — not complex enough to warrant its own file in the team component namespace

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - TypeScript compiled clean after initial implementation, build passed on first run.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Team page infrastructure (schema + components + pages) is ready for Plans 02, 03, 04 to populate content for remaining 36 teams
- Plans 02-04 can use this exact same pattern: add `content` to each team entry in teams.json and the detail page will automatically render all sections
- Team index will auto-populate group sections once FIFA group draw is announced (add `group` field to teams in JSON)
- No blockers — all 12 priority team pages live and rendering full content

---
*Phase: 07-team-pages*
*Completed: 2026-03-26*
