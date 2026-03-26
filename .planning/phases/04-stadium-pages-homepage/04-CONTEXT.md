# Phase 4: Stadium Pages & Homepage - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver 16 stadium pages with capacity, location, transport, nearby hotels, accessibility info. Stadium index page. Homepage with featured content sections and clear navigation to all major sections.

</domain>

<decisions>
## Implementation Decisions

### Stadium Content
- **D-01:** Each stadium page: Hero, Overview (capacity, year, surface), Getting There (transport from city center), Seating Guide, Nearby Hotels & Food, Accessibility, Match Schedule placeholder, FAQ.
- **D-02:** Content written natively in Spanish with English versions.
- **D-03:** Each stadium links to its host city guide.

### Stadium Index
- **D-04:** Stadium index at `/es/estadios/` organized by country/city.
- **D-05:** Card layout similar to city index.

### Homepage
- **D-06:** Hero section with World Cup branding and countdown placeholder.
- **D-07:** Featured sections: Cities (3 cards), Stadiums (3 cards), Latest content.
- **D-08:** Clear CTAs to browse all cities, stadiums, teams.
- **D-09:** Full SEO metadata and WebSite JSON-LD.

### All 16 Stadiums
- **D-10:** Mexico: Estadio Azteca (CDMX), Estadio BBVA (MTY), Estadio Akron (GDL)
- **D-11:** USA: MetLife Stadium (NY/NJ), SoFi Stadium (LA), AT&T Stadium (Dallas), NRG Stadium (Houston), Mercedes-Benz Stadium (Atlanta), Lincoln Financial Field (Philadelphia), Hard Rock Stadium (Miami), Lumen Field (Seattle), Levi's Stadium (SF), Gillette Stadium (Boston), Arrowhead Stadium (KC)
- **D-12:** Canada: BMO Field (Toronto), BC Place (Vancouver)

### Claude's Discretion
- Content depth per stadium (~800-1200 words)
- Stadium-specific transport details
- How to handle match schedule placeholder (ISR-ready)

</decisions>

<canonical_refs>
## Canonical References

- `content/stadiums.json` — Stadium data to extend
- `src/lib/content/schemas.ts` — Schemas to extend for stadium content
- `src/components/city/` — City components pattern to follow for stadiums
- `src/app/[lang]/ciudades/page.tsx` — City index as reference for stadium index
- `.planning/REQUIREMENTS.md` — STAD-01, STAD-02, STAD-03, TOOL-03

</canonical_refs>

<specifics>
## Specific Ideas

- Follow the exact same content architecture as cities (extended schema, section components, FAQ)
- Homepage should be the entry point that makes visitors want to explore

</specifics>

<deferred>
## Deferred Ideas

None

</deferred>

---
*Phase: 04-stadium-pages-homepage*
*Context gathered: 2026-03-26*
