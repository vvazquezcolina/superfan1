# Phase 2: Base Layout & Technical SEO - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a polished, mobile-first shared layout (header, footer, navigation, breadcrumbs) with full technical SEO baseline (sitemap, robots, metadata, OG tags, Twitter Cards) and FIFA non-affiliation disclaimer visible on every page.

</domain>

<decisions>
## Implementation Decisions

### Design System & Color Scheme
- **D-01:** Use a green/dark theme: primary `#1a472a` (dark green), secondary `#2d5016`, accent `#d4af37` (gold). White background, dark text. Matches World Cup/football branding.
- **D-02:** Tailwind v4 utility classes for all styling. No custom CSS files beyond `globals.css` for base resets.
- **D-03:** System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto`) for performance. No custom fonts.

### Navigation
- **D-04:** Sticky top nav bar with logo/site name on left, main navigation links on right.
- **D-05:** Navigation sections: Mundial 2026, Ciudades, Estadios, Equipos, Viajes, Herramientas.
- **D-06:** Mobile: hamburger menu that slides in from right. Desktop: horizontal links.
- **D-07:** Navigation labels are localized — Spanish in `/es/`, English in `/en/`.
- **D-08:** Active page/section highlighted in nav.

### Footer
- **D-09:** Multi-column footer: Section links, About, Legal, Newsletter placeholder.
- **D-10:** FIFA non-affiliation disclaimer prominently visible in footer on every page (LEGAL-01).
- **D-11:** Copyright notice: "© 2026 SuperFan Info. Proyecto independiente no afiliado con FIFA."
- **D-12:** Footer is localized per language.

### Breadcrumbs
- **D-13:** Text-based breadcrumbs below the header on every page except homepage.
- **D-14:** Auto-generated from URL path structure with localized labels.
- **D-15:** BreadcrumbList JSON-LD schema on every page (SEO-05).

### Technical SEO
- **D-16:** `sitemap.ts` in app directory using Next.js built-in API. All pages with proper priority levels and lastmod.
- **D-17:** `robots.ts` in app directory. Allow all crawlers. Reference sitemap URL.
- **D-18:** `generateMetadata()` on every page for unique title, description, canonical, OG, Twitter Cards.
- **D-19:** Page titles format: "{Page Title} | SuperFan Mundial 2026"
- **D-20:** Meta descriptions 120-155 characters, unique per page.
- **D-21:** Images use next/image with alt text, lazy loading, responsive sizing (SEO-04).

### Claude's Discretion
- Exact Tailwind color palette configuration
- Component file organization within `src/components/`
- Exact responsive breakpoints
- OG image dimensions and default fallback image

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 1 Output (build on this)
- `src/app/[lang]/layout.tsx` — Root layout to extend with header/footer
- `src/app/[lang]/dictionaries.ts` — Dictionary loader for i18n
- `src/lib/i18n.ts` — Locale config and helpers
- `next.config.ts` — Current config with rewrites

### Research
- `.planning/research/STACK.md` — Tech stack choices
- `.planning/research/ARCHITECTURE.md` — Component structure
- `.planning/research/PITFALLS.md` — SEO pitfalls to avoid

### Project
- `.planning/REQUIREMENTS.md` — INFRA-05, SEO-01 through SEO-06, LEGAL-01

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/[lang]/layout.tsx` — Root layout already exists with generateStaticParams
- `src/app/[lang]/dictionaries.ts` — Dictionary loader for localized strings
- `src/lib/i18n.ts` — Locale definitions, hreflang helpers

### Established Patterns
- App Router with `[lang]` segment for all routes
- Server Components by default, dictionaries loaded server-side
- Tailwind v4 configured

### Integration Points
- Layout.tsx is the main integration point — header/footer go here
- New components in `src/components/layout/` (Header, Footer, Nav, Breadcrumbs)
- sitemap.ts and robots.ts at `src/app/` level

</code_context>

<specifics>
## Specific Ideas

- The green color scheme should feel professional and sporty, not garish
- Navigation should make it easy to jump between cities — this is the most browsed content
- Footer disclaimer must be clearly visible, not buried in tiny text

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-base-layout-technical-seo*
*Context gathered: 2026-03-26*
