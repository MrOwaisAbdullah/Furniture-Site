"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/**
 * Next's App Router scroll-to-top on navigation isn't reliable when the new
 * page shares a layout boundary with the previous one (e.g. clicking a
 * product card near the bottom of a long scrolled list lands on the product
 * page still scrolled down). Force it explicitly on every route change.
 */
export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
