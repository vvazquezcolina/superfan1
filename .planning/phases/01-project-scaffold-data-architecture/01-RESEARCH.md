# Phase 1: Project Scaffold & Data Architecture - Research

**Researched:** 2026-03-26
**Domain:** Next.js 16 project bootstrap, bilingual i18n routing, typed content data layer with Zod validation
**Confidence:** HIGH

## Summary

Phase 1 delivers the foundational skeleton every subsequent phase builds on: a deployed Next.js 16 application with bilingual routing (`/es/`, `/en/`), typed JSON content schemas validated by Zod at build time, and data loader functions for cities, stadiums, and teams. This is a greenfield project replacing an existing static HTML site -- no migration, no existing package.json, no existing Next.js code.

The core technical challenges are: (1) implementing the `[lang]` dynamic segment i18n pattern without `next-intl` (per user decision D-01), using the official Next.js `getDictionary()` approach with `proxy.ts` for locale detection; (2) designing bilingual content JSON schemas where both locales live in the same file with locale-specific slugs for URL routing; (3) handling translated URL paths (`/es/ciudades/[slug]` vs `/en/cities/[slug]`) via proxy rewrites since filesystem routes use Spanish path names; and (4) ensuring `generateStaticParams` produces static pages for both locales across all content types.

**Critical discovery:** Next.js 16 renamed `middleware.ts` to `proxy.ts` and the exported function from `middleware` to `proxy`. All research documents and prior architecture references that mention `middleware.ts` must be updated. The CONTEXT.md decision D-06 says "Middleware detects locale" -- the implementation uses `proxy.ts` with exported `proxy()` function, but the behavior is identical.

**Primary recommendation:** Bootstrap with `create-next-app@latest` using `--src-dir`, then build the data layer (Zod schemas + JSON files + loader functions) before any page rendering. The data layer is the true foundation -- pages and routing are built on top of it.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Use Next.js built-in `[lang]` dynamic segment with `getDictionary()` pattern -- no next-intl dependency. Two languages (es, en) with Spanish as default.
- **D-02:** Proxy (middleware) detects locale from Accept-Language header and redirects to `/es/` if no locale prefix. Default locale is `es`.
- **D-03:** Use `es-419` (Latin American Spanish) for hreflang tags, not `es-MX`. English uses `en`.
- **D-04:** Content stored in local JSON files under `content/` directory -- one file per entity type: `cities.json`, `stadiums.json`, `teams.json`.
- **D-05:** Zod schemas validate all content JSON at build time. Invalid data must break the build to prevent bad content reaching production.
- **D-06:** Data loader functions in `lib/content/` are the ONLY access point for content data. Pages never read JSON files directly.
- **D-07:** Content includes both Spanish and English text in the same JSON structure (nested by locale key), not separate files per language.
- **D-08:** Spanish slugs for `/es/` routes: `/es/ciudades/ciudad-de-mexico`, `/es/estadios/estadio-azteca`
- **D-09:** English slugs for `/en/` routes: `/en/cities/mexico-city`, `/en/stadiums/estadio-azteca`
- **D-10:** Route structure: `app/[lang]/ciudades/[slug]/page.tsx` (Spanish path names in filesystem, English routes handled via rewrites or parallel route groups)
- **D-11:** Domain: `https://www.superfaninfo.com/`
- **D-12:** Fresh Next.js 16 project via `create-next-app`. Do NOT migrate existing HTML -- start clean.
- **D-13:** Archive existing static HTML files in a `legacy/` directory for content reference during later phases.
- **D-14:** TypeScript strict mode enabled from day one.
- **D-15:** Tailwind CSS v4 for styling (configured but minimal usage in this phase).

### Claude's Discretion
- Exact Zod schema field definitions for cities/stadiums/teams -- design schemas based on content needs from research
- Specific folder structure within `app/` and `lib/` -- follow Next.js 16 conventions
- Whether to use `src/` directory or root-level `app/` -- choose based on current Next.js best practice
- Proxy implementation details for locale detection

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INFRA-01 | Next.js 16 project with App Router, TypeScript, Tailwind v4 deployed on Vercel | `create-next-app@latest` with `--typescript --tailwind --eslint --app --src-dir` bootstraps this exactly. Verified: Next.js 16.2.1, Tailwind 4.2.2, TypeScript 5.8.x or 6.0.x (whatever create-next-app installs). Vercel CLI v44.2.7 available on system. |
| INFRA-02 | Bilingual routing with `[lang]` segment -- `/es/` (primary) and `/en/` prefixes with proper hreflang alternates | Built-in Next.js `[lang]` dynamic segment pattern with `getDictionary()`. Hreflang via `generateMetadata()` `alternates.languages` field. `es-419` for Spanish, `en` for English, plus `x-default` pointing to `/es/`. |
| INFRA-03 | Content data layer using typed JSON files with Zod schema validation at build time | Zod 3.24.x (verified: 3.24.x latest on npm is actually 4.3.6 -- NOTE: Zod 3 latest is 3.24.x, Zod 4.x is the new major -- use 3.24.x per STACK.md). JSON files in `content/`. Build-time validation via a script that runs during `next build` or a custom `prebuild` npm script. |
| INFRA-04 | Data loader functions as single access point for all content (abstracted from storage) | `lib/content/cities.ts`, `lib/content/stadiums.ts`, `lib/content/teams.ts` with typed return values. Functions like `getCities(lang)`, `getCity(slug, lang)`, `getCitySlugs()`. |
| INFRA-06 | Proxy (middleware) for locale detection and redirect | `proxy.ts` at project root (or `src/proxy.ts` if using src dir). Exports `proxy()` function. Uses `@formatjs/intl-localematcher` + `negotiator` for Accept-Language parsing. Redirects bare paths to `/es/` by default. |
| INFRA-07 | `generateStaticParams` configured for SSG across both locales | Root `[lang]/layout.tsx` exports `generateStaticParams` returning `[{lang:'es'},{lang:'en'}]`. Child pages export their own `generateStaticParams` using data loaders to enumerate slugs per locale. |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

