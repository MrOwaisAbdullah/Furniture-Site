"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/track-event"

const SCROLL_THRESHOLDS = [25, 50, 75, 100]

/** Lower-priority engagement signal: how far someone scrolled and how long
 * they stayed, per page. Fires each scroll milestone once, and a single
 * time-on-page event when the user navigates away or closes the tab. */
export function usePageEngagementTracking(page: string, productId?: string) {
  useEffect(() => {
    const startedAt = Date.now()
    const fired = new Set<number>()

    function onScroll() {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      const pct = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 100

      for (const threshold of SCROLL_THRESHOLDS) {
        if (pct >= threshold && !fired.has(threshold)) {
          fired.add(threshold)
          trackEvent("scroll_depth", { depth: threshold }, { page, productId })
        }
      }
    }

    function sendEngagement() {
      const seconds = Math.round((Date.now() - startedAt) / 1000)
      if (seconds < 2) return
      trackEvent("page_engagement", { seconds }, { page, productId })
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") sendEngagement()
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("visibilitychange", onVisibilityChange)
    window.addEventListener("pagehide", sendEngagement)

    return () => {
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("pagehide", sendEngagement)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, productId])
}
