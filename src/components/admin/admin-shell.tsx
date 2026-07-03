"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, Menu, X, MoreHorizontal } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"
import { adminNavItems, mobilePrimaryNavHrefs } from "@/lib/admin-nav"
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

function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col bg-forest text-bone" style={{ minWidth: 220 }}>
      <div className="flex h-16 items-center px-5 border-b border-white/10">
        <Logo variant="compact" on="forest" />
      </div>

      <nav className="flex-1 flex flex-col gap-1 p-3 pt-4">
        {adminNavItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(pathname, href, exact)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-[9px] px-3.5 py-2.5 text-[13.5px] font-medium transition-colors",
                active ? "bg-white/15 text-bone" : "text-bone/60 hover:bg-white/8 hover:text-bone"
              )}
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <SignOutButton className="w-full text-bone/50 hover:text-bone hover:bg-white/8" />
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

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-white px-4 lg:h-16 lg:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <Menu className="h-5 w-5 text-slate" />
        <span className="font-heading font-bold text-[15px] text-ink">
          {current?.label ?? "Admin"}
        </span>
      </div>
      <h1 className="hidden font-heading font-bold text-[17px] text-ink lg:block">
        {current?.label ?? "Admin"}
      </h1>
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
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar userEmail={userEmail} />
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">{children}</main>
      </div>
      <MobileNav />
    </div>
  )
}