The project CLAUDE.md establishes GSD workflow enforcement. Key directives:
- Use GSD entry points (`/gsd:execute-phase`, `/gsd:quick`, `/gsd:debug`) for all work
- Do not make direct repo edits outside a GSD workflow unless explicitly asked
- Follow project stack and architecture decisions from `.planning/research/STACK.md` and `.planning/research/ARCHITECTURE.md`

## Standard Stack

### Core (Phase 1 only -- packages needed for this phase)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.1 | Framework (App Router, SSG) | Current stable. Verified via `npm view next version`. Turbopack default. `generateStaticParams` for SSG. |
| React | 19.x | UI library | Bundled with Next.js 16. Server Components by default. |
| TypeScript | 5.8.x or 6.0.x | Type safety | Use whatever `create-next-app` installs. Both versions compatible. |
| Tailwind CSS | 4.2.2 | Styling | Verified via `npm view tailwindcss version`. CSS-first config (no JS config file). Configured but minimal use in Phase 1. |
| Zod | 3.24.x | Schema validation | Battle-tested, 40M+ weekly downloads. Use 3.x, NOT 4.x (ecosystem still targets 3.x). |
| @formatjs/intl-localematcher | 0.8.2 | Accept-Language negotiation | Recommended in official Next.js i18n docs for locale matching. |
| negotiator | 1.0.0 | HTTP content negotiation | Pairs with intl-localematcher for parsing Accept-Language header. |

### Supporting (installed but not primary focus of Phase 1)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | 2.x | Conditional CSS classes | Any component with conditional styling. Install now for later phases. |
| tailwind-merge | 3.x | Merge Tailwind classes | Component composition. Install now for later phases. |
| eslint-config-next | 16.2.x | Linting | Auto-installed by create-next-app. ESLint 9 flat config. |
| prettier + prettier-plugin-tailwindcss | latest | Code formatting | Install as devDependency for consistent formatting. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Built-in getDictionary | next-intl 4.8.x | next-intl provides TypeScript-safe keys, pluralization, date formatting. Overkill for 2 languages with mostly static content. User explicitly chose built-in pattern (D-01). |
| Single JSON per entity type | One JSON file per city/stadium/team | Per-entity files scale better but add complexity for 16 cities. Single-file-per-type is simpler for bounded dataset. User chose D-04. |
| proxy.ts rewrites | Parallel route groups for en/es | Parallel groups duplicate filesystem structure. Rewrites keep one set of page files. Rewrites are the simpler approach. |

**Installation:**
```bash
# Bootstrap (creates Next.js 16 + TypeScript + Tailwind CSS v4 + ESLint)
npx create-next-app@latest superfan --typescript --tailwind --eslint --app --src-dir

# i18n locale negotiation (for proxy.ts)
npm install @formatjs/intl-localematcher negotiator
npm install -D @types/negotiator

# Data validation
npm install zod

# UI utilities (for later phases, install now)
npm install clsx tailwind-merge

# Dev tools
npm install -D prettier prettier-plugin-tailwindcss
```

## Architecture Patterns

### Recommended Project Structure (Phase 1 scope)

