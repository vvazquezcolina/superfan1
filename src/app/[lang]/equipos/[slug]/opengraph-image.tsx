import { ImageResponse } from 'next/og'
import { getTeam } from '@/lib/content/teams'
import { OG_COLORS, OG_SIZE, CONFEDERATION_COLORS } from '@/lib/og-image'

export const runtime = 'edge'
export const size = OG_SIZE
export const contentType = 'image/png'

// Flag emojis for common World Cup nations
const TEAM_FLAGS: Record<string, string> = {
  mexico: '🇲🇽',
  usa: '🇺🇸',
  canada: '🇨🇦',
  brazil: '🇧🇷',
  argentina: '🇦🇷',
  france: '🇫🇷',
  germany: '🇩🇪',
  spain: '🇪🇸',
  england: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  portugal: '🇵🇹',
  netherlands: '🇳🇱',
  belgium: '🇧🇪',
  croatia: '🇭🇷',
  italy: '🇮🇹',
  japan: '🇯🇵',
  'south-korea': '🇰🇷',
  'saudi-arabia': '🇸🇦',
  morocco: '🇲🇦',
  senegal: '🇸🇳',
  ghana: '🇬🇭',
  nigeria: '🇳🇬',
  colombia: '🇨🇴',
  chile: '🇨🇱',
  uruguay: '🇺🇾',
  ecuador: '🇪🇨',
  peru: '🇵🇪',
  venezuela: '🇻🇪',
  paraguay: '🇵🇾',
  bolivia: '🇧🇴',
  jamaica: '🇯🇲',
  honduras: '🇭🇳',
  'costa-rica': '🇨🇷',
  panama: '🇵🇦',
  'trinidad-tobago': '🇹🇹',
  australia: '🇦🇺',
  iran: '🇮🇷',
  qatar: '🇶🇦',
  switzerland: '🇨🇭',
  austria: '🇦🇹',
  poland: '🇵🇱',
  turkey: '🇹🇷',
  ukraine: '🇺🇦',
  serbia: '🇷🇸',
  denmark: '🇩🇰',
  sweden: '🇸🇪',
  norway: '🇳🇴',
  scotland: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  wales: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
  romania: '🇷🇴',
  hungary: '🇭🇺',
  slovakia: '🇸🇰',
  czechia: '🇨🇿',
  greece: '🇬🇷',
}

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const team = getTeam(slug, lang as 'es' | 'en')
  if (!team) {
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
  const teamName = team.name[locale].toUpperCase()
  const confederation = team.confederation
  const confColor = CONFEDERATION_COLORS[confederation] ?? OG_COLORS.bgAccent
  const flag = TEAM_FLAGS[team.id] ?? TEAM_FLAGS[slug] ?? '🌍'
  const group = team.group
  const groupLabel = locale === 'es' ? 'GRUPO' : 'GROUP'
  const confLabel = locale === 'es' ? 'Confederación' : 'Confederation'

  // Description snippet
  const description = team.description[locale]
  const descSnippet = description.length > 90 ? description.slice(0, 87) + '...' : description

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(150deg, ${OG_COLORS.bgDark} 0%, ${OG_COLORS.bgPrimary} 40%, #0a1f12 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Confederation color accent — top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: `linear-gradient(to right, ${confColor}90, ${confColor}, ${confColor}90)`,
          }}
        />

        {/* Confederation color glow — left */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            left: -80,
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${confColor}20 0%, transparent 65%)`,
          }}
        />

        {/* Gold glow — right */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: -40,
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${OG_COLORS.gold}14 0%, transparent 70%)`,
          }}
        />

        {/* Large flag — background watermark */}
        <div
          style={{
            position: 'absolute',
            right: 60,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 200,
            opacity: 0.12,
            lineHeight: 1,
            display: 'flex',
          }}
        >
          {flag}
        </div>

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '50px 80px 0 80px',
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
              marginBottom: 20,
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
              SELECCIÓN / NATIONAL TEAM
            </div>
            {group && (
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#0a1f12',
                  background: OG_COLORS.gold,
                  padding: '5px 14px',
                  borderRadius: 4,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
              >
                {groupLabel} {group}
              </div>
            )}
          </div>

          {/* Flag + team name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              marginBottom: 4,
            }}
          >
            <div style={{ fontSize: 52, lineHeight: 1, display: 'flex' }}>{flag}</div>
          </div>

          {/* Team name — hero */}
          <div
            style={{
              fontSize: teamName.length > 20 ? 62 : teamName.length > 14 ? 76 : 90,
              fontWeight: 900,
              color: OG_COLORS.textWhite,
              letterSpacing: '-1px',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              marginTop: 6,
            }}
          >
            {teamName}
          </div>

          {/* Gold separator */}
          <div
            style={{
              width: 260,
              height: 3,
              background: `linear-gradient(to right, ${OG_COLORS.gold}, transparent)`,
              marginTop: 20,
              marginBottom: 18,
            }}
          />

          {/* Confederation badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                background: confColor,
                padding: '4px 12px',
                borderRadius: 3,
                letterSpacing: '1px',
              }}
            >
              {confederation}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 400,
                color: OG_COLORS.textMuted,
                letterSpacing: '0.5px',
              }}
            >
              {confLabel}
            </div>
          </div>

          {/* Description snippet */}
          <div
            style={{
              fontSize: 18,
              fontWeight: 400,
              color: OG_COLORS.textLight,
              opacity: 0.75,
              marginTop: 14,
              maxWidth: 700,
              lineHeight: 1.5,
            }}
          >
            {descSnippet}
          </div>
        </div>

        {/* Bottom branding bar */}
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
