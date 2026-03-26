# Architecture Research

**Domain:** Large-scale SEO/LLM-optimized content site (World Cup 2026)
**Researched:** 2026-03-26
**Confidence:** HIGH

## System Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────────┐ │
│  │  Layouts    │  │  Pages     │  │ Interactive │  │  SEO Components    │ │
│  │  (Server)   │  │  (Server)  │  │  Tools      │  │  (JSON-LD, Meta,  │ │
│  │             │  │            │  │  (Client)   │  │   OpenGraph, etc.) │ │
│  └──────┬─────┘  └──────┬─────┘  └──────┬──────┘  └────────┬──────────┘ │
│         │               │               │                   │            │
├─────────┴───────────────┴───────────────┴───────────────────┴────────────┤
│                         SHARED UI LAYER                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────────┐ │
│  │ Navigation  │  │  Cards     │  │  Affiliate  │  │  Analytics        │ │
│  │ & Footer    │  │  & Lists   │  │  Links      │  │  (GA4 + GTM)      │ │
│  └─────────────┘  └────────────┘  └─────────────┘  └───────────────────┘ │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                         CONTENT DATA LAYER                               │
│  ┌─────────────────────┐  ┌──────────────────┐  ┌─────────────────────┐ │
│  │  Content Schemas     │  │  Data Loaders    │  │  i18n Dictionaries  │ │
│  │  (TypeScript types)  │  │  (get* functions) │  │  (es.json, en.json) │ │
│  └──────────┬──────────┘  └────────┬─────────┘  └──────────┬──────────┘ │
│             │                      │                        │            │
├─────────────┴──────────────────────┴────────────────────────┴────────────┤
│                         STRUCTURED DATA (JSON FILES)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ cities/  │  │ stadiums/│  │ teams/   │  │ travel/  │  │ schedule/│  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                              BUILD TIME (SSG)
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         VERCEL EDGE / CDN                                │
│  Static HTML + Client JS hydration for interactive tools                 │
│  ISR revalidation for schedule updates when FIFA releases data           │
└──────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Layouts** | Shell structure (header, nav, footer), `<html lang>` tag, shared metadata | Server Components in `app/[lang]/layout.tsx`. Nested per section. |
| **Pages** | Content rendering for each route, per-page metadata + JSON-LD | Server Components in `app/[lang]/[section]/[slug]/page.tsx` |
| **Interactive Tools** | Budget calculator, trip planner, flight alerts | Client Components (`"use client"`) embedded within Server Component pages |
| **SEO Components** | JSON-LD injection, Open Graph tags, breadcrumbs, FAQ schema | Server Component helpers called from each page, type-safe via `schema-dts` |
| **Affiliate Links** | Consistent affiliate URL generation with tracking params | Centralized config + reusable `<AffiliateLink>` Client Component with GA4 click events |
| **Analytics** | GA4 pageview tracking, custom event dispatch, conversion tracking | Client Component wrapper in root layout + event utility functions |
| **Content Data Layer** | Type-safe data loading from JSON files | `getCity()`, `getStadium()`, `getTeam()` functions returning typed objects |
| **i18n Dictionaries** | Translated UI strings per locale | JSON dictionary files loaded server-side via `getDictionary()` |
| **Structured Data Files** | Canonical source of truth for all content | JSON files in `content/` directory, one per entity |

## Recommended Project Structure

