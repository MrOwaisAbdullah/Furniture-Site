import {
  BUSINESS_NAME, ADDRESS_STREET, ADDRESS_CITY, ADDRESS_REGION, ADDRESS_POSTAL_CODE,
  ADDRESS_COUNTRY, PHONE_STRUCTURED, SHOWROOM_LAT, SHOWROOM_LNG, SOCIAL_INSTAGRAM, waLink,
} from "@/lib/site-config"

const BASE_URL = "https://yousufliving.pk"

interface JsonLdProps {
  data: object
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: BUSINESS_NAME,
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        description: "Workshop-built bedroom sets, fairly priced. Beds, wardrobes, dressing tables and complete sets — made to order in Karachi.",
        address: {
          "@type": "PostalAddress",
          streetAddress: ADDRESS_STREET,
          addressLocality: ADDRESS_CITY,
          addressCountry: ADDRESS_COUNTRY,
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: PHONE_STRUCTURED,
          contactType: "customer service",
          availableLanguage: ["English", "Urdu"],
        },
        sameAs: [
          SOCIAL_INSTAGRAM,
          waLink(),
        ],
      }}
    />
  )
}

export function LocalBusinessJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: `${BUSINESS_NAME} Showroom`,
        image: `${BASE_URL}/showroom.jpg`,
        url: BASE_URL,
        telephone: PHONE_STRUCTURED,
        address: {
          "@type": "PostalAddress",
          streetAddress: ADDRESS_STREET,
          addressLocality: ADDRESS_CITY,
          addressRegion: ADDRESS_REGION,
          postalCode: ADDRESS_POSTAL_CODE,
          addressCountry: ADDRESS_COUNTRY,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: SHOWROOM_LAT,
          longitude: SHOWROOM_LNG,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "10:00",
            closes: "23:00",
          },
        ],
        priceRange: "$$",
      }}
    />
  )
}

interface ProductJsonLdProps {
  name: string
  description: string
  image: string
  price: number
  currency?: string
  availability?: string
  sku?: string
  brand?: string
  /** Real approved-review data — only pass when the product genuinely has reviews. */
  rating?: number
  reviewCount?: number
  /** Absolute URL of the product page. */
  url?: string
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  currency = "PKR",
  availability = "https://schema.org/InStock",
  sku,
  brand = BUSINESS_NAME,
  rating,
  reviewCount,
  url,
}: ProductJsonLdProps) {
  const offerUrl = url ?? `${BASE_URL}/shop`
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    sku,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    offers: {
      "@type": "Offer",
      url: offerUrl,
      priceCurrency: currency,
      price: price,
      availability: availability,
      itemCondition: "https://schema.org/NewCondition",
      // Merchant listings: return policy + shipping details (Google requires
      // these on the Offer for merchant listing eligibility)
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "PK",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "PK",
        },
        // Charges depend on location and the items ordered (furniture is
        // heavy) — Rs 3,000 is the starting rate, quoted per order on
        // WhatsApp. Only the minimum is exposed to Google.
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 3000,
          currency: "PKR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 14,
            maxValue: 21,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
      },
    },
  }

  // Real aggregate rating + review only when the product genuinely has
  // approved reviews — never a fabricated/default number (Google policy).
  if (typeof rating === "number" && typeof reviewCount === "number" && reviewCount > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Math.round(rating * 10) / 10,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return <JsonLd data={data} />
}

interface BreadcrumbJsonLdProps {
  items: Array<{ name: string; url: string }>
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${BASE_URL}${item.url}`,
        })),
      }}
    />
  )
}

interface BlogPostingJsonLdProps {
  title: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author: string
  url: string
}

export function BlogPostingJsonLd({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url,
}: BlogPostingJsonLdProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        image,
        datePublished,
        dateModified: dateModified || datePublished,
        author: {
          "@type": "Person",
          name: author,
        },
        publisher: {
          "@type": "Organization",
          name: BUSINESS_NAME,
          logo: {
            "@type": "ImageObject",
            url: `${BASE_URL}/logo.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${BASE_URL}${url}`,
        },
      }}
    />
  )
}

interface FAQJsonLdProps {
  items: { question: string; answer: string }[]
}

export function FAQJsonLd({ items }: FAQJsonLdProps) {
  if (items.length === 0) return null
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  )
}

interface ItemListJsonLdProps {
  items: Array<{
    name: string
    url: string
    position: number
  }>
}

export function ItemListJsonLd({ items }: ItemListJsonLdProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: items.map((item) => ({
          "@type": "ListItem",
          position: item.position,
          name: item.name,
          url: `${BASE_URL}${item.url}`,
        })),
      }}
    />
  )
}
