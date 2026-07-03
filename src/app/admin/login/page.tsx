"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Logo } from "@/components/ui/logo"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { signIn } from "@/lib/auth-client"
import { EMAIL_ADMIN } from "@/lib/site-config"

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") ?? "/admin"

  const [show, setShow] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await signIn.email({ email, password })

    if (result.error) {
      setError(result.error.message ?? "Invalid email or password")
      setLoading(false)
      return
    }

    // BetterAuth sign-in succeeded, but this admin panel is restricted to a
    // single owner email — verify server-side before trusting the session.
    const check = await fetch("/api/admin/session-check")
    if (!check.ok) {
      setError("This account isn't authorized for admin access.")
      setLoading(false)
      return
    }

    router.push(next)
    router.refresh()
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(160deg,#1c4233,#0a1c15)" }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo variant="stacked" on="forest" />
        </div>

        <form onSubmit={handleSubmit} className="rounded-[18px] bg-white p-6 shadow-lg">
          <h1
            className="font-heading font-black text-ink"
            style={{ fontSize: "22px", letterSpacing: "-0.4px" }}
          >
            Admin sign in
          </h1>
          <p className="mt-1 text-[12.5px] text-slate">Yousuf Living back-office</p>

          <div className="mt-6 flex flex-col gap-4">
            {error && (
              <div className="rounded-[10px] bg-error/10 px-3.5 py-2.5 text-[12.5px] text-error">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block font-body font-semibold text-[12.5px] text-slate">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={EMAIL_ADMIN}
                autoComplete="email"
                className="w-full rounded-[10px] border border-border-strong bg-surface px-3.5 py-3.5 text-[13.5px] text-ink placeholder:text-sage/60 focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block font-body font-semibold text-[12.5px] text-slate">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-[10px] border border-border-strong bg-surface px-3.5 py-3.5 pr-11 text-[13.5px] text-ink placeholder:text-sage/60 focus:border-forest focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sage hover:text-slate"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 rounded-[11px] bg-forest py-3.5 font-heading font-bold text-[14.5px] text-bone transition-transform active:scale-[.99] disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-5 text-center font-mono text-[10px] text-bone/30">
          Yousuf Living · Karachi
        </p>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  )
}
