import type { Team, Locale } from '@/lib/content/schemas'
import { Users, Shield, Globe, Clock } from 'lucide-react'

const CONFEDERATION_FLAGS: Record<string, string> = {
  UEFA: '\u{1F1EA}\u{1F1FA}',
  CONMEBOL: '\u{1F30E}',
  CONCACAF: '\u{1F30E}',
  CAF: '\u{1F30D}',
  AFC: '\u{1F30F}',
  OFC: '\u{1F1F3}\u{1F1FF}',
}

interface TeamHeroProps {
  team: Team
  lang: Locale
}

export function TeamHero({ team, lang }: TeamHeroProps) {
  const flag = CONFEDERATION_FLAGS[team.confederation] ?? ''
  const groupLabel = lang === 'es' ? 'Grupo' : 'Group'
  const confederationLabel = lang === 'es' ? 'Confederacion' : 'Confederation'

  const hasContent = !!team.content
  const overviewText = hasContent ? team.content!.overview[lang] : ''
  const firstParagraph = hasContent ? overviewText.split('\n\n')[0] : ''

  return (
    <section className="w-full rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-secondary px-6 py-10 text-white md:px-10 md:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-2 text-white/70 text-sm font-medium mb-3">
          <Shield className="h-4 w-4" />
          {lang === 'es' ? 'Seleccion nacional' : 'National Team'}
        </div>

        <h1 className="text-3xl font-extrabold md:text-5xl">
          {flag} {team.name[lang]}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-white/80">
          {team.group && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-sm font-bold text-accent">
              {groupLabel} {team.group}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
            <Globe className="h-3.5 w-3.5" />
            {confederationLabel}: {team.confederation}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm">
            <Clock className="h-3.5 w-3.5" />
            {lang === 'es' ? 'Actualizado' : 'Updated'}: {team.lastUpdated}
          </span>
        </div>

        {hasContent && firstParagraph && (
          <p className="mt-6 text-base leading-relaxed text-white/80 md:text-lg">
            {firstParagraph}
          </p>
        )}

        {!hasContent && (
          <p className="mt-6 text-base leading-relaxed text-white/70 md:text-lg">
            {team.description[lang]}
          </p>
        )}
      </div>
    </section>
  )
}