```
superfan/
├── content/                     # STRUCTURED DATA (not in src/)
│   ├── cities.json              # All 16 cities, bilingual
│   ├── stadiums.json            # All 16 stadiums, bilingual
│   └── teams.json               # All 48 teams, bilingual (stub data for Phase 1)
│
├── legacy/                      # Archived existing HTML files (D-13)
│   ├── index.html
│   ├── about.html
│   └── ...
│
├── src/
│   ├── app/
│   │   ├── [lang]/              # i18n root segment
│   │   │   ├── layout.tsx       # Root layout (<html lang>, generateStaticParams)
│   │   │   ├── page.tsx         # Homepage (minimal for Phase 1)
│   │   │   ├── not-found.tsx    # 404 page (bilingual)
│   │   │   ├── dictionaries.ts  # getDictionary(), hasLocale()
│   │   │   ├── dictionaries/
│   │   │   │   ├── es.json      # Spanish UI strings
│   │   │   │   └── en.json      # English UI strings
│   │   │   ├── ciudades/        # City pages (Spanish URL paths)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx # Individual city page (stub)
│   │   │   ├── estadios/        # Stadium pages
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx # Individual stadium page (stub)
│   │   │   └── equipos/         # Team pages
│   │   │       └── [slug]/
│   │   │           └── page.tsx # Individual team page (stub)
│   │   └── layout.tsx           # Outermost layout (if needed for non-locale routes)
│   │
│   ├── lib/
│   │   ├── content/
│   │   │   ├── schemas.ts       # Zod schemas for City, Stadium, Team
│   │   │   ├── cities.ts        # getCities(), getCity(), getCitySlugs()
│   │   │   ├── stadiums.ts      # getStadiums(), getStadium(), getStadiumSlugs()
│   │   │   ├── teams.ts         # getTeams(), getTeam(), getTeamSlugs()
│   │   │   └── validate.ts      # Build-time validation script entry point
│   │   ├── i18n.ts              # Locale config, types, route helpers
│   │   └── utils.ts             # Shared utilities (slugify, etc.)
│   │
│   └── types/
│       └── content.ts           # TypeScript interfaces inferred from Zod schemas
│
├── proxy.ts                     # Locale detection + redirect (was middleware.ts)
├── next.config.ts               # Rewrites for English route paths
├── tsconfig.json
├── package.json
└── vercel.json                  # Optional: redirects for old HTML URLs
```

### Structure Rationale

- **`src/` directory:** Use `--src-dir` flag. Separates application code from config files. Standard for production Next.js projects. CONTEXT.md leaves this to Claude's discretion.
- **`content/` at project root (outside `src/`):** Content is data, not application code. JSON files are imported by data loaders. Keeping content separate makes it easier to update and potentially script content generation.
- **`legacy/` directory:** Archives existing HTML files per D-13. Reference only -- never served.
- **`dictionaries.ts` inside `app/[lang]/`:** Follows official Next.js i18n guide. `getDictionary()` and `hasLocale()` are co-located with the layout that uses them.
- **Spanish filesystem paths (`ciudades/`, `estadios/`, `equipos/`):** Spanish is the primary locale. English routes use proxy rewrites to map `/en/cities/[slug]` to the same page files.

### Pattern 1: Built-in i18n with getDictionary (CRITICAL for Phase 1)

**What:** The official Next.js pattern for i18n without third-party libraries. Dynamic imports load locale-specific dictionaries server-side.

