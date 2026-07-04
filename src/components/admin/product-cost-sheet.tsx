"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export interface ProductCostRow {
  productSlug: string
  categorySlug: string
  boardQty: number
  foamQty: number
  rexineQty: number
  patexQty: number
  hardware: number
  labour: number
  deco: number
  wastage: number
  marginPct: number
}

export interface CategoryCostRow {
  categorySlug: string
  manufacturingCost: number
  showroomMarginPct: number
}

export interface ProductRef {
  slug: string
  name: string
  categorySlug: string
  categoryName: string
}

export interface MaterialRates {
  mdf16mm: number
  foamPerBed: number
  rexinePerBed: number
  patexSheet: number
}

// Flat, bespoke-per-product costs (not tied to a shared material rate).
const FLAT_FIELDS = ["hardware", "labour", "deco", "wastage"] as const
// Quantity × shared rate — changing the global rate recalculates every product.
const QTY_FIELDS = [
  { key: "boardQty",  label: "Board (sheets)",  rateKey: "mdf16mm" as const,      unit: "sheets" },
  { key: "foamQty",   label: "Foam (units)",    rateKey: "foamPerBed" as const,   unit: "units" },
  { key: "rexineQty", label: "Rexine (units)",  rateKey: "rexinePerBed" as const, unit: "units" },
  { key: "patexQty",  label: "Patex (sheets)",  rateKey: "patexSheet" as const,   unit: "sheets" },
] as const

function materialAmounts(row: ProductCostRow, rates: MaterialRates) {
  return {
    board:  row.boardQty * rates.mdf16mm,
    foam:   row.foamQty * rates.foamPerBed,
    rexine: row.rexineQty * rates.rexinePerBed,
    patex:  row.patexQty * rates.patexSheet,
  }
}

function mfgOf(row: ProductCostRow, rates: MaterialRates) {
  const amounts = materialAmounts(row, rates)
  return amounts.board + amounts.foam + amounts.rexine + amounts.patex
    + row.hardware + row.labour + row.deco + row.wastage
}

function NumberInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className="w-full rounded-[7px] border border-border-strong bg-white px-2 py-1.5 text-right font-mono text-[11.5px] text-ink focus:border-forest focus:outline-none"
    />
  )
}

function EditRow({
  product,
  cost,
  rates,
  onSave,
  onCancel,
}: {
  product: ProductRef
  cost: ProductCostRow
  rates: MaterialRates
  onSave: (data: ProductCostRow) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState(cost)
  const amounts = materialAmounts(draft, rates)
  const mfg = mfgOf(draft, rates)
  const wholesale = mfg * (1 + draft.marginPct / 100)

  return (
    <div className="border-t border-border bg-surface px-5 py-4">
      <p className="mb-3 font-heading font-bold text-[13px] text-ink">{product.name} — per-product cost override</p>

      <p className="mb-2 font-mono text-[9px] uppercase tracking-[.5px] text-sage">
        Materials — quantity × the shared rate set in the Advanced planner below
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QTY_FIELDS.map(({ key, label, rateKey, unit }) => (
          <div key={key}>
            <label className="mb-1 block font-mono text-[9px] uppercase tracking-[.5px] text-sage">{label}</label>
            <NumberInput value={draft[key]} onChange={(v) => setDraft((d) => ({ ...d, [key]: v }))} />
            <p className="mt-1 font-mono text-[9.5px] text-sage">
              × {formatPrice(rates[rateKey])}/{unit.slice(0, -1)} = {formatPrice(draft[key] * rates[rateKey])}
            </p>
          </div>
        ))}
      </div>

      <p className="mb-2 mt-4 font-mono text-[9px] uppercase tracking-[.5px] text-sage">Bespoke per-product costs</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {FLAT_FIELDS.map((key) => (
          <div key={key}>
            <label className="mb-1 block font-mono text-[9px] uppercase tracking-[.5px] text-sage">{key}</label>
            <NumberInput value={draft[key]} onChange={(v) => setDraft((d) => ({ ...d, [key]: v }))} />
          </div>
        ))}
        <div>
          <label className="mb-1 block font-mono text-[9px] uppercase tracking-[.5px] text-sage">Margin %</label>
          <NumberInput value={draft.marginPct} onChange={(v) => setDraft((d) => ({ ...d, marginPct: v }))} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-[10px] bg-forest px-4 py-2.5">
        <span className="font-heading font-bold text-[12px] text-bone">Manufacturing {formatPrice(mfg)} → Wholesale</span>
        <span className="font-mono font-bold text-[14px] text-gold">{formatPrice(wholesale)}</span>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-[8px] border border-border-strong px-3 py-1.5 font-mono text-[11px] text-slate">Cancel</button>
        <button type="button" onClick={() => onSave(draft)} className="rounded-[8px] bg-forest px-3.5 py-1.5 font-mono text-[11px] text-bone">Save</button>
      </div>
    </div>
  )
}

