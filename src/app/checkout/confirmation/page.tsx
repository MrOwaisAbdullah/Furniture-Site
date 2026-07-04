"use client"

import { useMemo } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { formatPrice } from "@/lib/utils"

function readOrderFromSession(): { ref: string; advance: number } | null {
  if (typeof window === "undefined") return null
  const raw = sessionStorage.getItem("yl_last_order")
  if (!raw) return null
  try {
    return JSON.parse(raw) as { ref: string; advance: number }
  } catch {
    return null
  }
}

export default function ConfirmationPage() {
  const order = useMemo(() => readOrderFromSession(), [])

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-success/14">
          <CheckCircle className="h-9 w-9 stroke-success" strokeWidth={2} />
        </div>

        <h1 className="mt-5 font-display italic text-forest" style={{ fontSize: "32px" }}>
          Booking received
        </h1>

        <p className="mt-2 text-[13.5px] leading-[1.55] text-slate">
          We&apos;ll{" "}
          <span className="inline-flex items-center gap-1 font-semibold text-ink">
            <FaWhatsapp className="h-3.5 w-3.5 text-[#25D366]" aria-hidden="true" />
            WhatsApp
          </span>{" "}
          you within 2 hours to confirm your build slot and delivery window.
        </p>

        {/* Order summary card */}
        {order && (
          <div className="mt-6 rounded-[13px] border border-border bg-white p-5 text-left">
            <div className="flex justify-between">
              <span className="text-[12px] text-sage">Order ref</span>
              <span className="font-mono font-bold text-[13px] text-forest">{order.ref}</span>
            </div>
            <div className="mt-3 flex justify-between">
              <span className="text-[12px] text-sage">Advance to pay</span>
              <span className="text-[13px] text-ink">{formatPrice(order.advance)}</span>
            </div>
          </div>
        )}

        {/* Referral CTA */}
        <div className="mt-3 rounded-[13px] border border-gold/30 bg-gold/5 p-4 text-left">
          <p className="text-[12.5px] leading-[1.55] text-slate">
            Love your order? Become an affiliate and earn a commission every time someone books using your code.
          </p>
          <Link href="/affiliate" className="mt-2 inline-block font-heading font-bold text-[12.5px] text-gold-700">
            Join the affiliate program →
          </Link>
        </div>

        <Link
          href="/track"
          className="mt-5 flex items-center justify-center rounded-[11px] bg-forest py-3.5 font-heading font-bold text-[14.5px] text-bone"
        >
          Track your order
        </Link>

        <Link href="/" className="mt-3 block font-heading font-bold text-[13.5px] text-gold-700">
          Back to home
        </Link>
      </div>
    </div>
  )
}
