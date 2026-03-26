import type { Team, Locale } from '@/lib/content/schemas'

const CONFEDERATION_FLAGS: Record<string, string> = {
  UEFA: '\u{1F1EA}\u{1F1FA}',      // EU flag
  CONMEBOL: '\u{1F30E}',           // Americas globe
  CONCACAF: '\u{1F30E}',           // Americas globe
  CAF: '\u{1F30D}',                // Africa/Europe globe
  AFC: '\u{1F30F}',                // Asia globe
  OFC: '\u{1F1F3}\u{1F1FF}',       // NZ flag for OFC
}

interface TeamHeroProps {
  team: Team
  lang: Locale
}

export function TeamHero({ team, lang }: TeamHeroProps) {
  const flag = CONFEDERATION_FLAGS[team.confederation] ?? ''
  const lastUpdatedLabel = lang === 'es' ? 'Ultima actualizacion' : 'Last updated'
  const groupLabel = lang === 'es' ? 'Grupo' : 'Group'
  const confederationLabel = lang === 'es' ? 'Confederacion' : 'Confederation'
  const comingSoonText =
    lang === 'es'
      ? 'Contenido completo proximamente.'
      : 'Full content coming soon.'

  if (!team.content) {
    return (
      <section className="w-full rounded-lg bg-primary/10 px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold md:text-5xl">
            {flag} {team.name[lang]}
          </h1>
          {team.group && (
            <span className="mt-3 inline-block rounded bg-primary px-2 py-0.5 text-sm font-semibold text-white">
              {groupLabel} {team.group}
            </span>
          )}
          <p className="mt-4 text-base text-muted md:text-lg">{confederationLabel}: {team.confederation}</p>
          <p className="mt-6 text-base leading-relaxed md:text-lg">{comingSoonText}</p>
          <p className="mt-4 text-sm text-muted">
            {lastUpdatedLabel}: {team.lastUpdated}
          </p>
        </div>
      </section>
    )
  }

  const overviewText = team.content.overview[lang]
  const firstParagraph = overviewText.split('\n\n')[0]

  return (
    <section className="w-full rounded-lg bg-primary/10 px-6 py-10 md:px-10 md:py-14">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold md:text-5xl">
          {flag} {team.name[lang]}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          {team.group && (
            <span className="inline-block rounded bg-primary px-2 py-0.5 text-sm font-semibold text-white">
              {groupLabel} {team.group}
            </span>
          )}
          <p className="text-base text-muted">
            {confederationLabel}: {team.confederation}
          </p>
        </div>

        <p className="mt-6 text-base leading-relaxed md:text-lg">
          {firstParagraph}
        </p>

        <p className="mt-4 text-sm text-muted">
          {lastUpdatedLabel}: {team.lastUpdated}
        </p>
      </div>
    </section>
  )
}