**Source:** [Next.js Internationalization Guide](https://nextjs.org/docs/app/guides/internationalization) (v16.2.1, updated 2026-03-25)

**Example:**
```typescript
// src/app/[lang]/dictionaries.ts
import 'server-only'

const dictionaries = {
  es: () => import('./dictionaries/es.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
```

```typescript
// src/app/[lang]/layout.tsx
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from './dictionaries'

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }]
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  return (
    <html lang={lang === 'es' ? 'es-419' : 'en'}>
      <body>{children}</body>
    </html>
  )
}
```

### Pattern 2: Proxy for Locale Detection (was middleware.ts)

**What:** Next.js 16 renamed `middleware.ts` to `proxy.ts`. The exported function is named `proxy` (not `middleware`). Behavior is identical.

**Source:** [Next.js proxy.js docs](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) and [migration guide](https://nextjs.org/docs/messages/middleware-to-proxy)

**CRITICAL:** This is a breaking change from Next.js 15. All prior research referencing `middleware.ts` must be translated to `proxy.ts`.

**Example:**
```typescript
// proxy.ts (project root, or src/proxy.ts if using src dir)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['es', 'en']
const defaultLocale = 'es'

function getLocale(request: NextRequest): string {
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    headers[key] = value
  })
  const languages = new Negotiator({ headers }).languages()
  return match(languages, locales, defaultLocale)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect to locale-prefixed path
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip internal paths and static files
    '/((?!_next|api|favicon.ico|images|robots.txt|sitemap.xml).*)',
  ],
}
```

### Pattern 3: Translated URL Paths via Rewrites

**What:** The filesystem uses Spanish path names (`ciudades/`, `estadios/`). English routes (`/en/cities/`, `/en/stadiums/`) are mapped via `next.config.ts` rewrites to the same page files.

**Why:** D-10 specifies Spanish path names in filesystem with English routes handled via rewrites. This avoids duplicating page files.

**Example:**
```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // English city routes -> Spanish filesystem paths
      {
        source: '/en/cities/:slug',
        destination: '/en/ciudades/:slug',
      },
      // English stadium routes -> Spanish filesystem paths
      {
        source: '/en/stadiums/:slug',
        destination: '/en/estadios/:slug',
      },
      // English team routes -> Spanish filesystem paths
      {
        source: '/en/teams/:slug',
        destination: '/en/equipos/:slug',
      },
    ]
  },
}

export default nextConfig
```

**Important:** The proxy.ts must NOT redirect `/en/cities/...` to `/en/ciudades/...` -- the rewrite in next.config.ts handles this transparently. The proxy only handles missing locale prefix.

### Pattern 4: Bilingual Content JSON with Locale-Specific Slugs

**What:** Per D-07, content includes both languages in the same JSON structure. Per D-08/D-09, each entity has locale-specific slugs.

**Example:**
```json
{
  "cities": [
    {
      "id": "mexico-city",
      "slugs": {
        "es": "ciudad-de-mexico",
        "en": "mexico-city"
      },
      "name": {
        "es": "Ciudad de Mexico",
        "en": "Mexico City"
      },
      "country": "mexico",
      "description": {
        "es": "Capital de Mexico y sede historica del Mundial...",
        "en": "Capital of Mexico and historic World Cup host city..."
      },
      "stadium": "estadio-azteca",
      "coordinates": { "lat": 19.4326, "lng": -99.1332 },
      "lastUpdated": "2026-03-26"
    }
  ]
}
```

### Pattern 5: Zod Schema Validation at Build Time

**What:** Zod schemas define the shape of content data. A validation script runs during the build to catch data errors before they reach production.

**Example:**
```typescript
// src/lib/content/schemas.ts
import { z } from 'zod'

const LocalizedString = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
})

const LocalizedSlug = z.object({
  es: z.string().regex(/^[a-z0-9-]+$/),
  en: z.string().regex(/^[a-z0-9-]+$/),
})

export const CitySchema = z.object({
  id: z.string(),
  slugs: LocalizedSlug,
  name: LocalizedString,
  country: z.enum(['mexico', 'usa', 'canada']),
  description: LocalizedString,
  stadium: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  lastUpdated: z.string().date(),
})

export const CitiesFileSchema = z.object({
  cities: z.array(CitySchema).min(1),
})

export type City = z.infer<typeof CitySchema>
```

```typescript
// src/lib/content/validate.ts
import { CitiesFileSchema } from './schemas'
import citiesData from '../../../content/cities.json'

// This runs at build time when imported
const result = CitiesFileSchema.safeParse(citiesData)
if (!result.success) {
  console.error('Content validation failed:', result.error.format())
  process.exit(1)
}

export const validatedCities = result.data
```

**Build integration approach:** Add a `prebuild` script in package.json:
```json
{
  "scripts": {
    "prebuild": "tsx src/lib/content/validate.ts",
    "build": "next build"
  }
}
```

Or alternatively, validate inline inside the data loaders (simpler, catches errors during `next build` when pages import data loaders):
```typescript
// src/lib/content/cities.ts
import { CitiesFileSchema, type City } from './schemas'
import citiesJson from '../../../content/cities.json'

// Validation happens when this module is first imported (build time for SSG)
const { cities } = CitiesFileSchema.parse(citiesJson)

export function getCities(lang: 'es' | 'en'): City[] {
  return cities
}

export function getCity(slug: string, lang: 'es' | 'en'): City | undefined {
  return cities.find((city) => city.slugs[lang] === slug)
}

export function getCitySlugs(): Array<{ slug: string; lang: 'es' | 'en' }> {
  return cities.flatMap((city) => [
    { slug: city.slugs.es, lang: 'es' as const },
    { slug: city.slugs.en, lang: 'en' as const },
  ])
}
```

**Recommendation:** Use the inline validation approach (validate inside data loaders). It is simpler, requires no extra build script, and Zod's `.parse()` will throw during `next build` when `generateStaticParams` or page components import the data loaders. This naturally breaks the build on invalid data, satisfying D-05.

### Pattern 6: generateStaticParams with Bilingual Slugs

**What:** Each content page generates static params for both locales with locale-specific slugs.

**Source:** [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) (v16.2.1)

**Example:**
```typescript
// src/app/[lang]/ciudades/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getCity, getCitySlugs } from '@/lib/content/cities'
import { hasLocale, type Locale } from '@/app/[lang]/dictionaries'

export async function generateStaticParams() {
  // Returns [{lang:'es', slug:'ciudad-de-mexico'}, {lang:'en', slug:'mexico-city'}, ...]
  return getCitySlugs().map(({ slug, lang }) => ({ lang, slug }))
}

export async function generateMetadata({ params }: PageProps<'/[lang]/ciudades/[slug]'>) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) return {}
  const city = getCity(slug, lang as Locale)
  if (!city) return {}

  return {
    title: city.name[lang as Locale],
    description: city.description[lang as Locale],
    alternates: {
      canonical: `https://www.superfaninfo.com/${lang}/${lang === 'es' ? 'ciudades' : 'cities'}/${slug}`,
      languages: {
        'es-419': `https://www.superfaninfo.com/es/ciudades/${city.slugs.es}`,
        'en': `https://www.superfaninfo.com/en/cities/${city.slugs.en}`,
        'x-default': `https://www.superfaninfo.com/es/ciudades/${city.slugs.es}`,
      },
    },
  }
}

