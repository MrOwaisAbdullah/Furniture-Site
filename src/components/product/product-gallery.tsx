"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  name: string
  /** CSS background (gradient) shown behind/instead of a missing image */
  tone: string
  onSale?: boolean
}

export function ProductGallery({ images, name, tone, onSale }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const [broken, setBroken] = useState<Record<number, boolean>>({})

  const count = images.length
  const prev = () => setActive((i) => (i - 1 + count) % count)
  const next = () => setActive((i) => (i + 1) % count)

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

  return (
    <div>
      {/* Main image — exactly one <Image> in the DOM at a time */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ background: tone, aspectRatio: "4/3", touchAction: "pan-y" }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {activeSrc && !broken[active] && (
          <Image
            key={active}
            src={activeSrc}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            onError={() => setBroken((b) => ({ ...b, [active]: true }))}
          />
        )}

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
                  onClick={() => setActive(i)}
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
              onClick={() => setActive(i)}
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
