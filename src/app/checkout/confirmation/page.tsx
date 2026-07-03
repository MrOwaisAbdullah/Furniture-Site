import Link from "next/link"
import { CheckCircle, Gift } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

export default function ConfirmationPage() {
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
        <div className="mt-6 rounded-[13px] border border-border bg-white p-5 text-left">
          {[
            { label: "Order ref",        value: "YL-26-0418", mono: true },
            { label: "Delivery window",  value: "28 Jun – 2 Jul" },
          ].map((row, i, arr) => (
            <div key={row.label} className={i < arr.length - 1 ? "mb-3" : ""}>
              <div className="flex justify-between">
                <span className="text-[12px] text-sage">{row.label}</span>
                <span className={row.mono ? "font-mono font-bold text-[13px] text-forest" : "text-[13px] text-ink"}>
                  {row.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Referral code — separate card with context */}
        <div className="mt-3 rounded-[13px] border border-gold/30 bg-gold/5 p-4 text-left">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15">
              <Gift className="h-4 w-4 stroke-gold-700" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-[1.5px] text-gold-700">Your referral code</p>
              <p className="mt-0.5 font-mono font-black text-[20px] text-forest tracking-wider">AHMED-5OFF</p>
              <p className="mt-1.5 text-[11.5px] leading-[1.5] text-slate">
                Share this code with friends — they get <strong className="text-ink">5% off</strong> their first order,
                and you earn a commission when they book.
              </p>
            </div>
          </div>
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
