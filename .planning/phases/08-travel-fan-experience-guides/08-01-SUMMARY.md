---
phase: 08-travel-fan-experience-guides
plan: 01
subsystem: travel-guides
tags: [travel, seo, affiliate, jsonld, content, guides]
dependency_graph:
  requires:
    - Phase 05 (jsonld.ts, buildArticleJsonLd, buildFAQPageJsonLd)
    - Phase 06 (AffiliateLink, BookingWidget, affiliates.ts)
    - Phase 03 (CitySection, CityFAQ component patterns)
    - Phase 01 (schemas.ts, LocalizedText, LocalizedSlug)
  provides:
    - GuidePage Zod schema and loader (getGuide, getGuidesByCategory, getGuideBySlug)
    - 7 static bilingual travel guide pages under /es/viajes/ and /en/travel/
    - content/guides/travel.json with full bilingual editorial content
  affects:
    - sitemap.ts (new viajes routes need to be added)
    - llms.txt (travel content now available for AI indexing)
tech_stack:
  added: []
  patterns:
    - GuidePage schema follows same module-level Zod validation as cities.ts/stadiums.ts
    - GuideFAQ structurally identical to CityFAQ for buildFAQPageJsonLd compatibility
    - GuideSection structurally identical to CitySection for CitySection component reuse
    - JSON data file at content/guides/travel.json (matches @content/* alias)
key_files:
  created:
    - src/lib/content/schemas.ts (extended with Guide* schemas)
    - content/guides/travel.json
    - src/lib/content/guides.ts
    - src/app/[lang]/viajes/vuelos/page.tsx
    - src/app/[lang]/viajes/vuelos/desde-mexico/page.tsx
    - src/app/[lang]/viajes/vuelos/desde-usa/page.tsx
    - src/app/[lang]/viajes/vuelos/desde-europa/page.tsx
    - src/app/[lang]/viajes/hospedaje/page.tsx
    - src/app/[lang]/viajes/transporte/page.tsx
    - src/app/[lang]/viajes/visa/page.tsx
  modified:
    - src/lib/content/schemas.ts (appended Guide* schemas and types)
decisions:
  - "Used GuideSectionSchema (not CitySection) to avoid naming collision, but made it structurally identical so CitySection component accepts it without type cast"
  - "GuideFAQ cast as CityFAQ[] when passed to buildFAQPageJsonLd — same shape, TypeScript structural typing"
  - "content/guides/travel.json placed at content/ root (not src/data/) to match @content/* tsconfig alias"
  - "affiliateCTAs empty for all flight guides — Travelpayouts/Skyscanner integration deferred per V2-05"
  - "BookingWidget receives citySlug='mundial-2026' (non-empty string) and city name for hospedaje page"
metrics:
  duration: 11 minutes
  completed_date: "2026-03-27"
  tasks_completed: 3
  files_created: 10
  files_modified: 1
---

# Phase 8 Plan 01: Travel Guide Pages Summary

**One-liner:** 7 bilingual static travel guide pages (flights, accommodation, transport, visa) with GuidePage Zod schema, content loader, JSON-LD stacking, and Booking.com affiliate CTAs.

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | GuidePage schema, travel.json data file, guides.ts loader | ba4575c | schemas.ts, content/guides/travel.json, guides.ts |
| 2 | Flight guide pages (vuelos + 3 origin sub-pages) | 9513fd9 | 4 page files |
| 3 | Accommodation, transport, and visa guide pages | b67d05a | 3 page files |

## Guide IDs Added to travel.json

1. `vuelos-general` — General flight guide (slugs: vuelos/flights)
2. `vuelos-desde-mexico` — Flights from Mexico (desde-mexico/from-mexico)
3. `vuelos-desde-usa` — Domestic US flights (desde-usa/from-usa)
4. `vuelos-desde-europa` — Flights from Europe (desde-europa/from-europe)
5. `hospedaje-general` — Accommodation guide (hospedaje/accommodation)
6. `transporte-entre-ciudades` — Intercity transport (transporte/transport)
7. `visa-entrada` — Visa & entry requirements (visa/entry-requirements)

## Architecture Notes

- All 7 guides validated at module load by `GuidesFileSchema.parse(travelJson)` — build fails on invalid data
- `GuideFAQ` is structurally identical to `CityFAQ` (both have `{ question: LocalizedText, answer: LocalizedText }`) so `buildFAQPageJsonLd` accepts guide FAQs with a type cast
- `GuideSection` is structurally identical to `CitySection` type so the `CitySection` component renders guide sections without modification
- JSON data file lives at `content/guides/travel.json` (not `src/data/`) to match the `@content/*` TypeScript path alias used by all data loaders

## Affiliate Integration

- `hospedaje-general` guide has 1 affiliateCTA: Booking.com search URL with aid=304142 and World Cup week 1 dates
- Hospedaje page renders `AffiliateLink` for each CTA plus `BookingWidget` after the "tipos de alojamiento" section
- Flight guides have empty affiliateCTAs — Travelpayouts/Skyscanner integration deferred to V2-05 per plan spec
- Per the important note in the execution context, Travelpayouts (token: 9a350c3ebd492165ade7135359165af9) is noted as primary affiliate — flight affiliate CTAs will be wired in a future plan

## Deviations from Plan

None — plan executed exactly as written.

- The `content/guides/travel.json` placement follows the existing `@content/*` alias pattern (all other JSON files are in `content/`, not `src/data/` as the plan mentioned)
- This is a clarification/auto-fix (Rule 3) — the plan said "src/data/ directory may need creating" but the correct location per project conventions is `content/`

## TypeScript Compilation

TypeScript compiled with 0 errors throughout all 3 tasks. Verified with `npx tsc --noEmit` after each task.

## Known Stubs

None — all guide content is fully written bilingual editorial content (es + en), no placeholders.

## Self-Check: PASSED
