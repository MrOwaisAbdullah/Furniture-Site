"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ShoppingBag, Search, Heart, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Logo } from "@/components/ui/logo"
import { useCartStore } from "@/lib/store"
import { CartDrawer } from "./cart-drawer"
import { SearchInput } from "@/components/product/search-input"
import type { Product } from "@/types"

const navLinks = [
  { href: "/shop",      label: "Shop" },
  { href: "/sets",      label: "Sets" },
  { href: "/blog",      label: "Blog" },
  { href: "/about",     label: "About" },
  { href: "/showroom",  label: "Showroom" },
  { href: "/contact",   label: "Contact" },
  { href: "/account",   label: "My Account" },
  { href: "/wishlist",  label: "Wishlist" },
]

export function Header({ products }: { products: Product[] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen]             = useState(false)
  const [searchOpen, setSearchOpen]         = useState(false)
  const cartCount = useCartStore((s) => s.totalQuantity)

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <>
      <header className="sticky top-0 z-40 bg-forest text-bone">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Hamburger (mobile) */}
            <button
              className="flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-white/10 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo */}
            <Link href="/" aria-label="Yousuf Living — Home" className="mx-auto md:mx-0">
              <Logo variant="compact" on="forest" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
              {navLinks.slice(0, -1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-bone/75 transition-colors hover:text-bone"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0.5">
              <button
                className="flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                href="/wishlist"
                data-nav-wishlist
                className="flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                data-nav-cart
                className="relative flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                aria-label={`Open cart, ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gold px-1 font-mono text-[9px] font-bold text-forest">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile nav bottom sheet ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-[70] md:hidden"
              style={{ background: "rgba(10,28,21,.55)" }}
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Bottom sheet */}
            <motion.div
              key="drawer"
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 38, mass: 0.9 }}
              className="fixed inset-x-0 bottom-0 z-[80] md:hidden"
              style={{
                background: "#16352A",
                borderRadius: "24px 24px 0 0",
                paddingBottom: "max(30px, env(safe-area-inset-bottom))",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle pill */}
              <div
                className="mx-auto mt-3.5 h-[5px] w-[42px] rounded-full"
                style={{ background: "rgba(242,238,230,.25)" }}
              />

              {/* Nav items */}
              <nav className="flex flex-col px-[22px] pt-4" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-center justify-between py-[15px]"
                    style={{ borderBottom: "1px solid rgba(242,238,230,.1)" }}
                  >
                    <span className="font-heading font-bold text-[16px] text-bone">
                      {link.label}
                    </span>
                    <ChevronRight className="h-[18px] w-[18px] shrink-0 stroke-gold" strokeWidth={2} />
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ── Search overlay ── */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              key="search-backdrop"
              className="fixed inset-0 z-[70]"
              style={{ background: "rgba(10,28,21,.65)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              key="search-panel"
              className="fixed inset-x-0 top-0 z-[71] px-4 pt-4 sm:px-6 lg:px-8"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 40, mass: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto max-w-2xl">
                <SearchInput products={products} onClose={() => setSearchOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
