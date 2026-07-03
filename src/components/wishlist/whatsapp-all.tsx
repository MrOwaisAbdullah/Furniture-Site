"use client"

import type { WishlistItem } from "@/lib/wishlist-client"
import { formatPrice } from "@/lib/utils"
import { FaWhatsapp } from "react-icons/fa"
import { waLink } from "@/lib/site-config"

interface WhatsAppAllProps {
  items: WishlistItem[]
  className?: string
}

export function WhatsAppAll({ items, className }: WhatsAppAllProps) {
  if (items.length === 0) return null

  const message = [
    "Hi, I'd like to enquire about the following items from my wishlist:",
    "",
    ...items.map((item, i) => `${i + 1}. ${item.name} — ${formatPrice(item.price)}`),
    "",
    "Please share availability and booking details.",
  ].join("\n")

  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? "flex items-center justify-center gap-2 rounded-[11px] bg-forest py-3.5 font-heading font-bold text-[14.5px] text-bone transition-transform active:scale-[.99]"}
    >
      <FaWhatsapp className="h-[18px] w-[18px]" aria-hidden="true" />
      WhatsApp all {items.length} item{items.length !== 1 ? "s" : ""}
    </a>
  )
}
