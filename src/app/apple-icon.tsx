import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 36,
          background: 'linear-gradient(135deg, #1a472a 0%, #2d5016 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <span
          style={{
            color: '#d4af37',
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: '-2px',
            fontFamily: 'sans-serif',
            lineHeight: 1,
          }}
        >
          SF
        </span>
        <span
          style={{
            color: '#ffffff',
            fontSize: 20,
            fontWeight: 600,
            fontFamily: 'sans-serif',
            lineHeight: 1,
            opacity: 0.9,
          }}
        >
          2026
        </span>
      </div>
    ),
    { width: 180, height: 180 },
  )
}
