"use client"

import { useState } from "react"
import { formatPrice } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface Payout {
  id: number
  affiliateId: number
  affiliateName: string | null
  orderRef: string
  orderValue: string
  payoutOwed: string
  payoutStatus: string
  paidAt: Date | string | null
  createdAt: Date | string
}

export function PayoutsList({ payouts: initialPayouts }: { payouts: Payout[] }) {
  const [payouts, setPayouts] = useState(initialPayouts)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [confirming, setConfirming] = useState<Payout | null>(null)

  async function markPaid(id: number) {
    setBusyId(id)
    await fetch(`/api/admin/payouts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
    setPayouts((prev) => prev.map((p) => (p.id === id ? { ...p, payoutStatus: "paid", paidAt: new Date() } : p)))
    setBusyId(null)
    setConfirming(null)
  }

  return (
    <div className="mt-5 overflow-hidden rounded-[14px] border border-border bg-white">
      {payouts.length === 0 ? (
        <p className="px-4 py-6 text-center font-mono text-[11px] text-sage">No payouts owed yet.</p>
      ) : (
        payouts.map((p, i) => (
          <div key={p.id} className={`flex items-center gap-4 px-4 py-4 ${i > 0 ? "border-t border-border" : ""}`}>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-[14px] text-ink">{p.affiliateName ?? "—"}</p>
              <p className="font-mono text-[11px] text-sage">{p.orderRef} · order {formatPrice(Number(p.orderValue))}</p>
            </div>
            <p className="font-mono font-bold text-[15px] text-ink">{formatPrice(Number(p.payoutOwed))}</p>
            {p.payoutStatus === "paid" ? (
              <span className="rounded-full bg-success/12 px-2.5 py-1 font-mono text-[9px] uppercase text-success">Paid</span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(p)}
                disabled={busyId === p.id}
                className="flex items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-1 font-mono text-[9px] uppercase text-gold-700 disabled:opacity-60"
              >
                {busyId === p.id && <Loader2 className="h-3 w-3 animate-spin" />}
                Mark paid
              </button>
            )}
          </div>
        ))
      )}

      <ConfirmDialog
        open={!!confirming}
        onClose={() => setConfirming(null)}
        onConfirm={() => confirming && markPaid(confirming.id)}
        title="Mark this payout as paid?"
        description={confirming ? `${formatPrice(Number(confirming.payoutOwed))} to ${confirming.affiliateName ?? "this affiliate"} for order ${confirming.orderRef}. This can't be undone from here.` : undefined}
        confirmLabel="Mark paid"
        variant="success"
        loading={busyId === confirming?.id}
      />
    </div>
  )
}
