# Phase 1: Project Scaffold & Data Architecture - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-26
**Phase:** 1-Project Scaffold & Data Architecture
**Areas discussed:** i18n approach, Data schema design, URL structure, Project bootstrap
**Mode:** Auto (all decisions auto-selected as recommended defaults)

---

## i18n Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Built-in [lang] + getDictionary() | Simpler for 2 languages, no dependency, follows Next.js official docs | ✓ |
| next-intl 4.8.x | More robust with pluralization, TypeScript-safe keys, but adds complexity | |
| Custom i18n wrapper | Maximum control, but reinvents the wheel | |

**User's choice:** [auto] Built-in [lang] + getDictionary() (recommended default)
**Notes:** Research presented both options. Built-in is sufficient for 2 locales and avoids a dependency. Can upgrade to next-intl later if needs grow.

---

## Data Schema Design

| Option | Description | Selected |
|--------|-------------|----------|
| Local JSON + Zod schemas | One JSON file per entity type, validated at build time | ✓ |
| MDX content files | Markdown with frontmatter, good for prose-heavy content | |
| Headless CMS (Sanity/Contentful) | External content management, overkill for single developer | |

**User's choice:** [auto] Local JSON + Zod schemas (recommended default)
**Notes:** Research unanimously recommended local JSON for bounded dataset with single developer. Zod catches errors at build time.

---

## URL Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Localized slugs (es: /ciudades/, en: /cities/) | Best for SEO in each language, requires slug mapping | ✓ |
| Shared English slugs for both locales | Simpler routing but poor Spanish SEO | |
| Numeric IDs in URLs | Language-agnostic but terrible for SEO and readability | |

**User's choice:** [auto] Localized slugs (recommended default)
**Notes:** SEO research strongly favors localized slugs. Slug mappings stored in content data.

---

## Project Bootstrap

| Option | Description | Selected |
|--------|-------------|----------|
| Fresh Next.js project | Clean foundation, no legacy debt | ✓ |
| Migrate existing HTML to Next.js | Preserves content but carries bad patterns | |
| Build on top of existing structure | Fastest start but worst architecture | |

**User's choice:** [auto] Fresh Next.js project (recommended default)
**Notes:** Existing HTML is auto-generated template content. Not worth migrating — archive for reference only.

---

## Claude's Discretion

- Zod schema field definitions
- Folder structure conventions
- src/ vs root-level app/
- Middleware implementation details

## Deferred Ideas

None
