"use client"

import { useState } from "react"
import { Star, Loader2, CheckCircle, Pen } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReviewFormProps {
  productSlug: string
  productName: string
}

export function ReviewForm({ productSlug, productName }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [body, setBody] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (rating === 0) {
      setError("Please select a rating")
      return
    }
    if (body.length < 10) {
      setError("Review must be at least 10 characters")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, name, rating, body }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to submit review")
        return
      }
      setSubmitted(true)
      setIsOpen(false)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  function handleOpen() {
    setIsOpen(true)
    setError(null)
  }

  if (submitted) {
    return (
      <div className="rounded-[14px] border border-success/30 bg-success/5 p-5 text-center">
        <CheckCircle className="mx-auto h-8 w-8 text-success" />
        <p className="mt-2 font-heading font-bold text-[14px] text-ink">Review submitted</p>
        <p className="mt-1 text-[12.5px] text-slate">
          Thanks for reviewing {productName}. It will appear after moderation.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Trigger button - always visible */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpen}
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-border-strong bg-white px-4 py-3 font-heading font-bold text-[13px] text-ink transition-colors hover:border-forest/40 hover:bg-surface"
        >
          <Pen className="h-4 w-4" />
          Write a review
        </button>
      )}

      {/* Collapsible form */}
      {isOpen && (
        <div className="rounded-[14px] border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <p className="font-heading font-bold text-[14px] text-ink">Write a review</p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="font-mono text-[11px] text-sage hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5">
            {/* Name */}
            <div>
              <label htmlFor="review-name" className="mb-1 block font-mono text-[10px] uppercase tracking-[.5px] text-sage">
                Your name
              </label>
              <input
                id="review-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-[8px] border border-border-strong bg-white px-3 py-2.5 text-[13px] text-ink placeholder:text-sage/50 focus:border-forest focus:outline-none"
                placeholder="e.g. Ahmed K."
              />
            </div>

            {/* Rating */}
            <div className="mt-4">
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[.5px] text-sage">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center transition-transform hover:scale-110"
                    aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                  >
                    <Star
                      className={cn(
                        "h-6 w-6 transition-colors",
                        (hoverRating || rating) >= star ? "fill-gold text-gold" : "fill-mist text-mist"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review body */}
            <div className="mt-4">
              <label htmlFor="review-body" className="mb-1 block font-mono text-[10px] uppercase tracking-[.5px] text-sage">
                Your review
              </label>
              <textarea
                id="review-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={4}
                className="w-full rounded-[8px] border border-border-strong bg-white px-3 py-2.5 text-[13px] text-ink placeholder:text-sage/50 focus:border-forest focus:outline-none resize-none"
                placeholder={`What did you like about the ${productName}? How was the quality, delivery, or value?`}
              />
              <p className="mt-1 font-mono text-[10px] text-sage">{body.length}/1000</p>
            </div>

            {/* Error */}
            {error && (
              <p className="mt-2 text-[12px] text-error">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !name.trim() || rating === 0 || body.length < 10}
              className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[10px] bg-forest font-heading font-bold text-[13px] text-bone transition-opacity disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {submitting ? "Submitting..." : "Submit review"}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
