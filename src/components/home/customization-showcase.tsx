"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"
import { MoveHorizontal } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { waLink } from "@/lib/site-config"
import { useReducedMotion } from "@/lib/use-reduced-motion"

const FINISHES = [
  { label: "Natural Oak", position: 0, image: "/assets/console-customization-1.png" },
  { label: "Walnut Brown", position: 100, image: "/assets/console-customization-2.png" },
]

export function CustomizationShowcase() {
  const prefersReduced = useReducedMotion()
  const [percent, setPercent] = useState(50)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const raw = ((clientX - rect.left) / rect.width) * 100
    setPercent(Math.min(100, Math.max(0, raw)))
  }, [])

  function onPointerDown(e: React.PointerEvent) {
    setDragging(true)
    updateFromClientX(e.clientX)
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return
    updateFromClientX(e.clientX)
  }
  function onPointerUp() {
    setDragging(false)
  }

  function onHandleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") { e.preventDefault(); setPercent((p) => Math.max(0, p - 5)) }
    if (e.key === "ArrowRight") { e.preventDefault(); setPercent((p) => Math.min(100, p + 5)) }
    if (e.key === "Home") { e.preventDefault(); setPercent(0) }
    if (e.key === "End") { e.preventDefault(); setPercent(100) }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: prefersReduced ? 0 : 0.45 }}
        className="mb-7 max-w-2xl"
      >
        <p className="font-mono uppercase text-gold-700" style={{ fontSize: "10px", letterSpacing: "2.5px" }}>
          Made to your exact spec
        </p>
        <h2
          className="mt-1 font-heading font-black text-ink"
          style={{ fontSize: "clamp(22px,4vw,32px)", letterSpacing: "-0.6px" }}
        >
          Any piece.<br />
          <span className="font-display italic text-forest/70">Any color you want.</span>
        </h2>
        <p className="mt-3 max-w-lg text-[13.5px] leading-[1.65] text-slate">
          Drag the slider — this console is the same design, built in two different finishes, just to show what&apos;s possible. The same goes for every piece we make: beds, wardrobes, dressing tables, side tables. Color, size, and finish are always up to you, not a catalog page.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: prefersReduced ? 0 : 0.5, delay: prefersReduced ? 0 : 0.1 }}
      >
        <div
          ref={containerRef}
          className="relative aspect-[1345/637] w-full select-none overflow-hidden rounded-[16px] bg-surface-sunken touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* Base layer — Walnut Brown, full width */}
          <Image
            src={FINISHES[1]!.image}
            alt="Console in Walnut Brown finish"
            fill
            className="object-contain p-6"
            sizes="(max-width: 1024px) 100vw, 1100px"
            priority
          />

          {/* Reveal layer — Natural Oak, clipped to the handle position via
              clip-path so it stays pixel-perfect aligned with the base
              layer regardless of container size (no width measurement). */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
          >
            <Image
              src={FINISHES[0]!.image}
              alt="Console in Natural Oak finish"
              fill
              className="object-contain p-6"
              sizes="(max-width: 1024px) 100vw, 1100px"
            />
          </div>

          {/* Corner labels */}
          <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 font-mono text-[9.5px] uppercase tracking-[1px] text-ink/70 backdrop-blur-sm">
            {FINISHES[0]!.label}
          </span>
          <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-ink/75 px-3 py-1 font-mono text-[9.5px] uppercase tracking-[1px] text-bone backdrop-blur-sm">
            {FINISHES[1]!.label}
          </span>

          {/* Divider + drag handle */}
          <div
            className="absolute inset-y-0 w-[2px] bg-white/90"
            style={{ left: `${percent}%` }}
          >
            <div
              role="slider"
              tabIndex={0}
              aria-label="Compare finishes"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(percent)}
              aria-valuetext={percent < 50 ? "Closer to Natural Oak" : "Closer to Walnut Brown"}
              onKeyDown={onHandleKeyDown}
              className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-2 border-white bg-forest text-bone shadow-[0_4px_16px_-4px_rgba(10,28,21,.5)] transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:cursor-grabbing active:scale-95"
            >
              <MoveHorizontal className="h-4 w-4" strokeWidth={2.25} />
            </div>
          </div>
        </div>

        {/* Tap-to-snap finish chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          {FINISHES.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => setPercent(f.position)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-semibold transition-colors",
                (f.position === 0 ? percent < 50 : percent >= 50)
                  ? "border-forest bg-forest text-bone"
                  : "border-border-strong bg-white text-slate hover:border-forest/40"
              )}
            >
              {f.label}
            </button>
          ))}
          <span className="font-mono text-[11px] text-sage">— tap to preview, drag to compare</span>
        </div>
      </motion.div>

      <div className="mt-6 flex flex-col items-start gap-3 rounded-[14px] border border-border bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-[1.6] text-slate">
          Want a bed, wardrobe, dressing table, or anything else in a color or size we haven&apos;t shown yet? Tell us what you have in mind — we&apos;ll build it to match.
        </p>
        <a
          href={waLink("Hi, I'd like to ask about a custom color/size for a piece I saw on your website.")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-2 rounded-[10px] bg-gold px-5 py-3 font-heading font-bold text-[13px] text-forest transition-all hover:bg-gold/88 active:scale-[.97]"
        >
          <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
          Ask about your custom piece
        </a>
      </div>
    </section>
  )
}
