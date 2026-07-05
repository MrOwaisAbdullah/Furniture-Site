import { NextResponse } from "next/server"
import { getProducts } from "@/lib/sanity/queries"

// Public — the full product catalog, used by client components that need
// a pool to compute related/upsell products from (checkout upsell modal).
export async function GET() {
  const products = await getProducts()
  return NextResponse.json({ products })
}
