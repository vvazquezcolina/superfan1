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
      <p className="mt-6 text-xl font-bold text-accent md:text-2xl">
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
    <div className="mt-8">
      <div className="inline-flex items-center gap-2 sm:gap-3">
        {units.map((unit, index) => (
          <div key={unit.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/15 text-2xl font-extrabold tabular-nums text-white backdrop-blur-sm sm:h-16 sm:w-16 sm:text-3xl md:h-20 md:w-20 md:text-4xl">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="mt-1.5 text-[10px] font-medium uppercase tracking-wider text-white/60 sm:text-xs">
                {unit.label}
              </span>
            </div>
            {index < units.length - 1 && (
              <span className="mx-1 pb-4 text-xl font-bold text-white/40 sm:mx-2 sm:text-2xl">
                :
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-white/60">{dict.label}</p>
    </div>
  )
}
