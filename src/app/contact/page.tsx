"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaWhatsapp } from "react-icons/fa"
import { Send, Phone, MapPin, Clock } from "lucide-react"
import { LocalBusinessJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld"
import { ADDRESS_FULL, PHONE_DISPLAY, PHONE_TEL, waLink } from "@/lib/site-config"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")

  const waHref = waLink(
    `Hi, I have an enquiry.\n\nName: ${name || "[your name]"}\nMessage: ${message || "[your message]"}`
  )

  return (
    <div className="min-h-screen bg-surface">
      <LocalBusinessJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ]}
      />
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#1c4233,#0a1c15)", minHeight: 160 }}
      >
        <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-10 text-bone sm:px-8 sm:pt-14 lg:px-14">
          <p
            className="font-mono uppercase text-gold"
            style={{ fontSize: "10px", letterSpacing: "3px" }}
          >
            Get in touch
          </p>
          <h1
            className="mt-3 font-display leading-[1.05] text-bone"
            style={{ fontSize: "clamp(28px,5vw,40px)" }}
          >
            Contact us
          </h1>
          <p className="mt-2 text-[13.5px] text-bone/60">
            Questions about our furniture? We&apos;re here to help.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Contact info */}
          <div className="lg:col-span-2">
            {/* WhatsApp card */}
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-[14px] p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(22,53,42,.2)]"
              style={{ background: "linear-gradient(135deg,#16352A,#0c231b)" }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/15">
                <FaWhatsapp className="h-[22px] w-[22px] text-gold" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="font-heading font-bold text-[15px] text-bone">Chat on WhatsApp</p>
                <p className="mt-0.5 text-[12px] text-bone/60">Usually replies within 1 hour</p>
              </div>
            </a>

            {/* Info cards */}
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 rounded-[12px] border border-border bg-white p-4">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                <div>
                  <p className="font-heading font-bold text-[13px] text-ink">Showroom</p>
                  <p className="mt-0.5 text-[12px] text-slate">{ADDRESS_FULL}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-[12px] border border-border bg-white p-4">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                <div>
                  <p className="font-heading font-bold text-[13px] text-ink">Hours</p>
                  <p className="mt-0.5 text-[12px] text-slate">Mon–Sat: 10 AM – 9 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-[12px] border border-border bg-white p-4">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                <div>
                  <p className="font-heading font-bold text-[13px] text-ink">Phone</p>
                  <a href={`tel:${PHONE_TEL}`} className="mt-0.5 text-[12px] text-slate hover:text-forest hover:underline">
                    {PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-[16px] border border-border bg-white p-6"
            >
              <h2 className="font-heading font-black text-ink" style={{ fontSize: "clamp(18px,3vw,22px)", letterSpacing: "-0.4px" }}>
                Send an enquiry
              </h2>
              <p className="mt-1 text-[13px] text-slate">
                Fill this in and we&apos;ll WhatsApp you back.
              </p>

              <div className="mt-5 flex flex-col gap-4">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block font-heading font-bold text-[12.5px] text-ink">
                    Your name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ahmed Khan"
                    className="w-full rounded-[10px] border border-border-strong bg-surface px-3.5 py-3.5 text-[13.5px] text-ink placeholder:text-sage/60 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest/20"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="mb-1.5 block font-heading font-bold text-[12.5px] text-ink">
                    WhatsApp number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 3XX XXXXXXX"
                    className="w-full rounded-[10px] border border-border-strong bg-surface px-3.5 py-3.5 font-mono text-[13.5px] text-ink placeholder:text-sage/60 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest/20"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-1.5 block font-heading font-bold text-[12.5px] text-ink">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="I'm looking for a bedroom set for a 12×10 room…"
                    rows={4}
                    className="w-full rounded-[10px] border border-border-strong bg-surface px-3.5 py-3.5 text-[13.5px] leading-[1.55] text-ink placeholder:text-sage/60 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest/20"
                  />
                </div>

                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-[11px] bg-forest py-3.5 font-heading font-bold text-[14.5px] text-bone transition-all hover:bg-forest/90 active:scale-[.99]"
                >
                  <Send className="h-4 w-4" />
                  Send via WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
