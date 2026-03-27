'use client'
import { useState, useMemo } from 'react'
import type { Match } from '@/lib/content/schedule'
import type { Locale } from '@/lib/content/schemas'

interface MatchCalendarProps {
  matches: Match[]
  lang: Locale
}

export function MatchCalendar({ matches, lang }: MatchCalendarProps) {
  const [filterGroup, setFilterGroup] = useState<string>('all')
  const [filterCity, setFilterCity] = useState<string>('all')
  const [filterDate, setFilterDate] = useState<string>('') // YYYY-MM-DD or ''

  // Derive filter options from data
  const groups = ['all', ...Array.from(new Set(matches.map((m) => m.group).filter(Boolean))).sort()] as string[]
  const cities = ['all', ...Array.from(new Set(matches.map((m) => m.city))).sort()]

  const filtered = useMemo(
    () =>
      matches.filter((m) => {
        if (filterGroup !== 'all' && m.group !== filterGroup) return false
        if (filterCity !== 'all' && m.city !== filterCity) return false
        if (filterDate && m.date !== filterDate) return false
        return true
      }),
    [matches, filterGroup, filterCity, filterDate],
  )

  // Bilingual labels
  const labels = {
    all: lang === 'es' ? 'Todos' : 'All',
    group: lang === 'es' ? 'Grupo' : 'Group',
    city: lang === 'es' ? 'Ciudad' : 'City',
    date: lang === 'es' ? 'Fecha' : 'Date',
    matchday: lang === 'es' ? 'Jornada' : 'Matchday',
    vs: 'vs',
    tbd: lang === 'es' ? 'Por confirmar' : 'TBD',
    noMatches:
      lang === 'es' ? 'No hay partidos para estos filtros.' : 'No matches for these filters.',
  }

  return (
    <div>
      {/* Filters row */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">{labels.group}</label>
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="rounded border border-border px-3 py-1.5 text-sm bg-background"
          >
            {groups.map((g) => (
              <option key={g} value={g}>
                {g === 'all' ? labels.all : `${labels.group} ${g}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{labels.city}</label>
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="rounded border border-border px-3 py-1.5 text-sm bg-background"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c === 'all'
                  ? labels.all
                  : (matches.find((m) => m.city === c)?.cityName[lang] ?? c)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{labels.date}</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            min="2026-06-11"
            max="2026-07-19"
            className="rounded border border-border px-3 py-1.5 text-sm bg-background"
          />
        </div>
        {(filterGroup !== 'all' || filterCity !== 'all' || filterDate) && (
          <button
            onClick={() => {
              setFilterGroup('all')
              setFilterCity('all')
              setFilterDate('')
            }}
            className="self-end rounded border border-border px-3 py-1.5 text-sm hover:bg-muted/20"
          >
            {lang === 'es' ? 'Limpiar filtros' : 'Clear filters'}
          </button>
        )}
      </div>

      {/* Match count */}
      <p className="text-sm text-muted mb-4">
        {lang === 'es' ? `${filtered.length} partido(s)` : `${filtered.length} match(es)`}
      </p>

      {/* Match grid */}
      {filtered.length === 0 ? (
        <p className="text-muted text-center py-8">{labels.noMatches}</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((match) => (
            <div
              key={match.id}
              className="rounded-lg border border-border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                {match.group && (
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {labels.group} {match.group}
                  </span>
                )}
                <span className="font-semibold">
                  {match.homeTeam[lang] === 'TBD' ? labels.tbd : match.homeTeam[lang]}
                  {' '}
                  {labels.vs}
                  {' '}
                  {match.awayTeam[lang] === 'TBD' ? labels.tbd : match.awayTeam[lang]}
                </span>
              </div>
              <div className="text-sm text-muted flex flex-col sm:items-end gap-0.5">
                <span>
                  {match.date} {match.time !== 'TBD' ? match.time : ''}
                </span>
                <span>{match.venue}</span>
                <span>{match.cityName[lang]}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
