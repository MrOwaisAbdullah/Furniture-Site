"use client"

import { useState } from "react"
import { Trash2, ShieldAlert } from "lucide-react"

interface Review {
  id: number
  productSlug: string
  name: string
  rating: number
  body: string
  photoUrl: string | null
  approved: boolean
  spamFlagged: boolean
  createdAt: Date | string
}

export function ReviewsList({ reviews: initialReviews }: { reviews: Review[] }) {
  const [reviews, setReviews] = useState(initialReviews)

  async function setApproved(id: number, approved: boolean) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, approved } : r)))
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved }),
    })
  }

  async function remove(id: number) {
    if (!window.confirm("Delete this review permanently?")) return
    setReviews((prev) => prev.filter((r) => r.id !== id))
    await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((r) => (
        <div
          key={r.id}
          className={`rounded-[14px] border bg-white p-4 ${r.spamFlagged ? "border-error/40" : "border-border"}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-heading font-bold text-[14px] text-ink">{r.name}</p>
                {r.spamFlagged && (
                  <span className="flex items-center gap-1 rounded-full bg-error/10 px-2 py-0.5 font-mono text-[8.5px] uppercase text-error">
                    <ShieldAlert className="h-2.5 w-2.5" /> Possible spam
                  </span>
                )}
              </div>
              <div className="mt-0.5 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < r.rating ? "#C9A24B" : "#D7DCD4"} stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => setApproved(r.id, !r.approved)}
                className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase ${
                  r.approved ? "bg-success/15 text-success" : "bg-gold/15 text-gold-700"
                }`}
              >
                {r.approved ? "Live" : "Pending"}
              </button>
              <button
                type="button"
                onClick={() => remove(r.id)}
                aria-label="Delete review"
                className="flex h-7 w-7 items-center justify-center rounded-full text-sage transition-colors hover:bg-error/10 hover:text-error"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <p className="mt-2.5 text-[12.5px] leading-[1.55] text-slate">&ldquo;{r.body}&rdquo;</p>
          <div className="mt-2.5 flex items-center justify-between">
            <p className="font-mono text-[10px] text-sage">{r.productSlug}</p>
            <p className="font-mono text-[10px] text-mist">
              {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
