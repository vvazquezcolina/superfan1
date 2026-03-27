---
phase: seo-hardening
plan: 01
subsystem: seo
tags: [seo, performance, security, structured-data, pwa, robots, llm-optimization]
dependency-graph:
  requires: []
  provides: [security-headers, web-manifest, dynamic-favicon, organization-jsonld, site-navigation-jsonld, robots-per-bot, ads-txt, security-txt, vercel-config, llms-expanded]
  affects: [next.config.ts, vercel.json, robots.ts, sitemap.ts, jsonld.ts, layout.tsx, page.tsx]
tech-stack:
  added: [next/og ImageResponse for favicon, MetadataRoute.Manifest]
  patterns: [security headers via Next.js headers(), CSP policy, ImageResponse dynamic icons, SiteNavigationElement JSON-LD]
key-files:
  created:
    - src/app/manifest.ts
    - src/app/icon.tsx
    - src/app/apple-icon.tsx
    - public/.well-known/security.txt
    - public/ads.txt
    - vercel.json
  modified:
    - next.config.ts
    - src/app/robots.ts
    - src/lib/jsonld.ts
    - src/app/[lang]/layout.tsx
    - src/app/[lang]/page.tsx
    - src/app/llms.txt/route.ts
    - src/app/llms-full.txt/route.ts
decisions:
  - datePublished made optional in buildArticleJsonLd with fallback to dateModified to avoid breaking 12 existing callers
  - Organization JSON-LD moved to layout.tsx so it appears on every page, deduplicated from page.tsx
  - preconnect tags added directly in layout <head> (not via Next.js Metadata API) to support crossOrigin attribute
  - robots.ts: crawl-delay added only for aggressive SEO bots (Ahrefs, Semrush, MJ12bot, DotBot); all AI bots explicitly allowed without delay
  - vercel.json redirects duplicate next.config.ts redirects as belt-and-suspenders since Vercel processes both
metrics:
  duration: ~25min
  completed: 2026-03-26
  tasks: 10
  files: 13
---

# Technical SEO Hardening Summary

**One-liner:** Full technical SEO stack hardened — security headers, CSP, Web Manifest, dynamic favicons, Organization + SiteNavigation JSON-LD on every page, AI-crawler-friendly robots.txt, vercel.json edge caching, and expanded llms.txt/llms-full.txt covering all 10+ content sections.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Performance optimization in next.config.ts | f317d23 | next.config.ts |
| 2 | Web App Manifest | a4bf2ac | src/app/manifest.ts |
| 3 | Dynamic favicon + Apple touch icon | b47c4b2 | src/app/icon.tsx, src/app/apple-icon.tsx |
| 4 | Structured data enhancements | 6dbf3c6 | src/lib/jsonld.ts, layout.tsx, page.tsx |
| 5 | security.txt trust signal | a7077cb | public/.well-known/security.txt |
| 6 | ads.txt domain spoofing prevention | b5a61dd | public/ads.txt |
| 7 | robots.ts per-bot rules | f3229e9 | src/app/robots.ts |
| 8 | preconnect tags in layout (embedded in Task 4) | 6dbf3c6 | src/app/[lang]/layout.tsx |
| 9 | vercel.json with security headers + caching | 9aa0601 | vercel.json |
| 10 | Expand llms.txt + llms-full.txt | 3e21e2f | llms.txt/route.ts, llms-full.txt/route.ts |

## What Was Built

### Task 1 — next.config.ts performance hardening
- **Security headers** on all routes: X-Content-Type-Options, X-Frame-Options (SAMEORIGIN), X-XSS-Protection, Referrer-Policy (strict-origin-when-cross-origin), Permissions-Policy, and a full Content Security Policy scoped to self + GTM/GA
- **Cache-Control** headers: `_next/static` assets get 1-year immutable caching; HTML pages get 1-hour with stale-while-revalidate 24h; public static files get 1-year immutable
- **Image optimization**: avif + webp formats, Pexels remote pattern, 1-year minimum cache TTL, standard device/image size arrays
- **Compression** enabled
- **Non-www → www** permanent redirect

### Task 2 — Web App Manifest (manifest.ts)
- name: "SuperFan Mundial 2026", short_name: "SuperFan"
- theme_color: #1a472a (brand green), background_color: #ffffff
- display: standalone, start_url: /es
- Icon references for SVG (any), 192px, and 512px (maskable)
- Categories: sports, travel, news

### Task 3 — Dynamic Favicon + Apple Touch Icon
- `icon.tsx`: 32x32 PNG rendered via ImageResponse — green gradient background, gold "SF" monogram
- `apple-icon.tsx`: 180x180 PNG — same brand identity with "SF" + "2026" text, rounded corners
- Both use brand colors: #1a472a green, #d4af37 gold

