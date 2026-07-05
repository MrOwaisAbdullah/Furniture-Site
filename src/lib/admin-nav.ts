import {
  LayoutDashboard, ShoppingBag, Package, BarChart3, Tag,
  MessageSquare, Star, Users2, CreditCard, Gift, DollarSign, HelpCircle,
  type LucideIcon,
} from "lucide-react"

export interface AdminNavItem {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
  group: "operations" | "growth"
}

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin",            label: "Dashboard",  icon: LayoutDashboard, exact: true, group: "operations" },
  { href: "/admin/orders",     label: "Orders",     icon: ShoppingBag,               group: "operations" },
  { href: "/admin/products",   label: "Products",   icon: Package,                   group: "operations" },
  { href: "/admin/costs",      label: "Cost Sheet", icon: DollarSign,                group: "operations" },
  { href: "/admin/leads",      label: "Leads",      icon: MessageSquare,             group: "operations" },
  { href: "/admin/gifts",      label: "Gifts",      icon: Gift,                      group: "operations" },
  { href: "/admin/coupons",    label: "Coupons",    icon: Tag,                       group: "growth" },
  { href: "/admin/affiliates", label: "Affiliates", icon: Users2,                    group: "growth" },
  { href: "/admin/payouts",    label: "Payouts",    icon: CreditCard,                group: "growth" },
  { href: "/admin/reviews",    label: "Reviews",    icon: Star,                      group: "growth" },
  { href: "/admin/questions",  label: "Q&A",        icon: HelpCircle,                group: "growth" },
  { href: "/admin/reports",    label: "Reports",    icon: BarChart3,                 group: "growth" },
]

export const OPERATIONS_LABEL = "Operations"
export const GROWTH_LABEL = "Growth"

// Bottom tab bar on mobile only surfaces the highest-traffic sections —
// everything else is reachable via the "More" drawer.
export const mobilePrimaryNavHrefs = ["/admin", "/admin/orders", "/admin/products", "/admin/reports"]
