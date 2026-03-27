'use client'
import { useState, useMemo } from 'react'
import { Filter, X, Calendar, MapPin } from 'lucide-react'
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
    vs: 'vs',
    tbd: lang === 'es' ? 'Por confirmar' : 'TBD',
    noMatches:
      lang === 'es' ? 'No hay partidos para estos filtros.' : 'No matches for these filters.',
    clearFilters: lang === 'es' ? 'Limpiar filtros' : 'Clear filters',
    matchCount: lang === 'es' ? 'partidos' : 'matches',
  }

  const hasFilters = filterGroup !== 'all' || filterCity !== 'all' || filterDate

  return (
    <div>
      {/* Filters row */}
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted">
          <Filter className="h-4 w-4" />
          {lang === 'es' ? 'Filtrar partidos' : 'Filter matches'}
        </div>
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">{labels.group}</label>
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-sm bg-background min-w-[120px]"
            >
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g === 'all' ? labels.all : `${labels.group} ${g}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">{labels.city}</label>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-sm bg-background min-w-[160px]"
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
            <label className="block text-xs font-medium text-muted mb-1">{labels.date}</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              min="2026-06-11"
              max="2026-07-19"
              className="rounded-lg border border-border px-3 py-2 text-sm bg-background"
            />
          </div>
          {hasFilters && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterGroup('all')
                  setFilterCity('all')
                  setFilterDate('')
                }}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-primary/5 transition-colors"
              >
                <X className="h-3 w-3" />
                {labels.clearFilters}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Match count */}
      <p className="text-sm text-muted mt-4 mb-3 font-medium">
        {filtered.length} {labels.matchCount}
      </p>

      {/* Match grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-border">
          <Calendar className="mx-auto h-10 w-10 text-muted/50 mb-3" />
          <p className="text-muted">{labels.noMatches}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((match) => (
            <div
              key={match.id}
              className="rounded-xl border border-border bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors hover:border-primary/30"
            >
              <div className="flex items-center gap-3">
                {match.group && (
                  <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary min-w-[52px] text-center">
                    {labels.group} {match.group}
                  </span>
                )}
                <span className="font-semibold text-base">
                  {match.homeTeam[lang] === 'TBD' ? labels.tbd : match.homeTeam[lang]}
                  {' '}
                  <span className="text-muted font-normal">{labels.vs}</span>
                  {' '}
                  {match.awayTeam[lang] === 'TBD' ? labels.tbd : match.awayTeam[lang]}
                </span>
              </div>
              <div className="text-sm text-muted flex flex-col sm:items-end gap-0.5">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <Calendar className="h-3 w-3" />
                  {match.date} {match.time !== 'TBD' ? match.time : ''}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {match.venue}, {match.cityName[lang]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