export default async function CityPage({ params }: PageProps<'/[lang]/ciudades/[slug]'>) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const city = getCity(slug, lang as Locale)
  if (!city) notFound()

  return (
    <div>
      <h1>{city.name[lang as Locale]}</h1>
      <p>{city.description[lang as Locale]}</p>
    </div>
  )
}
```

**Critical detail in Next.js 16:** `params` is a Promise and must be awaited before accessing values.

### Pattern 7: Hreflang Implementation

**What:** Hreflang alternate links are set per-page via `generateMetadata()` using the `alternates.languages` field.

**Source:** [Next.js generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) (v16.2.1)

**Key rules per D-03 and PITFALLS.md:**
- Use `es-419` (Latin American Spanish) as the hreflang value, NOT `es` or `es-MX`
- Use `en` for English
- Include `x-default` pointing to the Spanish version (default locale)
- Every page must self-reference AND reference all other language versions
- Each language version canonicals to itself (never cross-canonical)

**Example:**
```typescript
alternates: {
  canonical: `https://www.superfaninfo.com/es/ciudades/${city.slugs.es}`,
  languages: {
    'es-419': `https://www.superfaninfo.com/es/ciudades/${city.slugs.es}`,
    'en': `https://www.superfaninfo.com/en/cities/${city.slugs.en}`,
    'x-default': `https://www.superfaninfo.com/es/ciudades/${city.slugs.es}`,
  },
}
```

### Anti-Patterns to Avoid

- **Using `middleware.ts` instead of `proxy.ts`:** Next.js 16 renamed the convention. Using the old name will silently fail -- the proxy simply won't run. This is the most common Next.js 16 migration bug.
- **Importing JSON files directly in page components:** D-06 mandates all content access go through data loaders in `lib/content/`. This abstraction layer is critical for future CMS migration.
- **Separate JSON files per language:** D-07 explicitly requires both languages in the same JSON structure. This ensures translation completeness and makes slug cross-references trivial.
- **Forgetting to `await params`:** In Next.js 16, `params` and `searchParams` are Promises. Accessing `.lang` without `await` will cause runtime errors.
- **Using `es` or `es-MX` for hreflang:** D-03 specifies `es-419` for Latin American Spanish. This targets the correct audience.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accept-Language parsing | Custom header parser | `negotiator` + `@formatjs/intl-localematcher` | Edge cases in Accept-Language quality factors, wildcard matching, charset negotiation |
| Schema validation | Custom type checking | Zod 3.24.x | Parsing, transformation, error formatting, type inference all solved. 40M+ weekly downloads. |
| CSS utility composition | Custom className helpers | `clsx` + `tailwind-merge` | Class conflict resolution (e.g., `p-2` vs `p-4`) is non-trivial |
| URL rewriting for translated paths | Custom path resolver in proxy | `next.config.ts` rewrites | Framework-level rewrites are cached, optimized, and don't hit the proxy at all |

**Key insight:** The biggest "don't hand-roll" for this phase is the i18n routing. The temptation is to build a complex custom router for translated paths. The correct approach is: Spanish filesystem paths + `next.config.ts` rewrites for English paths. Simple, maintainable, framework-native.

## Common Pitfalls

### Pitfall 1: Using middleware.ts Instead of proxy.ts (Next.js 16 Breaking Change)
**What goes wrong:** Locale detection and redirect silently stops working. Bare URLs like `/` are not redirected to `/es/`. No error is thrown -- the file is simply ignored.
**Why it happens:** Every tutorial, blog post, and StackOverflow answer prior to Next.js 16 uses `middleware.ts`. The STACK.md and ARCHITECTURE.md research documents also reference `middleware.ts`.
**How to avoid:** File must be named `proxy.ts` (or `proxy.js`). Exported function must be named `proxy` (not `middleware`). There is a codemod: `npx @next/codemod@canary middleware-to-proxy .`
**Warning signs:** Visiting `/` does not redirect to `/es/`. The proxy function never executes.

### Pitfall 2: params Not Awaited in Next.js 16
**What goes wrong:** Runtime error when accessing `params.lang` or `params.slug` without awaiting the Promise.
**Why it happens:** Next.js 16 changed `params` and `searchParams` from synchronous objects to Promises. This affects every page, layout, `generateMetadata`, and `generateStaticParams`.
**How to avoid:** Always destructure after awaiting: `const { lang } = await params`
**Warning signs:** TypeError: Cannot read properties of undefined (reading 'lang')

### Pitfall 3: Hreflang Tags Missing Reciprocal References
**What goes wrong:** Google sees incomplete hreflang implementation. Spanish pages may cannibalize English pages in search results, or one locale gets de-indexed.
**Why it happens:** 75% of hreflang implementations have errors. Common mistake: the English page points to Spanish but Spanish doesn't point back to English.
**How to avoid:** Both language pages must include the complete set of hreflang alternates (including self-reference). Implement in `generateMetadata` with a shared helper function that always returns ALL alternates.
**Warning signs:** Google Search Console International Targeting shows hreflang errors.

### Pitfall 4: English Routes 404 Because Rewrites Missing
**What goes wrong:** `/en/cities/mexico-city` returns 404 because the filesystem only has `ciudades/` not `cities/`.
**Why it happens:** Rewrites in `next.config.ts` are forgotten or have incorrect patterns.
**How to avoid:** Add rewrites for every English path prefix. Test English routes immediately after setting up rewrites.
**Warning signs:** English locale pages 404 while Spanish locale pages work fine.

### Pitfall 5: Zod Validation Not Actually Running at Build Time
**What goes wrong:** Invalid content data reaches production. The build completes successfully despite malformed JSON.
**Why it happens:** If Zod schemas are defined but never actually called during the build, they are dead code. The validation must be triggered by an import chain that runs during `next build`.
**How to avoid:** Use the inline validation approach (parse inside data loaders). Since `generateStaticParams` imports data loaders, and `next build` executes `generateStaticParams`, the validation runs automatically.
**Warning signs:** Changing a JSON field to an invalid value does not break the build.

### Pitfall 6: Content JSON Relative Import Paths Break
**What goes wrong:** `import citiesJson from '../../../content/cities.json'` breaks or resolves to wrong path depending on file location.
**Why it happens:** Relative imports from `src/lib/content/` to project-root `content/` directory cross the `src` boundary.
**How to avoid:** Configure a TypeScript path alias in `tsconfig.json`: `"@content/*": ["./content/*"]`. Or use `fs.readFileSync` with `process.cwd()` for absolute resolution. The path alias approach is cleaner.
**Warning signs:** Module not found errors for content JSON imports.

## Code Examples

### Complete Zod Schema for Cities (Phase 1)

```typescript
// src/lib/content/schemas.ts
// Source: Custom design based on ARCHITECTURE.md entity definitions + CONTEXT.md decisions
import { z } from 'zod'

