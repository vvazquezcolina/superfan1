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

  const title = isEs ? 'MAPA\nINTERACTIVO' : 'INTERACTIVE\nMAP'
  const subtitle = isEs ? 'Explora las 16 sedes del Mundial 2026' : 'Explore all 16 World Cup 2026 venues'
  const toolLabel = isEs ? 'HERRAMIENTA GRATUITA' : 'FREE TOOL'

  const venues = [
    { flag: '🇲🇽', city: 'CDMX' },
    { flag: '🇺🇸', city: 'LA' },
    { flag: '🇨🇦', city: 'Toronto' },
    { flag: '🇺🇸', city: 'NY/NJ' },
  ]

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

        {/* Map pin dots watermark */}
        <div
          style={{
            position: 'absolute',
            right: 60,
            top: '40%',
            transform: 'translateY(-50%)',
            fontSize: 140,
            opacity: 0.12,
            lineHeight: 1,
            display: 'flex',
          }}
        >
          🗺️
        </div>

        {/* Grid dots */}
        {[...Array(4)].map((_, row) =>
          [...Array(5)].map((_, col) => (
            <div
              key={`${row}-${col}`}
              style={{
                position: 'absolute',
                right: 80 + col * 60,
                top: 80 + row * 80,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: OG_COLORS.gold,
                opacity: 0.12,
              }}
            />
          ))
        )}

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
          <div style={{ fontSize: 70, lineHeight: 1, marginBottom: 20, display: 'flex' }}>🗺️</div>

          {/* Title */}
          <div
            style={{
              fontSize: 88,
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
            }}
          >
            {subtitle}
          </div>

          {/* Venue pills */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              marginTop: 18,
            }}
          >
            {venues.map((v) => (
              <div
                key={v.city}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 15,
                  fontWeight: 600,
                  color: OG_COLORS.textLight,
                  background: 'rgba(255,255,255,0.08)',
                  border: `1px solid rgba(255,255,255,0.12)`,
                  padding: '5px 12px',
                  borderRadius: 4,
                }}
              >
                <span style={{ display: 'flex' }}>{v.flag}</span>
                <span style={{ display: 'flex' }}>{v.city}</span>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: 15,
                fontWeight: 600,
                color: OG_COLORS.gold,
                padding: '5px 12px',
              }}
            >
              +12 {isEs ? 'más' : 'more'}
            </div>
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
