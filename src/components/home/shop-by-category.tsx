"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { sampleCategories } from "@/data/sample-categories"
import { useReducedMotion } from "@/lib/use-reduced-motion"

const CAT_IMAGES: Record<string, string> = {
  "bedroom-sets":    "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&w=600&q=75",
  beds:              "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=75",
  "dressing-tables": "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=75",
  wardrobes:         "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=75",
  "side-tables":     "https://images.unsplash.com/photo-1556909114-44c8e86f9b12?auto=format&fit=crop&w=600&q=75",
}

const categoryTones: Record<string, string> = {
  "bedroom-sets":    "linear-gradient(135deg,#16352A,#0c231b)",
  beds:              "linear-gradient(135deg,#244C3C,#16352A)",
  "dressing-tables": "linear-gradient(135deg,#3A6B57,#244C3C)",
  wardrobes:         "linear-gradient(135deg,#1c3d2e,#0c231b)",
  "side-tables":     "linear-gradient(135deg,#4A5A50,#1A2420)",
}

export function ShopByCategory() {
  const prefersReduced = useReducedMotion()

  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 pt-10 sm:px-6 lg:px-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: prefersReduced ? 0 : 0.4 }}
        className="mb-5 flex items-baseline justify-between"
      >
        <h2
          className="font-heading font-black text-ink"
          style={{ fontSize: "clamp(20px,3vw,26px)", letterSpacing: "-0.5px" }}
        >
          Shop by category
        </h2>
        <Link href="/shop" className="flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-[1px] text-gold-700 transition-colors hover:text-gold">
          All products <ArrowRight className="h-3 w-3" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:gap-3.5 lg:grid-cols-5 lg:gap-4">
        {sampleCategories.map((cat, i) => {
          const img = CAT_IMAGES[cat.slug]
          const tone = categoryTones[cat.slug] ?? "linear-gradient(135deg,#16352A,#0c231b)"

          return (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: prefersReduced ? 0 : 0.4, delay: prefersReduced ? 0 : i * 0.07, ease: "easeOut" }}
            >
              <Link
                href={`/shop/${cat.slug}`}
                className="group relative flex h-[120px] flex-col justify-end overflow-hidden rounded-[14px] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(22,53,42,.3)] lg:h-[150px]"
                style={{ background: tone }}
              >
                {img && (
                  <Image
                    src={img}
                    alt={`${cat.name} — browse ${cat.name.toLowerCase()} collection`}
                    fill
                    className="object-cover opacity-40 mix-blend-luminosity transition-transform duration-500 group-hover:scale-105 group-hover:opacity-50"
                    sizes="(max-width: 1024px) 50vw, 20vw"
                    style={{ filter: "saturate(0.6)" }}
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                <div className="relative">
                  <p
                    className="font-heading font-black leading-none text-bone"
                    style={{ fontSize: "14.5px", letterSpacing: "-0.2px" }}
                  >
                    {cat.name}
                  </p>
                  <p className="relative mt-1 font-mono text-bone/55" style={{ fontSize: "9px" }}>
                    {cat.productCount} products
                  </p>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
