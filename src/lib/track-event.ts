"use client"

import { insertEvent } from "@/lib/neon/queries"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
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

  // Fire GA4 (non-blocking)
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, { ...meta, ...opts })
  }

  // Fire Neon (server action / fetch — non-blocking, no await in caller)
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
