"use client"

import { useSyncExternalStore } from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { wishlistClient, type WishlistItem } from "@/lib/wishlist-client"

interface WishlistButtonProps {
  item: WishlistItem
  className?: string
  iconSize?: number
}

export function WishlistButton({ item, className, iconSize = 18 }: WishlistButtonProps) {
  const saved = useSyncExternalStore(
    wishlistClient.subscribe,
    () => wishlistClient.has(item.productId),
    () => false,
  )

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    wishlistClient.toggle(item)
  }

  return (
    <button
      onClick={toggle}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={cn(
        "flex items-center justify-center transition-transform active:scale-90",
        className
      )}
    >
      <Heart
        width={iconSize}
        height={iconSize}
        className={saved ? "fill-error stroke-error" : "stroke-current"}
        strokeWidth={2}
      />
    </button>
  )
}
