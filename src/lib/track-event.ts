"use client"

import { insertEvent } from "@/lib/neon/queries"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    ttq?: { track: (event: string, params?: Record<string, unknown>) => void }
  }
}

function getSessionId(): string {
  if (typeof window === "undefined") return "server"
  let id = sessionStorage.getItem("yl_sid")
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    sessionStorage.setItem("yl_sid", id)
  }
  return id
}

export async function trackEvent(
  event: string,
  meta?: Record<string, unknown>,
  opts?: { page?: string; productId?: string }
) {
  const sessionId = getSessionId()

  const params = { ...meta, ...opts }

  if (typeof window !== "undefined") {
    if (window.gtag) {
      window.gtag("event", event, params)
    }
    if (window.fbq) {
      window.fbq("trackCustom", event, meta ?? {})
    }
    if (window.ttq) {
      window.ttq.track(event, meta ?? {})
    }
  }

  try {
    await fetch("/api/track", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ event, sessionId, meta, ...opts }),
      keepalive: true,
    })
  } catch {
    // never block the UI on analytics failure
  }
}
