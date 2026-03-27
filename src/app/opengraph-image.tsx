import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'SuperFan Mundial 2026 — Guía Completa | Complete Guide'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a472a',
          padding: '60px',
        }}
      >
        <p
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#ffffff',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          SuperFan Mundial 2026
        </p>
        <p
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: '#a8d8b4',
            margin: '24px 0 0',
            textAlign: 'center',
          }}
        >
          Guía Completa | Complete Guide
        </p>
      </div>
    ),
    {
      ...size,
    },
  )
}
