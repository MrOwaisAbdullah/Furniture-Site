"use client"

import { useState } from "react"

interface GiftRow {
  id: number
  orderRef: string
  giftTier: string | null
  giftGivenAt: Date | string | null
  thankyouCodeSent: boolean
  thankyouCodeSentAt: Date | string | null
  createdAt: Date | string
  customerName: string | null
  customerPhone: string | null
}

const TIERS = ["Thank-you card", "Small gift", "Referral discount code"]

export function GiftsList({ gifts: initialGifts }: { gifts: GiftRow[] }) {
  const [gifts, setGifts] = useState(initialGifts)

  async function giveGift(id: number, giftTier: string) {
    setGifts((prev) => prev.map((g) => (g.id === id ? { ...g, giftTier, giftGivenAt: new Date() } : g)))
    await fetch("/api/admin/gifts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "give", giftTier }),
    })
  }

  async function sendThankyou(id: number) {
    setGifts((prev) => prev.map((g) => (g.id === id ? { ...g, thankyouCodeSent: true, thankyouCodeSentAt: new Date() } : g)))
    await fetch("/api/admin/gifts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "thankyou" }),
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {gifts.map((g) => (
        <div key={g.id} className="rounded-[14px] border border-border bg-white p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-mono font-bold text-[12px] text-forest">{g.orderRef}</p>
              <p className="mt-0.5 font-heading font-bold text-[14px] text-ink">{g.customerName ?? "—"}</p>
              <p className="font-mono text-[11px] text-sage">{g.customerPhone ?? "—"}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase ${
              g.thankyouCodeSent ? "bg-success/12 text-success" : "bg-gold/12 text-gold-700"
            }`}>
              {g.thankyouCodeSent ? "Sent" : "Pending"}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-[10px] bg-surface px-3.5 py-3">
            {g.giftTier ? (
              <span className="text-[12px] text-slate">{g.giftTier}</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {TIERS.map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => giveGift(g.id, tier)}
                    className="rounded-[7px] border border-border-strong bg-white px-2.5 py-1 font-mono text-[10.5px] text-slate hover:border-forest hover:text-forest"
                  >
                    {tier}
                  </button>
                ))}
              </div>
            )}
            {g.giftTier && !g.thankyouCodeSent && (
              <button
                type="button"
                onClick={() => sendThankyou(g.id)}
                className="ml-auto rounded-[7px] bg-forest px-2.5 py-1 font-mono text-[10.5px] text-bone"
              >
                Mark thank-you sent
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
