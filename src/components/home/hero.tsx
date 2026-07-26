"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { FaWhatsapp } from "react-icons/fa"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { waLink, ADVANCE_LABEL } from "@/lib/site-config"
import { cn } from "@/lib/utils"

interface HeroSlide {
  eyebrow: string
  headlineLine1: string
  headlineAccent: string
  subtext: string
  ctaLabel: string
  ctaHref: string
  badge: string
  priceLabel: string
  priceValue: string
  image: string
  imageAlt: string
}

// Real product photos only — no stock/external images. Slide 1 and 2 use
// Sanity-hosted photos of the actual products they promote; slide 3 uses a
// local asset from public/assets instead of the old Unsplash placeholder.
const SLIDES: HeroSlide[] = [
  {
    eyebrow: "Karachi · Workshop-direct",
    headlineLine1: "Shaadi season,",
    headlineAccent: "sorted.",
    subtext: "A complete jahez bedroom set — bed, 2 side tables, dressing table, and wardrobe — for less than buying each piece separately.",
    ctaLabel: "See Shaadi Package",
    ctaHref: "/products/shaadi-package",
    badge: "Save Rs 23,500",
    priceLabel: "Shaadi Package from",
    priceValue: "Rs 211,500",
    image: "https://cdn.sanity.io/images/nelnbkzg/production/a9a093646b0b6bb9f2252e648ae01def5bf0916a-900x600.jpg",
    imageAlt: "Yousuf Living Shaadi Package — complete jahez bedroom set",
  },
  {
    eyebrow: "Karachi · Workshop-direct",
    headlineLine1: "Your color,",
    headlineAccent: "your bed.",
    subtext: "The Sovereign LED Bed comes in 8 colors with a glowing brass inlay headboard — and yes, we do custom colors too.",
    ctaLabel: "See Sovereign LED Bed",
    ctaHref: "/products/sovereign-led-bed",
    badge: "8 colors available",
    priceLabel: "Sovereign LED Bed from",
    priceValue: "Rs 75,000",
    image: "https://cdn.sanity.io/images/nelnbkzg/production/4a8d059bac9a6c1eadc26fbdbca45493eeebd77a-1254x1254.png",
    imageAlt: "Yousuf Living Sovereign LED Bed — backlit brass inlay headboard",
  },
  {
    eyebrow: "Karachi · Workshop-direct",
    headlineLine1: "Quality living,",
    headlineAccent: "by design.",
    subtext: "Workshop-built bedroom sets, fairly priced. See them in person, or order on WhatsApp in minutes.",
    ctaLabel: "Browse sets",
    ctaHref: "/shop",
    badge: "Workshop-built",
    priceLabel: "Starting from",
    priceValue: "Rs 60,000",
    image: "/assets/Cloude-boucle-bed-Offwhite.png",
    imageAlt: "Yousuf Living bedroom set — workshop-built furniture in Karachi",
  },
]

const AUTOPLAY_MS = 6000

const textVariants = {
  enter: { opacity: 0, y: 14 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

const imageVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "6%" : "-6%", opacity: 0, scale: 1.03 }),
  center: { x: "0%", opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-6%" : "6%", opacity: 0, scale: 1.03 }),
}

