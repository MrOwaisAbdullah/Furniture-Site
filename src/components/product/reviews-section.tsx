"use client"

import { useState } from "react"
import { Star, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface Review {
  id: number
  name: string
  rating: number
  body: string
  photoUrl?: string | null
  createdAt: Date | string
}

interface ReviewsSectionProps {
  reviews: Review[]
  averageRating: number | null
  totalReviews: number
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "shrink-0",
            i < rating ? "fill-gold text-gold" : "fill-mist text-mist"
          )}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  )
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 text-right font-mono text-[11px] text-sage">{stars}</span>
      <Star className="h-3 w-3 shrink-0 fill-gold text-gold" />
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-mist/50">
        <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-right font-mono text-[10px] text-sage">{count}</span>
    </div>
  )
}

export function ReviewsSection({ reviews, averageRating, totalReviews }: ReviewsSectionProps) {
  const [showAll, setShowAll] = useState(false)
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }))

  const visibleReviews = showAll ? reviews : reviews.slice(0, 3)

  return (
    <div className="rounded-[14px] border border-border bg-white">
      {/* Header with summary */}
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-heading font-bold text-[15px] text-ink">Customer reviews</h3>

        {totalReviews > 0 ? (
          <div className="mt-3 flex gap-6">
            {/* Average rating */}
            <div className="text-center">
              <p className="font-mono font-bold text-[28px] text-ink">
                {averageRating?.toFixed(1) ?? "—"}
              </p>
              <StarRating rating={Math.round(averageRating ?? 0)} />
              <p className="mt-1 font-mono text-[10px] text-sage">
                {totalReviews} review{totalReviews !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Distribution */}
            <div className="flex flex-1 flex-col gap-1.5">
              {ratingDistribution.map(({ stars, count }) => (
                <RatingBar key={stars} stars={stars} count={count} total={totalReviews} />
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-2 text-[13px] text-slate">No reviews yet. Be the first to review this product.</p>
        )}
      </div>

      {/* Individual reviews */}
      {reviews.length > 0 && (
        <div className="divide-y divide-border">
          {visibleReviews.map((review) => (
            <div key={review.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-heading font-bold text-[13px] text-ink">{review.name}</p>
                  <StarRating rating={review.rating} size={12} />
                </div>
                <p className="font-mono text-[10px] text-mist">
                  {new Date(review.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p className="mt-2 text-[12.5px] leading-[1.6] text-slate">{review.body}</p>
              {review.photoUrl && (
                <div className="mt-3">
                  {/* eslint-disable-next-line @next/next/no-img-element -- review photos from external URLs */}
                  <img
                    src={review.photoUrl}
                    alt={`Photo from ${review.name}'s review`}
                    className="h-20 w-20 rounded-[8px] border border-border object-cover"
                  />
                </div>
              )}
            </div>
          ))}

          {/* Show more/less */}
          {reviews.length > 3 && (
            <div className="border-t border-border px-5 py-3 text-center">
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="inline-flex min-h-[44px] items-center gap-1.5 font-heading font-bold text-[12px] text-forest transition-colors hover:text-forest/80"
              >
                {showAll ? (
                  <>
                    Show less <ChevronUp className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    Show all {reviews.length} reviews <ChevronDown className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
