"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin, Clock, ArrowRight } from "lucide-react"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { ADDRESS_FULL, waLink } from "@/lib/site-config"

const SHOWROOM_IMAGE = "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80"

export function ShowroomBlock() {
  const prefersReduced = useReducedMotion()

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 pb-14 sm:px-6 lg:px-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: prefersReduced ? 0 : 0.55, ease: "easeOut" }}
        className="overflow-hidden rounded-[20px] shadow-[0_20px_60px_-20px_rgba(22,53,42,.25)]"
      >
        <div className="flex flex-col lg:flex-row lg:h-[380px]">
          {/* ── Image ── */}
          <div className="relative h-56 shrink-0 overflow-hidden lg:h-full lg:w-[52%]">
            <Image
              src={SHOWROOM_IMAGE}
              alt="Yousuf Living showroom interior — visit us in Manzoor Colony, Karachi"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105 will-change-transform"
              sizes="(max-width: 1024px) 100vw, 52vw"
            />
            {/* Subtle bottom scrim for mobile readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/15" />
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="absolute bottom-4 left-4 rounded-[10px] px-3.5 py-2.5"
              style={{ background: "rgba(10,28,21,.82)", backdropFilter: "blur(12px)", border: "1px solid rgba(201,162,75,.2)" }}
            >
              <p className="font-mono text-[8.5px] uppercase tracking-[1.5px] text-bone/50">Open today</p>
              <p className="mt-0.5 font-mono font-bold text-[13px] text-gold">10 am – 9 pm</p>
            </motion.div>
          </div>

          {/* ── Info ── */}
          <div
            className="flex flex-1 flex-col justify-center px-7 py-8 text-bone lg:px-10 lg:py-6"
            style={{ background: "linear-gradient(155deg,#1c4233,#0a1c15)" }}
          >
            <p className="font-mono text-[9.5px] uppercase tracking-[2.5px] text-gold/60">
              Karachi · Manzoor Colony
            </p>
            <h2
              className="mt-3 font-heading font-black text-bone"
              style={{ fontSize: "clamp(22px,3.5vw,30px)", letterSpacing: "-0.6px" }}
            >
              See it before<br />
              <span className="font-display italic text-gold">you buy it.</span>
            </h2>
            <p className="mt-3.5 max-w-sm text-[13.5px] leading-[1.7] text-bone/60">
              Every finish. Every size. All bedroom sets on display — so you know exactly what you&apos;re ordering.
            </p>

            <div className="mt-5 flex flex-col gap-2.5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold/50" />
                <span className="text-[12.5px] text-bone/65">{ADDRESS_FULL}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-gold/50" />
                <span className="text-[12.5px] text-bone/65">Mon–Sun · 10 am – 11 pm</span>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Link
                  href="/showroom"
                  className="inline-flex items-center gap-2 rounded-[10px] shimmer-btn px-6 py-3 font-heading font-bold text-[13.5px] text-forest transition-all"
                >
                  Plan a visit <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.a
                href={waLink("Hi, I'd like to visit your showroom.")}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="inline-flex items-center gap-2 rounded-[10px] border border-bone/20 px-6 py-3 font-heading font-bold text-[13.5px] text-bone/70 transition-all hover:border-bone/35 hover:text-bone"
              >
                WhatsApp us
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
