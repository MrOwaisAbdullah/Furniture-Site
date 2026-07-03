"use client"

import { useEffect } from "react"

// Non-sensitive promo code, so a plain client-set cookie (not httpOnly) is
// fine — checkout reads it to pre-fill the single "Promo code" field per
// the spec's no-stacking UI rule.
export function SetPromoCookie({ code }: { code: string }) {
  useEffect(() => {
    const maxAge = 60 * 60 * 24 * 30 // 30 days
    document.cookie = `promo_code=${encodeURIComponent(code)}; path=/; max-age=${maxAge}; samesite=lax`
  }, [code])

  return null
}
