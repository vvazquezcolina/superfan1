# Feature Research

**Domain:** SEO/LLM-optimized sports event content site with travel affiliate monetization (FIFA World Cup 2026)
**Researched:** 2026-03-26
**Confidence:** HIGH (based on competitor analysis, GEO research, affiliate program documentation, schema.org specs)

## Feature Landscape

### Table Stakes (Users Expect These)

Features that fans and search engines assume exist. Missing any of these means the site feels incomplete, untrustworthy, or gets outranked by competitors who have them.

#### Content Foundation

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **16 Host City Guides** | Fans need to know where they're going. Every competitor (MLSSoccer, NYCTourism, TheWorldCupGuide, Sofascore) covers this. | MEDIUM | Each city needs: overview, getting there, getting around, neighborhoods, food, safety, weather, cultural tips. 11 USA + 3 Mexico + 2 Canada. |
| **16 Stadium Pages** | Stadium info is the #1 search query pattern for World Cup fans. FIFA.com, Sofascore, and Mapize all cover this. | MEDIUM | Each stadium needs: capacity, address, seating map/categories, transport to/from, nearby hotels, match schedule at venue, accessibility info. |
| **48 Team Pages** | Fans search for their team + World Cup. Goal.com, FIFA.com, InsightfulPost all have team content. | HIGH | Each team needs: group assignment, historical WC record, squad/key players, schedule, qualifying path. 48 pages is a lot of content. |
| **Match Schedule / Calendar** | Every single competitor has this. NortheastTimes offers a printable wall chart. Users cannot plan without it. | MEDIUM | Filterable by city, stadium, team, group, date. Must update when FIFA releases full schedule. ISR is ideal here. |
| **Ticket Buying Guide** | #1 practical question fans have. FIFA, TheWorldCupGuide, KickoffAdventures all cover this. | LOW | How to buy, categories (1-4), pricing tiers, resale rules, scam warnings. Link to official FIFA portal only. |
| **Visa & Entry Requirements** | Three-country tournament is unprecedented. Granicus highlights language gaps in host city communications. | MEDIUM | Requirements vary by nationality and host country. Cover USA ESTA/visa, Mexico FMM, Canada eTA. Must be accurate. |
| **Mobile-First Responsive Design** | 70%+ of sports content consumption is mobile. Non-negotiable in 2026. | MEDIUM | Next.js + Tailwind. Touch-friendly navigation, readable on small screens, fast loading. |
| **Technical SEO Baseline** | Without this, content won't rank. Period. | MEDIUM | Sitemap.xml, robots.txt, canonical URLs, Open Graph, Twitter Cards, meta descriptions, alt text, clean URL structure, proper heading hierarchy. |

#### Navigation & UX

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Search Functionality** | TheWorldCupGuide, NYCTourism, and every major content site has search. With 100+ pages, users need it. | LOW | Static site search via Pagefind or Algolia DocSearch (free for content sites). |
| **Breadcrumb Navigation** | SEO requirement and UX expectation for deep content hierarchies. Google displays breadcrumbs in SERPs. | LOW | BreadcrumbList JSON-LD schema. Auto-generated from URL structure. |
| **Category/Tag Filtering** | Users need to slice content by city, team, topic. TheWorldCupGuide uses categories extensively. | LOW | Tag pages for cities, teams, content types. Enables internal linking. |

#### Trust & Legal

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **FIFA Non-Affiliation Disclaimer** | Legal requirement. FIFA protects trademarks aggressively. Every unofficial guide includes this. | LOW | Footer disclaimer on every page. Clear "unofficial guide" language. |
| **Content Attribution & Sources** | GEO research shows cited statistics with named sources get 30-40% more AI visibility. Trust signal for users too. | LOW | Cite FIFA.com, official city tourism sites, official stadium sites. |
| **Privacy Policy & Cookie Consent** | Legal requirement for affiliate links, GA4 tracking, and newsletter collection. GDPR/CCPA compliance. | LOW | Standard privacy policy. Cookie consent banner for analytics. |

### Differentiators (Competitive Advantage)

Features that set SuperFan apart from MLSSoccer, TheWorldCupGuide, Sofascore, and generic English-language guides.

