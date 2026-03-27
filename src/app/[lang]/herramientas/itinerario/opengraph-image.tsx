import { ImageResponse } from 'next/og'
import { OG_COLORS, OG_SIZE } from '@/lib/og-image'

export const runtime = 'nodejs'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const isEs = lang !== 'en'

  const title = isEs ? 'GENERADOR DE\nITINERARIO' : 'ITINERARY\nGENERATOR'
  const subtitle = isEs ? 'Planifica tu viaje al Mundial día a día' : 'Plan your World Cup trip day by day'
  const toolLabel = isEs ? 'HERRAMIENTA GRATUITA' : 'FREE TOOL'

  const days = isEs
    ? ['Día 1', 'Día 2', 'Día 3', 'Partido']
    : ['Day 1', 'Day 2', 'Day 3', 'Match Day']

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(148deg, ${OG_COLORS.bgDark} 0%, ${OG_COLORS.bgPrimary} 50%, #0f3322 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: `linear-gradient(to right, transparent, ${OG_COLORS.gold}, transparent)`,
          }}
        />

        {/* Calendar grid watermark */}
        <div
          style={{
            position: 'absolute',
            right: 50,
            top: '30%',
            opacity: 0.06,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {[0, 1, 2].map((row) => (
            <div key={row} style={{ display: 'flex', gap: 6 }}>
              {[0, 1, 2, 3].map((col) => (
                <div
                  key={col}
                  style={{
                    width: 50,
                    height: 50,
                    border: `2px solid ${OG_COLORS.gold}`,
                    borderRadius: 4,
                    display: 'flex',
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: -40,
            left: -40,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${OG_COLORS.gold}15 0%, transparent 70%)`,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '52px 80px 0 80px',
            justifyContent: 'center',
          }}
        >
          {/* Tool badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: OG_COLORS.gold,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                background: `${OG_COLORS.gold}18`,
                border: `1px solid ${OG_COLORS.gold}40`,
                padding: '5px 14px',
                borderRadius: 4,
              }}
            >
              🛠️ {toolLabel}
            </div>
          </div>

          {/* Icon */}
          <div style={{ fontSize: 70, lineHeight: 1, marginBottom: 20, display: 'flex' }}>📅</div>

          {/* Title */}
          <div
            style={{
              fontSize: 76,
              fontWeight: 900,
              color: OG_COLORS.textWhite,
              letterSpacing: '-1px',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              whiteSpace: 'pre-line',
            }}
          >
            {title}
          </div>

          {/* Gold line */}
          <div
            style={{
              width: 260,
              height: 3,
              background: `linear-gradient(to right, ${OG_COLORS.gold}, transparent)`,
              marginTop: 22,
              marginBottom: 20,
            }}
          />

          {/* Subtitle */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: OG_COLORS.textMuted,
              letterSpacing: '0.5px',
              maxWidth: 680,
            }}
          >
            {subtitle}
          </div>

          {/* Day timeline */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 20,
            }}
          >
            {days.map((day, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: i === days.length - 1 ? '#0a1f12' : OG_COLORS.textLight,
                    background: i === days.length - 1 ? OG_COLORS.gold : 'rgba(255,255,255,0.1)',
                    padding: '5px 12px',
                    borderRadius: 4,
                    letterSpacing: '0.5px',
                    display: 'flex',
                  }}
                >
                  {day}
                </div>
                {i < days.length - 1 && (
                  <div style={{ fontSize: 14, color: OG_COLORS.gold, opacity: 0.6, display: 'flex' }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 80px 22px 80px',
            borderTop: `1px solid ${OG_COLORS.gold}28`,
            background: 'rgba(0,0,0,0.28)',
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: OG_COLORS.gold,
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            superfaninfo.com
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: OG_COLORS.textWhite,
              letterSpacing: '3px',
              opacity: 0.9,
            }}
          >
            ⚽ MUNDIAL 2026
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
