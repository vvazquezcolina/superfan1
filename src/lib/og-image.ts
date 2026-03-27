/**
 * Shared OG image utilities for SuperFan Mundial 2026
 * Provides brand colors, constants, and layout helpers for all OG images.
 * All OG images use Next.js ImageResponse (Edge runtime) — no external image deps.
 */

// ─── Brand Tokens ────────────────────────────────────────────────────────────
export const OG_COLORS = {
  // Backgrounds
  bgDark: '#0d2818',
  bgPrimary: '#1a472a',
  bgMid: '#163d23',
  bgAccent: '#0f3320',

  // Text
  textWhite: '#ffffff',
  textLight: '#e8f5e9',
  textMuted: '#a8d8b4',

  // Gold accent — World Cup prestige
  gold: '#d4af37',
  goldLight: '#f0d060',
  goldDark: '#b8941e',

  // Overlays & borders
  border: 'rgba(212, 175, 55, 0.4)',
  overlayDark: 'rgba(0, 0, 0, 0.45)',
  overlayLight: 'rgba(255, 255, 255, 0.05)',
} as const

// ─── Dimensions ───────────────────────────────────────────────────────────────
export const OG_SIZE = {
  width: 1200,
  height: 630,
} as const

// ─── Country display helpers ──────────────────────────────────────────────────
export const COUNTRY_FLAGS: Record<string, string> = {
  mexico: '🇲🇽',
  usa: '🇺🇸',
  canada: '🇨🇦',
}

export const COUNTRY_NAMES_ES: Record<string, string> = {
  mexico: 'México',
  usa: 'Estados Unidos',
  canada: 'Canadá',
}

export const COUNTRY_NAMES_EN: Record<string, string> = {
  mexico: 'Mexico',
  usa: 'United States',
  canada: 'Canada',
}

// ─── Confederation colors ─────────────────────────────────────────────────────
export const CONFEDERATION_COLORS: Record<string, string> = {
  UEFA: '#003DA5',
  CONMEBOL: '#006633',
  CONCACAF: '#C8102E',
  CAF: '#009A44',
  AFC: '#FF6B00',
  OFC: '#00A9CE',
}

// ─── Tool display map ─────────────────────────────────────────────────────────
export const TOOL_META: Record<string, { icon: string; titleEs: string; titleEn: string; descEs: string; descEn: string }> = {
  'conversor-moneda': {
    icon: '💱',
    titleEs: 'Conversor de Moneda',
    titleEn: 'Currency Converter',
    descEs: 'Convierte entre USD, MXN, CAD y más',
    descEn: 'Convert between USD, MXN, CAD and more',
  },
  'presupuesto': {
    icon: '📊',
    titleEs: 'Planificador de Presupuesto',
    titleEn: 'Budget Planner',
    descEs: 'Calcula cuánto cuesta tu aventura mundialista',
    descEn: 'Calculate your World Cup adventure cost',
  },
  'lista-equipaje': {
    icon: '🧳',
    titleEs: 'Lista de Equipaje',
    titleEn: 'Packing List',
    descEs: 'Todo lo que necesitas llevar al Mundial',
    descEn: 'Everything you need to bring to the World Cup',
  },
  'itinerario': {
    icon: '📅',
    titleEs: 'Generador de Itinerario',
    titleEn: 'Itinerary Generator',
    descEs: 'Planifica tu viaje día a día',
    descEn: 'Plan your trip day by day',
  },
  'mapa': {
    icon: '🗺️',
    titleEs: 'Mapa Interactivo',
    titleEn: 'Interactive Map',
    descEs: 'Explora todas las sedes del Mundial',
    descEn: 'Explore all World Cup venues',
  },
}
