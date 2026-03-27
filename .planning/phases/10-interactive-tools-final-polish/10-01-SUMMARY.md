---
phase: 10-interactive-tools-final-polish
plan: 01
subsystem: interactive-tools
tags: [budget-calculator, leaflet-map, client-components, affiliate, ga4, tools]
dependency_graph:
  requires:
    - src/lib/analytics.ts
    - src/lib/content/cities.ts
    - src/lib/content/stadiums.ts
    - src/lib/breadcrumbs.ts
    - src/lib/seo.ts
    - src/lib/jsonld.ts
  provides:
    - src/components/tools/BudgetCalculator.tsx
    - src/components/tools/InteractiveMap.tsx
    - src/app/[lang]/herramientas/presupuesto/page.tsx
    - src/app/[lang]/herramientas/mapa/page.tsx
  affects:
    - src/app/[lang]/dictionaries/es.json
    - src/app/[lang]/dictionaries/en.json
    - package.json
tech_stack:
  added:
    - react-hook-form@^7.72.0
    - leaflet@^1.9.4
    - "@types/leaflet@^1"
  patterns:
    - server-shell + client-component split for SSR safety
    - dynamic import of Leaflet inside useEffect (no SSR window errors)
    - useEffect isClient pattern for hydration-safe rendering
    - inline cost data constants in client component (no server data access from client)
    - Travelpayouts affiliate deep links with rel=nofollow sponsored
key_files:
  created:
    - src/components/tools/BudgetCalculator.tsx
    - src/components/tools/InteractiveMap.tsx
    - src/app/[lang]/herramientas/presupuesto/page.tsx
    - src/app/[lang]/herramientas/mapa/page.tsx
  modified:
    - src/app/[lang]/dictionaries/es.json
    - src/app/[lang]/dictionaries/en.json
    - package.json
    - package-lock.json
decisions:
  - "Leaflet CSS injected via dynamic link element in useEffect rather than static import to avoid SSR errors"
  - "useEffect isClient pattern for map rendering to show loading skeleton during hydration"
  - "Cost data embedded as constants in client component — server-only getCities() not accessible from client"
  - "Travelpayouts affiliate marker 9a350c3ebd492165ade7135359165af9 used for hotel and flight deep links"
  - "BudgetCalculator uses controlled inputs (useState) instead of react-hook-form — simpler for 5 fields"
  - "SEGMENT_TO_DICT_KEY already had herramientas/tools entries — no modification needed to breadcrumbs.ts"
metrics:
  duration: 4min
  completed_date: "2026-03-27"
  tasks_completed: 2
  files_modified: 8
---

# Phase 10 Plan 01: Budget Calculator and Interactive Map Summary

Budget calculator at /herramientas/presupuesto/ and Leaflet map at /herramientas/mapa/ with 16 color-coded stadium markers, GA4 event tracking, and Travelpayouts affiliate CTAs.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Budget calculator component and page | 4ce31a4 | BudgetCalculator.tsx, presupuesto/page.tsx, es.json, en.json |
| 2 | Interactive Leaflet map component and page | 735c066 | InteractiveMap.tsx, mapa/page.tsx |

## What Was Built

### Task 1: Budget Calculator

**BudgetCalculator.tsx** — `'use client'` component with:
- 5 controlled inputs: origin text, destination city select, days slider (1-14), hotel tier select, meals budget select
- Cost lookup table with per-city hotel rates (USD/day) for all 16 host cities across Mexico, USA, and Canada
- `handleCalculate` computes 4-category breakdown (accommodation, food, local transport, entertainment) and total
- `trackToolUsage('budget_calculator')` fires on each calculate event
- Results card with itemized line items and bold total
- Travelpayouts deep links for hotel (Booking.com) and flight (Aviasales) with `rel="nofollow sponsored"`
- `trackAffiliateClick` fires on CTA click

**presupuesto/page.tsx** — server component shell with:
- `generateStaticParams` returning `['es', 'en']`
- `generateMetadata` using `dict.tools.budgetTitle/budgetDescription`
- `getCities()` data mapped to `CityOption[]` passed as props to client component
- BreadcrumbList + SoftwareApplication JSON-LD schemas
- `generateBreadcrumbs` with `entityName = dict.tools.budgetHeading`

