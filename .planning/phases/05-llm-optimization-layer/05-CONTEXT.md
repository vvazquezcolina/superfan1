# Phase 5: LLM Optimization Layer - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Layer LLM/GEO optimization onto all existing content pages: JSON-LD schema stacking per page type, llms.txt and llms-full.txt at site root, direct-answer content blocks (first 200 words), FAQ sections with FAQPage schema, prompt-aligned headers, freshness signals, and cited statistics throughout.

</domain>

<decisions>
## Implementation Decisions

### JSON-LD Schema Stacking
- **D-01:** Every city page: Place + FAQPage + BreadcrumbList + Article schemas stacked.
- **D-02:** Every stadium page: StadiumOrArena + FAQPage + BreadcrumbList + Article schemas.
- **D-03:** Every team page: SportsTeam + FAQPage + BreadcrumbList schemas.
- **D-04:** Homepage: WebSite + Organization + ItemList schemas.
- **D-05:** Use `schema-dts` library for type-safe JSON-LD generation.
- **D-06:** Centralized factory functions in `src/lib/jsonld.ts`.

### llms.txt
- **D-07:** `/llms.txt` — Concise site description + key pages list in markdown.
- **D-08:** `/llms-full.txt` — Complete site structure with all pages, descriptions, and content summaries.
- **D-09:** Both files auto-generated from content data at build time via route handlers.

### Direct Answer Blocks
- **D-10:** Every content page starts with a 150-200 word "quick answer" block that directly answers the primary search query.
- **D-11:** Rendered as a styled summary box at the top of content, before main sections.

### FAQ Enhancement
- **D-12:** Every content page already has FAQ sections (from Phase 3/4). This phase adds FAQPage JSON-LD schema to each.
- **D-13:** FAQ questions phrased as natural language queries users and AI would ask.

### Content Freshness
- **D-14:** "Última actualización: [date]" / "Last updated: [date]" visible on every content page.
- **D-15:** Dates from `lastUpdated` field in content JSON.

### Claude's Discretion
- Exact JSON-LD field values for each schema type
- llms.txt content and format
- Direct answer block styling
- How to add cited statistics to existing content

</decisions>

<canonical_refs>
## Canonical References

- `src/lib/seo.ts` — Existing SEO helpers to extend
- `src/lib/breadcrumbs.ts` — Existing BreadcrumbList JSON-LD
- `src/components/city/CityFAQ.tsx` — Existing FAQ component
- `src/components/stadium/StadiumFAQ.tsx` — Existing FAQ component
- `content/cities.json` — City content with FAQ data
- `content/stadiums.json` — Stadium content with FAQ data
- `.planning/research/FEATURES.md` — LLM optimization features detail
- `.planning/research/PITFALLS.md` — LLM optimization pitfalls

</canonical_refs>

<code_context>
## Existing Code Insights

- BreadcrumbList JSON-LD already on all pages (Phase 2)
- FAQ sections already rendered on city and stadium pages (Phase 3/4)
- WebSite JSON-LD already on homepage
- `buildPageMetadata()` handles OG/Twitter Cards
- Content JSON has `lastUpdated` fields and FAQ data

</code_context>

<specifics>
## Specific Ideas

- This is our primary differentiator — no competitor optimizes for LLM citations
- Princeton research: pages with cited statistics get 30-40% more AI citations
- FAQPage schema drives 3.1x higher answer extraction rates

</specifics>

<deferred>
## Deferred Ideas

None

</deferred>

---
*Phase: 05-llm-optimization-layer*
*Context gathered: 2026-03-26*
