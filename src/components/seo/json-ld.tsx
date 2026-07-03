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
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "10:00",
            closes: "21:00",
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
}: ProductJsonLdProps) {
  return (
    <JsonLd
      data={{
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
          url: BASE_URL,
          priceCurrency: currency,
          price: price,
          availability: availability,
          itemCondition: "https://schema.org/NewCondition",
        },
      }}
    />
  )
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