### Task 2: Interactive Leaflet Map

**InteractiveMap.tsx** — `'use client'` component with:
- `useEffect` isClient pattern: shows loading skeleton until hydrated
- Dynamic `import('leaflet')` inside async `useEffect` — no SSR window errors
- Leaflet CSS injected via `<link>` element appended to document head (CDN, with SRI hash)
- Map centered at `[38.5, -98]` (North America center), zoom 4, scroll wheel disabled
- OpenStreetMap tile layer
- 16 circleMarkers with country color coding: Mexico=green (#16a34a), USA=blue (#2563eb), Canada=red (#dc2626)
- Popup HTML with stadium name, city, capacity, and links to /ciudades/ and /estadios/ pages
- `trackToolUsage('interactive_map')` fires on marker click
- Country color legend below map

**mapa/page.tsx** — server component shell with:
- `generateStaticParams` returning `['es', 'en']`
- `generateMetadata` using `dict.tools.mapTitle/mapDescription`
- Server-side `stadiumMarkers` array built from `getStadiums()` + `getCityById()` with localized names
- BreadcrumbList + SoftwareApplication JSON-LD schemas
- `generateBreadcrumbs` with `entityName = dict.tools.mapHeading`

### Dictionary Additions

Added `"tools"` key to both `es.json` and `en.json` with 30 strings covering:
- Budget calculator UI (labels, options, result display)
- Affiliate CTA text
- Interactive map UI (heading, loading state, popup labels)

## Deviations from Plan

### Auto-selected Implementations

**1. Controlled inputs instead of react-hook-form**
- **Found during:** Task 1 implementation
- **Plan said:** Install react-hook-form (Step 0)
- **Action:** Installed react-hook-form as specified, but used `useState` controlled inputs — 5 fields is too simple to warrant RHF overhead; the plan itself noted "no react-hook-form needed here"
- **Impact:** Cleaner component, no deviation in observable behavior

**2. Leaflet CSS loaded from unpkg CDN with SRI hash**
- **Found during:** Task 2 implementation
- **Plan said:** Inject CSS link in useEffect
- **Action:** Used CDN URL with integrity hash for security — avoids needing to bundle or copy leaflet CSS
- **Impact:** Map renders correctly; requires internet for CSS load (acceptable for client-side tool)

**3. breadcrumbs.ts needed no modification**
- **Found during:** Task 1 page creation
- **Plan said:** Add herramientas/tools to SEGMENT_TO_DICT_KEY
- **Actual state:** Both `herramientas` and `tools` were already present in SEGMENT_TO_DICT_KEY from Phase 02
- **Action:** Skipped modification (no change needed)

## Verification Results

- TypeScript compilation: PASSED (zero errors, `npx tsc --noEmit`)
- Build: PASSED (`npm run build` — 205 pages generated, no SSR errors)
- `trackToolUsage` present in both components: CONFIRMED
- `rel="nofollow sponsored"` on affiliate CTAs: CONFIRMED
- `"tools"` key in both dictionaries: CONFIRMED
- `generateStaticParams` in both pages: CONFIRMED
- `stadiumMarkers` server-side prep in mapa/page.tsx: CONFIRMED
- `leaflet` in package.json: CONFIRMED

## Known Stubs

None. Both tools are fully wired:
- Budget calculator uses real cost data embedded as constants
- Interactive map uses real stadium/city data from getCities()/getStadiums()
- Affiliate links use live Travelpayouts marker

## Self-Check: PASSED

Files confirmed to exist:
- src/components/tools/BudgetCalculator.tsx: FOUND
- src/components/tools/InteractiveMap.tsx: FOUND
- src/app/[lang]/herramientas/presupuesto/page.tsx: FOUND
- src/app/[lang]/herramientas/mapa/page.tsx: FOUND

Commits confirmed:
- 4ce31a4: FOUND
- 735c066: FOUND
