"use client"

import { useState, useEffect } from "react"
import { X, Cookie } from "lucide-react"

const COOKIE_CONSENT_KEY = "yf_cookie_consent"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Use requestAnimationFrame to avoid setState in effect
      requestAnimationFrame(() => setVisible(true))
    }
  }, [])

  function handleAccept() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
    setVisible(false)
  }

  function handleDecline() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-[16px] border border-border bg-white p-5 shadow-xl sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest/10">
            <Cookie className="h-5 w-5 text-forest" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-[15px] text-ink">We use cookies</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate">
              We use cookies to improve your experience, analyze site traffic, and personalize content.
              By continuing to browse, you agree to our use of cookies.
              Read more in our{" "}
              <a href="/privacy" className="text-forest underline hover:text-forest/80">
                Privacy Policy
              </a>.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleAccept}
                className="rounded-[10px] bg-forest px-5 py-2.5 font-heading font-bold text-[13px] text-bone transition-colors hover:bg-forest/90"
              >
                Accept All
              </button>
              <button
                onClick={handleDecline}
                className="rounded-[10px] border border-border px-5 py-2.5 font-heading font-bold text-[13px] text-slate transition-colors hover:bg-surface"
              >
                Decline
              </button>
            </div>
          </div>
          <button
            onClick={handleAccept}
            className="shrink-0 rounded-full p-1.5 text-sage transition-colors hover:bg-surface hover:text-ink"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