#### LLM/GEO Optimization (Primary Differentiator)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **llms.txt File** | Proposed standard for AI discoverability. Early adopters get citation advantage before competitors catch on. Research shows 30-70% improvement in citation accuracy. | LOW | Markdown file at /llms.txt listing site structure, key pages, content summary. Keep updated every 2 weeks. |
| **Direct Answer Blocks** | First 200 words of every page directly answer the primary query. AI systems extract these for citations. Research: pages with this pattern get 28-40% more LLM citations. | MEDIUM | Requires disciplined content structure: answer first, then elaborate. Every article opens with a "quick answer" block. |
| **FAQ Sections with FAQPage Schema** | FAQPage JSON-LD drives 3.1x higher answer extraction rates by AI systems. NYCTourism already does FAQ accordions. | MEDIUM | Every content page gets 3-5 relevant FAQs. JSON-LD FAQPage schema on each. Questions formatted as natural language queries users/AI would ask. |
| **Triple Schema Stacking** | Article + ItemList + FAQPage + Organization JSON-LD on every page. Maximizes rich result eligibility and AI extraction. | MEDIUM | Implement via reusable Next.js components. SportsEvent schema for match pages, Event for city events, Place for stadiums. |
| **Prompt-Aligned Content Headers** | H2/H3 headings phrased as questions AI systems would receive: "How much does it cost to attend the World Cup in Houston?" | LOW | Content strategy discipline. Match heading to likely user/AI prompts. |
| **Content Freshness Signals** | AI citation decay observed at ~14 days without freshness signals. Updated timestamps, version indicators, and "last verified" dates maintain citation priority. | LOW | Show "Last updated: [date]" on every page. ISR enables regular rebuilds. Update factual content bi-weekly. |

#### Spanish-First Content (Market Differentiator)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Native Spanish Content (Not Translations)** | Competitor gap: most WC2026 guides are English-first with poor Spanish translations. Hispanic viewers lead in tournament interest. Spanish long-tail has far less SEO competition. | HIGH | All primary content written natively in Spanish. Not machine-translated. Cultural context matters (Mexican vs. Latin American vs. US Hispanic audiences). |
| **Bilingual URL Structure** | Capture both Spanish and English long-tail keywords. e.g., `/ciudades/houston` and `/en/cities/houston`. | MEDIUM | Next.js i18n routing with `es` as default locale, `en` as secondary. hreflang tags for language variants. |
| **Cultural Context in City Guides** | Instead of generic tourist info, address what matters to Latin American fans: Mexican food availability, Spanish-speaking services, community gathering spots, consulate locations. | MEDIUM | Research-intensive but massive value. No competitor does this for Spanish-speaking fans visiting US/Canada cities. |

#### Interactive Tools (Engagement Differentiator)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **World Cup Budget Calculator** | No competitor offers this. Fans need to estimate trip costs across 3 countries with wildly different costs of living. Drives affiliate clicks naturally. | HIGH | Inputs: origin city, destination city, days, hotel tier, meal budget. Outputs: estimated total with affiliate links to Booking.com/Skyscanner for actual prices. Client-side calculation, no backend needed. |
| **Interactive Host City Map** | Mapme, ZeeMaps, and ArcGIS have basic stadium maps, but none are embedded in a comprehensive guide with affiliate integration. | MEDIUM | Leaflet.js or Mapbox GL (free tier). Plot 16 stadiums with pop-up cards linking to city/stadium pages. Color-code by country. |
| **Trip Planner / Match Selector** | Let fans pick matches they want to attend, see which cities they need to visit, get suggested itineraries. No competitor combines this with affiliate links. | HIGH | Multi-step wizard: select team/matches -> see cities -> get itinerary suggestion with hotel/flight affiliate links. Complex but very high engagement. |
| **Countdown Timer** | Creates urgency and return visits. Simple but effective engagement driver. PadSquad research shows time-sensitive elements drive higher conversion. | LOW | Countdown to tournament start (June 11, 2026). Updates to "X days until [next match]" during tournament. |

#### Affiliate Monetization (Revenue Differentiator)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Contextual Hotel Widgets** | Booking.com Deals Finder and Search Box widgets embedded in city guides. Users search for hotels without leaving the page. Booking.com provides customizable widgets. | MEDIUM | Booking.com affiliate program (instant approval). Embed search widgets in each city guide page. Deep links to pre-filtered searches for hotels near each stadium. |
| **Flight Search Integration** | Skyscanner Travel Widget embedded in travel planning pages. Up to 20% commission on completed bookings. | MEDIUM | Skyscanner affiliate via Impact. Flight search widget with pre-filled origin/destination based on page context. |
| **Contextual Affiliate Links in Content** | Natural integration of affiliate links within content (not banner ads). "Hotels near MetLife Stadium start at $X/night" with link. | LOW | Booking.com deep links, Skyscanner deep links, GetYourGuide activity links. Woven into content naturally, not intrusive. |
| **Travel Insurance Comparison** | Required for international travel, high-value affiliate vertical. Commission rates typically 15-40%. | LOW | Partner with SafetyWing, World Nomads, or Allianz Travel. Dedicated "travel insurance for the World Cup" page. |

