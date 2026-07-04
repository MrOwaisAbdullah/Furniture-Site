// Breadcrumb label shown above the page title in the topbar — matches the
// admin dashboard design's section groupings.
const CRUMBS: Record<string, string> = {
  "/admin":            "Overview",
  "/admin/orders":     "Operations",
  "/admin/products":   "Catalog",
  "/admin/costs":      "Finance",
  "/admin/leads":      "Sales",
  "/admin/gifts":      "Sales",
  "/admin/coupons":    "Growth",
  "/admin/affiliates": "Growth",
  "/admin/payouts":    "Finance",
  "/admin/reviews":    "Content",
  "/admin/reports":    "Analytics",
}

export function crumbFor(href: string | undefined): string {
  return (href && CRUMBS[href]) ?? "Overview"
}
