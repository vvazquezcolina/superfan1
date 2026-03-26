# Roadmap: SuperFan Mundial 2026

## Overview

This roadmap delivers a complete Spanish-first World Cup 2026 content site from an empty Next.js project to a fully monetized, SEO/LLM-optimized guide covering 16 host cities, 16 stadiums, 48 teams, and comprehensive travel content. Phases follow the architecture's natural dependency chain: data foundation first, then content pages that exercise it, then optimization layers that enhance those pages, then monetization that generates revenue from them, then expansion content and interactive tools that differentiate the site. The World Cup starts June 11, 2026 -- content must be live and indexing by mid-April to capture pre-tournament search traffic.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Project Scaffold & Data Architecture** - Next.js 16 project with TypeScript, Tailwind, bilingual routing, content data layer, and Zod schemas
- [ ] **Phase 2: Base Layout & Technical SEO** - Shared layout, navigation, responsive design, sitemap, robots, metadata, and FIFA disclaimer
- [ ] **Phase 3: City Guides** - 16 host city pages with deep editorial content and city index page
- [ ] **Phase 4: Stadium Pages & Homepage** - 16 stadium pages, stadium index, and homepage with featured content sections
- [ ] **Phase 5: LLM Optimization Layer** - JSON-LD schema stacking, llms.txt, FAQ sections, direct-answer blocks, and freshness signals
- [x] **Phase 6: Monetization & Analytics** - GA4 integration, affiliate link system, Booking.com widgets, disclosure page, and privacy/cookie compliance (completed 2026-03-26)
- [ ] **Phase 7: Team Pages** - 48 team pages with group assignments, history, and team index
- [ ] **Phase 8: Travel & Fan Experience Guides** - Flight, hotel, transport, visa, ticket, safety guides, and match schedule calendar
- [x] **Phase 9: Lead Capture & Engagement** - Newsletter signup, countdown timer, and site-wide search (completed 2026-03-26)
- [ ] **Phase 10: Interactive Tools & Final Polish** - Budget calculator, interactive host city map, and content attribution audit

## Phase Details

