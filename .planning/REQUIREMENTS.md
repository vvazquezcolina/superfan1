# Requirements: SuperFan Mundial 2026

**Defined:** 2026-03-26
**Core Value:** Be the most complete, accurate, and well-structured Spanish-language independent guide to the World Cup 2026 — optimized so both search engines and LLMs surface our content as authoritative answers.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation & Infrastructure

- [x] **INFRA-01**: Next.js 16 project with App Router, TypeScript, Tailwind v4 deployed on Vercel
- [x] **INFRA-02**: Bilingual routing with `[lang]` segment — `/es/` (primary) and `/en/` prefixes with proper hreflang alternates
- [x] **INFRA-03**: Content data layer using typed JSON files with Zod schema validation at build time
- [x] **INFRA-04**: Data loader functions as single access point for all content (abstracted from storage)
- [x] **INFRA-05**: Base layout with header, footer, navigation, breadcrumbs, and FIFA non-affiliation disclaimer
- [x] **INFRA-06**: Middleware for locale detection and redirect
- [x] **INFRA-07**: `generateStaticParams` configured for SSG across both locales

### Content — Cities

- [ ] **CITY-01**: 16 host city guide pages with overview, getting there, getting around, neighborhoods, food, safety, weather
- [ ] **CITY-02**: Each city page includes cultural context relevant to Latin American fans (Spanish-speaking services, community spots, consulate info)
- [ ] **CITY-03**: City listing/index page with all 16 cities organized by country (Mexico, USA, Canada)
- [ ] **CITY-04**: Content is native Spanish (not translated), with English versions as secondary locale

### Content — Stadiums

- [ ] **STAD-01**: 16 stadium pages with capacity, location, transport, nearby hotels, accessibility info
- [ ] **STAD-02**: Stadium listing/index page organized by city/country
- [ ] **STAD-03**: Each stadium page links to its host city guide and match schedule (when available)

### Content — Teams

- [ ] **TEAM-01**: 48 team pages with group assignment, historical World Cup record, key players, qualifying path
- [ ] **TEAM-02**: Team listing/index page organized by group and confederation
- [ ] **TEAM-03**: Each team page includes schedule of matches (when available) and links to host city guides

### Content — Travel & Fan Experience

- [ ] **TRVL-01**: Flight guide pages (general + from Mexico, from USA, from Europe) with practical booking advice
- [ ] **TRVL-02**: Accommodation guide pages (general + by city) with neighborhood recommendations and price ranges
- [ ] **TRVL-03**: Transport between cities guide with practical options (flights, buses, trains, rental cars)
- [ ] **TRVL-04**: Visa and entry requirements guide covering USA ESTA/visa, Mexico FMM, Canada eTA by nationality
- [ ] **TRVL-05**: Ticket buying guide with safety advice, categories, pricing tiers, scam warnings, official links
- [ ] **TRVL-06**: Safety and travel insurance guide with practical recommendations
- [ ] **TRVL-07**: Match schedule/calendar page filterable by city, team, group, and date (ISR for updates)

### SEO & Technical

- [x] **SEO-01**: Programmatic sitemap.ts and robots.ts with proper priority levels and change frequencies
- [x] **SEO-02**: Canonical URLs, Open Graph tags, and Twitter Cards on every page via `generateMetadata()`
- [x] **SEO-03**: Proper heading hierarchy (single H1, structured H2/H3) on every page
- [x] **SEO-04**: Alt text on all images, lazy loading, responsive images via next/image
- [ ] **SEO-05**: BreadcrumbList JSON-LD schema on every page
- [x] **SEO-06**: Mobile-first responsive design with touch-friendly navigation

### LLM Optimization

- [ ] **LLM-01**: JSON-LD schema stacking per page type (Place for cities, StadiumOrArena for stadiums, SportsEvent for matches, FAQPage for FAQs, Article for guides)
- [ ] **LLM-02**: llms.txt and llms-full.txt files at site root, updated with each content deployment
- [ ] **LLM-03**: Direct-answer content blocks — first 200 words of every page directly answer the primary query
- [ ] **LLM-04**: FAQ sections with FAQPage schema on every content page (3-5 natural-language questions per page)
- [ ] **LLM-05**: Prompt-aligned H2/H3 headers phrased as questions users and AI systems would ask
- [ ] **LLM-06**: Content freshness signals — "Last updated" visible date on every page, ISR for regular rebuilds
- [ ] **LLM-07**: Cited statistics with named sources throughout content for higher AI citation probability

### Monetization & Analytics

- [ ] **MON-01**: GA4 integration (G-HMRJTYPDPP) with page view tracking on all pages
- [ ] **MON-02**: Centralized affiliate configuration (affiliates.json) with all partner URLs
- [ ] **MON-03**: `<AffiliateLink>` component with built-in FTC disclosure, `rel="nofollow sponsored"`, and GA4 event tracking
- [ ] **MON-04**: Booking.com hotel search widgets embedded contextually in city guide pages
- [ ] **MON-05**: Contextual affiliate links woven naturally into travel and city content
- [ ] **MON-06**: Affiliate disclosure page (/divulgacion) in Spanish with FTC-compliant language
- [ ] **MON-07**: GA4 custom events for affiliate clicks, newsletter signups, and tool usage
- [ ] **MON-08**: Privacy policy and cookie consent banner (GDPR/CCPA compliant)

### Lead Capture & Engagement

- [ ] **LEAD-01**: Email newsletter signup form (name + email) with inline placement in content and exit-intent trigger
- [ ] **LEAD-02**: Countdown timer to tournament start (June 11, 2026) on homepage and key pages
- [ ] **LEAD-03**: Search functionality across all content pages (Pagefind or equivalent)

