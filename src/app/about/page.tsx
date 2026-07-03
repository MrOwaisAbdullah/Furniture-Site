import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MapPin, Clock, Phone } from "lucide-react"
import { BreadcrumbJsonLd } from "@/components/seo/json-ld"
import { ADDRESS_FULL, PHONE_DISPLAY, waLink } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Three generations of furniture craftsmanship in Karachi. Learn about Yousuf Living — workshop-built bedroom sets, honest materials, fair pricing.",
  openGraph: {
    title: "About Yousuf Living — Three Generations of Craft",
    description:
      "Three generations of furniture craftsmanship in Karachi. Workshop-built bedroom sets with honest materials and fair pricing.",
    url: "https://yousufliving.pk/about",
    type: "website",
  },
  alternates: {
    canonical: "https://yousufliving.pk/about",
  },
}

const ABOUT_HERO = "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1400&q=80"

const stats = [
  { value: "47", label: "Sets delivered" },
  { value: "4.9", label: "Google rating" },
  { value: "3", label: "Generations of craft" },
  { value: "10+", label: "Years experience" },
]

const values = [
  {
    title: "Honest materials",
    body: "We tell you exactly what your furniture is made of — 16mm Lasani MDF, hand-applied deco polish, solid sheesham. No vague 'engineered wood' or misleading claims.",
  },
  {
    title: "Workshop-direct",
    body: "No middleman, no retail markup. We build in our Karachi workshop and sell directly to you. That means better quality at 30% less than retail.",
  },
  {
    title: "Made to your size",
    body: "Every piece is built to your exact dimensions. Awkward room? Unusual wall? We measure, design, and build to fit — at no extra charge.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ]}
      />
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: 280 }}>
        <Image
          src={ABOUT_HERO}
          alt="Yousuf Living workshop — three generations of furniture craftsmanship in Karachi"
          fill
          className="object-cover"
          sizes="100vw"
          priority
          unoptimized
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg,rgba(10,28,21,.92) 0%,rgba(22,53,42,.80) 60%,rgba(22,53,42,.55) 100%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-10 text-bone sm:px-8 sm:pt-16 lg:px-14">
          <p
            className="font-mono uppercase text-gold"
            style={{ fontSize: "10px", letterSpacing: "3px" }}
          >
            Our story
          </p>
          <h1
            className="mt-3 font-display leading-[1]"
            style={{ fontSize: "clamp(32px,7vw,56px)" }}
          >
            Three generations
            <br />
            <span className="italic text-gold">of craft.</span>
          </h1>
          <p className="mt-4 max-w-lg text-[14.5px] leading-[1.65] text-bone/70">
            From a small workshop in Karachi to a showroom you can visit — we&apos;ve been building honest furniture for over a decade.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-14">
        {/* Story */}
        <div className="max-w-3xl">
          <h2 className="font-heading font-black text-ink" style={{ fontSize: "clamp(20px,3vw,26px)", letterSpacing: "-0.5px" }}>
            How we started
          </h2>
          <div className="mt-4 space-y-4 text-[14.5px] leading-[1.65] text-slate">
            <p>
              Yousuf Living began as a workshop in Karachi, building bedroom furniture for families who
              wanted honest quality at a fair price. We still build the same way — just with a showroom
              you can visit and a WhatsApp you can message.
            </p>
            <p>
              We work in 16mm Lasani MDF with hand-applied deco polish. We tell you exactly what your
              furniture is made of, what it costs, and when it&apos;ll be ready. No inflated
              &ldquo;solid wood&rdquo; claims — just well-built pieces, made to your size.
            </p>
            <p>
              Every set that leaves our workshop is built to the customer&apos;s exact dimensions.
              We measure, we design, we build — and then we deliver and install it ourselves.
              That&apos;s how we keep quality high and prices honest.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-[13px] border border-border bg-white p-4 text-center">
              <p
                className="font-heading font-black text-forest"
                style={{ fontSize: "28px" }}
              >
                {s.value}
              </p>
              <p className="mt-1 text-[11.5px] text-slate">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mt-12">
          <h2 className="font-heading font-black text-ink" style={{ fontSize: "clamp(20px,3vw,26px)", letterSpacing: "-0.5px" }}>
            What we believe
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="rounded-[14px] border border-border bg-white p-5">
                <h3 className="font-heading font-bold text-ink" style={{ fontSize: "15px" }}>
                  {v.title}
                </h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-slate">{v.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Showroom CTA */}
        <div
          id="sustainability"
          className="mt-12 overflow-hidden rounded-[18px]"
          style={{ background: "linear-gradient(150deg,#16352A,#0c231b)" }}
        >
          <div className="flex flex-col gap-6 px-6 py-8 text-bone sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:gap-10">
            <div className="flex-1">
              <p className="font-mono text-[9.5px] uppercase tracking-[2.5px] text-gold/60">
                Visit us
              </p>
              <h2 className="mt-2 font-heading font-black text-bone" style={{ fontSize: "clamp(20px,3vw,28px)", letterSpacing: "-0.5px" }}>
                See it before you buy it.
              </h2>
              <p className="mt-3 text-[13.5px] leading-[1.7] text-bone/60 max-w-md">
                Every finish, every size — all bedroom sets on display at our Manzoor Colony showroom.
              </p>
              <div className="mt-4 flex flex-col gap-2 text-[12.5px] text-bone/60">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gold/50" />
                  <span>{ADDRESS_FULL}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-gold/50" />
                  <span>Mon–Sat · 10 am – 9 pm</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-gold/50" />
                  <span>{PHONE_DISPLAY}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/showroom"
                className="inline-flex items-center gap-2 rounded-[10px] bg-gold px-6 py-3 font-heading font-bold text-[13.5px] text-forest transition-all hover:bg-gold/88 hover:-translate-y-0.5 active:scale-[.98]"
              >
                Plan a visit <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={waLink("Hi, I'd like to visit your showroom.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[10px] border border-bone/20 px-6 py-3 font-heading font-bold text-[13.5px] text-bone/70 transition-all hover:border-bone/35 hover:text-bone"
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
