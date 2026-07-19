import type { Metadata } from "next"
import { MapPin, Clock, Phone, Star } from "lucide-react"
import { BreadcrumbJsonLd } from "@/components/seo/json-ld"
import { ADDRESS_FULL, PHONE_DISPLAY, waLink } from "@/lib/site-config"

const GOOGLE_BUSINESS_URL = "https://share.google/FeCcJzHRq3EEv8ICn"
const MAPS_EMBED_URL = "https://maps.google.com/maps?q=Yousuf+Living+Manzoor+Colony+Karachi&t=&z=15&ie=UTF8&iwloc=&output=embed"

export const metadata: Metadata = {
  title: "Showroom — Visit Us",
  description:
    "Visit the Yousuf Living showroom in Manzoor Colony, Karachi. See bedroom sets, beds, wardrobes, and dressing tables on display. Mon–Sat 10am–9pm.",
  openGraph: {
    title: "Yousuf Living Showroom — Manzoor Colony, Karachi",
    description:
      "Visit the Yousuf Living showroom in Manzoor Colony, Karachi. See bedroom sets on display. Mon–Sat 10am–9pm.",
    url: "https://yousufliving.pk/showroom",
    type: "website",
  },
  alternates: {
    canonical: "https://yousufliving.pk/showroom",
  },
}

const details = [
  {
    icon: MapPin,
    label: "Address",
    value: ADDRESS_FULL,
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon – Sat · 10am – 9pm",
  },
  {
    icon: Phone,
    label: "Phone",
    value: PHONE_DISPLAY,
    mono: true,
  },
]

export default function ShowroomPage() {
  return (
    <div className="min-h-screen bg-surface">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Showroom", url: "/showroom" },
        ]}
      />
      {/* Google Maps embed */}
      <div className="relative h-44 sm:h-60 lg:h-72">
        <iframe
          src={MAPS_EMBED_URL}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Yousuf Living showroom location on Google Maps"
          className="absolute inset-0"
        />
      </div>

      <div className="mx-auto max-w-2xl px-5 py-8 sm:px-8">
        <h1
          className="font-heading font-black text-ink"
          style={{ fontSize: "26px", letterSpacing: "-0.6px" }}
        >
          Visit us
        </h1>

        <div className="mt-5 flex flex-col gap-4">
          {details.map(({ icon: Icon, label, value, mono }) => (
            <div key={label} className="flex gap-3.5">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 stroke-forest" strokeWidth={2} />
              <div>
                <p className="font-heading font-bold text-[14px] text-ink">{label}</p>
                <p className={`mt-0.5 text-[13px] leading-[1.5] text-slate ${mono ? "font-mono" : ""}`}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Google Review CTA */}
        <a
          href={GOOGLE_BUSINESS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex items-center justify-center gap-2 rounded-[11px] border border-gold/40 bg-gold/10 py-3.5 font-heading font-bold text-[14.5px] text-forest transition-all hover:bg-gold/20 active:scale-[.98]"
        >
          <Star className="h-4 w-4 fill-gold text-gold" />
          Leave us a Google review
        </a>

        <a
          href={waLink("Hi, I'd like to book a showroom visit.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex items-center justify-center gap-2 rounded-[11px] bg-forest py-3.5 font-heading font-bold text-[14.5px] text-bone"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          Book a visit on WhatsApp
        </a>
      </div>
    </div>
  )
}
