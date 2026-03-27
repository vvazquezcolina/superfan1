# Phase 10: Interactive Tools & Final Polish - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Budget calculator (origin/destination/days/hotel/meals → estimated total with affiliate links) and interactive host city map with 16 stadiums and pop-up cards. Both tools track usage events in GA4.

</domain>

<decisions>
## Implementation Decisions

### Budget Calculator
- **D-01:** Client component with form: origin city, destination city (one of 16), days (1-14), hotel tier (budget/mid/luxury), meals budget (low/mid/high).
- **D-02:** Outputs estimated daily and total cost. Breaks down: accommodation, food, local transport, entertainment.
- **D-03:** Affiliate CTAs to Travelpayouts hotel/flight search pre-filled with destination.
- **D-04:** Cost data embedded in component (average costs per city, per tier).
- **D-05:** GA4 trackToolUsage() on calculate.

### Interactive Map
- **D-06:** Use Leaflet.js (free, no API key needed) with OpenStreetMap tiles.
- **D-07:** Plot all 16 stadiums with markers, color-coded by country (green=Mexico, blue=USA, red=Canada).
- **D-08:** Pop-up cards on click: stadium name, city, capacity, link to stadium page and city guide.
- **D-09:** Mobile-friendly with touch zoom/pan.
- **D-10:** GA4 trackToolUsage() on map interactions.

### Claude's Discretion
- Exact cost estimates per city/tier
- Map zoom levels and center point
- Leaflet component implementation details
- Whether to lazy-load the map

</decisions>

<canonical_refs>
## Canonical References

- `src/lib/analytics.ts` — trackToolUsage function
- `src/components/affiliate/TravelpayoutsWidget.tsx` — Affiliate widgets
- `content/cities.json` — City data with coordinates
- `content/stadiums.json` — Stadium data with coordinates
- `.planning/REQUIREMENTS.md` — TOOL-01, TOOL-02

</canonical_refs>

<deferred>
## Deferred Ideas

None

</deferred>

---
*Phase: 10-interactive-tools-final-polish*
*Context gathered: 2026-03-26*
