import { ImageResponse } from 'next/og'
import { OG_COLORS, OG_SIZE } from '@/lib/og-image'

export const runtime = 'edge'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const isEs = lang !== 'en'

  const title = isEs ? 'SELECCIONES\nNACIONALES' : 'NATIONAL\nTEAMS'
  const subtitle = isEs
    ? '48 selecciones en el Mundial FIFA 2026'
    : '48 national teams in FIFA World Cup 2026'

  const confederations = [
    { name: 'UEFA', color: '#003DA5', count: '16' },
    { name: 'CONMEBOL', color: '#006633', count: '6' },
    { name: 'CONCACAF', color: '#C8102E', count: '6' },
    { name: 'CAF', color: '#009A44', count: '9' },
    { name: 'AFC', color: '#FF6B00', count: '8' },
    { name: 'OFC', color: '#00A9CE', count: '1' },
  ]

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(148deg, #061410 0%, ${OG_COLORS.bgPrimary} 45%, ${OG_COLORS.bgDark} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top accent — rainbow of confederation colors */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: 'linear-gradient(to right, #003DA5, #006633, #C8102E, #009A44, #FF6B00, #00A9CE)',
          }}
        />

        {/* Trophy glow */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${OG_COLORS.gold}14 0%, transparent 70%)`,
          }}
        />

        {/* Trophy watermark */}
        <div
          style={{
            position: 'absolute',
            right: 70,
            top: '40%',
            transform: 'translateY(-50%)',
            fontSize: 180,
            opacity: 0.1,
            lineHeight: 1,
            display: 'flex',
          }}
        >
          🏆
        </div>

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
          {/* Category badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
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
              🏆 {isEs ? 'GUÍA DE SELECCIONES' : 'TEAMS GUIDE'}
            </div>
          </div>

          {/* Number stat */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 12,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontSize: 100,
                fontWeight: 900,
                color: OG_COLORS.gold,
                lineHeight: 1,
              }}
            >
              48
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: OG_COLORS.textMuted,
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              {isEs ? 'SELECCIONES' : 'TEAMS'}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 76,
              fontWeight: 900,
              color: OG_COLORS.textWhite,
              letterSpacing: '-1px',
              lineHeight: 1,
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
              fontSize: 22,
              fontWeight: 400,
              color: OG_COLORS.textMuted,
              letterSpacing: '0.5px',
              maxWidth: 700,
            }}
          >
            {subtitle}
          </div>

          {/* Confederation breakdown */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              marginTop: 20,
            }}
          >
            {confederations.map((conf) => (
              <div
                key={conf.name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  background: `${conf.color}18`,
                  border: `1px solid ${conf.color}50`,
                  padding: '7px 12px',
                  borderRadius: 5,
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 800, color: conf.color, lineHeight: 1, display: 'flex' }}>
                  {conf.count}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: OG_COLORS.textMuted, display: 'flex', letterSpacing: '0.5px' }}>
                  {conf.name}
                </div>
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
