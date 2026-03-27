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

  const title = isEs ? 'CIUDADES\nSEDE' : 'HOST\nCITIES'
  const subtitle = isEs
    ? '16 ciudades en México, Estados Unidos y Canadá'
    : '16 cities across Mexico, United States and Canada'

  const countries = [
    { flag: '🇲🇽', label: isEs ? 'México' : 'Mexico', count: '3' },
    { flag: '🇺🇸', label: isEs ? 'Estados Unidos' : 'United States', count: '11' },
    { flag: '🇨🇦', label: isEs ? 'Canadá' : 'Canada', count: '2' },
  ]

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(148deg, ${OG_COLORS.bgDark} 0%, ${OG_COLORS.bgPrimary} 50%, #0a2016 100%)`,
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
            background: `linear-gradient(to right, #CE1126, ${OG_COLORS.gold}, #003DA5)`,
          }}
        />

        {/* Radial glows */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 340,
            height: 340,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${OG_COLORS.gold}15 0%, transparent 70%)`,
          }}
        />

        {/* Earth watermark */}
        <div
          style={{
            position: 'absolute',
            right: 60,
            top: '40%',
            transform: 'translateY(-50%)',
            fontSize: 180,
            opacity: 0.1,
            lineHeight: 1,
            display: 'flex',
          }}
        >
          🌎
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
              🌍 {isEs ? 'GUÍA DE SEDES' : 'VENUE GUIDE'}
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
              {isEs ? 'CIUDADES' : 'CITIES'}
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

          {/* Country breakdown */}
          <div
            style={{
              display: 'flex',
              gap: 14,
              marginTop: 20,
            }}
          >
            {countries.map((c) => (
              <div
                key={c.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255,255,255,0.07)',
                  border: `1px solid rgba(255,255,255,0.1)`,
                  padding: '8px 14px',
                  borderRadius: 6,
                }}
              >
                <div style={{ fontSize: 22, display: 'flex' }}>{c.flag}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: OG_COLORS.gold, lineHeight: 1, display: 'flex' }}>
                    {c.count}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: OG_COLORS.textMuted, display: 'flex', letterSpacing: '0.5px' }}>
                    {c.label}
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
