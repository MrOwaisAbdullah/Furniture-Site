"use client"

import { useReducedMotion as useFramerReducedMotion } from "framer-motion"

/**
 * Wrapper around framer-motion's useReducedMotion.
 * Returns true if user prefers reduced motion.
 * Use this to conditionally disable animations site-wide.
 */
export function useReducedMotion() {
  return useFramerReducedMotion() ?? false
}
