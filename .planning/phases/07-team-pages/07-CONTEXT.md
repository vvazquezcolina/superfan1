# Phase 7: Team Pages - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

48 team pages with group assignment, historical World Cup record, key players, qualifying path. Team index page organized by group and confederation. Each team links to host city guides for match venues.

</domain>

<decisions>
## Implementation Decisions

### Team Content
- **D-01:** Each team page: Overview, Group Assignment, Historical WC Record (appearances, best finish), Key Players (5-8 per team), Qualifying Path, Match Schedule placeholder, FAQ (3-4 questions).
- **D-02:** Content written natively in Spanish with English versions.
- **D-03:** Team data already in teams.json — extend with rich content fields following the city/stadium pattern.

### Team Index
- **D-04:** Team index at `/es/equipos/` organized by group (A-L) with confederation sub-grouping.
- **D-05:** Each team card: flag emoji, team name, group, confederation badge.

### Cross-linking
- **D-06:** Each team links to host city guides for their match venues (when schedule available).

### Claude's Discretion
- Content depth per team (~500-800 words)
- Which key players to highlight
- How to handle teams whose rosters aren't finalized
- How to batch 48 teams across plans efficiently

</decisions>

<canonical_refs>
## Canonical References

- `content/teams.json` — Team data to extend
- `src/lib/content/schemas.ts` — Schemas to extend
- `src/components/city/` and `src/components/stadium/` — Component patterns
- `.planning/REQUIREMENTS.md` — TEAM-01, TEAM-02, TEAM-03

</canonical_refs>

<specifics>
## Specific Ideas

- Focus on teams that Latin American fans care about most — Mexico, Argentina, Brazil, Colombia, etc.
- Include fun facts and emotional connection points, not just stats

</specifics>

<deferred>
## Deferred Ideas

None

</deferred>

---
*Phase: 07-team-pages*
*Context gathered: 2026-03-26*
