# Phase 3: City Guides - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver 16 host city guide pages with deep, native Spanish editorial content covering everything a Latin American fan needs to plan their trip: overview, getting there, getting around, neighborhoods, food, safety, weather, and cultural context for Spanish-speaking visitors. Plus a city index page and English language versions.

</domain>

<decisions>
## Implementation Decisions

### Content Structure Per City
- **D-01:** Each city page has these sections: Hero/Overview, Getting There (flights/transport), Getting Around (local transport), Where to Stay (neighborhoods), Food & Drink, Safety Tips, Weather, Cultural Context for Latin American Fans, FAQ (3-5 questions).
- **D-02:** Content is written natively in Spanish — not translated from English. Cultural context matters.
- **D-03:** English versions are professional translations maintaining the same depth.
- **D-04:** Each city section is a component that can be rendered from the JSON content data.

### City Index Page
- **D-05:** City index at `/es/ciudades/` shows all 16 cities organized by country (Mexico 3, USA 11, Canada 2).
- **D-06:** Each city card shows: city name, country flag, stadium name, hero image placeholder, brief description.
- **D-07:** Mobile: single column cards. Desktop: 3-column grid.

### Content Sources & Attribution
- **D-08:** Cite official tourism websites, FIFA.com, and named sources (LEGAL-03).
- **D-09:** Use Pexels/Unsplash images with proper attribution.
- **D-10:** Include "Last updated" date on every page for freshness signals.

### All 16 Host Cities
- **D-11:** Mexico: Ciudad de México, Monterrey, Guadalajara
- **D-12:** USA: New York/New Jersey, Los Angeles, Dallas, Houston, Atlanta, Philadelphia, Miami, Seattle, San Francisco Bay Area, Boston, Kansas City
- **D-13:** Canada: Toronto, Vancouver

### Claude's Discretion
- Exact content depth per city (aim for 1500-2000 words in Spanish per city)
- Image selection from Pexels
- Specific neighborhood recommendations
- Local transport details
- How to structure the JSON content for rich city data

</decisions>

<canonical_refs>
## Canonical References

### Phase 2 Output
- `src/components/layout/Header.tsx` — Navigation with cities link
- `src/components/layout/Breadcrumbs.tsx` — Breadcrumb component to use
- `src/lib/seo.ts` — buildPageMetadata helper
- `src/lib/breadcrumbs.ts` — Breadcrumb generation

### Data Layer (Phase 1)
- `content/cities.json` — City data to extend with rich content
- `src/lib/content/schemas.ts` — Zod schemas to extend
- `src/lib/content/cities.ts` — City data loaders
- `src/app/[lang]/ciudades/[slug]/page.tsx` — Stub city pages to replace

### Research
- `.planning/research/FEATURES.md` — Feature expectations for city guides
- `.planning/research/PITFALLS.md` — Content quality requirements

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- City stub pages already exist with generateStaticParams
- Content JSON has 16 cities with basic data (name, country, slug, stadium)
- Layout, Header, Footer, Breadcrumbs all ready
- SEO helpers (buildPageMetadata, breadcrumb JSON-LD) ready

### Established Patterns
- Server Components for content pages
- Dictionary loader for i18n
- Tailwind v4 green/gold theme

### Integration Points
- Extend cities.json with rich content fields
- Extend CitySchema in schemas.ts for new fields
- Replace stub page with full content page
- Add city index page route

</code_context>

<specifics>
## Specific Ideas

- Focus on what matters to a Mexican/Latin American fan visiting US/Canadian cities: where to find Mexican food, Spanish-speaking services, community gathering spots
- Each city should feel like a friend's recommendation, not a Wikipedia article
- Safety info should be practical and honest, not sugar-coated

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-city-guides*
*Context gathered: 2026-03-26*
