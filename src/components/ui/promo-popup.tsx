"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import type { ActivePopup, PopupVariant } from "@/lib/sanity/queries"
import { trackEvent } from "@/lib/track-event"

// Image-based promo popup. Sizes to the uploaded image but is capped to the
// viewport (max 90vw / 85vh, object-contain) so it never exceeds the screen.
// Closes via the X, a click on the backdrop, or Escape. Timing and frequency
// (delay, per-session cap, post-close cooldown) come from Sanity. Supports
// A/B testing: each visitor is weighted-randomly assigned one variant on
// first sight and keeps seeing it (persisted in localStorage), so results
// stay valid across return visits.

const shownKey = (id: string) => `yl_popup_shown_${id}`     // sessionStorage: times shown this session
const closedKey = (id: string) => `yl_popup_closed_${id}`   // localStorage: epoch ms when last closed
const variantKey = (id: string) => `yl_popup_variant_${id}` // localStorage: assigned variant name

function pickWeighted(variants: PopupVariant[]): PopupVariant {
  const total = variants.reduce((sum, v) => sum + v.weight, 0)
  let roll = Math.random() * total
  for (const v of variants) {
    roll -= v.weight
    if (roll <= 0) return v
  }
  return variants[variants.length - 1]!
}

function assignVariant(popup: ActivePopup): PopupVariant {
  if (typeof window === "undefined") return popup.variants[0]!
  const key = variantKey(popup._id)
  const stored = localStorage.getItem(key)
  const existing = stored ? popup.variants.find((v) => v.name === stored) : undefined
  if (existing) return existing

  const chosen = popup.variants.length > 1 ? pickWeighted(popup.variants) : popup.variants[0]!
  localStorage.setItem(key, chosen.name)
  return chosen
}

export function PromoPopup({ popup }: { popup: ActivePopup }) {
  const [visible, setVisible] = useState(false)
  const variant = useMemo(() => assignVariant(popup), [popup])

  useEffect(() => {
    // Respect the post-close cooldown.
    if (popup.cooldownDays > 0) {
      const closedAt = Number(localStorage.getItem(closedKey(popup._id)) ?? 0)
      if (closedAt && Date.now() - closedAt < popup.cooldownDays * 86_400_000) return
    }

    // Respect the per-session show cap.
    const shownSoFar = Number(sessionStorage.getItem(shownKey(popup._id)) ?? 0)
    if (shownSoFar >= popup.maxPerSession) return

    // Reveal only once BOTH the delay has elapsed AND the image has actually
    // loaded — otherwise the dialog (backdrop + close button) paints a beat
    // before the image does, flashing an empty popup with just an X on it.
    let cancelled = false
    let timerFired = false
    let imageReady = false

    const reveal = () => {
      if (cancelled || !timerFired || !imageReady) return
      sessionStorage.setItem(shownKey(popup._id), String(shownSoFar + 1))
      requestAnimationFrame(() => setVisible(true))
      trackEvent("promo_popup_view", { popupId: popup._id, variant: variant.name })
    }

    const preload = new window.Image()
    preload.onload = () => { imageReady = true; reveal() }
    preload.onerror = () => { imageReady = true; reveal() } // fail-open: don't hang forever on a broken image
    preload.src = variant.imageUrl

    const timer = setTimeout(() => {
      timerFired = true
      reveal()
    }, popup.delaySeconds * 1000)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [popup, variant])

  // Pure state + cooldown write, no tracking — shared by both close paths below.
  const hide = useCallback(() => {
    setVisible(false)
    if (popup.cooldownDays > 0) {
      localStorage.setItem(closedKey(popup._id), String(Date.now()))
    }
  }, [popup])

  // Closed without acting (X, backdrop, Escape) — distinct from a click-through.
  const handleDismiss = useCallback(() => {
    trackEvent("promo_popup_dismiss", { popupId: popup._id, variant: variant.name })
    hide()
  }, [popup, variant, hide])

  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleDismiss()
    }
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", onKey)
    }
  }, [visible, handleDismiss])

  if (!visible) return null

  const img = (
    <Image
      src={variant.imageUrl}
      alt={variant.alt}
      width={variant.imageWidth}
      height={variant.imageHeight}
      priority
      className="block h-auto w-auto max-h-[85vh] max-w-[90vw] rounded-[14px] object-contain shadow-2xl"
    />
  )

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={variant.alt}
      onClick={handleDismiss}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm animate-in fade-in-0 duration-200"
    >
      {/* Stop propagation so clicks on the image/close don't bubble to the backdrop */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative animate-in fade-in-0 zoom-in-95 duration-200"
      >
        {popup.linkUrl ? (
          <Link
            href={popup.linkUrl}
            onClick={() => {
              trackEvent("promo_popup_click", { popupId: popup._id, variant: variant.name, href: popup.linkUrl })
              hide()
            }}
            aria-label={variant.alt}
          >
            {img}
          </Link>
        ) : (
          img
        )}

        <button
          onClick={handleDismiss}
          aria-label="Close popup"
          className="absolute -right-3 -top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
