import type { Metadata } from "next"
import { ArrowRight, Building2, Users, TrendingUp, Handshake } from "lucide-react"
import { BreadcrumbJsonLd } from "@/components/seo/json-ld"
import { waLink } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Partner With Us",
  description:
    "Partner with Yousuf Living. Showcase your furniture in our Manzoor Colony showroom, reach Karachi homeowners, and grow your business.",
  openGraph: {
    title: "Partner With Yousuf Living — Grow Your Furniture Business",
    description:
      "Partner with Yousuf Living. Showcase your furniture in our showroom, reach Karachi homeowners, and grow your business.",
    url: "https://yousufliving.pk/partner",
    type: "website",
  },
  alternates: {
    canonical: "https://yousufliving.pk/partner",
  },
}

const benefits = [
  {
    icon: Building2,
    title: "Showcase in our showroom",
    description: "Your products displayed in our Manzoor Colony showroom with professional photography and styling.",
  },
  {
    icon: Users,
    title: "Access our customer base",
    description: "Reach thousands of Karachi homeowners actively looking for quality furniture.",
  },
  {
    icon: TrendingUp,
    title: "Grow your business",
    description: "Leverage our marketing, delivery, and customer service infrastructure.",
  },
  {
    icon: Handshake,
    title: "Flexible partnership models",
    description: "Consignment, wholesale, or exclusive collection — we work with what fits your business.",
  },
]

const steps = [
  {
    number: "01",
    title: "Get in touch",
    description: "Reach out via WhatsApp or our contact form with your business details.",
  },
  {
    number: "02",
    title: "Showroom visit",
    description: "We'll visit your workshop or invite you to our showroom to see the space.",
  },
  {
    number: "03",
    title: "Agreement",
    description: "We agree on terms, pricing, and display requirements.",
  },
  {
    number: "04",
    title: "Launch together",
    description: "Your products go live on our website and in our showroom.",
  },
]

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-surface">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Partner", url: "/partner" },
        ]}
      />
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#1c4233,#0a1c15)", minHeight: 200 }}
      >
        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-10 text-bone sm:px-8 sm:pt-14 lg:px-14">
          <p
            className="font-mono uppercase text-gold"
            style={{ fontSize: "10px", letterSpacing: "3px" }}
          >
            Partner with us
          </p>
          <h1
            className="mt-3 font-display leading-[1.05] text-bone"
            style={{ fontSize: "clamp(28px,6vw,44px)" }}
          >
            Grow your furniture business
            <br />
            <span className="italic text-gold">with Yousuf Living</span>
          </h1>
          <p className="mt-3 max-w-lg text-[13.5px] leading-[1.6] text-bone/65">
            We&apos;re looking for quality furniture makers to join our platform. Showroom space,
            online reach, and a trusted brand — all in one partnership.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        {/* Benefits */}
        <section>
          <h2 className="font-heading font-black text-ink" style={{ fontSize: "clamp(20px,4vw,28px)", letterSpacing: "-0.4px" }}>
            Why partner with us?
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="flex gap-4 rounded-[14px] border border-border bg-white p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest/8">
                  <benefit.icon className="h-5 w-5 text-forest" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[14px] text-ink">{benefit.title}</h3>
                  <p className="mt-1 text-[12.5px] leading-[1.55] text-slate">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-12">
          <h2 className="font-heading font-black text-ink" style={{ fontSize: "clamp(20px,4vw,28px)", letterSpacing: "-0.4px" }}>
            How it works
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-[14px] border border-border bg-white p-5"
              >
                <span className="font-mono text-[28px] font-bold text-gold/40">{step.number}</span>
                <h3 className="mt-2 font-heading font-bold text-[14px] text-ink">{step.title}</h3>
                <p className="mt-1 text-[12.5px] leading-[1.55] text-slate">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="mt-12 rounded-[16px] p-6 sm:p-8"
          style={{ background: "linear-gradient(150deg,#16352A,#0c231b)" }}
        >
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading font-black text-[20px] text-bone">
                Ready to get started?
              </h2>
              <p className="mt-1 text-[13px] text-bone/60">
                Send us a message on WhatsApp and we&apos;ll get back to you within 24 hours.
              </p>
            </div>
            <a
              href={waLink("Hi, I'm interested in becoming a partner with Yousuf Living.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[10px] shimmer-btn px-6 py-3 font-heading font-bold text-[14px] text-forest transition-all active:scale-[.97]"
            >
              Chat on WhatsApp <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