export function Hero() {
  const prefersReduced = useReducedMotion()
  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 500], [0, 80])
  const imageScale = useTransform(scrollY, [0, 500], [1, 1.08])

  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const paused = useRef(false)
  const count = SLIDES.length
  const slide = SLIDES[active]!

  const goTo = (i: number) => {
    setDirection(i > active ? 1 : -1)
    setActive(i)
  }
  const next = () => { setDirection(1); setActive((i) => (i + 1) % count) }
  const prev = () => { setDirection(-1); setActive((i) => (i - 1 + count) % count) }

  useEffect(() => {
    if (prefersReduced) return
    const id = setInterval(() => { if (!paused.current) next() }, AUTOPLAY_MS)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced])

  const touchStartX = useRef(0)
  const swiping = useRef(false)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? 0
    swiping.current = false
  }
  const onTouchMove = (e: React.TouchEvent) => {
    const dx = touchStartX.current - (e.touches[0]?.clientX ?? 0)
    if (Math.abs(dx) > 10) swiping.current = true
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!swiping.current) return
    const dx = touchStartX.current - (e.changedTouches[0]?.clientX ?? 0)
    if (Math.abs(dx) > 40) (dx > 0 ? next : prev)()
    swiping.current = false
  }

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReduced ? 0 : 0.55, delay, ease: [0.16, 1, 0.3, 1] as const },
  })

  return (
    <section
      style={{ background: "linear-gradient(160deg,#1c4233,#0a1c15)" }}
      className="relative pb-10 lg:pb-14"
      onMouseEnter={() => { paused.current = true }}
      onMouseLeave={() => { paused.current = false }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-14">
        <div className="flex flex-col gap-0 lg:flex-row lg:items-stretch lg:min-h-[580px]">

          {/* ── Left: copy — re-animates per slide ── */}
          <div className="flex flex-1 flex-col justify-center py-12 sm:py-14 lg:py-16 lg:pr-14">
            <motion.p
              {...fadeUp(0)}
              className="font-mono uppercase text-gold"
              style={{ fontSize: "10px", letterSpacing: "3px" }}
            >
              {slide.eyebrow}
            </motion.p>

            <div className="relative mt-4" style={{ minHeight: "clamp(84px,12vw,152px)" }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.h1
                  key={active}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: prefersReduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display leading-[0.92] text-bone"
                  style={{ fontSize: "clamp(42px,6vw,76px)" }}
                >
                  {slide.headlineLine1}
                  <br />
                  <span className="italic text-gold">{slide.headlineAccent}</span>
                </motion.h1>
              </AnimatePresence>
            </div>

            <div className="relative mt-5 max-w-[380px]" style={{ minHeight: "3.4em" }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={active}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: prefersReduced ? 0 : 0.35, delay: prefersReduced ? 0 : 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="leading-[1.65] text-bone/65"
                  style={{ fontSize: "15.5px" }}
                >
                  {slide.subtext}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Trust signals — constant across slides */}
            <motion.div
              {...fadeUp(0.24)}
              className="mt-5 flex flex-wrap gap-x-5 gap-y-2"
            >
              {[`${ADVANCE_LABEL} · balance on delivery`, "Karachi delivery", "Custom sizing free"].map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                  className="flex items-center gap-1.5 font-mono text-[10.5px] text-bone/50"
                >
                  <span className="h-1 w-1 rounded-full bg-gold/60" />
                  {t}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              {...fadeUp(0.32)}
              className="mt-8 flex flex-wrap gap-3"
            >
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 480, damping: 22 }}
                style={{ display: "inline-flex" }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={active}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: prefersReduced ? 0 : 0.25 }}
                    style={{ display: "inline-flex" }}
                  >
                    <Link
                      href={slide.ctaHref}
                      className="shimmer-btn inline-flex items-center gap-2 rounded-[10px] px-6 py-3.5 font-heading font-black text-[14.5px] text-forest shadow-[0_8px_22px_-8px_rgba(201,162,75,.5)] transition-shadow hover:shadow-[0_12px_28px_-8px_rgba(201,162,75,.6)]"
                    >
                      {slide.ctaLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.span>
                </AnimatePresence>
              </motion.div>
              <motion.a
                href={waLink("Hi, I'd like to know more about your furniture.")}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 480, damping: 22 }}
                className="inline-flex items-center gap-2 rounded-[10px] border border-bone/25 px-6 py-3.5 font-heading font-bold text-[14.5px] text-bone/80 transition-colors hover:bg-white/10 hover:text-bone"
              >
                <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
                WhatsApp us
              </motion.a>
            </motion.div>

            {/* Slide indicators */}
            <div className="mt-8 flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Show slide ${i + 1}`}
                  className={cn(
                    "h-[6px] rounded-full transition-all",
                    i === active ? "w-6 bg-gold" : "w-[6px] bg-bone/25 hover:bg-bone/45"
                  )}
                />
              ))}
            </div>
          </div>

          {/* ── Right: full product photo with parallax, slides per active item ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: prefersReduced ? 0 : 0.7, delay: 0.15, ease: "easeOut" }}
            className="lg:w-[48%] lg:shrink-0 lg:items-center lg:py-8 lg:flex"
          >
            <div
              className="relative w-full overflow-hidden rounded-2xl max-lg:mt-12 max-lg:h-[320px] lg:h-[500px]"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={{ touchAction: "pan-y" }}
            >
              <AnimatePresence custom={direction} initial={false}>
                <motion.div
                  key={active}
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: prefersReduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <motion.div
                    style={prefersReduced ? {} : { y: imageY, scale: imageScale }}
                    className="h-full w-full will-change-transform max-lg:!transform-none"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 48vw"
                      priority={active === 0}
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Only a very subtle bottom gradient for price chip contrast */}
              <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/45 via-transparent to-transparent" />

              {/* Desktop arrows */}
              <button
                onClick={prev}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 lg:flex"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 lg:flex"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Floating price chip */}
              <div
                className="absolute bottom-5 left-5 z-10 rounded-[12px] px-4 py-3"
                style={{ background: "rgba(10,28,21,.85)", backdropFilter: "blur(14px)", border: "1px solid rgba(201,162,75,.25)" }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: prefersReduced ? 0 : 0.3 }}
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[1.5px] text-bone/50">{slide.priceLabel}</p>
                    <p className="mt-0.5 font-mono font-bold text-[22px] text-gold">{slide.priceValue}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Workshop / highlight badge */}
              <div
                className="absolute right-4 top-4 z-10 rounded-full px-3 py-1.5"
                style={{ background: "rgba(10,28,21,.75)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.12)" }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={active}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: prefersReduced ? 0 : 0.3 }}
                    className="block font-mono text-[9px] uppercase tracking-[1.5px] text-bone/70"
                  >
                    {slide.badge}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Gold accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: prefersReduced ? 0 : 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 right-0 h-[3px] origin-left will-change-transform"
        style={{ background: "linear-gradient(90deg,#C9A24B,#9c7d2f,#C9A24B)" }}
      />
    </section>
  )
}