```
superfan/
├── public/
│   ├── images/
│   │   ├── cities/              # City hero images
│   │   ├── stadiums/            # Stadium photos
│   │   └── teams/               # Team badges/flags
│   ├── robots.txt
│   ├── llms.txt                 # LLM discovery file
│   └── favicon.ico
│
├── content/                     # STRUCTURED DATA (not in src/)
│   ├── cities/
│   │   ├── mexico-city.json     # One file per city
│   │   ├── los-angeles.json
│   │   └── ...
│   ├── stadiums/
│   │   ├── azteca.json
│   │   └── ...
│   ├── teams/
│   │   ├── mexico.json
│   │   └── ...
│   ├── travel/
│   │   ├── flights.json         # Affiliate-heavy content
│   │   └── hotels.json
│   ├── schedule/
│   │   └── matches.json         # When FIFA releases data
│   └── affiliates.json          # Centralized affiliate link config
│
├── src/
│   ├── app/
│   │   ├── [lang]/              # i18n root segment
│   │   │   ├── layout.tsx       # Root layout (html lang, nav, footer, analytics)
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── not-found.tsx    # Custom 404
│   │   │   │
│   │   │   ├── ciudades/        # City pages (Spanish URL slugs)
│   │   │   │   ├── page.tsx     # City index/listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx # Individual city page
│   │   │   │
│   │   │   ├── estadios/        # Stadium pages
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── equipos/         # Team pages
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── viajes/          # Travel section
│   │   │   │   ├── page.tsx
│   │   │   │   ├── vuelos/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── hoteles/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── herramientas/    # Interactive tools
│   │   │   │   ├── page.tsx
│   │   │   │   ├── calculadora-presupuesto/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── planificador-viaje/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── calendario/      # Match schedule
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── guias/           # Guides (tickets, safety, fan experience)
│   │   │       ├── page.tsx
│   │   │       └── [slug]/
│   │   │           └── page.tsx
│   │   │
│   │   ├── sitemap.ts           # Dynamic sitemap generation
│   │   ├── robots.ts            # Programmatic robots.txt
│   │   └── llms-txt/
│   │       └── route.ts         # /llms.txt route handler
│   │
│   ├── components/
│   │   ├── layout/              # Header, Footer, Navigation, Breadcrumbs
│   │   ├── ui/                  # Buttons, Cards, Badges, Inputs (design system)
│   │   ├── seo/                 # JsonLd, OpenGraph, FAQSchema components
│   │   ├── affiliate/           # AffiliateLink, AffiliateCard, PartnerBanner
│   │   ├── analytics/           # GA4Provider, EventTracker, ConversionPixel
│   │   ├── tools/               # BudgetCalculator, TripPlanner (client components)
│   │   └── content/             # CityCard, StadiumCard, TeamCard, MatchCard
│   │
│   ├── lib/
│   │   ├── content/             # Data loading functions
│   │   │   ├── cities.ts        # getCities(), getCity(slug), getCityByLang()
│   │   │   ├── stadiums.ts      # getStadiums(), getStadium(slug)
│   │   │   ├── teams.ts         # getTeams(), getTeam(slug)
│   │   │   ├── travel.ts        # getFlights(), getHotels()
│   │   │   ├── schedule.ts      # getMatches(), getMatchesByCity()
│   │   │   └── guides.ts        # getGuides(), getGuide(slug)
│   │   ├── affiliates.ts        # buildAffiliateUrl(), getPartnerConfig()
│   │   ├── analytics.ts         # trackEvent(), trackConversion()
│   │   ├── seo.ts               # generateJsonLd(), generateMetadata helpers
│   │   ├── i18n.ts              # getDictionary(), hasLocale(), locale config
│   │   └── utils.ts             # Slugify, date formatting, currency
│   │
│   ├── dictionaries/
│   │   ├── es.json              # Spanish UI strings
│   │   └── en.json              # English UI strings
│   │
│   └── types/
│       ├── content.ts           # City, Stadium, Team, Match interfaces
│       ├── affiliate.ts         # AffiliatePartner, AffiliateLink types
│       └── seo.ts               # JSON-LD type helpers
│
├── middleware.ts                 # i18n locale detection + redirect
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Structure Rationale

- **`content/` at project root:** Separates data from code. JSON files can be edited independently, potentially by non-developers. No build pipeline needed for content changes with ISR. Mirrors the existing CSV-based content approach but with structured JSON.
- **`app/[lang]/` as i18n root:** Official Next.js pattern. Every route automatically receives the locale parameter. `generateStaticParams` in the root layout generates both `es` and `en` variants of every page at build time.
- **Spanish URL slugs (`ciudades/`, `estadios/`):** Primary audience is Spanish-speaking. Spanish URLs signal relevance to search engines for Spanish queries. English content lives under `/en/cities/`, `/en/stadiums/` with locale-specific slugs.
- **`components/` organized by concern:** Not by route. Affiliate and analytics components are cross-cutting concerns used across all sections. Content cards are reused across listing pages, search results, and related content sidebars.
- **`lib/content/` data loaders:** Single source of truth for data access. Every page calls typed functions rather than reading JSON directly. This allows adding caching, transformation, or switching to a CMS later without changing page code.
- **`types/` centralized:** Content types are shared across data loaders, components, and pages. Changing a schema propagates TypeScript errors everywhere it matters.

## Architectural Patterns

### Pattern 1: Server-First Content with Client Islands

**What:** All content pages are Server Components. Interactive elements (calculators, planners, newsletter forms) are Client Components embedded as "islands" within otherwise static pages.

**When to use:** Every content page in this project. The ratio is approximately 90% server-rendered content, 10% client interactivity.

**Trade-offs:** Excellent for SEO (all content in initial HTML), minimal JS shipped to browser. Requires careful boundary planning -- state cannot flow from client to server.

**Example:**
```typescript
// app/[lang]/herramientas/calculadora-presupuesto/page.tsx (Server Component)
import { getDictionary } from '@/lib/i18n'
import { getCities } from '@/lib/content/cities'
import { BudgetCalculator } from '@/components/tools/BudgetCalculator'
import { JsonLd } from '@/components/seo/JsonLd'

