"use client"

import { useEffect, useState } from "react"
import { MapPin, Plus, Loader2, Star, Trash2 } from "lucide-react"

interface Address {
  id: number
  label: string
  area: string | null
  address: string
  isDefault: boolean
}

export function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [label, setLabel] = useState("Home")
  const [area, setArea] = useState("")
  const [address, setAddress] = useState("")
  const [saving, setSaving] = useState(false)

  function load() {
    fetch("/api/account/addresses")
      .then((r) => (r.ok ? r.json() : { addresses: [] }))
      .then((data) => setAddresses(data.addresses ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, area: area || undefined, address, isDefault: addresses.length === 0 }),
    })
    setSaving(false)
    setIsOpen(false)
    setLabel("Home")
    setArea("")
    setAddress("")
    load()
  }

  async function handleDelete(id: number) {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" })
  }

  async function handleSetDefault(id: number) {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
    await fetch(`/api/account/addresses/${id}`, { method: "PATCH" })
  }

  if (loading) return null

  return (
    <>
      <div className="mt-8 flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 font-heading font-bold text-[15px] text-ink">
          <MapPin className="h-4 w-4 text-gold-700" /> Saved addresses
        </h2>
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 font-heading font-bold text-[12.5px] text-forest hover:text-forest-700"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        )}
      </div>

      {isOpen && (
        <form onSubmit={handleAdd} className="mt-3 rounded-[12px] border border-border bg-white p-4">
          <div className="flex gap-2.5">
            <div className="w-28 shrink-0">
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[.5px] text-sage">Label</label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
                className="w-full rounded-[8px] border border-border-strong px-3 py-2 text-[13px] focus:border-forest focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-[.5px] text-sage">Area</label>
              <input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. DHA Phase 5"
                className="w-full rounded-[8px] border border-border-strong px-3 py-2 text-[13px] focus:border-forest focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-[.5px] text-sage">Full address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={2}
              className="w-full resize-none rounded-[8px] border border-border-strong px-3 py-2 text-[13px] focus:border-forest focus:outline-none"
              placeholder="House #, street, nearest landmark"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-[8px] border border-border-strong px-4 py-2 font-heading font-bold text-[12.5px] text-slate"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-forest py-2 font-heading font-bold text-[12.5px] text-bone disabled:opacity-60"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {saving ? "Saving…" : "Save address"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-3 flex flex-col gap-2">
        {addresses.length === 0 && !isOpen ? (
          <p className="rounded-[12px] border border-dashed border-border-strong px-4 py-5 text-center font-mono text-[11px] text-sage">
            No saved addresses yet.
          </p>
        ) : (
          addresses.map((a) => (
            <div key={a.id} className="flex items-start justify-between gap-3 rounded-[12px] border border-border bg-white px-4 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-heading font-bold text-[13px] text-ink">{a.label}</p>
                  {a.isDefault && (
                    <span className="rounded-full bg-gold/15 px-2 py-0.5 font-mono text-[9px] uppercase text-gold-700">Default</span>
                  )}
                </div>
                {a.area && <p className="mt-0.5 font-mono text-[10.5px] text-sage">{a.area}</p>}
                <p className="mt-1 text-[12.5px] leading-[1.5] text-slate">{a.address}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-1.5">
                {!a.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(a.id)}
                    aria-label="Set as default"
                    className="text-sage hover:text-gold-700"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(a.id)}
                  aria-label="Delete address"
                  className="text-sage hover:text-error"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
