import { getProductCosts, getCategoryCosts, getMaterialRates, getPieceCosts, getCostModes } from "@/lib/neon/queries"
import { DEFAULT_MATERIAL_RATES, DEFAULT_PIECE_COSTS } from "@/lib/cost-sheet"
import { sampleProducts } from "@/data/sample-products"
import { ProductCostSheet } from "@/components/admin/product-cost-sheet"
import { CostSheetEditor } from "@/components/admin/cost-sheet-editor"

export const dynamic = "force-dynamic"

export default async function AdminCostsPage() {
  const [productCostRows, categoryRows, rateRows, pieceRows, modeRows] = await Promise.all([
    getProductCosts(),
    getCategoryCosts(),
    getMaterialRates(),
    getPieceCosts(),
    getCostModes(),
  ])

  const products = sampleProducts.map((p) => ({
    slug: p.slug,
    name: p.name,
    categorySlug: p.category.slug,
    categoryName: p.category.name,
  }))

  const productCosts = productCostRows.map((c) => ({
    productSlug: c.productSlug,
    categorySlug: c.categorySlug,
    boardQty: Number(c.boardQty),
    foamQty: Number(c.foamQty),
    rexineQty: Number(c.rexineQty),
    patexQty: Number(c.patexQty),
    hardware: Number(c.hardware),
    labour: Number(c.labour),
    deco: Number(c.deco),
    wastage: Number(c.wastage),
    marginPct: Number(c.marginPct),
  }))

  const categoryCosts = categoryRows.map((c) => ({
    categorySlug: c.categorySlug,
    manufacturingCost: Number(c.manufacturingCost),
    showroomMarginPct: Number(c.showroomMarginPct),
  }))

  const rates = rateRows.length > 0
    ? rateRows.map((r) => ({ key: r.key, label: r.label, rate: Number(r.rate), unit: r.unit }))
    : DEFAULT_MATERIAL_RATES

  const pieces = pieceRows.length > 0
    ? pieceRows.map((p) => ({
        pieceType: p.pieceType, label: p.label,
        sheets16mm: Number(p.sheets16mm), thinSheets: Number(p.thinSheets),
        thapary: p.thapary, foam: p.foam, mirror: p.mirror,
        hardwareCost: Number(p.hardwareCost), labourCost: Number(p.labourCost), decoCost: Number(p.decoCost),
      }))
    : DEFAULT_PIECE_COSTS

  const modes = modeRows.map((m) => ({ categorySlug: m.categorySlug, mode: m.mode as "average" | "per_product" }))

  // Board quantity barely varies between products, so a new per-product
  // entry starts from the typical sheet count for its category (still
  // fully editable/overridable when a product genuinely differs).
  const sheetsByPieceType = Object.fromEntries(pieces.map((p) => [p.pieceType, p.sheets16mm]))
  const defaultBoardQtyByCategory: Record<string, number> = {
    "beds":            sheetsByPieceType["bed"] ?? 0,
    "side-tables":      sheetsByPieceType["side_tables_pair"] ?? 0,
    "dressing-tables":  sheetsByPieceType["dressing_table"] ?? 0,
    "wardrobes":        sheetsByPieceType["wardrobe_3door"] ?? 0,
    "bedroom-sets":     Object.values(sheetsByPieceType).reduce((sum, n) => sum + n, 0),
  }

  const materialRates = {
    mdf16mm:      rates.find((r) => r.key === "mdf16mm")?.rate ?? 0,
    foamPerBed:   rates.find((r) => r.key === "foamPerBed")?.rate ?? 0,
    rexinePerBed: rates.find((r) => r.key === "rexinePerBed")?.rate ?? 0,
    patexSheet:   rates.find((r) => r.key === "patexSheet")?.rate ?? 0,
  }

  return (
    <div className="p-6">
      <p className="font-mono text-[11px] text-sage">
        {categoryRows.length === 0 ? "No category averages set yet — set at least one below" : "Live from your saved costs"}
      </p>

      <div className="mt-5">
        <ProductCostSheet
          products={products}
          productCosts={productCosts}
          categoryCosts={categoryCosts}
          materialRates={materialRates}
          defaultBoardQtyByCategory={defaultBoardQtyByCategory}
        />
      </div>

      <details className="mt-8 rounded-[14px] border border-border bg-white">
        <summary className="cursor-pointer px-5 py-4 font-heading font-bold text-[13px] text-ink">
          Advanced: material-rate BOM planner &amp; category averages
        </summary>
        <div className="border-t border-border p-5">
          <p className="mb-3 font-mono text-[11px] text-sage">
            Set category averages here (used as the fallback above), or use the full per-piece bill-of-materials
            calculator matching the furniture cost/pricing model.
          </p>
          <CostSheetEditor
            initialRates={rates}
            initialPieces={pieces}
            initialCategories={categoryCosts}
            initialModes={modes}
          />
        </div>
      </details>
    </div>
  )
}
