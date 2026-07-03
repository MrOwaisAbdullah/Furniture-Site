import {
  LayoutDashboard, ShoppingBag, Package, BarChart3, Tag,
  MessageSquare, Star, Users2, CreditCard, Gift, DollarSign,
  type LucideIcon,
} from "lucide-react"

export interface AdminNavItem {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin",            label: "Dashboard",  icon: LayoutDashboard, exact: true },
  { href: "/admin/orders",     label: "Orders",     icon: ShoppingBag },
  { href: "/admin/products",   label: "Products",   icon: Package },
  { href: "/admin/costs",      label: "Cost Sheet", icon: DollarSign },
  { href: "/admin/leads",      label: "Leads",      icon: MessageSquare },
  { href: "/admin/reviews",    label: "Reviews",    icon: Star },
  { href: "/admin/coupons",    label: "Coupons",    icon: Tag },
  { href: "/admin/affiliates", label: "Affiliates", icon: Users2 },
  { href: "/admin/payouts",    label: "Payouts",    icon: CreditCard },
  { href: "/admin/gifts",      label: "Gifts",      icon: Gift },
  { href: "/admin/reports",    label: "Reports",    icon: BarChart3 },
]

// Bottom tab bar on mobile only surfaces the highest-traffic sections —
// everything else is reachable via the "More" drawer.
export const mobilePrimaryNavHrefs = ["/admin", "/admin/orders", "/admin/products", "/admin/reports"]
