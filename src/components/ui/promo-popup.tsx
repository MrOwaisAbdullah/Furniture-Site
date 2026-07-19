"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import type { ActivePopup } from "@/lib/sanity/queries"
import { trackEvent } from "@/lib/track-event"

// Image-based promo popup. Sizes to the uploaded image but is capped to the
// viewport (max 90vw / 85vh, object-contain) so it never exceeds the screen.
// Closes via the X, a click on the backdrop, or Escape. Timing and frequency
// (delay, per-session cap, post-close cooldown) come from Sanity.

const shownKey = (id: string) => `yl_popup_shown_${id}`   // sessionStorage: times shown this session
const closedKey = (id: string) => `yl_popup_closed_${id}` // localStorage: epoch ms when last closed

export function PromoPopup({ popup }: { popup: ActivePopup }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Respect the post-close cooldown.
    if (popup.cooldownDays > 0) {
      const closedAt = Number(localStorage.getItem(closedKey(popup._id)) ?? 0)
      if (closedAt && Date.now() - closedAt < popup.cooldownDays * 86_400_000) return
    }

    // Respect the per-session show cap.
    const shownSoFar = Number(sessionStorage.getItem(shownKey(popup._id)) ?? 0)
    if (shownSoFar >= popup.maxPerSession) return

    const timer = setTimeout(() => {
      sessionStorage.setItem(shownKey(popup._id), String(shownSoFar + 1))
      requestAnimationFrame(() => setVisible(true))
      trackEvent("promo_popup_view", { popupId: popup._id })
    }, popup.delaySeconds * 1000)

    return () => clearTimeout(timer)
  }, [popup])

  const close = useCallback(() => {
    setVisible(false)
    if (popup.cooldownDays > 0) {
      localStorage.setItem(closedKey(popup._id), String(Date.now()))
    }
  }, [popup])

  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", onKey)
    }
  }, [visible, close])

  if (!visible) return null

  const img = (
    <Image
      src={popup.imageUrl}
      alt={popup.alt}
      width={popup.imageWidth}
      height={popup.imageHeight}
      priority
      className="block h-auto w-auto max-h-[85vh] max-w-[90vw] rounded-[14px] object-contain shadow-2xl"
    />
  )

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={popup.alt}
      onClick={close}
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
              trackEvent("promo_popup_click", { popupId: popup._id, href: popup.linkUrl })
              close()
            }}
            aria-label={popup.alt}
          >
            {img}
          </Link>
        ) : (
          img
        )}

        <button
          onClick={close}
          aria-label="Close popup"
          className="absolute -right-3 -top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