### Interactive Tools

- [ ] **TOOL-01**: World Cup budget calculator — inputs: origin, destination, days, hotel tier, meals; outputs: estimated total with affiliate links
- [ ] **TOOL-02**: Interactive host city map with all 16 stadiums, pop-up cards linking to city/stadium pages
- [ ] **TOOL-03**: Homepage with featured content sections, countdown, and clear navigation to all major sections

### Legal & Trust

- [x] **LEGAL-01**: FIFA non-affiliation disclaimer visible in site footer on every page
- [ ] **LEGAL-02**: About page with project description, editorial independence statement, and contact info
- [ ] **LEGAL-03**: Content attribution — cite FIFA.com, official tourism sites, and official sources where applicable

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Expansion Content

- **V2-01**: Trip planner / match selector wizard — pick matches, see cities, get itinerary with affiliate links
- **V2-02**: Lead magnet: downloadable PDF city guide or budget planner gated behind email
- **V2-03**: Segmented content alerts — fans follow their team and get targeted email updates
- **V2-04**: PWA with offline access to saved guides and add-to-homescreen prompt

### Additional Monetization

- **V2-05**: Skyscanner flight search widget (requires 5,000+ monthly visitors for approval)
- **V2-06**: GetYourGuide activity/tour affiliate integration in city guides
- **V2-07**: Travel insurance comparison page with SafetyWing/World Nomads/Allianz affiliates
- **V2-08**: Display advertising (AdSense/Mediavine) once traffic justifies it

### Post-Tournament

- **V2-09**: Evergreen pivot — strip World Cup context from city guides, maintain as travel destination pages
- **V2-10**: 301 redirect strategy for expired event-specific pages
- **V2-11**: Content archive of tournament results, highlights, and historical data

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Real-time match scores/live data | Requires expensive APIs, WebSocket infra. ESPN/FIFA do this infinitely better. |
| User accounts/authentication | Content site, not a platform. Use localStorage for client-side favorites if needed. |
| Forum/comment system | Moderation burden, spam risk, legal liability. Link to Reddit/X instead. |
| E-commerce/direct ticket sales | FIFA licensing issues, legal liability, inventory management. |
| Native mobile app | Web does everything needed. PWA deferred to v2. |
| AI chatbot/virtual assistant | API costs at scale, hallucination risk with factual content. FAQ pages serve same purpose. |
| Video content hosting | Bandwidth/storage costs. Use YouTube embeds instead. |
| Multi-language beyond ES/EN | Content creation scales linearly. Two languages is already significant. |
| Prediction/betting features | Gambling regulations vary by jurisdiction. Not core to travel/guide mission. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Complete |
| INFRA-02 | Phase 1 | Complete |
| INFRA-03 | Phase 1 | Complete |
| INFRA-04 | Phase 1 | Complete |
| INFRA-05 | Phase 2 | Complete |
| INFRA-06 | Phase 1 | Complete |
| INFRA-07 | Phase 1 | Complete |
| CITY-01 | Phase 3 | Pending |
| CITY-02 | Phase 3 | Pending |
| CITY-03 | Phase 3 | Pending |
| CITY-04 | Phase 3 | Pending |
| STAD-01 | Phase 4 | Pending |
| STAD-02 | Phase 4 | Pending |
| STAD-03 | Phase 4 | Pending |
| TEAM-01 | Phase 7 | Pending |
| TEAM-02 | Phase 7 | Pending |
| TEAM-03 | Phase 7 | Pending |
| TRVL-01 | Phase 8 | Pending |
| TRVL-02 | Phase 8 | Pending |
| TRVL-03 | Phase 8 | Pending |
| TRVL-04 | Phase 8 | Pending |
| TRVL-05 | Phase 8 | Pending |
| TRVL-06 | Phase 8 | Pending |
| TRVL-07 | Phase 8 | Pending |
| SEO-01 | Phase 2 | Complete |
| SEO-02 | Phase 2 | Complete |
| SEO-03 | Phase 2 | Complete |
| SEO-04 | Phase 2 | Complete |
| SEO-05 | Phase 2 | Pending |
| SEO-06 | Phase 2 | Complete |
| LLM-01 | Phase 5 | Pending |
| LLM-02 | Phase 5 | Pending |
| LLM-03 | Phase 5 | Pending |
| LLM-04 | Phase 5 | Pending |
| LLM-05 | Phase 5 | Pending |
| LLM-06 | Phase 5 | Pending |
| LLM-07 | Phase 5 | Pending |
| MON-01 | Phase 6 | Pending |
| MON-02 | Phase 6 | Pending |
| MON-03 | Phase 6 | Pending |
| MON-04 | Phase 6 | Pending |
| MON-05 | Phase 6 | Pending |
| MON-06 | Phase 6 | Pending |
| MON-07 | Phase 6 | Pending |
| MON-08 | Phase 6 | Pending |
| LEAD-01 | Phase 9 | Pending |
| LEAD-02 | Phase 9 | Pending |
| LEAD-03 | Phase 9 | Pending |
| TOOL-01 | Phase 10 | Pending |
| TOOL-02 | Phase 10 | Pending |
| TOOL-03 | Phase 4 | Pending |
| LEGAL-01 | Phase 2 | Complete |
| LEGAL-02 | Phase 6 | Pending |
| LEGAL-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 54 total
- Mapped to phases: 54
- Unmapped: 0

---
*Requirements defined: 2026-03-26*
*Last updated: 2026-03-26 after roadmap creation*
