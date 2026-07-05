const STORAGE_KEY = "yl_recently_viewed"
const MAX_ITEMS = 8

export interface RecentlyViewedItem {
  productId: string
  name: string
  slug: string
  price: number
  image?: string
}

function read(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as RecentlyViewedItem[]
  } catch {
    return []
  }
}

function write(items: RecentlyViewedItem[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const recentlyViewedClient = {
  /** Most-recent first, optionally excluding the product currently being viewed. */
  getAll(excludeProductId?: string): RecentlyViewedItem[] {
    const items = read()
    return excludeProductId ? items.filter((i) => i.productId !== excludeProductId) : items
  },

  add(item: RecentlyViewedItem): void {
    const items = read().filter((i) => i.productId !== item.productId)
    items.unshift(item)
    write(items.slice(0, MAX_ITEMS))
  },
}
