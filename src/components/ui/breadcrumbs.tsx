import Link from "next/link"
import { ChevronRight } from "lucide-react"

export interface BreadcrumbItem {
  name: string
  href?: string
}

/** Visual breadcrumb trail. Pair with BreadcrumbJsonLd for the matching
 * structured-data version — this component is purely presentational. */
export function Breadcrumbs({ items, className = "" }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.5px]">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.name} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="opacity-70 transition-opacity hover:opacity-100">
                  {item.name}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "opacity-100" : "opacity-70"}>
                  {item.name}
                </span>
              )}
              {!isLast && <ChevronRight className="h-3 w-3 opacity-40" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
