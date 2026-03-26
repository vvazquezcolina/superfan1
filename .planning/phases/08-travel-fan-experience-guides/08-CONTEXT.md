# Phase 8: Travel & Fan Experience Guides - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Flight guides, accommodation guides, transport between cities, visa/entry requirements, ticket buying guide, safety/insurance guide, and match schedule calendar page. All with affiliate links where appropriate.

</domain>

<decisions>
## Implementation Decisions

### Travel Guides
- **D-01:** Flight guides: general + from Mexico + from USA + from Europe. Each ~1000 words with practical booking advice and Booking.com/future Skyscanner affiliate links.
- **D-02:** Accommodation guides: general + by-city recommendations with neighborhood picks and price ranges.
- **D-03:** Transport between cities: practical options (flights, buses, trains, rental cars) with costs.
- **D-04:** All travel content uses AffiliateLink component from Phase 6.

### Fan Experience
- **D-05:** Visa guide covering USA ESTA/visa, Mexico FMM, Canada eTA organized by fan nationality.
- **D-06:** Ticket buying guide: official FIFA portal, categories 1-4, pricing, scam warnings.
- **D-07:** Safety and travel insurance: practical advice, recommended coverage, emergency numbers.

### Match Schedule
- **D-08:** Match schedule page with ISR for updates. Initially shows group stage structure with TBD matches.
- **D-09:** Filterable by city, team, group, date (client-side filtering).

### Content Architecture
- **D-10:** Travel pages are new route groups: `/es/viajes/vuelos/`, `/es/viajes/hospedaje/`, `/es/viajes/transporte/`, `/es/fan/entradas/`, `/es/fan/visa/`, `/es/fan/seguridad/`, `/es/calendario/`.
- **D-11:** Each guide page uses the same section/FAQ pattern as cities and stadiums.

### Claude's Discretion
- Exact content for each guide page
- How to structure the match schedule JSON data
- Client-side filter implementation

</decisions>

<canonical_refs>
## Canonical References

- `src/components/city/CitySection.tsx` — Section pattern
- `src/components/affiliate/AffiliateLink.tsx` — Affiliate component
- `src/components/affiliate/BookingWidget.tsx` — Booking widget
- `.planning/REQUIREMENTS.md` — TRVL-01 through TRVL-07

</canonical_refs>

<deferred>
## Deferred Ideas

None

</deferred>

---
*Phase: 08-travel-fan-experience-guides*
*Context gathered: 2026-03-26*
