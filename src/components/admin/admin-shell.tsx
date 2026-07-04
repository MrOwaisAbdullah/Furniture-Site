"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, Menu, X, MoreHorizontal } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"
import { adminNavItems, mobilePrimaryNavHrefs, OPERATIONS_LABEL, GROWTH_LABEL } from "@/lib/admin-nav"
import { crumbFor } from "@/lib/admin-nav-meta"
import { signOut } from "@/lib/auth-client"

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname.startsWith(href)
}

function SignOutButton({ className }: { className?: string }) {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={cn(
        "flex items-center gap-3 rounded-[9px] px-3.5 py-2.5 text-[13px] transition-colors",
        className
      )}
    >
      <LogOut className="h-4 w-4" strokeWidth={2} />
      Sign out
    </button>
  )
}

function NavGroup({ label, items, pathname }: { label: string; items: typeof adminNavItems; pathname: string }) {
  return (
    <>
      <div className="px-3 pb-2 pt-4 font-mono text-[9px] uppercase tracking-[2px] text-bone/35">{label}</div>
      <div className="flex flex-col gap-0.5">
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(pathname, href, exact)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 rounded-[9px] px-3.5 py-2.5 text-[13.5px] font-medium transition-colors",
                active ? "bg-gold/[.14] text-bone" : "text-bone/60 hover:bg-white/[.06] hover:text-bone"
              )}
            >
              <span
                className="absolute left-0 top-[9px] bottom-[9px] w-[3px] rounded-sm"
                style={{ background: active ? "#C9A24B" : "transparent" }}
              />
              <Icon className="h-4.5 w-4.5" strokeWidth={active ? 2.5 : 2} style={{ color: active ? "#C9A24B" : undefined }} />
              {label}
            </Link>
          )
        })}
      </div>
    </>
  )
}

function Sidebar() {
  const pathname = usePathname()
  const operations = adminNavItems.filter((i) => i.group === "operations")
  const growth = adminNavItems.filter((i) => i.group === "growth")

  return (
    <aside className="hidden lg:flex flex-col text-bone" style={{ minWidth: 248, background: "#12281F" }}>
      <div className="flex h-16 items-center px-5 border-b border-white/[.08]">
        <Logo variant="compact" on="forest" />
      </div>

      <nav className="scrollbar-dark flex-1 flex flex-col gap-0 overflow-y-auto p-3 pt-1">
        <NavGroup label={OPERATIONS_LABEL} items={operations} pathname={pathname} />
        <NavGroup label={GROWTH_LABEL} items={growth} pathname={pathname} />
      </nav>

      <div className="p-3 border-t border-white/[.08]">
        <SignOutButton className="w-full text-bone/50 hover:text-bone hover:bg-white/[.06]" />
      </div>
    </aside>
  )
}

function MoreDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const overflowItems = adminNavItems.filter((item) => !mobilePrimaryNavHrefs.includes(item.href))

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 rounded-t-[20px] bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-heading font-bold text-[15px] text-ink">More</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate hover:bg-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {overflowItems.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(pathname, href, exact)
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex min-h-[44px] items-center gap-3 rounded-[10px] px-3.5 text-[14px] font-medium",
                  active ? "bg-forest/10 text-forest" : "text-ink hover:bg-surface"
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            )
          })}
          <div className="mt-2 border-t border-border pt-2">
            <SignOutButton className="min-h-[44px] w-full text-error hover:bg-error/8" />
          </div>
        </nav>
      </div>
    </div>
  )
}

function MobileNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)
  const primaryItems = adminNavItems.filter((item) => mobilePrimaryNavHrefs.includes(item.href))

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex border-t border-border bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label="Admin navigation"
      >
        {primaryItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(pathname, href, exact)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 text-[10.5px] font-medium",
                active ? "text-forest" : "text-sage"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          )
        })}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className="flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 text-[10.5px] font-medium text-sage"
        >
          <MoreHorizontal className="h-5 w-5" strokeWidth={2} />
          More
        </button>
      </nav>
      <MoreDrawer open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  )
}

function Topbar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const current = [...adminNavItems].reverse().find((item) => isActive(pathname, item.href, item.exact))
  const crumb = crumbFor(current?.href)

  return (
    <header
      className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-border px-4 py-3 backdrop-blur-md lg:px-8 lg:py-4"
      style={{ background: "rgba(238,234,225,.9)" }}
    >
      <div className="flex items-center gap-2 lg:hidden">
        <Menu className="h-5 w-5 text-slate" />
        <span className="font-heading font-bold text-[15px] text-ink">
          {current?.label ?? "Admin"}
        </span>
      </div>
      <div className="hidden lg:block">
        <div className="font-mono text-[10px] uppercase tracking-[2px] text-gold-700">{crumb}</div>
        <h1 className="mt-0.5 font-heading font-black text-[25px] text-forest" style={{ letterSpacing: "-0.5px" }}>
          {current?.label ?? "Admin"}
        </h1>
      </div>
      <span className="font-mono text-[11px] text-sage">{userEmail}</span>
    </header>
  )
}

export function AdminShell({
  userEmail,
  children,
}: {
  userEmail: string
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#EEEAE1" }}>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar userEmail={userEmail} />
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">{children}</main>
      </div>
      <MobileNav />
    </div>
  )
}
