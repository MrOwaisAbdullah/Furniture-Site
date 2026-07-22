"use client"

import { useRouter } from "next/navigation"
import { SetBundlePicker } from "@/components/product/set-bundle-picker"
import { useCartStore } from "@/lib/store"
import { useToast } from "@/components/ui/toast"
import { trackEvent } from "@/lib/track-event"
import type { Product } from "@/types"

export function SetPageClient({ setName, pieces, pool }: { setName: string; pieces: Product[]; pool: Product[] }) {
  const addItem = useCartStore((s) => s.addItem)
  const { toast } = useToast()
  const router = useRouter()

  function handleAddSelected(selected: Product[]) {
    for (const piece of selected) {
      addItem({
        productId: piece._id,
        name: piece.name,
        price: piece.salePrice ?? piece.basePrice,
        variantId: piece.variants[0]?._id,
        finishId: piece.finishes[0]?._id,
        finishName: piece.finishes[0]?.name,
      })
    }
    trackEvent("set_bundle_added", { setName, pieceCount: selected.length })
    toast(`${selected.length} piece${selected.length !== 1 ? "s" : ""} added to cart`, "success")
    router.push("/checkout")
  }

  return (
    <SetBundlePicker mode="browse" pieces={pieces} pool={pool} onAddSelected={handleAddSelected} />
  )
}
