'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  targetDate: string   // ISO string e.g. '2026-06-11T00:00:00Z'
  initialDays: number  // server-rendered initial value (prevents layout shift)
  dict: {
    days: string
    hours: string
    minutes: string
    seconds: string
    label: string
    started: string
  }
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(targetDate: string): TimeLeft | null {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

export function CountdownTimer({ targetDate, initialDays, dict }: CountdownTimerProps) {
  // Initialize with server-rendered value to prevent layout shift
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>({
    days: initialDays,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Calculate exact time on mount
    setTimeLeft(calcTimeLeft(targetDate))

    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  if (!timeLeft) {
    return (
      <p className="mt-6 text-xl font-bold text-primary md:text-2xl">
        {dict.started}
      </p>
    )
  }

  const units = [
    { value: timeLeft.days, label: dict.days },
    { value: timeLeft.hours, label: dict.hours },
    { value: timeLeft.minutes, label: dict.minutes },
    { value: timeLeft.seconds, label: dict.seconds },
  ]

  return (
    <div className="mt-6">
      <div className="grid grid-cols-4 gap-2">
        {units.map((unit, index) => (
          <div key={unit.label} className="flex items-center">
            <div className="flex flex-col items-center flex-1">
              <span className="text-3xl font-bold text-primary md:text-4xl tabular-nums">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-xs text-muted mt-1 uppercase tracking-wide">
                {unit.label}
              </span>
            </div>
            {index < units.length - 1 && (
              <span className="hidden sm:block text-2xl font-bold text-primary/60 mx-1 pb-4">
                :
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="text-sm text-muted mt-2">{dict.label}</p>
    </div>
  )
}