export default async function BudgetCalculatorPage({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const cities = await getCities(lang) // Data loaded server-side

  return (
    <article>
      <h1>{dict.tools.budgetCalculator.title}</h1>
      <p>{dict.tools.budgetCalculator.description}</p>

      <JsonLd type="WebApplication" data={{ name: dict.tools.budgetCalculator.title }} />

      {/* Client island for interactivity */}
      <BudgetCalculator cities={cities} labels={dict.tools.budgetCalculator} />
    </article>
  )
}
```

### Pattern 2: Typed Content Collection with Data Loaders

**What:** JSON files in `content/` define the canonical data. TypeScript interfaces define the shape. Data loader functions in `lib/content/` provide typed access with per-locale content resolution.

**When to use:** Every content type (cities, stadiums, teams, travel, schedule).

**Trade-offs:** No CMS overhead, zero cost, full type safety, works perfectly with SSG. Downside: content updates require a git commit + redeploy (mitigated by ISR for time-sensitive data like schedules).

**Example:**
```typescript
// types/content.ts
export interface City {
  slug: string
  slugs: { es: string; en: string }  // Locale-specific URL slugs
  name: { es: string; en: string }
  country: 'mexico' | 'usa' | 'canada'
  heroImage: string
  description: { es: string; en: string }
  stadium: string  // Reference to stadium slug
  transport: { es: string; en: string }
  hotels: AffiliateLink[]
  flights: AffiliateLink[]
  coordinates: { lat: number; lng: number }
  faq: { question: string; answer: string }[]  // For FAQ schema
}

// lib/content/cities.ts
import citiesData from '@/content/cities/*.json'  // Or dynamic import
import type { City } from '@/types/content'

export function getCities(lang: string): City[] { ... }
export function getCity(slug: string, lang: string): City | undefined { ... }
export function getCitySlugs(): { slug: string; lang: string }[] { ... }
```

### Pattern 3: Centralized JSON-LD Factory

**What:** A single `generateJsonLd()` function that produces type-safe JSON-LD for any content type. Called from every page to inject structured data. Uses `schema-dts` for TypeScript validation.

**When to use:** Every page. This is the core LLM optimization strategy.

**Trade-offs:** Upfront investment in schema mapping pays off with consistent, validated structured data across 100+ pages. Mistakes in one place propagate everywhere (both a risk and a benefit -- fix once, fix everywhere).

**Example:**
```typescript
// lib/seo.ts
import type { WithContext, Place, SportsEvent, FAQPage } from 'schema-dts'

export function generateCityJsonLd(city: City, lang: string): WithContext<Place> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: city.name[lang],
    description: city.description[lang],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: city.coordinates.lat,
      longitude: city.coordinates.lng,
    },
    // ... more fields
  }
}