function CategoryEditRow({
  category,
  onSave,
  onCancel,
}: {
  category: CategoryCostRow
  onSave: (data: CategoryCostRow) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState(category)
  const wholesale = draft.manufacturingCost * (1 + draft.showroomMarginPct / 100)

  return (
    <div className="border-t border-border bg-surface px-5 py-4">
      <p className="mb-3 font-heading font-bold text-[13px] text-ink">
        {category.categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} — category average
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block font-mono text-[9px] uppercase tracking-[.5px] text-sage">Mfg cost (PKR)</label>
          <NumberInput value={draft.manufacturingCost} onChange={(v) => setDraft((d) => ({ ...d, manufacturingCost: v }))} />
        </div>
        <div>
          <label className="mb-1 block font-mono text-[9px] uppercase tracking-[.5px] text-sage">Margin %</label>
          <NumberInput value={draft.showroomMarginPct} onChange={(v) => setDraft((d) => ({ ...d, showroomMarginPct: v }))} />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-[10px] bg-forest px-4 py-2.5">
        <span className="font-heading font-bold text-[12px] text-bone">Manufacturing {formatPrice(draft.manufacturingCost)} → Wholesale</span>
        <span className="font-mono font-bold text-[14px] text-gold">{formatPrice(wholesale)}</span>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-[8px] border border-border-strong px-3 py-1.5 font-mono text-[11px] text-slate">Cancel</button>
        <button type="button" onClick={() => onSave(draft)} className="rounded-[8px] bg-forest px-3.5 py-1.5 font-mono text-[11px] text-bone">Save</button>
      </div>
    </div>
  )
}

export function ProductCostSheet({
  products,
  productCosts,
  categoryCosts,
  materialRates,
  defaultBoardQtyByCategory,
}: {
  products: ProductRef[]
  productCosts: ProductCostRow[]
  categoryCosts: CategoryCostRow[]
  materialRates: MaterialRates
  /** Board quantity barely varies between products, so a new per-product
   * entry starts from the typical sheet count for its category rather than
   * zero — still editable/overridable when a product genuinely differs. */
  defaultBoardQtyByCategory: Record<string, number>
}) {
  const router = useRouter()
  const [mode, setMode] = useState<"per_product" | "average">("per_product")
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [editingCategorySlug, setEditingCategorySlug] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const costBySlug = useMemo(() => {
    const map = new Map<string, ProductCostRow>()
    for (const c of productCosts) map.set(c.productSlug, c)
    return map
  }, [productCosts])

  const categoryBySlug = useMemo(() => {
    const map = new Map<string, CategoryCostRow>()
    for (const c of categoryCosts) map.set(c.categorySlug, c)
    return map
  }, [categoryCosts])

  function resolve(product: ProductRef) {
    const specific = costBySlug.get(product.slug)
    if (specific) {
      const amounts = materialAmounts(specific, materialRates)
      const mfg = mfgOf(specific, materialRates)
      const wholesale = mfg * (1 + specific.marginPct / 100)
      return { source: "product" as const, amounts, breakdown: specific, mfg, marginPct: specific.marginPct, wholesale }
    }
    const category = categoryBySlug.get(product.categorySlug)
    if (!category) return null
    return {
      source: "category" as const,
      amounts: null,
      breakdown: null,
      mfg: category.manufacturingCost,
      marginPct: category.showroomMarginPct,
      wholesale: category.manufacturingCost * (1 + category.showroomMarginPct / 100),
    }
  }

  async function saveProductCost(product: ProductRef, data: ProductCostRow) {
    setSaving(true)
    await fetch("/api/admin/cost-sheet", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: [data] }),
    })
    setSaving(false)
    setEditingSlug(null)
    router.refresh()
  }

  async function saveCategoryCost(data: CategoryCostRow) {
    setSaving(true)
    await fetch("/api/admin/cost-sheet", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories: [data] }),
    })
    setSaving(false)
    setEditingCategorySlug(null)
    router.refresh()
  }

  const rows = mode === "per_product"
    ? products.map((p) => ({ product: p, resolved: resolve(p) }))
    : Array.from(categoryBySlug.values()).map((c) => ({
        product: { slug: c.categorySlug, name: products.find((p) => p.categorySlug === c.categorySlug)?.categoryName ?? c.categorySlug, categorySlug: c.categorySlug, categoryName: "" },
        resolved: { source: "category" as const, amounts: null, breakdown: null, mfg: c.manufacturingCost, marginPct: c.showroomMarginPct, wholesale: c.manufacturingCost * (1 + c.showroomMarginPct / 100) },
      }))

  const dash = (n: number | undefined) => (n ? Math.round(n).toLocaleString("en-US") : "—")

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-[10px] border border-border bg-white p-1">
          {(["per_product", "average"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-[7px] px-3.5 py-2 font-heading font-bold text-[12px] transition-colors ${
                mode === m ? "bg-forest text-bone" : "text-slate hover:bg-surface"
              }`}
            >
              {m === "per_product" ? "Per product" : "Category average"}
            </button>
          ))}
        </div>
        <span className="font-mono text-[11px] text-sage">
          {saving && <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />}
          Per-product overrides category average when present · PKR
        </span>
      </div>

      <div className="mt-4 overflow-x-auto rounded-[16px] border border-border bg-white">
        <div className="grid min-w-[920px] grid-cols-[1.6fr_repeat(8,0.8fr)_1fr_0.8fr_1fr] gap-2 bg-surface px-4 py-3 font-mono text-[9px] uppercase tracking-[.5px] text-sage">
          <span>Product</span><span className="text-right">Board</span><span className="text-right">Foam</span>
          <span className="text-right">Rexine</span><span className="text-right">H/ware</span><span className="text-right">Labour</span>
          <span className="text-right">Deco</span><span className="text-right">Waste</span><span className="text-right">Patex</span>
          <span className="text-right">Mfg cost</span><span className="text-right">Marg</span><span className="text-right">Wholesale</span>
        </div>
        {rows.map(({ product, resolved }) => (
          <div key={product.slug}>
            <button
              type="button"
              onClick={() => {
                if (mode === "per_product") {
                  setEditingSlug(editingSlug === product.slug ? null : product.slug)
                  setEditingCategorySlug(null)
                } else {
                  setEditingCategorySlug(editingCategorySlug === product.slug ? null : product.slug)
                  setEditingSlug(null)
                }
              }}
              className="grid min-w-[920px] w-full grid-cols-[1.6fr_repeat(8,0.8fr)_1fr_0.8fr_1fr] gap-2 border-t border-border px-4 py-3 text-left font-mono text-[11px] text-slate hover:bg-surface"
            >
              <span className="font-heading font-bold text-[12.5px] text-ink">
                {product.name}
                {resolved?.source === "category" && mode === "per_product" && (
                  <span className="ml-1.5 font-mono text-[9px] font-normal text-sage">(general)</span>
                )}
              </span>
              <span className="text-right">{dash(resolved?.amounts?.board)}</span>
              <span className="text-right">{dash(resolved?.amounts?.foam)}</span>
              <span className="text-right">{dash(resolved?.amounts?.rexine)}</span>
              <span className="text-right">{dash(resolved?.breakdown?.hardware)}</span>
              <span className="text-right">{dash(resolved?.breakdown?.labour)}</span>
              <span className="text-right">{dash(resolved?.breakdown?.deco)}</span>
              <span className="text-right">{dash(resolved?.breakdown?.wastage)}</span>
              <span className="text-right">{dash(resolved?.amounts?.patex)}</span>
              <span className="text-right font-bold text-forest">{dash(resolved?.mfg)}</span>
              <span className="text-right text-gold-700">{resolved?.marginPct ?? 0}%</span>
              <span className="text-right font-bold text-success">{dash(resolved?.wholesale)}</span>
            </button>
            {editingSlug === product.slug && mode === "per_product" && (
              <EditRow
                product={product}
                rates={materialRates}
                cost={costBySlug.get(product.slug) ?? {
                  productSlug: product.slug, categorySlug: product.categorySlug,
                  boardQty: defaultBoardQtyByCategory[product.categorySlug] ?? 0,
                  foamQty: 0, rexineQty: 0, patexQty: 0,
                  hardware: 0, labour: 0, deco: 0, wastage: 0,
                  marginPct: categoryBySlug.get(product.categorySlug)?.showroomMarginPct ?? 40,
                }}
                onSave={(data) => saveProductCost(product, data)}
                onCancel={() => setEditingSlug(null)}
              />
            )}
            {editingCategorySlug === product.slug && mode === "average" && (
              <CategoryEditRow
                category={categoryBySlug.get(product.slug)!}
                onSave={(data) => saveCategoryCost(data)}
                onCancel={() => setEditingCategorySlug(null)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
