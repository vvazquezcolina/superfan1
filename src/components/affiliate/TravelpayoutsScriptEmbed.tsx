'use client'

import { useEffect, useRef } from 'react'

interface TravelpayoutsScriptEmbedProps {
  src: string
  title: string
  className?: string
}

/**
 * Client-side script injector for Travelpayouts widgets.
 * Travelpayouts distributes its white-label widgets as a <script src="...">
 * that writes markup next to its own <script> tag. Using the same URL as an
 * iframe src does not work — tp.media returns JavaScript, not HTML — which
 * is why prior iframe embeds showed blank boxes.
 */
export function TravelpayoutsScriptEmbed({
  src,
  title,
  className,
}: TravelpayoutsScriptEmbedProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container || !src) return
    container.innerHTML = ''

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.charset = 'utf-8'
    container.appendChild(script)

    return () => {
      container.innerHTML = ''
    }
  }, [src])

  return <div ref={ref} title={title} className={className} />
}