#### Lead Capture (Audience Building)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Email Newsletter Signup** | Build owned audience before tournament. 2%+ capture rate is healthy benchmark. Forms with 3 or fewer fields convert 25% better. | LOW | Name + email only. Offer: "Weekly World Cup updates + exclusive travel deals." Pop-up on exit intent + inline forms in content. Use Resend or Buttondown (free tier). |
| **Lead Magnet: Downloadable Guide** | PDF city guide or budget planner gated behind email. Research shows 2x signups when value is offered. | MEDIUM | "Download our complete World Cup 2026 travel checklist" or "Printable match schedule." Requires PDF generation. |
| **Segmented Content Alerts** | "Follow your team" feature where fans get email alerts about their specific team's matches, city guides, and travel deals. | MEDIUM | Requires email segmentation. Higher engagement than generic newsletters. Ties into team pages. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Real-Time Match Scores** | Fans want live updates during the tournament. | Requires live data feeds (expensive APIs), WebSocket infrastructure, constant monitoring. ESPN/FIFA/Sofascore already do this infinitely better. Reliability risk during peak traffic. PROJECT.md explicitly excludes this. | Embed or link to FIFA.com/ESPN live scores. Focus on pre-match and post-match content (travel, experience) where you add unique value. |
| **User Accounts & Profiles** | "Let fans save their favorite cities/matches." | Authentication system complexity (auth, sessions, database, password resets). Massive scope increase. Content site doesn't need user state. PROJECT.md explicitly excludes this. | Use localStorage for client-side "favorites" without accounts. No backend needed. |
| **Forum / Comment System** | "Build community around the World Cup." | Moderation burden, spam, legal liability for user-generated content. Requires constant monitoring. Small team cannot sustain this. | Link to Reddit r/worldcup, Twitter/X hashtags, official fan zones. Let established communities handle discussion. |
| **E-Commerce / Ticket Sales** | "Sell tickets or merchandise directly." | FIFA licensing issues, legal liability, inventory management, payment processing. PROJECT.md explicitly excludes this. | Affiliate links to official FIFA ticket portal, licensed merchandise retailers. |
| **Native Mobile App** | "Fans want an app." | Development cost (2x: iOS + Android), app store approval, maintenance burden. Web does everything needed. PROJECT.md explicitly excludes this. | Progressive Web App (PWA) with service worker for offline access to saved guides. Add-to-homescreen prompt. |
| **AI Chatbot / Virtual Assistant** | "Let fans ask questions about the World Cup." | API costs scale with traffic, hallucination risk with factual content (match times, visa rules), maintenance complexity. | Well-structured FAQ pages serve the same purpose. Content structured for AI extraction means LLMs answer questions about your content anyway. |
| **Video Content Hosting** | "Stadium video tours, fan vlogs." | Bandwidth costs, storage costs, transcoding complexity. PROJECT.md explicitly excludes this. | YouTube embeds for stadium tours and city guides. Zero hosting cost, YouTube SEO benefits, same user experience. |
| **Multi-Language Beyond ES/EN** | "Add Portuguese, French, Arabic for global fans." | Content creation scales linearly per language. Two languages is already significant. PROJECT.md explicitly excludes this. | Focus on Spanish (primary market) and English (long-tail). Consider PT-BR as a v2+ expansion if traffic warrants it. |
| **Prediction/Betting Features** | "Let fans predict match outcomes, bracket challenges." | Gambling regulations vary by jurisdiction. Legal complexity. Not core to travel/guide mission. | Link to established prediction games (FIFA.com bracket challenge). Keep site focused on travel and attendance content. |

## Feature Dependencies

