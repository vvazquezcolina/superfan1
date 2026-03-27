'use client'

import { useEffect, useRef, useState } from 'react'
import { trackToolUsage } from '@/lib/analytics'

const COUNTRY_COLORS: Record<string, string> = {
  mexico: '#16a34a', // green-600
  usa: '#2563eb', // blue-600
  canada: '#dc2626', // red-600
}

export interface StadiumMarker {
  id: string
  name: string
  cityId: string
  cityName: string
  capacity: number
  lat: number
  lng: number
  countryColor: string
  stadiumSlug: string
  citySlug: string
}

interface InteractiveMapProps {
  stadiums: StadiumMarker[]
  lang: 'es' | 'en'
  dict: {
    mapLoading: string
    popupCapacity: string
    popupCityGuide: string
    popupStadiumPage: string
  }
}

export { COUNTRY_COLORS }

export function InteractiveMap({ stadiums, lang, dict }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !mapRef.current) return

    // Cleanup any existing map instance
    if (mapInstanceRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mapInstanceRef.current as any).remove()
      mapInstanceRef.current = null
    }

    let isMounted = true

    async function initMap() {
      // Inject Leaflet CSS if not already present
      const cssId = 'leaflet-css'
      if (!document.getElementById(cssId)) {
        const link = document.createElement('link')
        link.id = cssId
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
        link.crossOrigin = ''
        document.head.appendChild(link)
      }

      const L = (await import('leaflet')).default

      if (!isMounted || !mapRef.current) return

      // Initialize map centered on North America
      const map = L.map(mapRef.current, {
        center: [38.5, -98],
        zoom: 4,
        scrollWheelZoom: false,
      })

      mapInstanceRef.current = map

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map)

      // Add stadium markers
      for (const stadium of stadiums) {
        const marker = L.circleMarker([stadium.lat, stadium.lng], {
          radius: 10,
          fillColor: stadium.countryColor,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        })

        const popupContent = `
          <div style="min-width:180px;font-family:system-ui,sans-serif">
            <h3 style="font-weight:700;margin:0 0 4px 0;font-size:14px;line-height:1.3">${stadium.name}</h3>
            <p style="margin:0 0 4px 0;color:#666;font-size:13px">${stadium.cityName}</p>
            <p style="margin:0 0 10px 0;color:#666;font-size:13px">${dict.popupCapacity}: ${stadium.capacity.toLocaleString()}</p>
            <a href="/${lang}/ciudades/${stadium.citySlug}" style="display:block;margin-bottom:6px;color:#16a34a;font-size:13px;font-weight:600;text-decoration:none">${dict.popupCityGuide} &rarr;</a>
            <a href="/${lang}/estadios/${stadium.stadiumSlug}" style="color:#16a34a;font-size:13px;font-weight:600;text-decoration:none">${dict.popupStadiumPage} &rarr;</a>
          </div>
        `

        marker.bindPopup(popupContent, { maxWidth: 250 })
        marker.on('click', () => {
          trackToolUsage('interactive_map')
        })
        marker.addTo(map)
      }
    }

    initMap()

    return () => {
      isMounted = false
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapInstanceRef.current as any).remove()
        mapInstanceRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient])

  if (!isClient) {
    return (
      <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-lg animate-pulse">
        <p className="text-gray-500">{dict.mapLoading}</p>
      </div>
    )
  }

  return (
    <div>
      <div
        ref={mapRef}
        style={{ height: '500px', width: '100%' }}
        className="rounded-lg overflow-hidden border border-gray-200"
      />
      {/* Country color legend */}
      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: COUNTRY_COLORS.mexico }}
          />
          Mexico
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: COUNTRY_COLORS.usa }}
          />
          {lang === 'es' ? 'Estados Unidos' : 'United States'}
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: COUNTRY_COLORS.canada }}
          />
          Canada
        </span>
      </div>
    </div>
  )
}
