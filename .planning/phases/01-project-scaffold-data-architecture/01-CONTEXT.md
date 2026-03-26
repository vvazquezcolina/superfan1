# Phase 1: Project Scaffold & Data Architecture - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a working Next.js 16 application deployed on Vercel with bilingual routing (`/es/` and `/en/`), typed content data schemas (Zod), data loader functions, and `generateStaticParams` for SSG across both locales. This is the foundation every subsequent phase builds on — no content pages, no styling, no SEO beyond what's structurally required.

</domain>

<decisions>
## Implementation Decisions

### i18n Approach
- **D-01:** Use Next.js built-in `[lang]` dynamic segment with `getDictionary()` pattern — no next-intl dependency. Two languages (es, en) with Spanish as default.
- **D-02:** Middleware detects locale from Accept-Language header and redirects to `/es/` if no locale prefix. Default locale is `es`.
- **D-03:** Use `es-419` (Latin American Spanish) for hreflang tags, not `es-MX`. English uses `en`.

### Data Schema Design
- **D-04:** Content stored in local JSON files under `content/` directory — one file per entity type: `cities.json`, `stadiums.json`, `teams.json`.
- **D-05:** Zod schemas validate all content JSON at build time. Invalid data must break the build to prevent bad content reaching production.
- **D-06:** Data loader functions in `lib/content/` are the ONLY access point for content data. Pages never read JSON files directly.
- **D-07:** Content includes both Spanish and English text in the same JSON structure (nested by locale key), not separate files per language.

### URL Structure
- **D-08:** Spanish slugs for `/es/` routes: `/es/ciudades/ciudad-de-mexico`, `/es/estadios/estadio-azteca`
- **D-09:** English slugs for `/en/` routes: `/en/cities/mexico-city`, `/en/stadiums/estadio-azteca`
- **D-10:** Route structure: `app/[lang]/ciudades/[slug]/page.tsx` (Spanish path names in filesystem, English routes handled via rewrites or parallel route groups)
- **D-11:** Domain: `https://www.superfaninfo.com/`

### Project Bootstrap
- **D-12:** Fresh Next.js 16 project via `create-next-app`. Do NOT migrate existing HTML — start clean.
- **D-13:** Archive existing static HTML files in a `legacy/` directory for content reference during later phases.
- **D-14:** TypeScript strict mode enabled from day one.
- **D-15:** Tailwind CSS v4 for styling (configured but minimal usage in this phase).

### Claude's Discretion
- Exact Zod schema field definitions for cities/stadiums/teams — Claude should design schemas based on the content needs identified in research (FEATURES.md, ARCHITECTURE.md)
- Specific folder structure within `app/` and `lib/` — follow Next.js 16 conventions
- Whether to use `src/` directory or root-level `app/` — Claude's choice based on current Next.js best practice
- Middleware implementation details for locale detection

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Research
- `.planning/research/STACK.md` — Technology choices, versions, rationale
- `.planning/research/ARCHITECTURE.md` — System structure, component boundaries, data flow
- `.planning/research/PITFALLS.md` — Critical mistakes to avoid (hreflang errors, content penalties)
- `.planning/research/SUMMARY.md` — Synthesized findings and phase implications

### Project
- `.planning/PROJECT.md` — Project context, constraints, domain/analytics info
- `.planning/REQUIREMENTS.md` — INFRA-01 through INFRA-07 are this phase's requirements

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `seo_world_cup_structure.csv` — Contains keyword research, URL structure, and content hierarchy. Useful as reference when designing data schemas.
- Existing HTML pages — Content text can be extracted as reference for future phases. Not usable as code.

### Established Patterns
- None — this is a greenfield Next.js project. The existing Python/HTML site is being replaced entirely.

### Integration Points
- Vercel deployment target — project must include `vercel.json` or rely on Next.js auto-detection
- Domain `superfaninfo.com` — Vercel domain configuration needed

</code_context>

<specifics>
## Specific Ideas

- GA4 Measurement ID `G-HMRJTYPDPP` should be configured in environment variables from the start, even if tracking is implemented in Phase 6
- The content JSON should include a `lastUpdated` field per entity to support freshness signals in Phase 5
- Slug mappings (Spanish ↔ English) should be part of the content data, not hardcoded in routes

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-project-scaffold-data-architecture*
*Context gathered: 2026-03-26*