### Phase 1: Project Scaffold & Data Architecture
**Goal**: A working Next.js 16 application is deployed on Vercel with bilingual routing, typed content schemas, and data loaders -- the foundation every content page builds on
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-06, INFRA-07
**Success Criteria** (what must be TRUE):
  1. Visiting superfaninfo.com shows a deployed Next.js application on Vercel
  2. Navigating to /es/ and /en/ renders locale-specific content with correct hreflang alternates
  3. Content JSON files are validated by Zod schemas at build time -- invalid data breaks the build
  4. Data loader functions return typed content for cities, stadiums, and teams (even if pages don't exist yet)
  5. The build generates static pages for both locales via generateStaticParams
**Plans:** 2 plans

Plans:
- [x] 01-01-PLAN.md -- Bootstrap Next.js 16 project with bilingual i18n routing, proxy, and English URL rewrites
- [x] 01-02-PLAN.md -- Zod schemas, content JSON files (16 cities, 16 stadiums, 48 teams), data loaders, and stub pages with SSG
**UI hint**: yes

### Phase 2: Base Layout & Technical SEO
**Goal**: Every page shares a polished, mobile-first layout with header, footer, navigation, breadcrumbs, and full technical SEO baseline -- visitors and search engines see a professional site
**Depends on**: Phase 1
**Requirements**: INFRA-05, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, LEGAL-01
**Success Criteria** (what must be TRUE):
  1. Every page renders a consistent header with navigation, footer with FIFA non-affiliation disclaimer, and breadcrumbs
  2. /sitemap.xml returns a valid sitemap with all pages and proper priority levels
  3. /robots.txt returns valid directives allowing search engine crawling
  4. Every page has a unique title, meta description, canonical URL, Open Graph tags, and Twitter Cards
  5. The site is fully responsive -- usable on mobile, tablet, and desktop with touch-friendly navigation
**Plans:** 3 plans

Plans:
- [x] 02-01-PLAN.md -- Tailwind v4 green/gold theme, Header, Footer, MobileNav components, layout integration
- [x] 02-02-PLAN.md -- sitemap.ts, robots.ts, seo.ts metadata helper, enhanced generateMetadata on all pages
- [x] 02-03-PLAN.md -- Breadcrumbs component, BreadcrumbList JSON-LD, WebSite JSON-LD, visual verification
**UI hint**: yes

### Phase 3: City Guides
**Goal**: Visitors can browse all 16 host city guides with deep, native Spanish content covering everything a Latin American fan needs to plan their trip
**Depends on**: Phase 2
**Requirements**: CITY-01, CITY-02, CITY-03, CITY-04, LEGAL-03
**Success Criteria** (what must be TRUE):
  1. All 16 host city guide pages are live with overview, getting there, getting around, neighborhoods, food, safety, and weather sections
  2. Each city page includes cultural context for Latin American fans (Spanish-speaking services, community spots, consulate info)
  3. A city index page at /es/ciudades/ lists all 16 cities organized by country (Mexico, USA, Canada)
  4. Content is native Spanish (not translated) with English versions available at /en/cities/
  5. Content cites official tourism sites, FIFA.com, and named sources where applicable
**Plans:** 5 plans

Plans:
- [x] 03-01-PLAN.md -- Extend CitySchema with rich content fields, city components, city index page, Ciudad de Mexico full content
- [x] 03-02-PLAN.md -- Full content for Monterrey, Guadalajara, New York/New Jersey, Los Angeles
- [x] 03-03-PLAN.md -- Full content for Dallas, Houston, Atlanta, Philadelphia
- [x] 03-04-PLAN.md -- Full content for Miami, Seattle, San Francisco, Boston, Kansas City
- [x] 03-05-PLAN.md -- Full content for Toronto, Vancouver (completes all 16 cities)
**UI hint**: yes

### Phase 4: Stadium Pages & Homepage
**Goal**: Visitors can explore all 16 stadium pages and land on a homepage that surfaces featured content and provides clear navigation to every section of the site
**Depends on**: Phase 3
**Requirements**: STAD-01, STAD-02, STAD-03, TOOL-03
**Success Criteria** (what must be TRUE):
  1. All 16 stadium pages are live with capacity, location, transport, nearby hotels, and accessibility info
  2. A stadium index page lists all 16 stadiums organized by city and country
  3. Each stadium page links to its host city guide
  4. The homepage features content sections, a countdown placeholder, and clear navigation to cities, stadiums, and all major sections
**Plans:** 2 plans

Plans:
- [x] 04-01-PLAN.md -- Extend StadiumSchema, stadium components, stadium index page, 8 stadiums full content (Mexico 3 + USA 5)
- [x] 04-02-PLAN.md -- Remaining 8 stadiums full content (USA 6 + Canada 2) and homepage with hero, featured sections, CTAs
**UI hint**: yes

### Phase 5: LLM Optimization Layer
**Goal**: Every content page is optimized for AI assistant citation -- structured data, FAQ schemas, direct answers, and machine-readable site descriptions make SuperFan the authoritative source LLMs reference
**Depends on**: Phase 4
**Requirements**: LLM-01, LLM-02, LLM-03, LLM-04, LLM-05, LLM-06, LLM-07
**Success Criteria** (what must be TRUE):
  1. Every content page has stacked JSON-LD schemas appropriate to its type (Place, StadiumOrArena, FAQPage, Article, Organization)
  2. /llms.txt and /llms-full.txt exist at the site root and are updated with each deployment
  3. The first 200 words of every content page directly answer the primary query for that page
  4. Every content page includes 3-5 FAQ questions with FAQPage schema markup
  5. Statistics and facts throughout content cite named sources for higher AI citation probability
**Plans:** 2 plans

Plans:
- [x] 05-01-PLAN.md -- Install schema-dts, create JSON-LD factory functions in src/lib/jsonld.ts, stack schemas on all 6 page types
- [x] 05-02-PLAN.md -- llms.txt/llms-full.txt route handlers, direct-answer blocks, prompt-aligned headers, key facts, freshness signals

### Phase 6: Monetization & Analytics
**Goal**: The site generates revenue through contextual affiliate links and tracks all user interactions -- every city page has hotel booking widgets, every affiliate link is FTC-compliant, and GA4 captures meaningful events
**Depends on**: Phase 5
**Requirements**: MON-01, MON-02, MON-03, MON-04, MON-05, MON-06, MON-07, MON-08, LEGAL-02
**Success Criteria** (what must be TRUE):
  1. GA4 (G-HMRJTYPDPP) tracks page views on every page and fires custom events for affiliate clicks, newsletter signups, and tool usage
  2. An AffiliateLink component renders affiliate URLs with rel="nofollow sponsored", inline FTC disclosure text, and GA4 click tracking
  3. Booking.com hotel search widgets appear contextually on city guide pages
  4. An affiliate disclosure page exists at /es/divulgacion/ with FTC-compliant Spanish language
  5. A privacy policy page and cookie consent banner handle GDPR/CCPA compliance
**Plans:** 2/2 plans complete

Plans:
- [x] 06-01-PLAN.md -- GA4 integration, affiliate data layer (affiliates.json + Zod loader), AffiliateLink component, Booking.com widgets on city pages, affiliate disclosure page
- [x] 06-02-PLAN.md -- Privacy policy pages, About pages, cookie consent banner, Footer link fixes for locale-aware legal paths

### Phase 7: Team Pages
**Goal**: Fans can browse all 48 participating teams with group assignments, World Cup history, key players, and links to host city guides where their matches will be played
**Depends on**: Phase 4
**Requirements**: TEAM-01, TEAM-02, TEAM-03
**Success Criteria** (what must be TRUE):
  1. All 48 team pages are live with group assignment, historical World Cup record, key players, and qualifying path
  2. A team index page organizes all 48 teams by group and confederation
  3. Each team page links to host city guides for their match venues (when schedule data is available)
**Plans:** 4 plans

Plans:
- [x] 07-01-PLAN.md -- Extend TeamSchema, build team components (TeamHero/Section/FAQ), team index page, 12 priority teams (CONCACAF + top CONMEBOL)
- [ ] 07-02-PLAN.md -- 12 European powerhouses (Spain, France, Germany, England, Portugal, Netherlands, Belgium, Italy, Croatia, Denmark, Switzerland, Austria)
- [ ] 07-03-PLAN.md -- 12 more teams (Serbia, Scotland, Poland, Turkey + 8 CAF: Morocco, Senegal, Nigeria, Cameroon, Tunisia, Algeria, Egypt, Ivory Coast)
- [ ] 07-04-PLAN.md -- Final 12 teams (Ecuador, Paraguay, South Africa + all AFC 8 + New Zealand) + full build validation
**UI hint**: yes

### Phase 8: Travel & Fan Experience Guides
**Goal**: Visitors find comprehensive, practical travel guides covering every aspect of attending the World Cup -- flights, hotels, intercity transport, visas, tickets, safety, and a filterable match schedule
**Depends on**: Phase 6
**Requirements**: TRVL-01, TRVL-02, TRVL-03, TRVL-04, TRVL-05, TRVL-06, TRVL-07
**Success Criteria** (what must be TRUE):
  1. Flight guide pages cover booking from Mexico, USA, and Europe with practical advice
  2. Accommodation guides cover neighborhoods and price ranges by city with affiliate hotel links
  3. A visa and entry requirements guide covers USA ESTA, Mexico FMM, and Canada eTA by nationality
  4. Ticket buying and safety/insurance guides provide actionable advice with scam warnings
  5. A match schedule page is filterable by city, team, group, and date (using ISR for updates as FIFA releases data)
**Plans:** 2 plans

Plans:
- [ ] 08-01-PLAN.md -- GuidePage schema + travel.json (7 guides), flight/accommodation/transport/visa pages under /viajes/
- [ ] 08-02-PLAN.md -- fan.json (ticket + safety guides), matches.json (48 group stage), fan experience pages + match calendar
**UI hint**: yes

### Phase 9: Lead Capture & Engagement
**Goal**: The site captures email leads for pre-tournament engagement and helps visitors find content quickly -- newsletter forms, a countdown timer building urgency, and search across all pages
**Depends on**: Phase 6
**Requirements**: LEAD-01, LEAD-02, LEAD-03
**Success Criteria** (what must be TRUE):
  1. Newsletter signup forms (name + email) appear inline within content and trigger on exit-intent
  2. A countdown timer to June 11, 2026 is visible on the homepage and key pages
  3. Site-wide search lets visitors find content across all pages (Pagefind or equivalent)
**Plans:** 1/1 plans complete

Plans:
- [x] 09-01-PLAN.md -- NewsletterSignup + ExitIntentWrapper components, live CountdownTimer, Pagefind search with Header trigger
**UI hint**: yes

### Phase 10: Interactive Tools & Final Polish
**Goal**: Differentiated interactive tools that no competitor offers -- a budget calculator helps fans estimate trip costs, and an interactive map lets them explore all 16 host cities visually
**Depends on**: Phase 8
**Requirements**: TOOL-01, TOOL-02
**Success Criteria** (what must be TRUE):
  1. The budget calculator accepts origin, destination, days, hotel tier, and meals -- outputs an estimated total with contextual affiliate links
  2. An interactive map displays all 16 stadiums with pop-up cards linking to city and stadium pages
  3. Both tools track usage events in GA4
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10
Note: Phases 7 and 9 can run in parallel with 8 (they share Phase 6 as dependency but are independent of each other).

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Scaffold & Data Architecture | 2/2 | Complete | 2026-03-26 |
| 2. Base Layout & Technical SEO | 0/3 | Planning complete | - |
| 3. City Guides | 0/5 | Planning complete | - |
| 4. Stadium Pages & Homepage | 0/2 | Planning complete | - |
| 5. LLM Optimization Layer | 0/2 | Planning complete | - |
| 6. Monetization & Analytics | 2/2 | Complete   | 2026-03-26 |
| 7. Team Pages | 0/4 | Planning complete | - |
| 8. Travel & Fan Experience Guides | 0/2 | Planning complete | - |
| 9. Lead Capture & Engagement | 1/1 | Complete   | 2026-03-26 |
| 10. Interactive Tools & Final Polish | 0/TBD | Not started | - |
