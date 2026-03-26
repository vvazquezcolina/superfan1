'use client'

import { useState } from 'react'
import { trackNewsletterSignup } from '@/lib/analytics'

export interface NewsletterSignupDict {
  heading: string
  subheading: string
  namePlaceholder: string
  emailPlaceholder: string
  submitButton: string
  successMessage: string
  privacyNote: string
  dismissLabel?: string
}

interface NewsletterSignupProps {
  dict: NewsletterSignupDict
  variant?: 'inline' | 'popup'
  onDismiss?: () => void
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function NewsletterSignup({ dict, variant = 'inline', onDismiss }: NewsletterSignupProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Validate
    if (!name.trim() || !email.includes('@')) {
      setStatus('error')
      return
    }

    setStatus('submitting')

    // TODO: wire to email provider (Resend/Buttondown) when ready
    // For now, only fire the GA4 event — no backend call per D-01
    trackNewsletterSignup()
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg bg-primary/5 border border-primary/20 p-6 text-center">
        <svg
          className="mx-auto h-10 w-10 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <p className="mt-3 text-base font-medium text-foreground">{dict.successMessage}</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-primary/5 border border-primary/20 p-6">
      {variant === 'popup' && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-3 right-3 text-muted hover:text-foreground transition-colors"
          aria-label={dict.dismissLabel ?? 'Close'}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <h2 className="text-xl font-bold">{dict.heading}</h2>
      <p className="mt-1 text-sm text-muted">{dict.subheading}</p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3" noValidate>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={dict.namePlaceholder}
          className="rounded-md border border-border px-4 py-2 w-full text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dict.emailPlaceholder}
          className="rounded-md border border-border px-4 py-2 w-full text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          required
        />
        {status === 'error' && (
          <p className="text-xs text-red-600">
            {!name.trim() ? 'Please enter your name.' : 'Please enter a valid email address.'}
          </p>
        )}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-primary text-white rounded-md px-6 py-2 font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {status === 'submitting' ? '...' : dict.submitButton}
        </button>
        <p className="text-xs text-muted">{dict.privacyNote}</p>
      </form>
    </div>
  )
}
