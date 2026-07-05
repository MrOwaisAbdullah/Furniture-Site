"use client"

import Link from "next/link"
import { useState } from "react"
import { MapPin, Phone, Clock, Loader2, CheckCircle } from "lucide-react"
import { FaWhatsapp, FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa"
import { Logo } from "@/components/ui/logo"
import {
  ADDRESS_STREET, ADDRESS_CITY, PHONE_DISPLAY, PHONE_TEL, BUSINESS_NAME,
  SOCIAL_INSTAGRAM, SOCIAL_FACEBOOK, SOCIAL_TIKTOK, waLink,
} from "@/lib/site-config"

const shopLinks = [
  { label: "All Products",     href: "/shop" },
  { label: "Bedroom Sets",     href: "/shop?category=bedroom-sets" },
  { label: "Beds",             href: "/shop?category=beds" },
  { label: "Wardrobes",        href: "/shop?category=wardrobes" },
  { label: "Dressing Tables",  href: "/shop?category=dressing-tables" },
  { label: "Side Tables",      href: "/shop?category=side-tables" },
]

const companyLinks = [
  { label: "About Us",         href: "/about" },
  { label: "Blog",             href: "/blog" },
  { label: "Become a Partner", href: "/affiliate" },
  { label: "Track Order",      href: "/track" },
  { label: "Showroom",         href: "/showroom" },
]

const helpLinks = [
  { label: "How it Works",     href: "/#how-it-works" },
  { label: "FAQ",              href: "/faq" },
  { label: "Shipping",         href: "/shipping" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Privacy Policy",   href: "/privacy" },
  { label: "Terms",            href: "/terms" },
]

const socials = [
  {
    label: "WhatsApp",
    href: waLink(),
    icon: FaWhatsapp,
  },
  {
    label: "Instagram",
    href: SOCIAL_INSTAGRAM,
    icon: FaInstagram,
  },
  {
    label: "Facebook",
    href: SOCIAL_FACEBOOK,
    icon: FaFacebook,
  },
  {
    label: "TikTok",
    href: SOCIAL_TIKTOK,
    icon: FaTiktok,
  },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [subscribing, setSubscribing] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email || subscribing) return
    setSubscribing(true)
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      setSubscribed(true)
      setEmail("")
    } catch {
      // Silently fail
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <footer style={{ background: "#0c1f17" }} className="text-bone pb-36 lg:pb-0">
      <div className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 lg:px-14">

        {/* ── Newsletter — full-width row above the link columns ── */}
        <div className="flex flex-col items-start justify-between gap-5 border-b border-bone/10 pb-10 lg:flex-row lg:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-gold">Stay in the loop</p>
            <p className="mt-2 text-[13px] text-bone/45">
              New collections, sales, and workshop stories. No spam.
            </p>
          </div>
          {subscribed ? (
            <div className="flex items-center gap-2 text-[13px] text-success">
              <CheckCircle className="h-4 w-4" />
              You are subscribed!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="min-w-0 flex-1 rounded-[9px] border border-bone/15 bg-white/5 px-4 py-3 text-[13px] text-bone placeholder:text-bone/30 focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                disabled={subscribing || !email}
                className="shrink-0 rounded-[9px] bg-gold px-5 py-3 font-heading font-bold text-[12.5px] text-forest transition-colors hover:bg-gold/90 disabled:opacity-50"
              >
                {subscribing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Join"}
              </button>
            </form>
          )}
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 gap-10 pt-10 md:grid-cols-[1fr_auto] lg:gap-16">

          {/* Brand column */}
          <div className="max-w-[280px]">
            {/* Logo — on="forest" renders bone wordmark + gold accent, correct for dark bg */}
            <Logo variant="compact" on="forest" />

            <p className="mt-4 text-[13.5px] leading-[1.7] text-bone/55">
              Workshop-built bedroom furniture, fairly priced. Built in Karachi, delivered across the city.
            </p>

            {/* Socials */}
            <div className="mt-6 flex gap-2.5">
              {socials.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-bone/15 text-bone/50 transition-all hover:border-gold/40 hover:text-gold"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-10">

            {/* Shop */}
            <div>
              <h3 className="font-heading text-[10.5px] font-bold uppercase tracking-[2px] text-gold">
                Shop
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {shopLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[13px] text-bone/55 transition-colors hover:text-bone">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-heading text-[10.5px] font-bold uppercase tracking-[2px] text-gold">
                Company
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {companyLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[13px] text-bone/55 transition-colors hover:text-bone">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h3 className="font-heading text-[10.5px] font-bold uppercase tracking-[2px] text-gold">
                Help
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {helpLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[13px] text-bone/55 transition-colors hover:text-bone">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-heading text-[10.5px] font-bold uppercase tracking-[2px] text-gold">
                Contact
              </h3>
              <ul className="mt-4 flex flex-col gap-4">
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/60" strokeWidth={1.75} />
                  <span className="text-[12.5px] leading-[1.55] text-bone/55">
                    {ADDRESS_STREET},<br />{ADDRESS_CITY}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-gold/60" strokeWidth={1.75} />
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="font-mono text-[12.5px] text-bone/55 transition-colors hover:text-bone"
                  >
                    {PHONE_DISPLAY}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-gold/60" strokeWidth={1.75} />
                  <span className="text-[12.5px] text-bone/55">Mon–Sat · 10am–9pm</span>
                </li>
                <li>
                  <a
                    href={waLink("Hi, I'd like to enquire about your furniture.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-2 rounded-[9px] bg-[#25D366]/15 px-3.5 py-2 font-heading font-bold text-[12px] text-[#25D366] transition-colors hover:bg-[#25D366]/25"
                  >
                    <FaWhatsapp className="h-3.5 w-3.5" aria-hidden="true" />
                    Chat with us
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-bone/10 pb-6 pt-6 text-[11px] text-bone/30 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {BUSINESS_NAME} · {ADDRESS_CITY}</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-bone/60">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-bone/60">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
