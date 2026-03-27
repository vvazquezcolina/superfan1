---
phase: 08-travel-fan-experience-guides
plan: 02
subsystem: fan-experience
tags: [fan-guides, match-schedule, affiliate, json-ld, isr, client-filters]
dependency_graph:
  requires: [08-01]
  provides: [fan-guide-pages, match-calendar, schedule-loader]
  affects: [sitemap, llms-txt]
tech_stack:
  added: []
  patterns: [ISR-3600-for-live-data, hybrid-server-client-page, affiliate-link-disclosure]
key_files:
  created:
    - content/guides/fan.json
    - content/schedule/matches.json
    - src/lib/content/schedule.ts
    - src/components/schedule/MatchCalendar.tsx
    - src/app/[lang]/fan/entradas/page.tsx
    - src/app/[lang]/fan/seguridad/page.tsx
    - src/app/[lang]/calendario/page.tsx
  modified:
    - src/lib/content/guides.ts
decisions:
  - guides.ts merges travel.json and fan.json via allGuides array so getGuide() resolves all guide IDs across both files
  - MatchCalendar is 'use client' with useMemo filtering; page shell is server component for SEO
  - Match schedule uses revalidate=3600 (hourly ISR) to pick up FIFA data updates when released
  - Ticket page has no AffiliateLink (e-commerce/direct ticket sales out of scope per PROJECT.md)
  - SafetyWing affiliate on safety page uses existing AffiliateLink component with FTC disclosure
metrics:
  duration: 8min
  completed: "2026-03-27T00:45:50Z"
  tasks: 3
  files: 8
---

# Phase 08 Plan 02: Fan Experience Guide Pages and Match Schedule Calendar Summary

Fan guide content (entradas, seguridad) and match schedule calendar with ISR and client-side filters across all 16 host cities.

## What Was Built

### Task 1: Fan guide data, match schedule data, and loaders

- **content/guides/fan.json**: 2 guide objects (`entradas-oficial`, `seguridad-viaje`) validated by GuidesFileSchema/Zod at import time
- **content/schedule/matches.json**: 48 group stage matches (groups A-H, 6 per group) distributed across all 16 host city stadiums, dates June 11-23 2026, all teams TBD
- **src/lib/content/schedule.ts**: Typed Zod-validated loader exporting `getMatches()`, `getMatchesByCity()`, `getMatchesByGroup()`, `getScheduleLastUpdated()`, `getScheduleDisclaimer()`
- **src/lib/content/guides.ts**: Extended to merge travel.json and fan.json into a single `allGuides` array, so `getGuide()` resolves all 9 guide IDs

### Task 2: Ticket buying and safety fan experience pages

- **src/app/[lang]/fan/entradas/page.tsx**: Ticket guide with scam warning box (yellow border), direct link to fifa.com/tickets (plain `<a>`, NOT AffiliateLink), Article + FAQPage + BreadcrumbList JSON-LD, ISR revalidate=86400
- **src/app/[lang]/fan/seguridad/page.tsx**: Safety + insurance guide with SafetyWing AffiliateLink block (FTC disclosure), Article + FAQPage + BreadcrumbList JSON-LD, ISR revalidate=86400
- Both pages: bilingual routes (es/fan/entradas, en/fan/tickets; es/fan/seguridad, en/fan/safety), hreflang alternates

### Task 3: Match schedule calendar with client-side filters

- **src/components/schedule/MatchCalendar.tsx**: `'use client'` component with 3 filter states (filterGroup, filterCity, filterDate), useMemo for performance, bilingual labels, clear-filters button, match grid with group badge
- **src/app/[lang]/calendario/page.tsx**: Server component with revalidate=3600 (hourly ISR for FIFA updates), SportsEvent JSON-LD for the tournament (FIFA World Cup 2026, June 11 - July 19), Article + BreadcrumbList JSON-LD, disclaimer from matches.json, passes all 48 matches to MatchCalendar

## Data Summary

- **Fan guides in fan.json**: 2 (`entradas-oficial`, `seguridad-viaje`)
- **Matches in matches.json**: 48 (group stage, groups A-H)
- **Host cities represented**: 16 (all: ciudad-de-mexico, monterrey, guadalajara, new-york, los-angeles, dallas, houston, atlanta, philadelphia, miami, seattle, san-francisco, boston, kansas-city, toronto, vancouver)

## Deviations from Plan

None - plan executed exactly as written. The guides.ts parallel-wave contingency (create from scratch if Plan 01 not done) was not needed since Plan 01 had already run and guides.ts existed.

## Known Stubs

Match teams are all TBD in matches.json — this is intentional per the plan spec ("schedule initially shows group stage structure with TBD teams"). The ISR architecture (revalidate=3600) is designed to update when FIFA releases confirmed team assignments. The MatchCalendar component displays "Por confirmar"/"TBD" for TBD team names. This stub is not a bug — it is the documented state until FIFA data is available.

## TypeScript

Compiled with 0 errors after all 3 tasks.

## Self-Check: PASSED
