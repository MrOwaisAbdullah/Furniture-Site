import type { Metadata } from "next"
import { headers } from "next/headers"
import { Instrument_Serif, Archivo, Hanken_Grotesk, Space_Mono } from "next/font/google"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileStickyBar } from "@/components/layout/mobile-sticky-bar"
import { CookieConsent } from "@/components/ui/cookie-consent"
import { TrackingScripts } from "@/components/ui/tracking-scripts"
import { ToastProvider } from "@/components/ui/toast"
import { BUSINESS_NAME, ADDRESS_CITY } from "@/lib/site-config"
import { PromoPopup } from "@/components/ui/promo-popup"
import { getProducts, getActivePopup } from "@/lib/sanity/queries"
import "./globals.css"

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const archivo = Archivo({
  weight: ["400", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: `${BUSINESS_NAME} — Workshop-built Furniture in ${ADDRESS_CITY}`,
    template: `%s | ${BUSINESS_NAME}`,
  },
  description:
    `Workshop-built bedroom sets, fairly priced. Beds, wardrobes, dressing tables and complete sets — made to order in ${ADDRESS_CITY}.`,
  keywords: ["furniture", "Karachi", "Pakistani furniture", "bedroom sets", "workshop furniture", "shaadi furniture"],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/assets/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/assets/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: BUSINESS_NAME,
  },
  other: {
    "theme-color": "#16352A",
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: BUSINESS_NAME,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = (await headers()).get("x-pathname") ?? ""
  const isAdmin = pathname.startsWith("/admin")
  const [products, popup] = isAdmin
    ? [[], null]
    : await Promise.all([getProducts(), getActivePopup()])

  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${archivo.variable} ${hankenGrotesk.variable} ${spaceMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-body antialiased">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] rounded-lg bg-forest px-4 py-2 font-heading text-sm font-bold text-bone shadow-lg -translate-y-full opacity-0 focus:translate-y-0 focus:opacity-100 transition-all duration-200"
        >
          Skip to content
        </a>
        {!isAdmin && <Header products={products} />}
        <main id="main-content" className={isAdmin ? "flex-1" : "flex-1 pb-20 lg:pb-0"} tabIndex={-1}>
          <ToastProvider>{children}</ToastProvider>
        </main>
        {!isAdmin && <Footer />}
        {!isAdmin && <MobileStickyBar />}
        {!isAdmin && <CookieConsent />}
        {!isAdmin && popup && <PromoPopup popup={popup} />}
        {!isAdmin && <TrackingScripts />}
      </body>
    </html>
  )
}