export function generateFAQJsonLd(faqs: FAQ[]): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}
```

### Pattern 4: Affiliate Link Abstraction

**What:** All affiliate URLs are managed through a centralized configuration and rendered through a single `<AffiliateLink>` component that handles URL construction, tracking parameters, GA4 event firing, and `rel="nofollow sponsored"` attributes.

**When to use:** Every external monetization link across the entire site.

**Trade-offs:** One place to update when affiliate programs change terms, tracking IDs, or URL formats. Slightly more complex than raw `<a>` tags, but prevents the nightmare of updating hundreds of hardcoded affiliate URLs.

**Example:**
```typescript
// content/affiliates.json
{
  "booking": {
    "name": "Booking.com",
    "baseUrl": "https://www.booking.com",
    "affiliateId": "XXXXX",
    "paramName": "aid",
    "category": "hotels"
  },
  "skyscanner": {
    "name": "Skyscanner",
    "baseUrl": "https://www.skyscanner.com",
    "affiliateId": "YYYYY",
    "paramName": "associateid",
    "category": "flights"
  }
}

// components/affiliate/AffiliateLink.tsx
'use client'
import { trackEvent } from '@/lib/analytics'

export function AffiliateLink({ partner, destination, children, context }) {
  const url = buildAffiliateUrl(partner, destination)

  const handleClick = () => {
    trackEvent('affiliate_link_click', {
      partner: partner.name,
      category: partner.category,
      destination,
      page_context: context,
    })
  }

  return (
    <a href={url} onClick={handleClick}
       target="_blank" rel="nofollow sponsored noopener"
       data-affiliate={partner.name}>
      {children}
    </a>
  )
}
```

### Pattern 5: Build-Time i18n with Dictionary Loading

**What:** Next.js official pattern: `app/[lang]/` dynamic segment + `generateStaticParams` for both locales + server-side dictionary loading via dynamic imports. No third-party i18n library needed for this scale.

**When to use:** This project. Two languages, primarily static content, Server Components throughout. The built-in pattern is sufficient; `next-intl` would add unnecessary complexity.

**Trade-offs:** Simpler setup than `next-intl`, zero client-side JS for translations. Downside: no built-in pluralization or ICU message formatting (implement manually for the few cases needed). Client Components receive translated strings as props rather than calling a hook.

**Example:**
```typescript
// app/[lang]/layout.tsx
import { getDictionary, hasLocale } from '@/lib/i18n'

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }]
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  return (
    <html lang={lang}>
      <body>
        <Header dict={dict.nav} lang={lang} />
        {children}
        <Footer dict={dict.footer} lang={lang} />
        <GA4Provider measurementId="G-HMRJTYPDPP" />
      </body>
    </html>
  )
}
```

## Data Flow

### Build-Time Content Generation Flow

```
content/*.json  (structured data files)
      │
      ▼
lib/content/*.ts  (typed data loaders)
      │
      ├──▶ generateStaticParams()  →  route parameter list
      │
      ├──▶ generateMetadata()  →  <head> meta tags, OG tags
      │
      └──▶ Page Component  →  HTML content
                │
                ├──▶ JsonLd component  →  <script type="application/ld+json">
                ├──▶ Content components  →  rendered HTML
                └──▶ Client islands  →  hydrated interactive tools
                          │
                          ▼
                    Static HTML output (per locale)
                          │
                          ▼
                    Vercel CDN (global edge)
```

### Runtime Analytics Flow

```
User visits page
      │
      ▼
GA4Provider (root layout, Client Component)
      │  loads gtag.js
      │  fires page_view automatically
      │
      ├──▶ User clicks affiliate link
      │         │
      │         ▼
      │    AffiliateLink.onClick()
      │         │
      │         ▼
      │    trackEvent('affiliate_link_click', { partner, category, ... })
      │         │
      │         ▼
      │    gtag('event', 'affiliate_link_click', params)  →  GA4
      │
      ├──▶ User interacts with tool (calculator, planner)
      │         │
      │         ▼
      │    trackEvent('tool_interaction', { tool, action, value })
      │
      └──▶ User submits newsletter
                │
                ▼
           trackEvent('newsletter_signup', { source })
```

### i18n Routing Flow

```
User request: /  (no locale)
      │
      ▼
middleware.ts
      │  reads Accept-Language header
      │  detects locale preference
      │
      ├──▶ Spanish-speaking user  →  redirect to /es/
      └──▶ English-speaking user  →  redirect to /en/

User request: /es/ciudades/ciudad-de-mexico
      │
      ▼
app/[lang]/ciudades/[slug]/page.tsx
      │  params.lang = 'es'
      │  params.slug = 'ciudad-de-mexico'
      │
      ├──▶ getDictionary('es')  →  Spanish UI strings
      ├──▶ getCity('ciudad-de-mexico', 'es')  →  City data in Spanish
      ├──▶ generateMetadata()  →  Spanish meta tags
      └──▶ generateCityJsonLd()  →  Schema.org structured data
```

### Key Data Flows

1. **Content to HTML:** JSON files are read at build time by data loaders, passed to Server Components, rendered as static HTML, and deployed to Vercel's CDN. No runtime data fetching for content pages.

2. **Content to JSON-LD:** Same data loaders feed both the visible page content and the invisible structured data (JSON-LD). A city's name, coordinates, and description appear both as rendered HTML and as Schema.org Place markup. This duality is the core of the LLM optimization strategy.

3. **Affiliate config to tracked links:** The centralized `affiliates.json` feeds the `AffiliateLink` component, which constructs URLs with tracking params and fires GA4 events on click. Revenue attribution flows from click events in GA4 back to specific pages and content types.

4. **Locale to content variant:** The `[lang]` segment determines which dictionary loads and which content variant renders. Data files contain both language variants; the data loader filters by locale.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Launch (100-200 pages) | Pure SSG with JSON files. Build takes under 2 minutes on Vercel. No adjustments needed. |
| Pre-tournament (200-500 pages) | Add ISR (60s revalidation) for schedule pages when FIFA publishes match data. Content JSON files may split into per-entity files if single-file loading gets slow. |
| Tournament peak (same pages, high traffic) | Vercel CDN handles this natively -- static pages scale infinitely. Monitor GA4 for real-time event volume. Ensure affiliate redirect performance. No architecture changes needed. |
| Post-tournament (optional) | If pivoting to other events, extract content schema into a generic "event guide" pattern. The data loader abstraction makes this straightforward. |

### Scaling Priorities

1. **First bottleneck (build time):** At 200+ pages x 2 locales = 400+ static routes, build times may approach 3-5 minutes. Mitigation: `dynamicParams: true` to pre-render high-priority pages and generate long-tail on first request. This is unlikely to be a real problem at this scale.

2. **Second bottleneck (content management):** Editing JSON files via git becomes cumbersome with 50+ content files. Mitigation path: add a lightweight CMS (Sanity free tier, or Contentlayer) that outputs to the same data loader interface. The `lib/content/` abstraction makes this a transparent swap.

## Anti-Patterns

### Anti-Pattern 1: CMS-First for Static Content

**What people do:** Adopt Sanity, Contentful, or Strapi before having any content, spending weeks on CMS schema design.
**Why it's wrong:** For a site with a known, finite content set (16 cities, 16 stadiums, 48 teams), a CMS adds latency (API calls at build time), cost (API limits), and complexity (webhook-triggered rebuilds) without proportional benefit.
**Do this instead:** Start with JSON files in the repo. The typed data loader abstraction (`lib/content/`) means migrating to a CMS later requires changing only the loader implementations, not any page code. Add a CMS only when non-developer contributors need to edit content.

### Anti-Pattern 2: Using `next-intl` for Two-Language Static Sites

**What people do:** Install `next-intl` (or `next-i18next`) because "that's what you use for i18n in Next.js."
**Why it's wrong:** These libraries add complexity (unstable_setRequestLocale hacks, middleware configuration, client-side translation loading) that's justified for 10+ languages with dynamic content. For two languages on a primarily static site, the official Next.js dictionary pattern is simpler, has zero client-side overhead, and requires no third-party dependencies.
**Do this instead:** Follow the Next.js official i18n guide: `[lang]` segment + `getDictionary()` + `generateStaticParams`. Add `next-intl` only if you discover you need complex ICU message formatting, pluralization across 3+ languages, or client-side locale switching without page reload.

### Anti-Pattern 3: Putting All JSON-LD in a Global Layout

**What people do:** Inject a single Organization or WebSite JSON-LD blob in the root layout and call SEO "done."
**Why it's wrong:** JSON-LD should describe the specific entity on each page. A city page needs Place schema. A stadium page needs StadiumOrArena schema. A FAQ section needs FAQPage schema. Global-only JSON-LD misses the entire point of structured data for LLM consumption.
**Do this instead:** Each page renders its own JSON-LD via the `JsonLd` component, using the page-specific data. The root layout can additionally include Organization and WebSite schemas, but per-page schemas are mandatory.

### Anti-Pattern 4: Hardcoded Affiliate Links Throughout JSX

**What people do:** Scatter raw `<a href="https://booking.com/hotel/x?aid=12345">` links across dozens of components.
**Why it's wrong:** When an affiliate program changes their tracking parameter format, URL structure, or you switch partners, you need to find-and-replace across the entire codebase. Missed links silently lose revenue. No tracking consistency.
**Do this instead:** Centralize all affiliate configuration in `affiliates.json`. Render every affiliate link through the `<AffiliateLink>` component. One config change updates every link site-wide. Tracking is automatic and consistent.

### Anti-Pattern 5: Client-Side Data Fetching for Content

**What people do:** Use `useEffect` + `fetch()` to load content data in Client Components, treating the site like a SPA.
**Why it's wrong:** Content loaded client-side is invisible to search engine crawlers and LLMs. The entire SEO and LLM optimization strategy depends on content being present in the initial HTML response. Client-fetched content also causes layout shifts and slower perceived performance.
**Do this instead:** Load all content data in Server Components at build time. Pass data to Client Components as props only when those components need interactivity (e.g., passing city data to the `BudgetCalculator` so it can show city-specific costs).

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **Vercel** | Deploy target, CDN, ISR runtime | Zero-config with Next.js. Use `vercel.json` only for redirects (old HTML URLs to new routes). |
| **GA4** | `gtag.js` loaded via `<Script strategy="afterInteractive">` in root layout | Use `G-HMRJTYPDPP`. Track pageviews automatically, custom events via `trackEvent()` utility. |
| **Booking.com** | Affiliate links with `aid` parameter | Deep links to city-specific hotel listings. Track clicks via `affiliate_link_click` event. |
| **Skyscanner** | Affiliate links with `associateid` parameter | Deep links to route-specific flight searches. Same tracking pattern. |
| **GetYourGuide** | Affiliate widget or deep links | May provide embeddable widgets -- evaluate if they impact Core Web Vitals. Prefer deep links if widgets are heavy. |
| **Google Search Console** | Sitemap submission, index monitoring | Submit dynamic sitemap (`app/sitemap.ts`). Monitor coverage for all 100+ pages. |
| **Pexels/Unsplash** | Image assets | Download and optimize at build time via `next/image`. Do not hotlink -- it's slow and unreliable. Store optimized images in `public/images/`. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Content JSON <-> Data Loaders** | File system read (fs) at build time | Data loaders are the ONLY code that reads JSON files. Pages never import JSON directly. |
| **Data Loaders <-> Pages** | Function call returning typed objects | `getCity(slug, lang)` returns `City \| undefined`. Pages handle the undefined case with `notFound()`. |
| **Pages <-> SEO Components** | Props: page data -> JSON-LD output | Pages pass their loaded data to `JsonLd`, which transforms it into Schema.org format. |
| **Pages <-> Client Islands** | Props: serialized data, translated labels | Server Components pass data down as props. No shared state store needed. Client Components are self-contained. |
| **AffiliateLink <-> GA4** | `trackEvent()` call on click | Decoupled: AffiliateLink calls the analytics utility, which calls gtag. Swapping analytics providers only changes `lib/analytics.ts`. |
| **Middleware <-> App** | URL redirect (no data passing) | Middleware only handles locale detection and redirect. It does NOT load content or dictionaries. |

## Build Order Implications

The architecture has clear dependency layers that dictate implementation order:

### Phase 1: Foundation (must come first)
- TypeScript content type definitions (`types/`)
- Content JSON structure (`content/`)
- Data loader functions (`lib/content/`)
- i18n setup (middleware, dictionaries, `getDictionary()`)
- Base layout with `[lang]` segment
- `generateStaticParams` in root layout

**Rationale:** Everything else depends on having typed data and working i18n routing. Without this, no page can render.

### Phase 2: Core Content Pages (depends on Phase 1)
- City pages with full content rendering
- Stadium pages
- Homepage with featured content
- Navigation and layout components
- Sitemap and robots.txt generation

**Rationale:** These are the highest-value SEO pages. They exercise the data layer and validate the entire architecture. Build the most complex content type first (cities, which have the most data fields and affiliate integrations) to prove the pattern.

### Phase 3: SEO and Structured Data (depends on Phase 2)
- JSON-LD factory functions for each content type
- FAQ schema generation
- Open Graph image generation
- Breadcrumb schema
- `llms.txt` route handler
- Canonical URL and hreflang configuration

**Rationale:** Requires working pages to attach structured data to. This is the LLM optimization layer -- critical for the project's differentiation, but meaningless without content underneath.

### Phase 4: Monetization Layer (depends on Phase 2)
- Affiliate link configuration
- `AffiliateLink` component
- Affiliate cards and banners
- GA4 integration and event tracking
- Conversion tracking setup

**Rationale:** Revenue generation layer. Depends on content pages existing to embed links into. GA4 tracking wraps the entire site, so it touches the root layout but doesn't block content development.

### Phase 5: Interactive Tools (depends on Phases 1, 4)
- Budget calculator
- Trip planner
- Newsletter signup
- Match schedule (when data available)

**Rationale:** Client Components that depend on the data layer (city costs, flight data) and the analytics layer (event tracking). These are differentiators but not table-stakes -- they enhance existing content pages rather than standing alone.

### Phase 6: Expansion Content (depends on Phase 2 pattern)
- Team pages (48 teams)
- Travel guide pages
- Fan experience guides
- Ticket buying guides

**Rationale:** High volume, lower complexity. Once the content page pattern is proven with cities and stadiums, these follow the same pattern and can be built rapidly.

## Sources

- [Next.js Official: JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) -- JSON-LD implementation pattern (v16.2.1, updated 2026-03-25)
- [Next.js Official: Internationalization Guide](https://nextjs.org/docs/app/guides/internationalization) -- i18n architecture pattern (v16.2.1, updated 2026-03-25)
- [Next.js Official: generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) -- SSG with dynamic routes
- [Next.js Official: Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) -- File conventions
- [How I built a Next.js app with 1,500+ localized routes and perfect Technical SEO](https://dev.to/hunterx13/how-i-built-a-nextjs-app-with-1500-localized-routes-and-perfect-technical-seo-3g5l) -- Real-world large SSG architecture
- [The Complete Guide to Scalable Next.js Architecture](https://dev.to/melvinprince/the-complete-guide-to-scalable-nextjs-architecture-39o0) -- Folder organization patterns
- [llms.txt Specification](https://llmstxt.org/) -- LLM discovery file format
- [Mastering llms.txt: Advanced Next.js 15 Implementation](https://www.buildwithmatija.com/blog/llms-txt-advanced-nextjs-implementation) -- Next.js-specific llms.txt implementation
- [schema-dts on npm](https://www.npmjs.com/package/schema-dts) -- Type-safe Schema.org JSON-LD
- [Vercel SEO Playbook](https://vercel.com/blog/nextjs-seo-playbook) -- Vercel's official SEO optimization guide
- [GA4 Affiliate Link Tracking](https://www.analyticsmania.com/post/track-affiliate-link-clicks-with-google-analytics-4/) -- GA4 event tracking for affiliate clicks

---
*Architecture research for: SuperFan Mundial 2026 -- SEO/LLM-optimized content site*
*Researched: 2026-03-26*