// Reusable schema for bilingual text fields
const LocalizedText = z.object({
  es: z.string().min(1, 'Spanish text required'),
  en: z.string().min(1, 'English text required'),
})

// Reusable schema for bilingual URL slugs
const LocalizedSlug = z.object({
  es: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid Spanish slug'),
  en: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid English slug'),
})

// Coordinates for map features (future Phase 10)
const Coordinates = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

export const CitySchema = z.object({
  id: z.string().min(1),
  slugs: LocalizedSlug,
  name: LocalizedText,
  country: z.enum(['mexico', 'usa', 'canada']),
  description: LocalizedText,
  stadium: z.string().min(1), // Reference to stadium id
  coordinates: Coordinates,
  lastUpdated: z.string(), // ISO date string for freshness signals (per CONTEXT.md specifics)
})

export const StadiumSchema = z.object({
  id: z.string().min(1),
  slugs: LocalizedSlug,
  name: LocalizedText,
  city: z.string().min(1), // Reference to city id
  capacity: z.number().int().positive(),
  coordinates: Coordinates,
  description: LocalizedText,
  lastUpdated: z.string(),
})

export const TeamSchema = z.object({
  id: z.string().min(1),
  slugs: LocalizedSlug,
  name: LocalizedText,
  confederation: z.enum(['UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC']),
  group: z.string().optional(), // May not be assigned yet
  description: LocalizedText,
  lastUpdated: z.string(),
})

// File-level schemas for validating entire JSON files
export const CitiesFileSchema = z.object({ cities: z.array(CitySchema).min(1) })
export const StadiumsFileSchema = z.object({ stadiums: z.array(StadiumSchema).min(1) })
export const TeamsFileSchema = z.object({ teams: z.array(TeamSchema).min(1) })

// Inferred types -- these ARE the TypeScript interfaces
export type City = z.infer<typeof CitySchema>
export type Stadium = z.infer<typeof StadiumSchema>
export type Team = z.infer<typeof TeamSchema>
export type Locale = 'es' | 'en'
```

### Complete Data Loader for Cities

```typescript
// src/lib/content/cities.ts
// Source: Pattern from ARCHITECTURE.md + D-06 (loaders are ONLY access point)
import { CitiesFileSchema, type City, type Locale } from './schemas'
import citiesJson from '@content/cities.json'

// Validate at import time (build time for SSG)
// If this throws, `next build` fails -- satisfying D-05
const { cities } = CitiesFileSchema.parse(citiesJson)

export function getCities(lang: Locale): City[] {
  return cities
}

export function getCity(slug: string, lang: Locale): City | undefined {
  return cities.find((city) => city.slugs[lang] === slug)
}

