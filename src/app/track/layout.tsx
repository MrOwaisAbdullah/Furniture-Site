import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Track your Yousuf Living furniture order in real time. Enter your order reference to see build progress, delivery status, and updates.",
  openGraph: {
    title: "Track Your Order — Yousuf Living",
    description:
      "Track your Yousuf Living furniture order in real time. Enter your order reference to see build progress.",
    url: "https://yousufliving.pk/track",
    type: "website",
  },
  alternates: {
    canonical: "https://yousufliving.pk/track",
  },
}

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