```
[Technical SEO Baseline]
    +-- requires --> [Next.js Migration / SSG Setup]
    +-- requires --> [URL Structure / Routing]

[JSON-LD Schema (SportsEvent, FAQPage, etc.)]
    +-- requires --> [Next.js Migration / SSG Setup]
    +-- requires --> [Content Data Model]

[Host City Guides]
    +-- requires --> [Content Data Model]
    +-- requires --> [Next.js Page Templates]
    +-- enables --> [Contextual Hotel Widgets]
    +-- enables --> [Interactive Host City Map]
    +-- enables --> [Cultural Context Content]

[Stadium Pages]
    +-- requires --> [Content Data Model]
    +-- requires --> [Next.js Page Templates]
    +-- enables --> [Interactive Host City Map]
    +-- enables --> [Match Schedule Integration]

[48 Team Pages]
    +-- requires --> [Content Data Model]
    +-- requires --> [Match Schedule Data]
    +-- enables --> [Trip Planner / Match Selector]
    +-- enables --> [Segmented Content Alerts]

[Match Schedule / Calendar]
    +-- requires --> [Content Data Model]
    +-- requires --> [FIFA Official Schedule Data]
    +-- enables --> [Trip Planner / Match Selector]
    +-- enables --> [Countdown Timer]

[Budget Calculator]
    +-- requires --> [Host City Guides] (for cost data)
    +-- enhances --> [Contextual Affiliate Links]

[Trip Planner / Match Selector]
    +-- requires --> [Match Schedule / Calendar]
    +-- requires --> [Host City Guides]
    +-- requires --> [Stadium Pages]
    +-- enhances --> [Affiliate Monetization]

[Newsletter Signup]
    +-- requires --> [Email Service Provider Setup]
    +-- enables --> [Lead Magnet: Downloadable Guide]
    +-- enables --> [Segmented Content Alerts]

[llms.txt]
    +-- requires --> [Content Pages Exist]
    +-- enhances --> [All Content Pages]

[Direct Answer Blocks + FAQ Sections]
    +-- requires --> [Content Writing Guidelines]
    +-- enhances --> [All Content Pages]

[Bilingual URL Structure]
    +-- requires --> [Next.js i18n Configuration]
    +-- requires --> [Content in Both Languages]

[Contextual Hotel Widgets]
    +-- requires --> [Host City Guides]
    +-- requires --> [Booking.com Affiliate Approval]

[Flight Search Integration]
    +-- requires --> [Skyscanner/Impact Affiliate Approval]
    +-- enhances --> [Host City Guides]
    +-- enhances --> [Trip Planner]
```

### Dependency Notes

- **Next.js Migration is the foundation:** Nearly every feature depends on having the SSG framework, routing, and component system in place. This must be Phase 1.
- **Content Data Model enables everything:** A well-designed data model (cities, stadiums, teams, matches) unlocks all content pages and interactive tools. Define early.
- **Affiliate approval is async:** Booking.com and Skyscanner approvals take days/weeks. Apply early, integrate widgets later.
- **Match Schedule depends on FIFA:** Full schedule may not be available until closer to the tournament. Design for ISR updates. Group stage draw is done; match schedule is partially available.
- **Trip Planner is the most complex feature:** Depends on match data, city data, and stadium data all being complete. Build last among interactive tools.
- **LLM optimization is a content discipline, not a feature:** llms.txt and schema are technical, but Direct Answer Blocks and FAQ sections are content writing patterns applied to every page.

## MVP Definition

### Launch With (v1) -- Target: 8-10 weeks before tournament

The absolute minimum to capture pre-tournament search traffic and begin monetization.

- [ ] **Next.js SSG on Vercel** -- Foundation for everything else
- [ ] **16 Host City Guides (Spanish)** -- Highest search volume content. Include basic hotel/flight affiliate links.
- [ ] **16 Stadium Pages** -- Second-highest search volume. SportsEvent schema.
- [ ] **Match Schedule / Calendar** -- Fans need this to plan. Filterable by city/team.
- [ ] **Technical SEO Baseline** -- Sitemap, robots.txt, canonicals, Open Graph, hreflang
- [ ] **JSON-LD Schema Stacking** -- Article + FAQPage + SportsEvent + Organization on every page
- [ ] **llms.txt** -- Low effort, high potential LLM visibility
- [ ] **Direct Answer Blocks on all pages** -- Content structure discipline from day 1
- [ ] **Newsletter Signup** -- Start building audience immediately. Name + email, exit-intent popup.
- [ ] **Booking.com Hotel Widgets** -- Primary monetization from day 1
- [ ] **FIFA Disclaimer + Privacy Policy** -- Legal compliance
- [ ] **GA4 Integration** -- Measure everything from launch

### Add After Validation (v1.x) -- Weeks 2-6 post-launch

Features to add once core content is ranking and traffic is flowing.

