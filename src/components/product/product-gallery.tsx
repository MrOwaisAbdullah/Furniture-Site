"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  name: string
  /** CSS background (gradient) shown behind/instead of a missing image */
  tone: string
  onSale?: boolean
}

// 1 = sliding to the next image (new one enters from the right), -1 = prev.
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
}

export function ProductGallery({ images, name, tone, onSale }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const [broken, setBroken] = useState<Record<number, boolean>>({})
  const [loaded, setLoaded] = useState<Record<number, boolean>>({})
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null)

  const count = images.length
  const goTo = (i: number) => {
    setDirection(i > active || (active === count - 1 && i === 0) ? 1 : -1)
    setActive(i)
  }
  const prev = () => { setDirection(-1); setActive((i) => (i - 1 + count) % count) }
  const next = () => { setDirection(1); setActive((i) => (i + 1) % count) }

  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const swiping = useRef(false)

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    if (!t) return
    touchStartX.current = t.clientX
    touchStartY.current = t.clientY
    swiping.current = false
  }
  const onTouchMove = (e: React.TouchEvent) => {
    const t = e.touches[0]
    if (!t) return
    const dx = touchStartX.current - t.clientX
    const dy = touchStartY.current - t.clientY
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) swiping.current = true
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!swiping.current) return
    const t = e.changedTouches[0]
    if (!t) return
    const dx = touchStartX.current - t.clientX
    if (Math.abs(dx) > 40) (dx > 0 ? next : prev)()
    swiping.current = false
  }

  const activeSrc = images[active]
  const nextIndex = count > 1 ? (active + 1) % count : -1
  const prevIndex = count > 1 ? (active - 1 + count) % count : -1
  // Same fill+sizes combo as the visible slot below — matching it exactly is
  // what makes next/image request the identical optimizer URL, so the
  // browser already has it cached by the time the user actually swipes
  // there. A mismatched `sizes` (e.g. the thumbnail strip's "62px") silently
  // warms a completely different URL and does nothing for perceived speed.
  const GALLERY_SIZES = "(max-width: 1024px) 100vw, 50vw"

  return (
    <div>
      {/* Invisible neighbor preload — fixed off-screen, not display:none, so
          the browser still fetches it eagerly instead of treating it as
          out-of-viewport and lazy-deferring forever. */}
      <div style={{ position: "fixed", inset: 0, opacity: 0, pointerEvents: "none", zIndex: -1 }} aria-hidden="true">
        {[nextIndex, prevIndex].map((i) =>
          i >= 0 && i !== active && images[i] && !broken[i] && !loaded[i] ? (
            <Image
              key={images[i]}
              src={images[i]}
              alt=""
              fill
              sizes={GALLERY_SIZES}
              onLoad={() => setLoaded((l) => ({ ...l, [i]: true }))}
              onError={() => setBroken((b) => ({ ...b, [i]: true }))}
            />
          ) : null
        )}
      </div>

      {/* Main image — exactly one <Image> in the DOM at a time */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: activeSrc ? undefined : tone,
          aspectRatio: imageAspectRatio || "4/3",
          touchAction: "pan-y"
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            {activeSrc && !broken[active] && !loaded[active] && (
              <div className="absolute inset-0 animate-pulse bg-slate-200" />
            )}

            {activeSrc && !broken[active] && (
              <Image
                src={activeSrc}
                alt={name}
                fill
                className="object-cover"
                sizes={GALLERY_SIZES}
                onLoad={(e) => {
                  setLoaded((l) => ({ ...l, [active]: true }))
                  // Set aspect ratio from first image
                  if (active === 0 && !imageAspectRatio) {
                    const img = e.target as HTMLImageElement
                    if (img.naturalWidth && img.naturalHeight) {
                      setImageAspectRatio(img.naturalWidth / img.naturalHeight)
                    }
                  }
                }}
                onError={() => setBroken((b) => ({ ...b, [active]: true }))}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />

        {onSale && (
          <div className="absolute left-3 top-3 z-10 rounded-full bg-gold px-3 py-1 font-mono text-[9px] font-bold tracking-[1.5px] text-forest">
            SALE
          </div>
        )}

        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 lg:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 lg:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Image ${i + 1}`}
                  className={cn(
                    "h-[6px] rounded-full transition-all",
                    i === active ? "w-5 bg-bone" : "w-[6px] bg-bone/40"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip — each button is `relative` so its fill-image is
          contained inside the 62px tile instead of escaping to the nearest
          positioned ancestor (the sticky gallery column). */}
      {count > 1 && (
        <div className="mt-3 flex gap-2">
          {images.slice(0, 5).map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative h-[62px] w-[62px] shrink-0 overflow-hidden rounded-[10px] border-2 transition-all",
                i === active ? "border-forest shadow-sm" : "border-transparent opacity-50 hover:opacity-75"
              )}
              style={{ background: tone }}
            >
              {img && !broken[i] && (
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="62px"
                  onError={() => setBroken((b) => ({ ...b, [i]: true }))}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