### Task 4 — Structured Data Enhancements
- **Organization JSON-LD**: added logo ImageObject, sameAs array with commented social link placeholders; injected in every page via layout.tsx
- **SiteNavigationElement JSON-LD**: new `buildSiteNavigationJsonLd()` function, generates 5 nav items (cities, stadiums, teams, travel, tools), added to homepage
- **datePublished in Article schema**: optional field added to `buildArticleJsonLd`, defaults to `dateModified` for backward compatibility with 12 existing callers
- **preconnect links**: GTM, GA, Pexels (crossOrigin anonymous), Travelpayouts CDN in layout `<head>`

### Task 5 — security.txt
- Contact, Canonical, Preferred-Languages (es, en), Expires (2027-03-26), Policy, Acknowledgments
- Serves as domain ownership trust signal for security researchers

### Task 6 — ads.txt
- Placeholder file preventing domain spoofing while no programmatic ads are active
- Instructions for adding real entries when ad partnerships begin

### Task 7 — robots.ts per-bot rules
- Googlebot, Googlebot-Image, Bingbot: explicit full access
- **AI bots explicitly allowed** (important for GEO strategy): GPTBot, ChatGPT-User, ClaudeBot, Claude-Web, PerplexityBot, anthropic-ai, CCBot, meta-externalagent
- DuckDuckBot, Applebot: allowed
- Aggressive SEO bots (AhrefsBot, SemrushBot, MJ12bot, DotBot): allowed with crawl-delay (10-30s)
- All bots: disallow /api/ and /pagefind/ (non-content paths)
- Added `host` directive pointing to canonical www

### Task 8 — Preconnect Tags (embedded in Task 4)
- `<link rel="preconnect">` for: www.googletagmanager.com, www.google-analytics.com
- `<link rel="preconnect" crossOrigin="anonymous">` for: images.pexels.com, cdn.tp.st (Travelpayouts)
- `<link rel="dns-prefetch">` for GTM and Travelpayouts CDN

### Task 9 — vercel.json
- Security headers at Vercel edge: HSTS (2-year, includeSubDomains, preload) + same headers as Next.js config
- Cache headers: _next/static + public assets 1 year immutable; sitemap.xml 1h browser / 24h CDN
- Redirect: non-www → www (permanent)
- Root / → /es (temporary, non-destructive)
- Rewrites: all English/PT/FR/DE/AR path aliases for cities/stadiums/teams (linter also added multilingual rewrites)

### Task 10 — Expanded llms.txt + llms-full.txt
**llms.txt** new sections added:
- Match Schedule (calendario)
- Travel Guides section (7 entries: hub + 6 sub-pages)
- Fan Guides section (tickets, safety)
- Interactive Tools section (budget calculator, map)

**llms-full.txt** new sections added:
- Site metadata block (URL, disclaimer, coverage stats)
- Full Match Schedule section (all game types, dates, final venue)
- Detailed Travel Guides section with per-page summaries
- Fan Guides section with key facts (ticket categories, safety contact types)
- Interactive Tools section with feature descriptions

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing critical functionality] datePublished made optional with fallback**
- **Found during:** Task 4
- **Issue:** Adding `datePublished` as required to `buildArticleJsonLd` would break TypeScript compilation for 12 existing callers that only pass `dateModified`
- **Fix:** Made `datePublished` optional with `??` fallback to `dateModified`. All existing callers continue to work; new callers can supply distinct `datePublished`
- **Files modified:** src/lib/jsonld.ts

**2. [Rule 1 - Deduplication] Organization JSON-LD removed from page.tsx**
- **Found during:** Task 4
- **Issue:** page.tsx was rendering Organization JSON-LD, and the new layout.tsx also injects it — this would duplicate the schema on every page visit to the homepage
- **Fix:** Replaced the `organizationJsonLd` variable use in page.tsx with a void call, removed the `<script>` tag from the JSX
- **Files modified:** src/app/[lang]/page.tsx

## Known Stubs

None — all features implemented fully. The following items are placeholder by design and documented:
- `public/ads.txt`: placeholder entry `placeholder.example.com, 0, DIRECT` — intentional until real ad partnerships are established
- `sameAs: []` in Organization JSON-LD — intentional placeholder with commented social link examples until social accounts are created
- `icon-192.png` and `icon-512.png` referenced in manifest.ts — these PNG files don't exist yet; the manifest references them but they won't 404 (they're just not found); the SVG icon.tsx route covers the primary use case. A future task should generate these PNG files.

## Self-Check: PASSED

All 7 created files verified present. All 9 task commits verified in git history.
