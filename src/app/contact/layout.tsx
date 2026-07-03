import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Yousuf Living. WhatsApp us for furniture enquiries, visit our Manzoor Colony showroom in Karachi, or send a message online.",
  openGraph: {
    title: "Contact Yousuf Living — Furniture Enquiries",
    description:
      "Get in touch with Yousuf Living. WhatsApp, call, or visit our Manzoor Colony showroom in Karachi.",
    url: "https://yousufliving.pk/contact",
    type: "website",
  },
  alternates: {
    canonical: "https://yousufliving.pk/contact",
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
