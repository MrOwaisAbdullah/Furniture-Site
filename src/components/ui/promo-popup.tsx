"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import type { ActivePopup, PopupVariant } from "@/lib/sanity/queries"
import { trackEvent } from "@/lib/track-event"

// Image-based promo popup. Sizes to the uploaded image but is capped to the
// viewport (max 90vw / 85vh, object-contain) so it never exceeds the screen.
// Closes via the X, a click on the backdrop, or Escape.
//
// Timing: the first appearance each session waits `delaySeconds` (from
// Sanity). Any repeat appearance (up to maxPerSession) waits a random
// interval within a minute instead — and that target time is persisted in
// sessionStorage, so a client-side route change (which remounts this
// component under Next's app router) resumes the same countdown rather than
// restarting it or re-showing the popup just because the page changed.
//
// A/B testing: variants rotate — each new eligible view advances to the next
// variant via a smooth, weight-proportional round-robin (nginx-style
// weighted round-robin), not a random pick a visitor gets stuck with.
//
// Reveal-flash fix: the dialog is never shown until the variant's image has
// actually finished loading. We preload with next/image itself (not a raw
// `new Image()`) because next/image rewrites the src through its own
// optimizer path — preloading the raw URL doesn't warm the cache for the
// URL the real <Image> will request, which was the actual cause of a
// lingering "close button alone" flash even after an earlier preload attempt.

const shownKey = (id: string) => `yl_popup_shown_${id}`             // sessionStorage: times shown this session
const closedKey = (id: string) => `yl_popup_closed_${id}`           // localStorage: epoch ms when last closed
const rotationKey = (id: string) => `yl_popup_rotation_${id}`       // localStorage: smooth weighted round-robin state
const nextAttemptKey = (id: string) => `yl_popup_next_attempt_${id}` // sessionStorage: epoch ms target for the next repeat attempt

// Smooth weighted round-robin (the same algorithm nginx uses for weighted
// upstream balancing): each variant accumulates its weight every turn: the
// highest accumulator wins that turn and then gets docked the total weight.
// This guarantees rotation between 2+ variants — a variant can never win
// twice in a row unless it's the only one with weight > 0 — while still
// visiting higher-weighted variants proportionally more often.
function nextRotatingVariant(popup: ActivePopup): PopupVariant {
  const first = popup.variants[0]
  if (!first) throw new Error("popup has no variants")
  if (typeof window === "undefined" || popup.variants.length === 1) return first

  const key = rotationKey(popup._id)
  let current: Record<string, number> = {}
  try {
    current = JSON.parse(localStorage.getItem(key) ?? "{}")
  } catch {
    current = {}
  }

  const totalWeight = popup.variants.reduce((sum, v) => sum + v.weight, 0)
  let winner = first
  let winnerScore = -Infinity
  const updated: Record<string, number> = {}

  for (const v of popup.variants) {
    const score = (current[v.name] ?? 0) + v.weight
    updated[v.name] = score
    if (score > winnerScore) {
      winnerScore = score
      winner = v
    }
  }
  updated[winner.name] = (updated[winner.name] ?? 0) - totalWeight

  localStorage.setItem(key, JSON.stringify(updated))
  return winner
}

export function PromoPopup({ popup }: { popup: ActivePopup }) {
  const [variant, setVariant] = useState<PopupVariant | null>(null)
  const [timerFired, setTimerFired] = useState(false)
  const [imageReady, setImageReady] = useState(false)
  const [visible, setVisible] = useState(false)
  const revealedRef = useRef(false)

  useEffect(() => {
    // Respect the post-close cooldown.
    if (popup.cooldownDays > 0) {
      const closedAt = Number(localStorage.getItem(closedKey(popup._id)) ?? 0)
      if (closedAt && Date.now() - closedAt < popup.cooldownDays * 86_400_000) return
    }

    // Respect the per-session show cap.
    const shownSoFar = Number(sessionStorage.getItem(shownKey(popup._id)) ?? 0)
    if (shownSoFar >= popup.maxPerSession) return

    // First appearance uses the CMS-configured delay. Any repeat appearance
    // waits a random interval within a minute — computed once and persisted
    // to sessionStorage so remounting on a route change resumes the same
    // countdown instead of restarting it (which is what made repeats feel
    // like they were triggered by page navigation rather than real time).
    let waitMs: number
    if (shownSoFar === 0) {
      waitMs = popup.delaySeconds * 1000
    } else {
      const key = nextAttemptKey(popup._id)
      let target = Number(sessionStorage.getItem(key) ?? 0)
      if (!target) {
        target = Date.now() + Math.random() * 60_000
        sessionStorage.setItem(key, String(target))
      }
      waitMs = Math.max(0, target - Date.now())
    }

    // Advancing the rotation and starting the (invisible) image preload
    // happen immediately, in parallel with the wait — by the time the timer
    // fires, the image has almost always already finished loading. This has
    // to run inside this mount-only effect (never during SSR/hydration, so
    // server and client render the same null on first paint), and has to
    // set state right away rather than deferring to the timer callback —
    // deferring it would mean the image only starts loading once the timer
    // fires, reintroducing the load-time flash this is meant to prevent.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVariant(nextRotatingVariant(popup))

    const timer = setTimeout(() => setTimerFired(true), waitMs)
    return () => clearTimeout(timer)
  }, [popup])

  // Once both the timer and the image are ready, reveal exactly once.
  useEffect(() => {
    if (!timerFired || !imageReady || !variant || revealedRef.current) return
    revealedRef.current = true

    const shownSoFar = Number(sessionStorage.getItem(shownKey(popup._id)) ?? 0)
    sessionStorage.setItem(shownKey(popup._id), String(shownSoFar + 1))
    sessionStorage.removeItem(nextAttemptKey(popup._id)) // consumed; the next repeat gets a fresh roll
    requestAnimationFrame(() => setVisible(true))
    trackEvent("promo_popup_view", { popupId: popup._id, variant: variant.name })
  }, [timerFired, imageReady, variant, popup])

  // Pure state + cooldown write, no tracking — shared by both close paths below.
  const hide = useCallback(() => {
    setVisible(false)
    if (popup.cooldownDays > 0) {
      localStorage.setItem(closedKey(popup._id), String(Date.now()))
    }
  }, [popup])

  // Closed without acting (X, backdrop, Escape) — distinct from a click-through.
  const handleDismiss = useCallback(() => {
    if (variant) trackEvent("promo_popup_dismiss", { popupId: popup._id, variant: variant.name })
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

  if (!variant) return null

  // Invisible preloader — same next/image component (and therefore the same
  // optimizer URL) the real dialog below will use, so by the time it's
  // rendered for real the browser already has it cached.
  const preloader = !imageReady && (
    <div style={{ position: "fixed", inset: 0, opacity: 0, pointerEvents: "none", zIndex: -1 }} aria-hidden="true">
      <Image
        src={variant.imageUrl}
        alt=""
        width={variant.imageWidth}
        height={variant.imageHeight}
        priority
        onLoad={() => setImageReady(true)}
        onError={() => setImageReady(true)}
      />
    </div>
  )

  if (!visible) return preloader

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