- [ ] **48 Team Pages** -- Trigger: Group draw complete, fan search queries increasing
- [ ] **Ticket Buying Guide** -- Trigger: FIFA ticket sales phases begin
- [ ] **Visa & Entry Requirements** -- Trigger: Pre-tournament travel planning peak (April-May 2026)
- [ ] **Budget Calculator** -- Trigger: City guides complete with cost data
- [ ] **Interactive Host City Map** -- Trigger: All 16 city/stadium pages live
- [ ] **Skyscanner Flight Widget** -- Trigger: Skyscanner affiliate approval received
- [ ] **English Language Pages** -- Trigger: Spanish content validated, capacity for second language
- [ ] **Lead Magnet PDF** -- Trigger: Newsletter list > 500 subscribers
- [ ] **Countdown Timer** -- Trigger: Tournament < 90 days away
- [ ] **Content Freshness Updates** -- Trigger: Bi-weekly content review cycle established

### Future Consideration (v2+) -- During/post tournament or if traffic exceeds expectations

- [ ] **Trip Planner / Match Selector** -- Why defer: Highest complexity tool, requires all data complete. Build when match schedule is finalized.
- [ ] **Segmented Team Alerts** -- Why defer: Requires email list scale to justify segmentation effort.
- [ ] **Cultural Context Deep Dives** -- Why defer: High research effort per city. Add for top-traffic cities first.
- [ ] **PWA Offline Access** -- Why defer: Only valuable during tournament when fans are traveling.
- [ ] **GetYourGuide Activity Links** -- Why defer: Lower priority affiliate, add when city guides are mature.
- [ ] **Travel Insurance Page** -- Why defer: Evergreen content, can add anytime. Not time-sensitive.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Revenue Impact | SEO/GEO Impact | Priority |
|---------|------------|---------------------|----------------|-----------------|----------|
| Next.js SSG Migration | HIGH | HIGH | - | HIGH | P1 |
| 16 Host City Guides | HIGH | HIGH | HIGH | HIGH | P1 |
| 16 Stadium Pages | HIGH | MEDIUM | MEDIUM | HIGH | P1 |
| Match Schedule/Calendar | HIGH | MEDIUM | LOW | HIGH | P1 |
| Technical SEO Baseline | HIGH | MEDIUM | - | HIGH | P1 |
| JSON-LD Schema Stacking | MEDIUM | MEDIUM | - | HIGH | P1 |
| llms.txt | LOW | LOW | - | MEDIUM | P1 |
| Direct Answer Blocks | MEDIUM | LOW | - | HIGH | P1 |
| Newsletter Signup | MEDIUM | LOW | MEDIUM | - | P1 |
| Booking.com Widgets | MEDIUM | LOW | HIGH | - | P1 |
| GA4 Integration | LOW | LOW | - | - | P1 |
| 48 Team Pages | HIGH | HIGH | LOW | HIGH | P2 |
| Ticket Buying Guide | HIGH | LOW | LOW | MEDIUM | P2 |
| Visa & Entry Guide | HIGH | MEDIUM | LOW | MEDIUM | P2 |
| Budget Calculator | HIGH | HIGH | HIGH | MEDIUM | P2 |
| Interactive Map | MEDIUM | MEDIUM | LOW | MEDIUM | P2 |
| Skyscanner Widget | MEDIUM | LOW | MEDIUM | - | P2 |
| English Language Pages | MEDIUM | HIGH | MEDIUM | HIGH | P2 |
| Lead Magnet PDF | MEDIUM | MEDIUM | MEDIUM | - | P2 |
| Countdown Timer | LOW | LOW | - | LOW | P2 |
| Trip Planner/Selector | HIGH | HIGH | HIGH | MEDIUM | P3 |
| Segmented Alerts | MEDIUM | MEDIUM | MEDIUM | - | P3 |
| Cultural Context Guides | HIGH | HIGH | MEDIUM | HIGH | P3 |
| PWA Offline Access | MEDIUM | MEDIUM | - | - | P3 |
| Travel Insurance Page | LOW | LOW | MEDIUM | LOW | P3 |

**Priority key:**
- P1: Must have for launch -- drives initial traffic and revenue
- P2: Should have, add in first 4 weeks post-launch
- P3: Nice to have, build if time/traffic warrants

## Competitor Feature Analysis