export function getCityByid(id: string): City | undefined {
  return cities.find((city) => city.id === id)
}

/**
 * Returns all slug + lang combinations for generateStaticParams
 * Produces entries like:
 *   { lang: 'es', slug: 'ciudad-de-mexico' }
 *   { lang: 'en', slug: 'mexico-city' }
 */
export function getCitySlugs(): Array<{ slug: string; lang: Locale }> {
  return cities.flatMap((city) => [
    { slug: city.slugs.es, lang: 'es' as const },
    { slug: city.slugs.en, lang: 'en' as const },
  ])
}
```

### Complete Hreflang Helper

```typescript
// src/lib/i18n.ts
import type { Locale } from '@/lib/content/schemas'

export const locales: Locale[] = ['es', 'en']
export const defaultLocale: Locale = 'es'
export const SITE_URL = 'https://www.superfaninfo.com'

// Map from filesystem (Spanish) path segments to English equivalents
export const pathTranslations: Record<string, Record<Locale, string>> = {
  ciudades: { es: 'ciudades', en: 'cities' },
  estadios: { es: 'estadios', en: 'stadiums' },
  equipos: { es: 'equipos', en: 'teams' },
}

/**
 * Build hreflang alternates for generateMetadata.
 * Always includes self-reference, cross-reference, and x-default.
 */
