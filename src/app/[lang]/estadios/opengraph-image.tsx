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

  const title = isEs ? 'ESTADIOS\nDEL MUNDIAL' : 'WORLD CUP\nSTADIUMS'
  const subtitle = isEs
    ? '16 estadios icónicos — hasta 87,523 espectadores'
    : '16 iconic stadiums — up to 87,523 spectators'

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
        {/* Top accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: `linear-gradient(to right, ${OG_COLORS.gold}80, ${OG_COLORS.gold}, ${OG_COLORS.gold}80)`,
          }}
        />

        {/* Concentric arcs — stadium shape */}
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            right: -100,
            width: 600,
            height: 600,
            borderRadius: '50%',
            border: `2px solid ${OG_COLORS.gold}14`,
            background: 'transparent',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            right: -60,
            width: 460,
            height: 460,
            borderRadius: '50%',
            border: `1px solid ${OG_COLORS.gold}10`,
            background: 'transparent',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            right: -20,
            width: 320,
            height: 320,
            borderRadius: '50%',
            border: `1px solid ${OG_COLORS.gold}08`,
            background: 'transparent',
          }}
        />

        {/* Gold glow — top left */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            left: -60,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${OG_COLORS.gold}14 0%, transparent 70%)`,
          }}
        />

        {/* Stadium icon */}
        <div
          style={{
            position: 'absolute',
            right: 80,
            top: '40%',
            transform: 'translateY(-50%)',
            fontSize: 160,
            opacity: 0.12,
            lineHeight: 1,
            display: 'flex',
          }}
        >
          🏟️
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
              🏟️ {isEs ? 'GUÍA DE ESTADIOS' : 'STADIUM GUIDE'}
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
              16
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
              {isEs ? 'ESTADIOS' : 'STADIUMS'}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 80,
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

          {/* Featured stadiums */}
          <div
            style={{
              display: 'flex',
              gap: 14,
              marginTop: 20,
            }}
          >
            {[
              { name: 'Estadio Azteca', cap: '87,523', flag: '🇲🇽' },
              { name: 'MetLife Stadium', cap: '82,500', flag: '🇺🇸' },
              { name: 'AT&T Stadium', cap: '80,000', flag: '🇺🇸' },
            ].map((s) => (
              <div
                key={s.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid rgba(255,255,255,0.1)`,
                  padding: '7px 12px',
                  borderRadius: 5,
                }}
              >
                <div style={{ fontSize: 16, display: 'flex' }}>{s.flag}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: OG_COLORS.textWhite, display: 'flex', lineHeight: 1 }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: 11, color: OG_COLORS.gold, display: 'flex', opacity: 0.9 }}>
                    {s.cap}
                  </div>
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
