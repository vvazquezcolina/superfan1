'use client'

import { useState } from 'react'
import { Mail, CheckCircle, X, Send } from 'lucide-react'
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
      <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 p-8 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
        <p className="mt-4 text-lg font-semibold text-foreground">{dict.successMessage}</p>
      </div>
    )
  }

  return (
    <div className={`relative rounded-2xl border border-primary/20 overflow-hidden ${
      variant === 'popup' ? 'bg-white p-6' : 'bg-gradient-to-br from-primary/5 to-accent/5 p-8'
    }`}>
      {variant === 'popup' && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-3 right-3 rounded-full p-1 text-muted hover:text-foreground hover:bg-muted/10 transition-colors"
          aria-label={dict.dismissLabel ?? 'Close'}
        >
          <X className="h-5 w-5" />
        </button>
      )}

      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-full bg-primary/10 p-2">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold">{dict.heading}</h2>
      </div>
      <p className="text-sm text-muted">{dict.subheading}</p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-2" noValidate>
        <div className="flex-1 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={dict.namePlaceholder}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={dict.emailPlaceholder}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
            required
          />
        </div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center justify-center gap-2 bg-primary text-white rounded-lg px-6 py-2.5 font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors whitespace-nowrap"
        >
          <Send className="h-4 w-4" />
          {status === 'submitting' ? '...' : dict.submitButton}
        </button>
      </form>
      {status === 'error' && (
        <p className="mt-2 text-xs text-red-600">
          {!name.trim() ? 'Please enter your name.' : 'Please enter a valid email address.'}
        </p>
      )}
      <p className="mt-3 text-xs text-muted">{dict.privacyNote}</p>
    </div>
  )
}