export function buildAlternates(
  section: string,
  slugs: Record<Locale, string>,
) {
  const pathEs = pathTranslations[section]?.es ?? section
  const pathEn = pathTranslations[section]?.en ?? section

  return {
    canonical: `${SITE_URL}/es/${pathEs}/${slugs.es}`,
    languages: {
      'es-419': `${SITE_URL}/es/${pathEs}/${slugs.es}`,
      'en': `${SITE_URL}/en/${pathEn}/${slugs.en}`,
      'x-default': `${SITE_URL}/es/${pathEs}/${slugs.es}`,
    },
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `middleware.ts` with `middleware()` export | `proxy.ts` with `proxy()` export | Next.js 16 (2026) | File renamed. All tutorials outdated. Codemod available. |
| `params` as synchronous object | `params` as Promise (must `await`) | Next.js 16 (2026) | Every page, layout, generateMetadata affected. |
| `tailwind.config.js` (JS config) | CSS-first config (no config file) | Tailwind v4 (Jan 2025) | `@import "tailwindcss"` in CSS file. No JS config needed. |
| `.eslintrc.json` (legacy config) | `eslint.config.mjs` (flat config) | ESLint 9 / Next.js 16 | `next lint` command removed. Use `eslint .` directly. |
| Pages Router `getStaticPaths` | App Router `generateStaticParams` | Next.js 13+ (2023) | Simpler API, typed params, works with layouts. |

**Deprecated/outdated warnings from project research docs:**
- STACK.md mentions `middleware.ts` -- must use `proxy.ts` instead
- ARCHITECTURE.md mentions `middleware.ts` in project structure -- must be `proxy.ts`
- CONTEXT.md D-02 says "Middleware detects locale" -- implementation is `proxy.ts` (same behavior, different file name)

## Open Questions

1. **TypeScript Path Alias for Content Directory**
   - What we know: Content JSON lives at project root `content/`, data loaders live in `src/lib/content/`. Relative imports would be `../../../content/cities.json`.
   - What's unclear: Whether Next.js 16 `create-next-app` configures a `@content` path alias automatically, or if we need to add it to `tsconfig.json` manually.
   - Recommendation: Add `"@content/*": ["./content/*"]` to `tsconfig.json` `paths`. Test after `create-next-app` scaffolding.

2. **Rewrite Order with Proxy Redirect**
   - What we know: `next.config.ts` rewrites and `proxy.ts` both process requests. The execution order is: headers -> redirects -> proxy -> rewrites -> filesystem.
   - What's unclear: Whether a request to `/en/cities/mexico-city` gets intercepted by proxy (which checks for locale prefix, finds `/en/`, and passes through) BEFORE the rewrite maps it to `/en/ciudades/mexico-city`.
   - Recommendation: This should work correctly because proxy only redirects when NO locale prefix exists. `/en/cities/...` has a locale prefix so proxy passes it through, then the rewrite maps it. Test this flow explicitly.

3. **Zod 3.x vs 4.x Package Name**
   - What we know: `npm view zod version` returns 4.3.6 (Zod 4 is now the latest on npm). STACK.md recommends Zod 3.24.x.
   - What's unclear: Whether `npm install zod` now installs Zod 4 by default, requiring `npm install zod@3` for the 3.x line.
   - Recommendation: Pin explicitly: `npm install zod@3.24` to ensure 3.x is installed per STACK.md guidance.

4. **English Route Index Pages**
   - What we know: `/en/cities/` should show the city listing. But the filesystem has `ciudades/page.tsx` not `cities/page.tsx`.
   - What's unclear: Whether the rewrite pattern `'/en/cities/:slug'` also covers `/en/cities` (without slug, for the index page). It likely does NOT because `:slug` is required.
   - Recommendation: Add a separate rewrite for each index route: `{ source: '/en/cities', destination: '/en/ciudades' }`. Test both `/en/cities` and `/en/cities/mexico-city`.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js 16 | Yes | v20.20.0 | -- |
| npm | Package management | Yes | 10.8.2 | -- |
| npx | create-next-app | Yes | 10.8.2 | -- |
| git | Version control | Yes | 2.39.3 | -- |
| Vercel CLI | Deployment | Yes | 44.2.7 | Deploy via git push to Vercel |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** None.

All required tools are available on the development machine.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None (greenfield project -- no test framework exists yet) |
| Config file | None -- see Wave 0 |
| Quick run command | `npx tsx src/lib/content/validate.ts` (content validation) |
| Full suite command | `npm run build` (build-time validation via Zod parse in data loaders) |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INFRA-01 | Next.js app builds and deploys on Vercel | smoke | `npm run build` | N/A (build itself is the test) |
| INFRA-02 | `/es/` and `/en/` render locale-specific content with hreflang | smoke | `npm run build && grep -r 'hreflang' .next/` | Wave 0 |
| INFRA-03 | JSON files validated by Zod -- invalid data breaks build | unit | `npx tsx src/lib/content/__tests__/schemas.test.ts` | Wave 0 |
| INFRA-04 | Data loaders return typed content for cities, stadiums, teams | unit | `npx tsx src/lib/content/__tests__/loaders.test.ts` | Wave 0 |
| INFRA-06 | Proxy detects locale and redirects | unit | `npx tsx src/__tests__/proxy.test.ts` | Wave 0 |
| INFRA-07 | generateStaticParams produces pages for both locales | smoke | `npm run build` (check build output for route count) | N/A (build output is the test) |

### Sampling Rate
- **Per task commit:** `npm run build` (catches Zod validation failures and TypeScript errors)
- **Per wave merge:** `npm run build` + manual verification of route output
- **Phase gate:** Successful Vercel deployment + both `/es/` and `/en/` accessible

### Wave 0 Gaps
- [ ] Install a test runner (vitest recommended for Next.js 16 projects)
- [ ] `src/lib/content/__tests__/schemas.test.ts` -- test Zod schemas with valid and invalid data
- [ ] `src/lib/content/__tests__/loaders.test.ts` -- test data loader functions return correct types
- [ ] `src/__tests__/proxy.test.ts` -- test proxy locale detection (using `unstable_doesProxyMatch` from Next.js)
- [ ] `vitest.config.ts` -- framework configuration

**Note:** For Phase 1, `npm run build` is the primary validation mechanism. Zod schemas that throw during build ARE the test. Dedicated unit tests are a "should have" that adds safety but are not strictly required for Phase 1 success criteria, which focus on deployment and build-time validation.

## Sources

### Primary (HIGH confidence)
- [Next.js Internationalization Guide](https://nextjs.org/docs/app/guides/internationalization) -- v16.2.1, getDictionary pattern, locale routing
- [Next.js proxy.ts File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) -- v16.2.1, middleware-to-proxy migration
- [Next.js Middleware to Proxy Migration](https://nextjs.org/docs/messages/middleware-to-proxy) -- breaking change documentation
- [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) -- v16.2.1, SSG for dynamic routes
- [Next.js generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) -- v16.2.1, alternates/hreflang pattern
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) -- v16.2.1, structured data implementation
- npm registry: next@16.2.1, zod@4.3.6 (latest) / zod@3.24.x (3.x line), tailwindcss@4.2.2, typescript@6.0.2

### Secondary (MEDIUM confidence)
- [Next.js 16 Blog Post](https://nextjs.org/blog/next-16) -- proxy rename, Turbopack stable
- [Medium: Next.js Middleware is Now Called Proxy](https://medium.com/@console.log.vivek/next-js-middleware-is-now-called-proxy-what-changed-in-next-js-16-f66983516634) -- community confirmation of rename
- [GitHub Discussion: Internationalized routing with different URL slugs](https://github.com/vercel/next.js/discussions/18485) -- rewrite approach for translated paths

### Tertiary (LOW confidence)
- Rewrite + proxy interaction order -- verified via Next.js docs execution order diagram, but untested in practice for this specific bilingual pattern. Needs validation during implementation.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all versions verified against npm registry and official docs on 2026-03-26
- Architecture: HIGH -- follows official Next.js patterns exactly as documented in v16.2.1 docs
- i18n routing: HIGH for basic pattern, MEDIUM for English rewrite approach (documented but not widely covered for bilingual translated paths without next-intl)
- Pitfalls: HIGH -- proxy.ts rename is verified; params Promise change is verified; hreflang issues are extensively documented

**Research date:** 2026-03-26
**Valid until:** 2026-04-26 (stable -- Next.js 16 patterns unlikely to change in 30 days)
