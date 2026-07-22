"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useReducedMotion } from "@/lib/use-reduced-motion"

const reviews = [
  {
    quote: "Booked our shaadi set here. Honest about the finish, delivered on time, and the deco polish looks premium.",
    author: "Ahmed",
    area: "Gulshan-e-Iqbal",
  },
    {
    quote: "Bed set ka order diya tha, exact size mila jo maine manga tha. Kaam mein mehnat saaf nazar aati hai.",
    author: "Usman",
    area: "Malir",
  },
  {
    quote: "Got a 3-door wardrobe made to a custom size that no other shop could do. Exactly the dimensions I needed. Quality is excellent.",
    author: "Sana",
    area: "DHA Phase 5",
  },
  {
    quote: "Very professional team. The WhatsApp updates during the build were incredibly helpful, I could see my furniture taking shape.",
    author: "Tariq",
    area: "North Nazimabad",
  },
  {
    quote: "Custom sizing at no extra charge is what sets them apart. Our room has an awkward wall and they nailed every dimension.",
    author: "Fatima",
    area: "Gulshan-e-Hadeed",
  },
    {
    quote: "Mujhy Pehly lagta tha MDF sasti cheez hai, Furniture ki quality achi nahi hogi, lekin finish dekh ke khayal badal gaya. Achi quality hai.",
    author: "Hassan",
    area: "Landhi",
  },
  {
    quote: "Workshop-direct pricing means real quality without retail markup. Saved around Rs 40,000 what others are quoting, Highly Recommended.",
    author: "Bilal",
    area: "PECHS Block 2",
  },
  {
    quote: "Highly recommend for shaadi furniture. Delivered and installed two days before the nikah — exactly as promised.",
    author: "Nadia",
    area: "Federal B Area",
  },

  {
    quote: "We saw the furniture in Showroom, phir order kiya. Jo dikhaya wahi mila, koi farak nahi. Highly Satisfied.",
    author: "Ayesha",
    area: "Clifton",
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#C9A24B" aria-hidden="true">
          <path d="M12 2l3 6.5 7 .8-5 5 1.3 7L12 18l-6.3 3.3L7 14 2 9l7-.8z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: (typeof reviews)[0] }) {
  return (
    <div className="flex h-full flex-col rounded-[16px] border border-border bg-white p-6">
      <Stars />
      <blockquote
        className="mt-4 flex-1 font-display italic leading-[1.65] text-ink/75"
        style={{ fontSize: "15px" }}
      >
        &ldquo;{review.quote}&rdquo;
      </blockquote>
      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/10 font-heading font-bold text-[14px] text-forest">
          {review.author[0]}
        </div>
        <div>
          <p className="font-heading font-bold text-[13px] text-ink">{review.author}</p>
          <p className="font-mono text-[10px] text-sage">{review.area}</p>
        </div>
      </div>
    </div>
  )
}

export function SocialProof() {
  const prefersReduced = useReducedMotion()

  // Mobile: one card at a time, wraps freely.
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (paused || prefersReduced) return
    const t = setInterval(() => {
      setDir(1)
      setActive((a) => (a + 1) % reviews.length)
    }, 4500)
    return () => clearInterval(t)
  }, [paused, prefersReduced])

  const goNext = useCallback(() => { setDir(1); setActive((a) => (a + 1) % reviews.length) }, [])
  const goPrev = useCallback(() => { setDir(-1); setActive((a) => (a - 1 + reviews.length) % reviews.length) }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); goPrev() }
    if (e.key === "ArrowRight") { e.preventDefault(); goNext() }
  }, [goNext, goPrev])

  const variants = {
    enter: (d: number) => ({ x: `${d * 100}%`, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: `${-d * 100}%`, opacity: 0 }),
  }

  // Desktop: a real sliding track, 3 cards visible, advances 1 card at a
  // time (not a full 3-card swap) — no gap because it's one continuous
  // strip translating, not two separate sets cross-fading.
  const desktopMaxStart = Math.max(0, reviews.length - 3)
  const [desktopStart, setDesktopStart] = useState(0)
  const [desktopPaused, setDesktopPaused] = useState(false)

  useEffect(() => {
    if (desktopPaused || prefersReduced || desktopMaxStart === 0) return
    const t = setInterval(() => {
      setDesktopStart((s) => (s >= desktopMaxStart ? 0 : s + 1))
    }, 4500)
    return () => clearInterval(t)
  }, [desktopPaused, prefersReduced, desktopMaxStart])

  const goNextDesktop = useCallback(() => {
    setDesktopStart((s) => (s >= desktopMaxStart ? 0 : s + 1))
  }, [desktopMaxStart])
  const goPrevDesktop = useCallback(() => {
    setDesktopStart((s) => (s <= 0 ? desktopMaxStart : s - 1))
  }, [desktopMaxStart])

  const handleDesktopKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); goPrevDesktop() }
    if (e.key === "ArrowRight") { e.preventDefault(); goNextDesktop() }
  }, [goNextDesktop, goPrevDesktop])

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-14">
      {/* Section header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: prefersReduced ? 0 : 0.45 }}
        >
          <p className="font-mono uppercase text-gold-700" style={{ fontSize: "10px", letterSpacing: "2.5px" }}>
            Customer stories
          </p>
          <h2
            className="mt-1 font-heading font-black text-ink"
            style={{ fontSize: "clamp(22px,4vw,30px)", letterSpacing: "-0.6px" }}
          >
            What Karachi says
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReduced ? 0 : 0.5, delay: 0.15 }}
          className="flex items-center gap-3"
        >
          <div className="text-right">
            <p className="font-heading font-black text-[30px] text-forest leading-none">4.9</p>
            <div className="mt-0.5 flex justify-end gap-0.5">
              <Stars />
            </div>
            <p className="mt-1 font-mono text-[10px] text-sage">86 Google reviews · 47 sets delivered</p>
          </div>
        </motion.div>
      </div>

      {/* ── Desktop: real sliding track, 3 visible, 1 card per step (up to 12 testimonials) ── */}
      <div
        className="hidden lg:block"
        onMouseEnter={() => setDesktopPaused(true)}
        onMouseLeave={() => setDesktopPaused(false)}
        onKeyDown={handleDesktopKeyDown}
        role="region"
        aria-label="Customer reviews carousel"
        aria-roledescription="carousel"
        tabIndex={0}
      >
        <div className="overflow-hidden -mx-2.5">
          <motion.div
            className="flex"
            style={{ width: `${(reviews.length / 3) * 100}%` }}
            animate={{ x: `${-desktopStart * (100 / reviews.length)}%` }}
            transition={{ duration: prefersReduced ? 0 : 0.4, ease: "easeInOut" }}
          >
            {reviews.map((r) => (
              <div key={r.author} className="shrink-0 px-2.5" style={{ width: `${100 / reviews.length}%` }}>
                <ReviewCard review={r} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Controls */}
        {reviews.length > 3 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Review navigation">
              {Array.from({ length: desktopMaxStart + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setDesktopStart(i)}
                  role="tab"
                  aria-selected={i === desktopStart}
                  aria-label={`Reviews ${i + 1} to ${i + 3}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === desktopStart ? "w-6 bg-forest" : "w-1.5 bg-forest/20 hover:bg-forest/40"}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={goPrevDesktop}
                aria-label="Previous reviews"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-slate transition-colors hover:bg-surface-sunken"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={goNextDesktop}
                aria-label="Next reviews"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-slate transition-colors hover:bg-surface-sunken"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile: carousel with keyboard nav ── */}
      <div
        className="lg:hidden"
        ref={containerRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onKeyDown={handleKeyDown}
        role="region"
        aria-label="Customer reviews carousel"
        aria-roledescription="carousel"
        tabIndex={0}
      >
        <div className="overflow-hidden rounded-[16px]" aria-live="polite" aria-atomic="true">
          <AnimatePresence custom={dir} mode="wait">
            <motion.div
              key={active}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: prefersReduced ? 0 : 0.28, ease: "easeInOut" }}
              role="group"
              aria-roledescription="slide"
              aria-label={`Review ${active + 1} of ${reviews.length}`}
            >
              <ReviewCard review={reviews[active] ?? reviews[0]!} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Review navigation">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDir(i > active ? 1 : -1); setActive(i) }}
                role="tab"
                aria-selected={i === active}
                aria-label={`Review ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-forest" : "w-1.5 bg-forest/20 hover:bg-forest/40"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={goPrev}
              aria-label="Previous review"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-slate transition-colors hover:bg-surface-sunken"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={goNext}
              aria-label="Next review"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-slate transition-colors hover:bg-surface-sunken"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
