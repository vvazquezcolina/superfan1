import { ImageResponse } from 'next/og'
import { getStadium } from '@/lib/content/stadiums'
import { getCityById } from '@/lib/content/cities'
import { OG_COLORS, OG_SIZE, COUNTRY_FLAGS } from '@/lib/og-image'

export const runtime = 'edge'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const stadium = getStadium(slug, lang as 'es' | 'en')
  if (!stadium) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: OG_COLORS.bgPrimary,
          }}
        >
          <div style={{ fontSize: 48, color: '#fff', display: 'flex' }}>SuperFan Mundial 2026</div>
        </div>
      ),
      { ...size },
    )
  }

  const isEs = lang === 'es' || lang === 'pt' || lang === 'fr' || lang === 'de' || lang === 'ar'
  const locale = isEs ? 'es' : 'en'
  const stadiumName = stadium.name[locale].toUpperCase()
  const city = getCityById(stadium.city)
  const cityName = city ? city.name[locale] : ''
  const countryKey = city?.country ?? 'usa'
  const flag = COUNTRY_FLAGS[countryKey] ?? ''
  const capacityLabel = locale === 'es' ? 'Capacidad' : 'Capacity'
  const capacityFormatted = stadium.capacity.toLocaleString('en-US')

  // Stadium tier indicator based on capacity
  const isMassive = stadium.capacity >= 80000
  const isLarge = stadium.capacity >= 60000

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(155deg, #0a1f12 0%, ${OG_COLORS.bgPrimary} 35%, ${OG_COLORS.bgDark} 70%, #061410 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top accent band */}
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

        {/* Stadium arch visual — decorative arc */}
        <div
          style={{
            position: 'absolute',
            bottom: -180,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 900,
            height: 360,
            borderRadius: '50%',
            border: `2px solid ${OG_COLORS.gold}12`,
            background: 'transparent',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -120,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 700,
            height: 280,
            borderRadius: '50%',
            border: `1px solid ${OG_COLORS.gold}08`,
            background: 'transparent',
          }}
        />

        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: 100,
            right: 80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${OG_COLORS.gold}12 0%, transparent 70%)`,
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
            gap: 0,
          }}
        >
          {/* Category badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 22,
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
              🏟️ ESTADIO SEDE / HOST STADIUM
            </div>
          </div>

          {/* City + flag */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: 34, lineHeight: 1, display: 'flex' }}>{flag}</div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: OG_COLORS.textMuted,
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              {cityName}
            </div>
          </div>

          {/* Stadium name — hero */}
          <div
            style={{
              fontSize: stadiumName.length > 24 ? 58 : stadiumName.length > 18 ? 70 : 82,
              fontWeight: 900,
              color: OG_COLORS.textWhite,
              letterSpacing: '-1px',
              lineHeight: 1.05,
              textTransform: 'uppercase',
            }}
          >
            {stadiumName}
          </div>

          {/* Gold line */}
          <div
            style={{
              width: 240,
              height: 3,
              background: `linear-gradient(to right, ${OG_COLORS.gold}, transparent)`,
              marginTop: 22,
              marginBottom: 20,
            }}
          />

          {/* Capacity — prominent gold */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 44,
                fontWeight: 900,
                color: OG_COLORS.gold,
                lineHeight: 1,
              }}
            >
              {capacityFormatted}
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: OG_COLORS.textMuted,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              {capacityLabel}
            </div>
          </div>

          {/* Tier badge */}
          {isMassive && (
            <div
              style={{
                marginTop: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#0a1f12',
                  background: OG_COLORS.gold,
                  padding: '4px 12px',
                  borderRadius: 3,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                ★ ICÓNICO
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: OG_COLORS.textMuted,
                  opacity: 0.8,
                }}
              >
                Top venue for FIFA World Cup 2026
              </div>
            </div>
          )}
        </div>

        {/* Bottom branding bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 80px 22px 80px',
            borderTop: `1px solid ${OG_COLORS.gold}28`,
            background: 'rgba(0,0,0,0.3)',
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
