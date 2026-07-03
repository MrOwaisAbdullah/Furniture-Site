"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid3X3, ShoppingCart, Heart } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/lib/store"
import { waLink } from "@/lib/site-config"

const navItems = [
  { label: "Home",      href: "/",         icon: Home,        external: false },
  { label: "Shop",      href: "/shop",     icon: Grid3X3,     external: false },
  { label: "Cart",      href: "/cart",     icon: ShoppingCart,external: false },
  { label: "Wishlist",  href: "/wishlist", icon: Heart,       external: false },
  { label: "WhatsApp",  href: waLink(),    icon: FaWhatsapp,  external: true  },
]

export function MobileStickyBar() {
  const pathname = usePathname()
  const cartCount = useCartStore((s) => s.totalQuantity)

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface-raised lg:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={cn(
                  "relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-lg text-xs transition-colors",
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-slate hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {item.label === "Cart" && cartCount > 0 && (
                    <span
                      className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-foreground"
                      aria-label={`${cartCount} items in cart`}
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
