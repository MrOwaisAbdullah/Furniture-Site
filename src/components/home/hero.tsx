"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { FaWhatsapp } from "react-icons/fa"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { waLink } from "@/lib/site-config"

const HERO_IMAGE = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=85"

export function Hero() {
  const prefersReduced = useReducedMotion()
  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 500], [0, 80])
  const imageScale = useTransform(scrollY, [0, 500], [1, 1.08])

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReduced ? 0 : 0.55, delay, ease: [0.16, 1, 0.3, 1] as const },
  })

  return (
    <section style={{ background: "linear-gradient(160deg,#1c4233,#0a1c15)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-14">
        <div className="flex flex-col gap-0 lg:flex-row lg:items-stretch lg:min-h-[580px]">

          {/* ── Left: copy ── */}
          <div className="flex flex-1 flex-col justify-center py-12 sm:py-14 lg:py-16 lg:pr-14">
            <motion.p
              {...fadeUp(0)}
              className="font-mono uppercase text-gold"
              style={{ fontSize: "10px", letterSpacing: "3px" }}
            >
              Karachi · Workshop-direct
            </motion.p>

            <motion.h1
              {...fadeUp(0.08)}
              className="mt-4 font-display leading-[0.92] text-bone"
              style={{ fontSize: "clamp(42px,6vw,76px)" }}
            >
              Quality living,
              <br />
              <span className="italic text-gold">by design.</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.16)}
              className="mt-5 max-w-[380px] leading-[1.65] text-bone/65"
              style={{ fontSize: "15.5px" }}
            >
              Workshop-built bedroom sets, fairly priced. See them in person, or order on WhatsApp in minutes.
            </motion.p>

            {/* Trust signals */}
            <motion.div
              {...fadeUp(0.24)}
              className="mt-5 flex flex-wrap gap-x-5 gap-y-2"
            >
              {["30–50% advance · balance on delivery", "Karachi delivery", "Custom sizing free"].map((t, i) => (
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
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-[10px] bg-gold px-6 py-3.5 font-heading font-black text-[14.5px] text-forest shadow-[0_8px_22px_-8px_rgba(201,162,75,.5)] transition-shadow hover:shadow-[0_12px_28px_-8px_rgba(201,162,75,.6)]"
                >
                  Browse sets
                  <ArrowRight className="h-4 w-4" />
                </Link>
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
          </div>

          {/* ── Right: full product photo with parallax ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: prefersReduced ? 0 : 0.7, delay: 0.15, ease: "easeOut" }}
            className="hidden lg:flex lg:w-[48%] lg:shrink-0 lg:items-center lg:py-8"
          >
            <div className="relative w-full overflow-hidden rounded-2xl" style={{ height: "500px" }}>
              <motion.div
                style={{ y: prefersReduced ? 0 : imageY, scale: prefersReduced ? 1 : imageScale }}
                className="h-full w-full will-change-transform"
              >
                <Image
                  src={HERO_IMAGE}
                  alt="Yousuf Living bedroom set — workshop-built furniture in Karachi"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 0px, 48vw"
                  priority
                />
              </motion.div>
              {/* Only a very subtle bottom gradient for price chip contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

              {/* Floating price chip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute bottom-5 left-5 rounded-[12px] px-4 py-3"
                style={{ background: "rgba(10,28,21,.85)", backdropFilter: "blur(14px)", border: "1px solid rgba(201,162,75,.25)" }}
              >
                <p className="font-mono text-[9px] uppercase tracking-[1.5px] text-bone/50">Full bedroom set from</p>
                <p className="mt-0.5 font-mono font-bold text-[22px] text-gold">Rs 65,000</p>
              </motion.div>

              {/* Workshop badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute right-4 top-4 rounded-full px-3 py-1.5"
                style={{ background: "rgba(10,28,21,.75)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.12)" }}
              >
                <span className="font-mono text-[9px] uppercase tracking-[1.5px] text-bone/70">Workshop-built</span>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Gold accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: prefersReduced ? 0 : 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="h-[3px] origin-left will-change-transform"
        style={{ background: "linear-gradient(90deg,#C9A24B,#9c7d2f,#C9A24B)" }}
      />
    </section>
  )
}
