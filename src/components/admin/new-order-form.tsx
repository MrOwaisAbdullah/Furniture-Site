"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Loader2, X } from "lucide-react"
import { ThemedSelect } from "@/components/ui/themed-select"

interface LineItem {
  name: string
  price: string
  qty: string
}

export function NewOrderForm({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank" | "easypaisa">("cash")
  const [advance, setAdvance] = useState("")
  const [discount, setDiscount] = useState("0")
  const [items, setItems] = useState<LineItem[]>([{ name: "", price: "", qty: "1" }])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateItem(i: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const res = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        customerPhone,
        paymentMethod,
        advance: Number(advance || 0),
        discount: Number(discount || 0),
        items: items
          .filter((it) => it.name.trim())
          .map((it) => ({ name: it.name, price: Number(it.price || 0), qty: Number(it.qty || 1) })),
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => null)
      setError(body?.error ?? "Failed to create order")
      setSubmitting(false)
      return
    }

    setSubmitting(false)
    onClose()
    router.refresh()
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/40 lg:items-center">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-[20px] bg-white p-5 lg:rounded-[16px]"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading font-bold text-[16px] text-ink">Log showroom order</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-slate hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-3 rounded-[10px] bg-error/10 px-3 py-2 text-[12px] text-error">{error}</div>
        )}

        <div className="flex flex-col gap-3">
          <input
            required
            placeholder="Customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="min-h-[44px] rounded-[10px] border border-border-strong px-3 text-[13.5px] focus:border-forest focus:outline-none"
          />
          <input
            required
            placeholder="Phone (03xxxxxxxxx)"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="min-h-[44px] rounded-[10px] border border-border-strong px-3 text-[13.5px] focus:border-forest focus:outline-none"
          />

          <div className="flex flex-col gap-2">
            <p className="font-mono text-[10.5px] uppercase tracking-[1px] text-sage">Items</p>
            <div className="flex gap-2 pr-[42px]">
              <span className="flex-1 font-mono text-[9px] uppercase tracking-[.5px] text-sage">Name</span>
              <span className="w-24 font-mono text-[9px] uppercase tracking-[.5px] text-sage">Price</span>
              <span className="w-16 font-mono text-[9px] uppercase tracking-[.5px] text-sage">Qty</span>
            </div>
            {items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  aria-label="Item name"
                  placeholder="e.g. King Foam Bed"
                  value={item.name}
                  onChange={(e) => updateItem(i, { name: e.target.value })}
                  className="min-h-[40px] flex-1 rounded-[8px] border border-border-strong px-2.5 text-[12.5px] focus:border-forest focus:outline-none"
                />
                <input
                  aria-label="Price"
                  placeholder="e.g. 65000"
                  inputMode="numeric"
                  value={item.price}
                  onChange={(e) => updateItem(i, { price: e.target.value })}
                  className="min-h-[40px] w-24 rounded-[8px] border border-border-strong px-2.5 text-[12.5px] focus:border-forest focus:outline-none"
                />
                <input
                  aria-label="Quantity"
                  inputMode="numeric"
                  value={item.qty}
                  onChange={(e) => updateItem(i, { qty: e.target.value })}
                  className="min-h-[40px] w-16 rounded-[8px] border border-border-strong px-2.5 text-[12.5px] focus:border-forest focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
                  disabled={items.length === 1}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] text-error disabled:opacity-30"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setItems((prev) => [...prev, { name: "", price: "", qty: "1" }])}
              className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-[8px] border border-dashed border-border-strong text-[12.5px] text-slate hover:bg-surface"
            >
              <Plus className="h-4 w-4" /> Add item
            </button>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block font-mono text-[10.5px] uppercase tracking-[1px] text-sage">Discount (Rs)</label>
              <input
                inputMode="numeric"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="min-h-[44px] w-full rounded-[10px] border border-border-strong px-3 text-[13.5px] focus:border-forest focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block font-mono text-[10.5px] uppercase tracking-[1px] text-sage">Advance received (Rs)</label>
              <input
                required
                inputMode="numeric"
                value={advance}
                onChange={(e) => setAdvance(e.target.value)}
                className="min-h-[44px] w-full rounded-[10px] border border-border-strong px-3 text-[13.5px] focus:border-forest focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10.5px] uppercase tracking-[1px] text-sage">Payment method</label>
            <ThemedSelect
              value={paymentMethod}
              onChange={(v) => setPaymentMethod(v as typeof paymentMethod)}
              options={[
                { value: "cash", label: "Cash" },
                { value: "bank", label: "Bank transfer" },
                { value: "easypaisa", label: "EasyPaisa / JazzCash" },
              ]}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 flex min-h-[46px] items-center justify-center gap-2 rounded-[11px] bg-forest font-heading font-bold text-[14px] text-bone disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Saving…" : "Create order"}
          </button>
        </div>
      </form>
    </div>
  )
}
