import { ImageResponse } from 'next/og'
import { getCity } from '@/lib/content/cities'
import { getStadiumById } from '@/lib/content/stadiums'
import { OG_COLORS, OG_SIZE, COUNTRY_FLAGS, COUNTRY_NAMES_EN, COUNTRY_NAMES_ES } from '@/lib/og-image'

export const runtime = 'nodejs'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const isEs = lang === 'es' || lang === 'pt' || lang === 'fr' || lang === 'de' || lang === 'ar'
  const city = getCity(slug, lang as 'es' | 'en')
  if (!city) {
    // Fallback for unknown cities
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

  const locale = isEs ? 'es' : 'en'
  const cityName = city.name[locale].toUpperCase()
  const countryKey = city.country
  const flag = COUNTRY_FLAGS[countryKey] ?? ''
  const countryName = locale === 'es' ? COUNTRY_NAMES_ES[countryKey] : COUNTRY_NAMES_EN[countryKey]
  const stadium = getStadiumById(city.stadium)
  const stadiumName = stadium ? stadium.name[locale] : ''
  const subtitleEs = 'Guía de la Sede | Host City Guide'

  // Accent color per country
  const accentColor = countryKey === 'mexico' ? '#CE1126' : countryKey === 'usa' ? '#3C3B6E' : '#FF0000'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(150deg, ${OG_COLORS.bgPrimary} 0%, ${OG_COLORS.bgDark} 55%, #061410 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Country color accent band — top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: `linear-gradient(to right, ${accentColor}, ${OG_COLORS.gold}, ${accentColor})`,
          }}
        />

        {/* Background radial glow */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            left: -60,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${OG_COLORS.gold}15 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -40,
            right: -40,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
          }}
        />

        {/* Side rule — left */}
        <div
          style={{
            position: 'absolute',
            left: 56,
            top: 60,
            bottom: 60,
            width: 2,
            background: `linear-gradient(to bottom, transparent, ${OG_COLORS.gold}60, transparent)`,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '48px 72px 0 88px',
            justifyContent: 'center',
            gap: 0,
          }}
        >
          {/* Category label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: OG_COLORS.gold,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                background: `${OG_COLORS.gold}20`,
                border: `1px solid ${OG_COLORS.gold}40`,
                padding: '5px 14px',
                borderRadius: 4,
              }}
            >
              CIUDAD SEDE / HOST CITY
            </div>
          </div>

          {/* Flag + Country */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 44, lineHeight: 1, display: 'flex' }}>{flag}</div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: OG_COLORS.textMuted,
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              {countryName}
            </div>
          </div>

          {/* City name — hero */}
          <div
            style={{
              fontSize: cityName.length > 20 ? 68 : cityName.length > 14 ? 78 : 92,
              fontWeight: 900,
              color: OG_COLORS.textWhite,
              letterSpacing: '-1px',
              lineHeight: 1.05,
              textTransform: 'uppercase',
            }}
          >
            {cityName}
          </div>

          {/* Gold separator */}
          <div
            style={{
              width: 280,
              height: 3,
              background: `linear-gradient(to right, ${OG_COLORS.gold}, transparent)`,
              marginTop: 24,
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
            }}
          >
            {subtitleEs}
          </div>

          {/* Stadium info */}
          {stadiumName && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 12,
              }}
            >
              <div style={{ fontSize: 18, display: 'flex' }}>🏟️</div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: OG_COLORS.gold,
                  opacity: 0.9,
                }}
              >
                {stadiumName}
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
            padding: '18px 72px 22px 88px',
            borderTop: `1px solid ${OG_COLORS.gold}30`,
            background: 'rgba(0,0,0,0.25)',
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
