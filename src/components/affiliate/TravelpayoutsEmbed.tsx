'use client'

import { useEffect, useRef } from 'react'

interface TravelpayoutsEmbedProps {
  scriptSrc: string
  title: string
}

export function TravelpayoutsEmbed({ scriptSrc, title }: TravelpayoutsEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !scriptSrc) return

    const script = document.createElement('script')
    script.src = scriptSrc
    script.async = true
    script.charset = 'utf-8'
    containerRef.current.appendChild(script)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [scriptSrc])

  return (
    <div
      ref={containerRef}
      className="mt-4 min-h-[200px] overflow-hidden rounded-lg"
      aria-label={title}
    />
  )
}
