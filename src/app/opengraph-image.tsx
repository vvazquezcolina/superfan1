import { ImageResponse } from 'next/og'
import { OG_COLORS, OG_SIZE } from '@/lib/og-image'

export const runtime = 'nodejs'

export const alt = 'SuperFan Mundial 2026 — Guía Completa de las 16 Sedes | Complete 16-City Host Guide'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(145deg, ${OG_COLORS.bgPrimary} 0%, ${OG_COLORS.bgDark} 60%, #061410 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Geometric corner accents — top-left */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 220,
            height: 220,
            background: `radial-gradient(circle at top left, ${OG_COLORS.gold}22 0%, transparent 70%)`,
          }}
        />
        {/* Geometric corner accents — bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 280,
            height: 280,
            background: `radial-gradient(circle at bottom right, ${OG_COLORS.gold}18 0%, transparent 70%)`,
          }}
        />

        {/* Side accent lines — left */}
        <div
          style={{
            position: 'absolute',
            left: 48,
            top: 0,
            bottom: 0,
            width: 3,
            background: `linear-gradient(to bottom, transparent, ${OG_COLORS.gold}80, transparent)`,
          }}
        />
        {/* Side accent lines — right */}
        <div
          style={{
            position: 'absolute',
            right: 48,
            top: 0,
            bottom: 0,
            width: 3,
            background: `linear-gradient(to bottom, transparent, ${OG_COLORS.gold}80, transparent)`,
          }}
        />

        {/* Football icon top-right corner */}
        <div
          style={{
            position: 'absolute',
            top: 32,
            right: 72,
            fontSize: 64,
            opacity: 0.2,
            lineHeight: 1,
          }}
        >
          ⚽
        </div>

        {/* Main content — centered */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            padding: '0 80px',
            gap: 0,
          }}
        >
          {/* Trophy icon */}
          <div
            style={{
              fontSize: 56,
              lineHeight: 1,
              marginBottom: 16,
              filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.6))',
            }}
          >
            🏆
          </div>

          {/* SUPERFAN wordmark */}
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: OG_COLORS.textWhite,
              letterSpacing: '-2px',
              lineHeight: 1,
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            SUPERFAN
          </div>

          {/* MUNDIAL 2026 — gold */}
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: OG_COLORS.gold,
              letterSpacing: '8px',
              lineHeight: 1,
              textAlign: 'center',
              marginTop: 8,
              textTransform: 'uppercase',
            }}
          >
            MUNDIAL 2026
          </div>

          {/* Gold separator line */}
          <div
            style={{
              width: 340,
              height: 3,
              background: `linear-gradient(to right, transparent, ${OG_COLORS.gold}, transparent)`,
              marginTop: 28,
              marginBottom: 24,
            }}
          />

          {/* Subtitle */}
          <div
            style={{
              fontSize: 26,
              fontWeight: 400,
              color: OG_COLORS.textMuted,
              textAlign: 'center',
              letterSpacing: '1px',
            }}
          >
            México · USA · Canadá
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: OG_COLORS.textLight,
              textAlign: 'center',
              marginTop: 8,
              opacity: 0.8,
              letterSpacing: '0.5px',
            }}
          >
            Guía Completa · 16 Ciudades · Complete Guide
          </div>
        </div>

        {/* Bottom branding bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 28,
            gap: 12,
          }}
        >
          {/* Domain */}
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: OG_COLORS.gold,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              opacity: 0.85,
            }}
          >
            superfaninfo.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
