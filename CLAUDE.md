<!-- GSD:project-start source:PROJECT.md -->
## Project

**SuperFan Mundial 2026**

A comprehensive SEO and LLM-optimized content site covering the FIFA World Cup 2026 across Mexico, USA, and Canada. Targets Spanish-speaking fans with travel guides, ticket info, city guides, interactive tools, and affiliate-driven monetization. Designed to rank in search engines AND be cited by AI assistants (ChatGPT, Claude, Perplexity, Google AI Overviews).

**Core Value:** Be the most complete, accurate, and well-structured Spanish-language independent guide to the World Cup 2026 — optimized so both search engines and LLMs surface our content as authoritative answers.

### Constraints

- **Timeline**: Must be live and indexed before June 2026. Every week of delay = lost SEO value.
- **Tech stack**: Next.js + Vercel (SSG for performance, ISR for updates). TypeScript.
- **Budget**: Minimize paid services. Use free tiers (Vercel, GA4, free affiliate programs).
- **Legal**: Must include clear FIFA non-affiliation disclaimers. No official FIFA branding/logos.
- **Content**: Must be factual and up-to-date. No fabricated data. Cite sources where possible.
- **Images**: Use Pexels/Unsplash (free, attributed) or create original graphics.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.2.x | Framework (SSG + ISR) | Current stable. Turbopack default for dev and build (2-5x faster builds). Stable React Compiler. `generateStaticParams` perfectly suits 100+ static pages from structured data. SSG pages deploy as edge-cached HTML on Vercel. ISR lets you update match schedules without full rebuilds. The upgrade path from 15 is smooth via codemods, so starting greenfield on 16 is the right call. |
| React | 19.2.x | UI library | Stable since Dec 2024. Server Components reduce client JS bundle. React Compiler (stable in Next.js 16) auto-memoizes components -- zero manual `useMemo`/`useCallback`. |
| TypeScript | 5.8.x or 6.0.x | Type safety | TS 6.0 released 2026-03-23. For stability, pin to 5.8.x unless Next.js 16 ships with 6.0 support. Check `create-next-app` output -- use whatever version it installs. |
| Tailwind CSS | 4.2.x | Styling | Ground-up rewrite. CSS-first config (no `tailwind.config.js`). 5x faster full builds, 100x faster incremental. Built-in container queries, cascade layers. First-class Next.js 16 support via `create-next-app`. |
| next-intl | 4.8.x | i18n (ES/EN routing, translations) | The standard for App Router i18n since Next.js dropped built-in i18n routing. Handles `/es/...` and `/en/...` URL prefixes, locale detection via middleware, TypeScript-safe translation keys, date/number formatting. ~2KB client bundle. Confirmed Next.js 16 compatible (caveat: avoid `use cache` on translated server components for now). |
### Data Layer
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| TypeScript types + JSON files | N/A | Content data store | The project has CSV data that gets transformed into structured content. Convert CSVs to typed JSON/TS files at build time. No CMS needed -- this is a content site with a known, bounded dataset (16 cities, 16 stadiums, 48 teams, ~200 pages). JSON files imported directly in `generateStaticParams` and page components. Zero runtime cost, full type safety. |
| Zod | 3.24.x | Schema validation | Validate structured data at build time. Define schemas for City, Stadium, Team, Match. Catch data errors before they reach production. Use 3.24.x (battle-tested, 40M+ weekly downloads) rather than 4.x which is newer but less ecosystem-proven. |
### SEO & LLM Optimization
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js Metadata API | built-in | Meta tags, Open Graph, Twitter Cards | Native `generateMetadata()` in page/layout files. Dynamic per-page titles, descriptions, canonical URLs, hreflang alternates. No third-party library needed. |
| schema-dts | 1.1.x | TypeScript types for JSON-LD | Google-maintained. Type-safe Schema.org structured data. 100K+ weekly downloads. Zero runtime cost (types only). Use with `SportsEvent`, `Place`, `FAQPage`, `BreadcrumbList` schemas. |
| next/og (ImageResponse) | built-in | Dynamic OG images | Generate unique social cards per city/stadium/team at build time. JSX-to-image API. Preferred over `@vercel/og` for Next.js projects. Critical for social sharing of Spanish content. |
| Built-in sitemap.ts | built-in | XML sitemap generation | Native `sitemap.ts` file convention. Typed, supports images, videos, hreflang. `generateSitemaps()` for splitting. No need for `next-sitemap` package. |
| llms.txt / llms-full.txt | manual | LLM content discovery | Markdown file at `/llms.txt` describing site structure for AI crawlers. `llms-full.txt` concatenates key content for single-pass LLM ingestion. 844K+ sites adopted as of Oct 2025. Anthropic, Vercel already implement it. Low effort, high potential for AI citation. |
### Analytics & Tracking
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| @next/third-parties/google | built-in | GA4 integration | Official Next.js package for Google Analytics. Loads after hydration for performance. Supports gtag events. Uses existing GA4 ID `G-HMRJTYPDPP`. |
| GA4 custom events | N/A | Affiliate click tracking | Track outbound affiliate clicks (Booking.com, Skyscanner, GetYourGuide) via `gtag('event', ...)`. Enable Enhanced Measurement for automatic outbound click detection. Create custom events in GA4 admin for affiliate-specific tracking. |
### UI Components & Utilities
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | 2.x | Conditional CSS classes | Every component that needs conditional styling. Tiny (< 1KB). |
| tailwind-merge | 3.x | Merge Tailwind classes safely | When composing component variants -- prevents class conflicts (e.g., `p-2` + `p-4` resolves to `p-4`). |
| class-variance-authority (cva) | 0.7.x | Component variant API | Define button/card/badge variants declaratively. Use for any component with multiple visual states. |
| lucide-react | latest | Icons | Tree-shakeable SVG icons. MIT license. Consistent design language. |
### Interactive Tools
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| React Hook Form | 7.x | Form state management | Budget calculator inputs, trip planner forms, newsletter signup. Minimal re-renders. |
| date-fns | 4.x | Date manipulation | Match schedule display, countdown timers, date formatting in ES/EN locales. Tree-shakeable (only import what you use). |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| Turbopack | Dev server & builds (default in Next.js 16) | No config needed. 10x faster Fast Refresh. Stable for both dev and production builds. |
| ESLint 9 + eslint-config-next | Linting | Next.js 16 removed `next lint`. Use ESLint directly with flat config (`eslint.config.mjs`). Install `eslint-config-next@16.2.x`. |
| Prettier + prettier-plugin-tailwindcss | Code formatting | Auto-sorts Tailwind classes. Consistent code style. |
| sharp | Image optimization | Required for production `next/image` optimization. Pre-installed by `create-next-app`. On Vercel, images are optimized and cached at the edge. |
## Installation
# Bootstrap (creates Next.js 16 + TypeScript + Tailwind CSS v4 + ESLint)
# i18n
# Data validation
# SEO / Structured Data (types only, zero runtime)
# UI utilities
# Icons
# Interactive tools
# Analytics (already bundled with Next.js)
# @next/third-parties is part of Next.js -- just import it
# Dev tools
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js 16 | Next.js 15 | Only if you hit a blocking Next.js 16 bug. 15 is still supported but 16 is stable and greenfield projects should use it. Turbopack alone justifies the choice. |
| Next.js 16 | Astro 5.x | If you wanted zero JS by default. But Astro lacks ISR on Vercel, and interactive tools (calculators, planners) need React islands which add complexity. Next.js is the native Vercel framework -- better DX, better caching, better support. |
| next-intl | next-i18next | Only for Pages Router. next-i18next does not support App Router. Dead end for new projects. |
| Tailwind CSS v4 | CSS Modules | If your team hates utility classes. But for a content site with many similar page layouts, Tailwind's utility-first approach is faster to build and easier to maintain. |
| JSON files (local data) | Headless CMS (Sanity, Strapi) | If you had multiple content editors or needed a CMS UI. This project has a single developer, bounded dataset, and a 3-month deadline. A CMS adds latency, API dependencies, and setup time with no benefit. |
| Zod 3.24.x | Zod 4.x | Zod 4 is newer but the ecosystem (form libraries, tools) still targets 3.x. Stick with 3.24 for compatibility. Revisit after project launches. |
| schema-dts | next-seo | next-seo adds runtime overhead and is less precise than hand-crafted JSON-LD with TypeScript types. For a site where structured data is a core differentiator, schema-dts gives you full control. |
| Built-in sitemap.ts | next-sitemap | Only if you need cross-domain sitemap indices or news sitemaps. The built-in solution handles hreflang, images, and splitting -- everything this project needs. |
| date-fns | dayjs / Temporal API | dayjs is smaller but less tree-shakeable. Temporal API is still behind a flag in some runtimes. date-fns v4 is the safe, modern choice. |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Pages Router | Legacy API. No Server Components, no `generateMetadata`, no streaming. Next.js investment is in App Router. Starting a new project on Pages Router in 2026 is technical debt from day one. | App Router |
| next-seo package | Unnecessary with Next.js Metadata API. Adds runtime JS for something the framework does natively at zero cost. | `generateMetadata()` + `schema-dts` for JSON-LD |
| next-sitemap package | Unnecessary. Built-in `sitemap.ts` handles everything including hreflang alternates and image sitemaps. One fewer dependency. | Built-in `sitemap.ts` / `robots.ts` |
| styled-components / Emotion | CSS-in-JS libraries add runtime overhead (parsing CSS in the browser). Incompatible with React Server Components without workarounds. Tailwind v4 is faster and produces smaller bundles. | Tailwind CSS v4 |
| Contentlayer | Abandoned. Main sponsor (Stackbit) acquired by Netlify. Incompatible with App Router. | Local JSON/TS files + Zod validation |
| next-i18next | Does not support App Router. Only works with Pages Router. | next-intl |
| moment.js | Massive bundle (300KB+), mutable API, officially in maintenance mode. | date-fns |
| Create React App | Dead project. No SSG, no SSR, no SEO. | Next.js |
| @vercel/og (standalone) | Use `next/og` import instead -- it's maintained as part of Next.js and has the same API. `@vercel/og` is the standalone version for non-Next.js projects. | `next/og` (ImageResponse) |
| MDX (for content pages) | Overkill for this project. Content is structured data (cities, stadiums, teams), not free-form prose with embedded components. JSON + React components is simpler and more maintainable. | JSON data files + TypeScript page components |
| Google Tag Manager | Adds an extra layer of indirection. For a single-developer project with one analytics property, direct GA4 via `@next/third-parties` is simpler and faster. GTM is for marketing teams managing dozens of tags. | Direct GA4 via @next/third-parties |
## Stack Patterns by Variant
- Use `generateStaticParams` to pre-render all pages at build time
- Import JSON data directly in server components (zero API calls)
- Use ISR with `revalidate: 86400` (daily) for pages that might need match schedule updates
- Because: SSG gives fastest possible load times and best SEO
- Use Client Components (`'use client'`) only for the interactive parts
- Keep the page shell as a Server Component for SEO (metadata, JSON-LD)
- Because: Calculators need client-side state, but search engines should still index the page content
- Wrap in a tracked `<AffiliateLink>` component that fires GA4 events on click
- Use `rel="nofollow sponsored"` attributes
- Because: Centralized tracking and SEO compliance
- Use `[locale]` dynamic segment at the root: `/es/ciudad/mexico-city`, `/en/city/mexico-city`
- Generate hreflang alternates via `generateMetadata` + `sitemap.ts`
- Translate URL slugs (Spanish slugs for `/es/`, English slugs for `/en/`)
- Because: Translated URLs improve SEO in each language market
## Version Compatibility
| Package | Compatible With | Notes |
|---------|-----------------|-------|
| next@16.2.x | react@19.2.x, react-dom@19.2.x | Next.js 16 requires React 19. Installed automatically by create-next-app. |
| next@16.2.x | tailwindcss@4.2.x | First-class support. create-next-app sets up CSS-first config automatically. |
| next@16.2.x | typescript@5.8.x | Verified compatible. TS 6.0 may also work but is 3 days old -- let create-next-app decide. |
| next-intl@4.8.x | next@16.2.x | Compatible. Known issue: `use cache` directive conflicts with translated server components. Workaround: don't use `use cache` on i18n pages (not needed for SSG anyway). |
| eslint-config-next@16.2.x | eslint@9.x | Requires ESLint flat config (`eslint.config.mjs`). Legacy `.eslintrc` format no longer supported. |
| zod@3.24.x | typescript@5.8.x+ | Fully compatible. |
| react-hook-form@7.x | react@19.x | Compatible with React 19. |
| schema-dts@1.1.x | typescript@5.x+ | Type-only package. Compatible with any TS version. |
## Confidence Assessment
| Area | Confidence | Rationale |
|------|------------|-----------|
| Next.js 16 as framework | HIGH | Current stable, native Vercel framework, SSG/ISR proven at scale. Verified via official blog and docs. |
| Tailwind CSS v4 | HIGH | Stable since Jan 2025, 14+ months of production use. Official Next.js integration. |
| next-intl for i18n | HIGH | De facto standard for App Router i18n. 4.8.x confirmed compatible with Next.js 16. Active maintenance. |
| Local JSON data over CMS | HIGH | Project constraints (single developer, bounded dataset, 3-month deadline) make CMS overhead unjustifiable. |
| llms.txt for LLM optimization | MEDIUM | Adopted by 844K+ sites including Anthropic and Vercel. But Google hasn't confirmed ranking impact. Princeton research supports structured citation stats. Worth implementing (low effort) but don't rely on it as sole LLM strategy. |
| schema-dts for JSON-LD | HIGH | Google-maintained, 100K+ weekly downloads, zero runtime cost. Standard approach verified in Next.js docs. |
| GEO (Generative Engine Optimization) | MEDIUM | Emerging field. Princeton research shows 30-40% higher AI visibility with citations/statistics. Tactics are sound but measurement is still maturing. |
| TypeScript 5.8.x vs 6.0 | MEDIUM | TS 6.0 released 3 days ago. Use whatever create-next-app installs. Both will work. |
## Sources
- [Next.js 16 Release Blog](https://nextjs.org/blog/next-16) -- features, Turbopack stable, React Compiler
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16) -- breaking changes, migration
- [Next.js Metadata API / JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) -- structured data implementation
- [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) -- SSG for dynamic routes
- [Next.js Built-in Sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) -- sitemap.ts convention
- [Next.js OG Image Generation](https://nextjs.org/docs/app/api-reference/functions/image-response) -- ImageResponse API
- [Next.js @next/third-parties for GA4](https://nextjs.org/docs/app/guides/third-party-libraries) -- analytics integration
- [Tailwind CSS v4.0 Release](https://tailwindcss.com/blog/tailwindcss-v4) -- CSS-first config, Oxide engine
- [next-intl Docs](https://next-intl.dev/docs/getting-started/app-router) -- App Router setup
- [next-intl 4.0 Release](https://next-intl.dev/blog/next-intl-4-0) -- SWC plugin, ahead-of-time compilation
- [schema-dts on GitHub](https://github.com/google/schema-dts) -- TypeScript Schema.org types
- [llms.txt Specification](https://llmstxt.org/) -- proposed standard by Jeremy Howard
- [llms.txt Adoption (Bluehost Guide)](https://www.bluehost.com/blog/what-is-llms-txt/) -- 844K+ sites, implementation details
- [GEO Complete Guide (Similarweb)](https://www.similarweb.com/blog/marketing/geo/what-is-geo/) -- citation optimization tactics
- [GEO Research Paper (Princeton/arXiv)](https://arxiv.org/pdf/2311.09735) -- 30-40% visibility improvement with statistics
- [Zod on npm](https://www.npmjs.com/package/zod) -- version, downloads
- [TypeScript 6.0 Announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) -- latest release
- [React 19 Versions](https://react.dev/versions) -- 19.2.x stable
- [ESLint 9 Flat Config with Next.js 16](https://chris.lu/web_development/tutorials/next-js-16-linting-setup-eslint-9-flat-config) -- migration guide
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
