import Link from "next/link"
import { PackageSearch } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { waLink } from "@/lib/site-config"

interface OrderEmptyStateProps {
  orderRef?: string
}

export function OrderEmptyState({ orderRef }: OrderEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage/12">
        <PackageSearch className="h-7 w-7 stroke-sage/70" strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-heading font-bold text-[18px] text-ink">Order not found</p>
        {orderRef ? (
          <p className="mt-1.5 max-w-xs text-[13px] leading-[1.55] text-slate">
            We couldn&apos;t find an order for <span className="font-mono text-ink">{orderRef}</span>. Check the reference on your WhatsApp confirmation.
          </p>
        ) : (
          <p className="mt-1.5 max-w-xs text-[13px] leading-[1.55] text-slate">
            Enter your order reference number from your WhatsApp confirmation message.
          </p>
        )}
      </div>
      <a
        href={waLink("Hi, I need help tracking my order")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-flex items-center gap-2 rounded-[11px] bg-forest px-6 py-3 font-heading font-bold text-[14px] text-bone transition-transform active:scale-[.97]"
      >
        <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
        WhatsApp us
      </a>
      <Link href="/shop" className="text-[12.5px] font-medium text-gold-700">
        Browse the shop
      </Link>
    </div>
  )
}
