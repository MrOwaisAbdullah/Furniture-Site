"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import type { Category } from "@/types"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/lib/use-reduced-motion"

// Real photos only — no stock/external images. Wardrobes has no local
// asset yet, so it falls back to the Glass Niche Wardrobe's own Sanity
// photo (still our real product, just not in public/assets) until a
// dedicated category shot is added there too.
const CAT_IMAGES: Record<string, string> = {
  "bedroom-sets":    "/assets/ashcombe-bedroom-set.png",
  beds:              "/assets/Cloude-boucle-bed-Offwhite.png",
  "dressing-tables": "/assets/cloud-mirror-vanity-white-dressing-table-mirror-2.png",
  wardrobes:         "https://cdn.sanity.io/images/nelnbkzg/production/5bf8a7ca14d9ade0148691ee5930d213fc939f5e-1402x1122.png",
  "side-tables":     "/assets/marble-top-ribbed-nightstand-round-beige-nightstand-2.png",
  decor:             "/assets/channel-storage-bench-light-blue-storage-bench-decor-accent.png",
}

const categoryTones: Record<string, string> = {
  "bedroom-sets":    "linear-gradient(135deg,#16352A,#0c231b)",
  beds:              "linear-gradient(135deg,#244C3C,#16352A)",
  "dressing-tables": "linear-gradient(135deg,#3A6B57,#244C3C)",
  wardrobes:         "linear-gradient(135deg,#1c3d2e,#0c231b)",
  "side-tables":     "linear-gradient(135deg,#4A5A50,#1A2420)",
  decor:             "linear-gradient(135deg,#4A5A50,#1c3d2e)",
}

// Desktop bento spans — keyed by slug (not position) so reordering
// categories in Sanity doesn't silently break the layout. "beds" is the
// anchor tile (big square); "decor" closes the grid as a wide banner.
const BENTO_SPAN: Record<string, string> = {
  beds:  "lg:col-span-2 lg:row-span-2",
  decor: "lg:col-span-2",
}

export function ShopByCategory({ categories }: { categories: Category[] }) {
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

      <div className="grid grid-cols-2 gap-3 sm:gap-3.5 lg:grid-cols-4 lg:auto-rows-[150px] lg:grid-flow-dense lg:gap-4">
        {categories.map((cat, i) => {
          const img = CAT_IMAGES[cat.slug]
          const tone = categoryTones[cat.slug] ?? "linear-gradient(135deg,#16352A,#0c231b)"
          // On the 2-col mobile grid, an odd-numbered last card would be
          // left alone in its row with an empty cell beside it — span it
          // full width instead. Desktop's bento spans (below) take over there.
          const isLastOfOddRow = i === categories.length - 1 && categories.length % 2 === 1
          const bentoSpan = BENTO_SPAN[cat.slug]

          return (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: prefersReduced ? 0 : 0.4, delay: prefersReduced ? 0 : i * 0.07, ease: "easeOut" }}
              className={cn(isLastOfOddRow && "col-span-2 lg:col-span-1", bentoSpan)}
            >
              <Link
                href={`/shop/${cat.slug}`}
                className="group relative flex h-[120px] flex-col justify-end overflow-hidden rounded-[14px] p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(22,53,42,.3)] lg:h-full"
                style={{ background: tone }}
              >
                {img && (
                  <Image
                    src={img}
                    alt={`${cat.name} — browse ${cat.name.toLowerCase()} collection`}
                    fill
                    className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 20vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

                <div className="relative">
                  <p
                    className={cn(
                      "font-heading font-black leading-none text-bone text-[14.5px] tracking-[-0.2px]",
                      bentoSpan && "lg:text-[22px]"
                    )}
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
