---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Phase complete — ready for verification
stopped_at: Completed 07-03-PLAN.md
last_updated: "2026-03-27T00:14:40.592Z"
progress:
  total_phases: 10
  completed_phases: 7
  total_plans: 23
  completed_plans: 20
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-26)

**Core value:** Be the most complete, accurate, and well-structured Spanish-language independent guide to the World Cup 2026 -- optimized so both search engines and LLMs surface our content as authoritative answers.
**Current focus:** Phase 07 — team-pages

## Current Position

Phase: 07 (team-pages) — EXECUTING
Plan: 4 of 4

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: -
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**

- Last 5 plans: -
- Trend: -

*Updated after each plan completion*
| Phase 01 P01 | 6min | 2 tasks | 75 files |
| Phase 01 P02 | 5min | 2 tasks | 10 files |
| Phase 02 P01 | 3min | 2 tasks | 8 files |
| Phase 02 P02 | 3min | 2 tasks | 7 files |
| Phase 02 P03 | 2min | 3 tasks | 6 files |
| Phase 03 P01 | 9min | 2 tasks | 11 files |
| Phase 03 P02 | 10min | 2 tasks | 1 files |
| Phase 03 P03 | 10min | 2 tasks | 1 files |
| Phase 03 P04 | 14min | 2 tasks | 1 files |
| Phase 03 P05 | 7min | 1 tasks | 1 files |
| Phase 04 P01 | 17min | 2 tasks | 11 files |
| Phase 04 P02 | 12min | 2 tasks | 4 files |
| Phase 05 P01 | 4min | 2 tasks | 8 files |
| Phase 05 P02 | 3min | 2 tasks | 8 files |
| Phase 06 P01 | 2min | 2 tasks | 13 files |
| Phase 06 P02 | 4min | 2 tasks | 9 files |
| Phase 09 P01 | 4min | 3 tasks | 10 files |
| Phase 07 P01 | 15 | 3 tasks | 7 files |
| Phase 07 P02 | 17min | 2 tasks | 1 files |
| Phase 07 P03 | 20 | 3 tasks | 1 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap]: Fine granularity with 10 phases to enable focused execution on a deadline-driven project
- [Roadmap]: City content before stadiums to establish editorial quality standards with the most complex content type first
- [Roadmap]: LLM optimization as dedicated phase after content exists (can't optimize empty pages)
- [Roadmap]: Monetization before expansion content -- revenue flowing from 16 city pages beats 48 unmonetized team pages
- [Phase 01]: Used getDictionary pattern with server-only guard instead of next-intl (per D-01)
- [Phase 01]: proxy.ts exports proxy() function for Next.js 16 locale detection (per D-02)
- [Phase 01]: es-419 for Spanish hreflang, x-default points to /es/ (per D-03)
- [Phase 01]: Pinned Zod to 3.24.x for ecosystem compatibility per STACK.md
- [Phase 01]: All 48 teams included with bilingual names and confederation assignments
- [Phase 01]: Stadium slugs same in both languages (proper nouns)
- [Phase 01]: Data loaders validate JSON at module-level import time (build fails on invalid data)
- [Phase 02]: Header is Server Component with MobileNav as client island for minimal client JS
- [Phase 02]: Nav paths hardcoded with locale-aware mapping for viajes/travel and herramientas/tools (not yet in pathTranslations)
- [Phase 02]: CSS custom properties in :root consumed by @theme inline for Tailwind v4 utility class generation
- [Phase 02]: buildPageMetadata pattern: all pages import from @/lib/seo for consistent OG/Twitter/canonical metadata
- [Phase 02]: robots.txt allows all crawlers including AI bots (GPTBot, ClaudeBot, PerplexityBot) with no restrictions
- [Phase 02]: Sitemap priority levels: 1.0 homepage, 0.9 cities, 0.8 stadiums, 0.7 teams
- [Phase 02]: Breadcrumbs rendered at page level (not layout) because each page knows its entity name and layout Server Components cannot access current URL path
- [Phase 02]: JSON-LD injection pattern: script type=application/ld+json with dangerouslySetInnerHTML at page component level for BreadcrumbList and WebSite schemas
- [Phase 03]: Native HTML details/summary for FAQ accordion - zero client JS, accessible by default
- [Phase 03]: City content paragraphs split by double newline - no markdown parser needed
- [Phase 03]: Placeholder content pattern: brief valid content passing Zod schema, replaced by subsequent plans
- [Phase 03]: Native Spanish content written first, English created after -- authentic voice per D-02
- [Phase 03]: Multiple official tourism sources cited per city for credibility (turismo.monterrey, visitguadalajara, nycgo, discoverlosangeles)
- [Phase 03]: Dallas AT&T Stadium emphasizes Oak Cliff Mexican-American neighborhood and warns about Arlington transit gap
- [Phase 03]: Houston content highlights METRORail Red Line direct NRG Park connection as key transit advantage
- [Phase 03]: Atlanta content positions Buford Highway as 10+ mile international food corridor with Plaza Fiesta
- [Phase 03]: Philadelphia content leverages Amtrak NYC/DC connectivity as strategic multi-city World Cup base
- [Phase 03]: Miami positioned as THE gateway city -- 70% Hispanic, Spanish-dominant, every Latin consulate present
- [Phase 03]: Seattle Lumen Field highlighted as best transit-connected stadium (Light Rail adjacent)
- [Phase 03]: SF weather contrast emphasized: foggy 13-18C in city vs sunny 20-30C at Levi's Stadium in Santa Clara
- [Phase 03]: Boston Gillette Stadium transit gap documented honestly -- Foxborough 50km away with no regular transit
- [Phase 03]: Kansas City BBQ and KCK Westside 100-year Mexican-American heritage positioned as unique value proposition
- [Phase 03]: Toronto: BMO Field waterfront, Kensington Market bohemian hub, St. Clair West Latino epicenter, eTA prominently featured
- [Phase 03]: Vancouver: most scenic World Cup city, Asian-Pacific cultural identity, BC Place easiest stadium to reach downtown, DTES honest disclosure
- [Phase 03]: All 16 host cities complete with full bilingual editorial content -- Phase 03 done, zero placeholders
- [Phase 04]: Reused CitySectionSchema/CityFAQSchema/CitySourceSchema in StadiumContentSchema -- same shape avoids duplication
- [Phase 04]: Stadium components in separate /stadium/ namespace despite structural similarity to city components -- allows future divergence
- [Phase 04]: Placeholder content added to all 16 stadiums in Task 1 to satisfy build-time Zod validation before Task 2 populated full content
- [Phase 04]: Featured cities: CDMX, LA, Toronto (one per country); Featured stadiums: Azteca, SoFi, BC Place (iconic per country)
- [Phase 04]: Homepage countdown: server-rendered date math, no date-fns dependency -- adequate for SSG
- [Phase 04]: All 16 stadiums complete with full bilingual editorial content -- zero placeholders in content/stadiums.json
- [Phase 05]: JSON-LD factory pattern: all structured data built via centralized src/lib/jsonld.ts with schema-dts types
- [Phase 05]: Schema stacking pattern: multiple JSON-LD script tags per page for LLM/search engine extraction
- [Phase 05]: llms.txt and llms-full.txt auto-generated via force-static route handlers from content data loaders
- [Phase 05]: titleOverride prop pattern on section components enables prompt-aligned headers without breaking existing titles
- [Phase 05]: Key facts with cited statistics (FIFA.com, official sites) per Princeton GEO research for 30-40% AI visibility improvement
- [Phase 06]: Cookie-consent-gated GA4: reads localStorage cookie-consent on mount, defaults to null until Plan 02 adds cookie banner UI
- [Phase 06]: BookingWidget is server component wrapping AffiliateLink client island for optimal RSC/hydration split
- [Phase 06]: Booking.com affiliate aid 304142 used as standard public affiliate tracking ID with World Cup week 1 default dates (June 11-18, 2026)
- [Phase 06]: Single-locale generateStaticParams used for language-specific legal pages (privacidad/privacy, acerca/about)
- [Phase 06]: CookieConsent dispatches cookie-consent-changed event on accept so GoogleAnalytics can load GA4 without page reload
- [Phase 06]: getLegalPath() added inline to Footer.tsx for locale-aware legal URL mapping (privacidad, acerca, divulgacion for ES)
- [Phase 09]: Pagefind via npx (not installed in node_modules) to avoid large binary dependency; postbuild script auto-runs after npm run build
- [Phase 09]: SearchModal is self-contained with trigger button -- Header is a Server Component so isOpen state must live in the client island itself
- [Phase 09]: Newsletter form fires GA4 event only (no backend POST) -- email provider wiring deferred to Resend/Buttondown per D-01
- [Phase 07]: TeamContentSchema.content is optional on TeamSchema so 36 non-content teams still validate at build time
- [Phase 07]: Team index groups by group field; ungrouped section shows all teams until FIFA draw assigns groups
- [Phase 07]: TeamFAQ casts as CityFAQ[] for buildFAQPageJsonLd — structurally identical shapes
- [Phase 07]: Phase 07-02: Ronaldo content uses hedged language ('posiblemente su ultimo Mundial') - not stated as fact
- [Phase 07]: Phase 07-02: Eriksen cardiac arrest story used as primary narrative hook for Denmark page - strongest emotional differentiator
- [Phase 07]: Phase 07-02: Italy FAQ explains 2018/2022 absences directly - most common search question for Italian team
- [Phase 07]: Used Python scripts for bulk JSON content injection — safer than string replacements on large JSON files

### Pending Todos

None yet.

### Blockers/Concerns

- World Cup starts June 11, 2026 -- ~2.5 months to get content live and indexing. Every week of delay costs SEO value.
- FIFA match schedule may not be finalized -- TRVL-07 and TEAM-03 depend on external data availability. ISR architecture must handle partial data.
- Booking.com affiliate approval is async -- apply during Phase 1, integrate in Phase 6.
- Vercel Pro upgrade needed by late May 2026 for traffic capacity.

## Session Continuity

Last session: 2026-03-27T00:14:35.366Z
Stopped at: Completed 07-03-PLAN.md
Resume file: None