| Feature | TheWorldCupGuide | NYCTourism/WC26 | Sofascore | MLSSoccer | FIFA.com | SuperFan (Our Approach) |
|---------|-----------------|-----------------|-----------|-----------|----------|----------------------|
| City Guides | Basic, blog-style | NYC only (deep) | Multiple cities | Overview only | All cities (basic) | Deep guides for all 16, Spanish-first, culturally contextual |
| Stadium Info | Basic | MetLife only | Basic | Links to FIFA | Detailed, official | Detailed + transport + nearby hotels + seating guide |
| Match Schedule | Table format | NYC matches only | Full | Full | Official source | Filterable calendar, team/city filters, JSON-LD |
| Team Coverage | Minimal | None | Power rankings | Group overview | Official profiles | 48 team pages with history, squad, schedule |
| Interactive Map | None | None | None | None | Basic | Leaflet/Mapbox with all 16 stadiums, pop-ups, affiliate links |
| Budget Tools | None | None | None | None | None | Budget calculator with per-city cost estimates |
| Trip Planner | Basic itineraries | None | Travel distances | None | None | Match selector + multi-city itinerary generator |
| Affiliate Integration | Minimal | Crewfare hotel partner | None | None | Official sponsors | Booking.com, Skyscanner, GetYourGuide contextual widgets |
| Spanish Content | None | ES via language toggle | None | None | ES available | Native Spanish, not translated. Cultural context for LATAM fans. |
| LLM Optimization | None visible | None visible | None visible | None visible | None visible | llms.txt, FAQPage schema, direct answer blocks, triple schema stacking |
| Newsletter | None visible | Signup form | None | None | FIFA+ account | Segmented by team interest, lead magnets, pre-tournament drip |
| FAQ Sections | None | Accordion FAQ | None | None | Official FAQ | Every page has FAQ section with FAQPage JSON-LD |

**Competitive gap summary:** No single competitor combines deep city/stadium/team content, Spanish-first language strategy, LLM optimization, interactive planning tools, and affiliate monetization. The biggest gaps in the market are:
1. **Spanish-language comprehensive guides** -- Nobody does this well
2. **LLM/GEO optimization** -- Nobody is doing this deliberately for World Cup content
3. **Interactive planning tools** -- Budget calculator and trip planner are absent from all competitors
4. **Contextual affiliate integration** -- Most competitors either have no monetization or use generic banner ads

## Sources

- [FIFA World Cup 2026 Official Site](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026) - Official tournament information
- [TheWorldCupGuide.com](https://theworldcupguide.com/) - Fan-created World Cup guide, competitor analysis
- [NYCTourism World Cup 2026 Guide](https://www.nyctourism.com/worldcup26/) - City-level fan guide example
- [MLSSoccer.com World Cup 2026 Guide](https://www.mlssoccer.com/news/fifa-world-cup-2026-guide) - Official MLS fan guide
- [Sofascore Travel Guides](https://www.sofascore.com/news/a-fans-complete-2026-fifa-world-cup-travel-guide-to-north-america/) - Sports platform travel content
- [LLMrefs GEO Guide](https://llmrefs.com/generative-engine-optimization) - GEO optimization techniques and citation data
- [Averi.ai LLM-Optimized Content Guide](https://www.averi.ai/breakdowns/the-definitive-guide-to-llm-optimized-content) - LLM citation patterns
- [Oflight LLMO Technical Guide](https://www.oflight.co.jp/en/columns/llmo-technical-implementation-guide-2026) - llms.txt and structured data implementation
- [llmstxt.org Specification](https://llmstxt.org/) - Official llms.txt proposed standard
- [Rankability llms.txt Best Practices](https://www.rankability.com/guides/llms-txt-best-practices/) - Implementation guide
- [Schema.org SportsEvent](https://schema.org/SportsEvent) - SportsEvent structured data specification
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) - Official Next.js structured data docs
- [Booking.com Partnerships Hub](https://partnerships.booking.com/unlock-your-full-potential-our-affiliate-programme) - Affiliate program details
- [Skyscanner Partners](https://www.partners.skyscanner.net/product/travel-api) - API and widget documentation
- [PadSquad World Cup Fan Attention Study](https://padsquad.com/blog/winning-fan-attention-during-the-2026-fifa-world-cup) - Fan engagement research
- [Granicus Multilingual WC2026 Playbook](https://granicus.com/blog/world-cup-2026-a-playbook-for-multilingual-communications-and-engagement/) - Multilingual communication gap analysis
- [Mapme Interactive Stadium Map](https://mapme.com/interactive-map-example/2026-world-cup-stadium-map/) - Interactive map example

---
*Feature research for: SuperFan Mundial 2026 -- SEO/LLM-Optimized World Cup Content Site*
*Researched: 2026-03-26*
