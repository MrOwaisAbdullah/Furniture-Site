/**
 * Seeds the cost sheet with the defaults from
 * docs/furniture-cost-pricing-model-v5.xlsx — safe to re-run, upserts by key.
 *
 * Usage: npm run seed:cost-sheet
 */
import { upsertMaterialRate, upsertPieceCost, upsertCategoryCost } from "../src/lib/neon/queries"
import { DEFAULT_MATERIAL_RATES, DEFAULT_PIECE_COSTS } from "../src/lib/cost-sheet"

async function main() {
  for (const rate of DEFAULT_MATERIAL_RATES) {
    await upsertMaterialRate(rate.key, rate.label, String(rate.rate), rate.unit)
  }

  for (const piece of DEFAULT_PIECE_COSTS) {
    await upsertPieceCost({
      pieceType: piece.pieceType,
      label: piece.label,
      sheets16mm: String(piece.sheets16mm),
      thinSheets: String(piece.thinSheets),
      thapary: piece.thapary,
      foam: piece.foam,
      mirror: piece.mirror,
      hardwareCost: String(piece.hardwareCost),
      labourCost: String(piece.labourCost),
      decoCost: String(piece.decoCost),
    })
  }

  // Category averages (Mode 1) — manufacturing cost per category derived
  // from the matching single piece where a 1:1 mapping exists.
  const categoryDefaults: Array<[string, number]> = [
    ["beds", 49900],
    ["side-tables", 31600],
    ["dressing-tables", 38800],
    ["wardrobes", 68200],
    ["bedroom-sets", 188500],
  ]
  for (const [slug, manufacturingCost] of categoryDefaults) {
    await upsertCategoryCost(slug, String(manufacturingCost), "20")
  }

  console.log("Cost sheet seeded.")
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
