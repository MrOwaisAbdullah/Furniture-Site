"use client"

import { cn } from "@/lib/utils"
import { FaWhatsapp } from "react-icons/fa"
import { waLink } from "@/lib/site-config"

interface WhatsAppButtonProps {
  productName?: string
  variant?: string
  finish?: string
  size?: string
  price?: string
  className?: string
  label?: string
  compact?: boolean
}

function buildMessage(opts: WhatsAppButtonProps): string {
  if (opts.productName) {
    const parts = [`Hi, I'm interested in the *${opts.productName}*`]
    if (opts.finish) parts.push(`Finish: ${opts.finish}`)
    if (opts.size) parts.push(`Size: ${opts.size}`)
    if (opts.price) parts.push(`Price: ${opts.price}`)
    parts.push("Please share more details.")
    return parts.join("\n")
  }
  return "Hi, I'd like to know more about your furniture sets."
}

export function WhatsAppButton({
  className,
  label = "Book on WhatsApp",
  compact = false,
  ...opts
}: WhatsAppButtonProps) {
  const message = buildMessage(opts)
  const href = waLink(message)

  const handleClick = () => {
    // Tracking placeholder — real trackEvent() wired in Part 2
    console.log("[track] whatsapp_click", { productName: opts.productName })
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-[11px] bg-forest font-heading font-bold text-bone transition-transform active:scale-[.99]",
        compact ? "px-4 py-2.5 text-[13px]" : "py-3.5 text-[14.5px]",
        className
      )}
    >
      <FaWhatsapp className={compact ? "h-[15px] w-[15px]" : "h-[18px] w-[18px]"} aria-hidden="true" />
      {label}
    </a>
  )
}
