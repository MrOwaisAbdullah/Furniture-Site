"use client"

import { useState } from "react"
import { Share2, Check } from "lucide-react"
import type { WishlistItem } from "@/lib/wishlist-client"

interface ShareWishlistProps {
  items: WishlistItem[]
}

export function ShareWishlist({ items }: ShareWishlistProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    // In Part 2 this will hit /api/wishlist/share to generate a real token
    const mockToken = btoa(items.map((i) => i.productId).join(",")).slice(0, 12)
    const shareUrl = `${window.location.origin}/wishlist/share/${mockToken}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Yousuf Living wishlist",
          text: `Check out the furniture I've saved — ${items.length} item${items.length !== 1 ? "s" : ""}`,
          url: shareUrl,
        })
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (items.length === 0) return null

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center gap-2 rounded-[11px] border border-border-strong py-3 font-heading font-bold text-[14px] text-slate transition-colors hover:bg-surface-sunken"
    >
      {copied ? <Check className="h-4 w-4 stroke-success" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Link copied!" : "Share wishlist"}
    </button>
  )
}
