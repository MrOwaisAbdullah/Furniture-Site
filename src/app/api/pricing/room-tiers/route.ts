import { NextResponse } from "next/server"
import { getProducts } from "@/lib/sanity/queries"
import { getRoomTierPricing } from "@/lib/pricing/room-tiers"

// Public — see getRoomTierPricing() for what this does and doesn't expose.
export async function GET() {
  const products = await getProducts()
  const pricing = await getRoomTierPricing(products)
  return NextResponse.json({ pricing })
}
