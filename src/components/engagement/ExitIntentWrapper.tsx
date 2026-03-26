'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { NewsletterSignup } from './NewsletterSignup'
import type { NewsletterSignupDict } from './NewsletterSignup'

interface ExitIntentWrapperProps {
  dict: NewsletterSignupDict
}

const SESSION_KEY = 'exit-intent-shown'

export function ExitIntentWrapper({ dict }: ExitIntentWrapperProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Don't show again if already shown this session
    if (sessionStorage.getItem(SESSION_KEY)) return

    const isMobile = window.innerWidth < 768

    function showPopup() {
      if (sessionStorage.getItem(SESSION_KEY)) return
      sessionStorage.setItem(SESSION_KEY, '1')
      setIsVisible(true)
    }

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY < 10) {
        showPopup()
      }
    }

    function handleScroll() {
      const scrollRatio = window.scrollY / document.body.scrollHeight
      if (scrollRatio >= 0.6) {
        showPopup()
      }
    }

    if (isMobile) {
      window.addEventListener('scroll', handleScroll, { passive: true })
    } else {
      document.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (isMobile) {
        window.removeEventListener('scroll', handleScroll)
      } else {
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  // Dismiss on Escape key
  useEffect(() => {
    if (!isVisible) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsVisible(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible])

  if (!isMounted || !isVisible) return null

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsVisible(false)
      }}
      role="dialog"
      aria-modal="true"
      aria-label={dict.heading}
    >
      <div className="bg-white dark:bg-neutral-900 rounded-xl max-w-md w-full p-6 relative shadow-xl">
        <NewsletterSignup
          dict={dict}
          variant="popup"
          onDismiss={() => setIsVisible(false)}
        />
      </div>
    </div>,
    document.body,
  )
}
