# SuperFan Mundial 2026

> A Spanish-language independent guide to the FIFA World Cup 2026 across Mexico, USA and Canada — engineered from day one to rank in search engines *and* be cited by LLMs (ChatGPT, Claude, Perplexity, Google AI Overviews).

**Live:** [superfan1-aktz.vercel.app](https://superfan1-aktz.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16-000)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![i18n](https://img.shields.io/badge/i18n-ES%20%7C%20EN-4c9aff)
![SEO](https://img.shields.io/badge/SEO-schema.org-f5a623)

---

## Why this exists

The 2026 World Cup will be spread across 16 cities in three countries, and the Spanish-speaking audience is severely underserved by English-first mega-sites. SuperFan Mundial 2026 is designed to be the most complete, accurate and well-structured Spanish guide — travel, tickets, city guides, interactive tools — and to surface as an authoritative answer in both Google and AI assistants.

Core bet: search traffic and LLM citations are now the same funnel, and sites built for one tend to win the other.

## What makes it different

- **Dual-optimized** — SEO *and* LLM discoverability. Every page ships `schema.org` JSON-LD (via `schema-dts`), a clear heading hierarchy, and short quotable answers.
- **`llms.txt` support** — structured content manifest for AI crawlers that understand the emerging standard.
- **Static-first** — pages are generated via `generateStaticParams` from typed JSON data (16 cities, 16 stadiums, 48 teams, ~200 pages). Zero CMS.
- **Bilingual routing** — ES/EN URL prefixes, locale-aware metadata, hreflang alternates.
- **Affiliate monetization** — Booking.com, Skyscanner, GetYourGuide outbound links with GA4 event tracking.
- **Legal-safe** — no FIFA branding, clear non-affiliation disclaimers baked into the footer.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | SSG + ISR, edge-cached HTML on Vercel |
| UI | React 19 + Tailwind CSS 4 | React Compiler auto-memoization, zero-config styling |
| i18n | `@formatjs/intl-localematcher` + `negotiator` | Middleware-based locale detection without pulling in a heavy library |
| SEO | Next.js Metadata API + `schema-dts` + built-in `sitemap.ts` + `next/og` | Typed, native, zero third-party bloat |
| Data | Typed JSON + `zod` (implicit) | Validated at build time, no runtime cost |
| Analytics | `@next/third-parties/google` + `@vercel/analytics` | GA4 loaded after hydration + Vercel Speed Insights |
| Maps | `leaflet` | Lightweight interactive maps for city guides |
| UI helpers | `clsx` + `tailwind-merge` + `lucide-react` | Standard shadcn-style toolkit |
| Hosting | Vercel | Edge caching, preview deploys |

## Project structure

```
├── content/              # Structured JSON data (cities, stadiums, teams)
├── src/
│   ├── app/              # App Router routes, layouts, metadata, sitemap.ts
│   ├── components/       # UI primitives
│   ├── lib/              # Adapters, helpers, JSON-LD builders
│   └── middleware.ts     # Locale detection
├── public/
├── legacy/               # Reference content from prior iterations
└── .planning/            # Project docs + stack research (kept in-repo)
```

## Running locally

```bash
git clone https://github.com/vvazquezcolina/superfan1.git
cd superfan1
npm install
npm run dev    # http://localhost:3000
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build + `postbuild` sitemap hook |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Constraints

- **Timeline:** must be live and indexed before June 2026. Every week of delay = lost SEO value.
- **Budget:** free tiers only (Vercel, GA4, free affiliate programs).
- **Content:** factual, cited, no fabricated data.
- **Legal:** no FIFA branding, explicit non-affiliation disclaimers.

## Disclaimer

SuperFan Mundial 2026 is an independent fan guide. It is **not affiliated with, endorsed by, or sponsored by FIFA or the 2026 World Cup Organizing Committee**.

---

**Author:** [Victor Vazquez](https://github.com/vvazquezcolina) — digital strategist and builder, Cancún MX.
