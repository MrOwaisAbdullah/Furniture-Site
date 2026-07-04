/**
 * Seeds a demo order and a demo approved affiliate so /account and
 * /affiliate/dashboard can be previewed end-to-end without a real checkout.
 * Safe to re-run — uses fixed phone/email so repeated runs just add another
 * order rather than erroring.
 *
 * Usage: npm run seed:preview
 */
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

import { createOrder, createAffiliateApplication, approveAffiliate, getAffiliateByEmail } from "../src/lib/neon/queries"

const PREVIEW_PHONE = "03001234567"
const PREVIEW_EMAIL = "preview.customer@example.com"
const PREVIEW_AFFILIATE_EMAIL = "preview.affiliate@example.com"
const PREVIEW_AFFILIATE_PHONE = "03009876543"

async function main() {
  const order = await createOrder({
    customerName: "Preview Customer",
    customerPhone: PREVIEW_PHONE,
    customerEmail: PREVIEW_EMAIL,
    deliveryMethod: "delivery",
    deliveryArea: "Gulshan-e-Iqbal",
    deliveryAddress: "House 12, Street 4, Gulshan-e-Iqbal, Karachi",
    items: [
      { productId: "demo-bed", name: "King Foam Bed — Walnut Deco", price: 65000, qty: 1 },
      { productId: "demo-side-tables", name: "Side Tables (Pair) — Walnut", price: 28000, qty: 1 },
    ],
    subtotal: "93000.00",
    discount: "0.00",
    advance: "30000.00",
    total: "93000.00",
    paymentMethod: "bank",
    channel: "online",
  })
  console.log(`Demo order created: ${order?.ref}`)

  const existing = await getAffiliateByEmail(PREVIEW_AFFILIATE_EMAIL)
  if (existing) {
    if (!existing.approvedAt) await approveAffiliate(existing.id)
    console.log(`Demo affiliate already exists: ${existing.referralCode}`)
  } else {
    const affiliate = await createAffiliateApplication({
      name: "Preview Affiliate",
      phone: PREVIEW_AFFILIATE_PHONE,
      email: PREVIEW_AFFILIATE_EMAIL,
      platform: "Instagram",
      handle: "@previewaffiliate",
      followerCount: 5000,
      contentType: "Reel",
    })
    if (affiliate) {
      await approveAffiliate(affiliate.id)
      console.log(`Demo affiliate created and approved: ${affiliate.referralCode}`)
    }
  }

  console.log("\nPreview data seeded.")
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
