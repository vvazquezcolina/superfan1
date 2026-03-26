# SuperFan Mundial 2026

## What This Is

A comprehensive SEO and LLM-optimized content site covering the FIFA World Cup 2026 across Mexico, USA, and Canada. Targets Spanish-speaking fans with travel guides, ticket info, city guides, interactive tools, and affiliate-driven monetization. Designed to rank in search engines AND be cited by AI assistants (ChatGPT, Claude, Perplexity, Google AI Overviews).

## Core Value

Be the most complete, accurate, and well-structured Spanish-language independent guide to the World Cup 2026 — optimized so both search engines and LLMs surface our content as authoritative answers.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Migrate from static HTML to Next.js SSG on Vercel for performance, SEO, and maintainability
- [ ] Complete coverage of all 16 host cities (11 USA + 3 Mexico + 2 Canada) with deep, unique content
- [ ] Complete coverage of all 16 stadiums with capacity, location, transport, and match info
- [ ] LLM optimization: structured data (JSON-LD), FAQ schemas, clear factual answers, llms.txt
- [ ] Interactive tools: budget calculator, trip planner, flight alerts (functional, not placeholder)
- [ ] Affiliate monetization: Booking.com, Skyscanner, GetYourGuide, travel insurance partners
- [ ] GA4 integration (G-HMRJTYPDPP) with conversion tracking and custom events
- [ ] Lead capture: newsletter signup forms with email collection for pre-tournament engagement
- [ ] Bilingual content strategy: primary Spanish with English long-tail keyword targeting
- [ ] Real match schedule data when FIFA releases it, with filterable calendar
- [ ] All 48 team pages with squad info, group assignments, and historical context
- [ ] Travel content: flights, hotels, transport between cities with real affiliate links
- [ ] Fan experience: ticket buying guides, safety info, viewing party locations
- [ ] Weekly review tracking system for performance monitoring and content adjustment
- [ ] Mobile-first responsive design with modern UI/UX
- [ ] Sitemap, robots.txt, canonical URLs, Open Graph, Twitter Cards — full technical SEO

### Out of Scope

- Real-time match scores or live data feeds — too complex, better served by ESPN/FIFA
- User accounts or authentication — content site, not a platform
- E-commerce or direct ticket sales — legal/FIFA licensing issues
- Native mobile app — web-first, PWA if needed later
- Video content hosting — bandwidth costs, use YouTube embeds instead
- Multi-language beyond ES/EN — focus on two languages first

## Context

- **Domain**: https://www.superfaninfo.com/
- **Hosting**: Vercel (free tier to start, upgrade if traffic demands)
- **Analytics**: GA4 Measurement ID G-HMRJTYPDPP, Stream ID 14232810636
- **Current state**: 37 static HTML pages auto-generated from CSV via Python scripts. Content is template-quality, needs complete rewrite. No monetization implemented. Missing most US host cities and stadiums.
- **Timeline**: World Cup runs June 11 - July 19, 2026. ~3 months to position. SEO needs time to index; LLM optimization can have faster impact.
- **Market**: Spanish-speaking football fans in Mexico, USA (Hispanic market), and Latin America. Less competition in Spanish long-tail than English.
- **Revenue model**: Affiliate commissions (travel, hotels, tickets, insurance), newsletter-driven engagement, potential display ads at scale.
- **Existing assets**: CSV with SEO keyword structure, Python generation scripts, Pexels image integration, domain registered.

## Constraints

- **Timeline**: Must be live and indexed before June 2026. Every week of delay = lost SEO value.
- **Tech stack**: Next.js + Vercel (SSG for performance, ISR for updates). TypeScript.
- **Budget**: Minimize paid services. Use free tiers (Vercel, GA4, free affiliate programs).
- **Legal**: Must include clear FIFA non-affiliation disclaimers. No official FIFA branding/logos.
- **Content**: Must be factual and up-to-date. No fabricated data. Cite sources where possible.
- **Images**: Use Pexels/Unsplash (free, attributed) or create original graphics.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Migrate to Next.js SSG | Static HTML doesn't scale, needs components, routing, ISR for updates | — Pending |
| Spanish-first with EN long-tail | Less competition in Spanish, large addressable market | — Pending |
| LLM optimization as primary differentiator | Traditional SEO is saturated; LLM citations are the new frontier | — Pending |
| Fine-grained GSD phases | Project is complex with many parallel workstreams; fine granularity enables parallel execution | — Pending |
| Quality model profile for agents | This is a revenue-generating project; investment in quality planning pays off | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-26 after initialization*
