const STORAGE_KEY = "yl_wishlist"

export interface WishlistItem {
  productId: string
  name: string
  slug: string
  price: number
  finishName?: string
  categorySlug?: string
}

type Listener = () => void
const listeners = new Set<Listener>()

function emitChange() {
  for (const listener of listeners) listener()
}

let cached: WishlistItem[] = []
let lastRaw: string | null = null

function read(): WishlistItem[] {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === lastRaw) return cached
  lastRaw = raw
  try {
    cached = JSON.parse(raw ?? "[]") as WishlistItem[]
  } catch {
    cached = []
  }
  return cached
}

function write(items: WishlistItem[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  emitChange()
}

export const wishlistClient = {
  subscribe(callback: Listener): () => void {
    listeners.add(callback)
    return () => listeners.delete(callback)
  },

  getAll(): WishlistItem[] {
    return read()
  },

  has(productId: string): boolean {
    return read().some((i) => i.productId === productId)
  },

  add(item: WishlistItem): void {
    const items = read()
    if (!items.some((i) => i.productId === item.productId)) {
      write([...items, item])
    }
  },

  remove(productId: string): void {
    write(read().filter((i) => i.productId !== productId))
  },

  toggle(item: WishlistItem): boolean {
    if (this.has(item.productId)) {
      this.remove(item.productId)
      return false
    }
    this.add(item)
    return true
  },

  clear(): void {
    write([])
  },
}
