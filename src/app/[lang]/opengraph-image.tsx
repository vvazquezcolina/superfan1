import { ImageResponse } from 'next/og'
import { OG_COLORS, OG_SIZE } from '@/lib/og-image'

export const runtime = 'nodejs'
export const size = OG_SIZE
export const contentType = 'image/png'

const LOCALE_META: Record<string, { headline: string; sub: string; flag: string }> = {
  es: {
    headline: 'TU GUÍA COMPLETA\nDEL MUNDIAL 2026',
    sub: 'Ciudades · Estadios · Selecciones · Herramientas',
    flag: '🌎',
  },
  en: {
    headline: 'YOUR COMPLETE\nWORLD CUP 2026 GUIDE',
    sub: 'Cities · Stadiums · Teams · Tools',
    flag: '🌎',
  },
  pt: {
    headline: 'SEU GUIA COMPLETO\nDA COPA 2026',
    sub: 'Cidades · Estádios · Seleções · Ferramentas',
    flag: '🌎',
  },
  fr: {
    headline: 'VOTRE GUIDE COMPLET\nDE LA COUPE DU MONDE 2026',
    sub: 'Villes · Stades · Équipes · Outils',
    flag: '🌎',
  },
  de: {
    headline: 'IHR KOMPLETTER\nWM 2026 REISEFÜHRER',
    sub: 'Städte · Stadien · Teams · Tools',
    flag: '🌎',
  },
  ar: {
    headline: 'دليلك الكامل\nلكأس العالم 2026',
    sub: 'مدن · ملاعب · منتخبات · أدوات',
    flag: '🌎',
  },
}

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const meta = LOCALE_META[lang] ?? LOCALE_META.en

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
        {/* Top accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: `linear-gradient(to right, #CE1126 0%, ${OG_COLORS.gold} 50%, #003DA5 100%)`,
          }}
        />

        {/* Left rule */}
        <div
          style={{
            position: 'absolute',
            left: 52,
            top: 60,
            bottom: 60,
            width: 2,
            background: `linear-gradient(to bottom, transparent, ${OG_COLORS.gold}60, transparent)`,
          }}
        />

        {/* Corner glows */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            left: -80,
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${OG_COLORS.gold}12 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${OG_COLORS.gold}10 0%, transparent 70%)`,
          }}
        />

        {/* Football watermark */}
        <div
          style={{
            position: 'absolute',
            right: 60,
            top: '40%',
            transform: 'translateY(-50%)',
            fontSize: 200,
            opacity: 0.08,
            lineHeight: 1,
            display: 'flex',
          }}
        >
          ⚽
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '50px 80px 0 80px',
            justifyContent: 'center',
          }}
        >
          {/* SUPERFAN wordmark */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 28, lineHeight: 1, display: 'flex' }}>{meta.flag}</div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: OG_COLORS.gold,
                letterSpacing: '6px',
                textTransform: 'uppercase',
              }}
            >
              SUPERFAN
            </div>
          </div>

          {/* Headline */}
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
            {meta.headline}
          </div>

          {/* Gold separator */}
          <div
            style={{
              width: 300,
              height: 3,
              background: `linear-gradient(to right, ${OG_COLORS.gold}, transparent)`,
              marginTop: 22,
              marginBottom: 20,
            }}
          />

          {/* Sub categories */}
          <div
            style={{
              fontSize: 22,
              fontWeight: 400,
              color: OG_COLORS.textMuted,
              letterSpacing: '1px',
            }}
          >
            {meta.sub}
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              gap: 20,
              marginTop: 24,
            }}
          >
            {[
              { num: '16', label: lang === 'es' ? 'Ciudades' : lang === 'pt' ? 'Cidades' : 'Cities' },
              { num: '16', label: lang === 'es' ? 'Estadios' : lang === 'pt' ? 'Estádios' : 'Stadiums' },
              { num: '48', label: lang === 'es' ? 'Equipos' : lang === 'pt' ? 'Seleções' : 'Teams' },
              { num: '3', label: lang === 'es' ? 'Países' : lang === 'pt' ? 'Países' : 'Countries' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid rgba(255,255,255,0.1)`,
                  padding: '10px 18px',
                  borderRadius: 6,
                  gap: 2,
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 900, color: OG_COLORS.gold, lineHeight: 1, display: 'flex' }}>
                  {stat.num}
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: OG_COLORS.textMuted, display: 'flex', letterSpacing: '0.5px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
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
              fontSize: 18,
              fontWeight: 700,
              color: OG_COLORS.textWhite,
              letterSpacing: '2px',
              opacity: 0.85,
            }}
          >
            🏆 FIFA WORLD CUP 2026
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
