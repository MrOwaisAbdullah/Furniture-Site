"use client"

import { create } from "zustand"

export interface CartItem {
  productId: string
  variantId?: string
  finishId?: string
  name: string
  price: number
  quantity: number
  image?: string
  finishName?: string
}

interface CartState {
  items: CartItem[]
  totalQuantity: number
  totalPrice: number
  addItem: (item: Omit<CartItem, "quantity">) => void
  updateQuantity: (
    productId: string,
    variantId?: string,
    finishId?: string,
    quantity?: number
  ) => void
  removeItem: (productId: string, variantId?: string, finishId?: string) => void
  clearCart: () => void
}

function getCartKey(productId: string, variantId?: string, finishId?: string) {
  return `${productId}-${variantId ?? ""}-${finishId ?? ""}`
}

function recalculateTotals(items: CartItem[]) {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return { totalQuantity, totalPrice }
}

export const useCartStore = create<CartState>((set: (partial: Partial<CartState> | ((state: CartState) => Partial<CartState>)) => void) => ({
  items: [],
  totalQuantity: 0,
  totalPrice: 0,

  addItem: (item: Omit<CartItem, "quantity">) =>
    set((state: CartState) => {
      const key = getCartKey(item.productId, item.variantId, item.finishId)
      const existing = state.items.find(
        (i: CartItem) => getCartKey(i.productId, i.variantId, i.finishId) === key
      )

      let newItems: CartItem[]
      if (existing) {
        newItems = state.items.map((i: CartItem) =>
          getCartKey(i.productId, i.variantId, i.finishId) === key
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      } else {
        newItems = [...state.items, { ...item, quantity: 1 }]
      }

      return { ...recalculateTotals(newItems), items: newItems }
    }),

  updateQuantity: (productId: string, variantId?: string, finishId?: string, quantity: number = 1) =>
    set((state: CartState) => {
      const key = getCartKey(productId, variantId, finishId)
      const newItems = state.items
        .map((i: CartItem) =>
          getCartKey(i.productId, i.variantId, i.finishId) === key
            ? { ...i, quantity: Math.max(1, quantity) }
            : i
        )
        .filter((i: CartItem) => i.quantity > 0)

      return { ...recalculateTotals(newItems), items: newItems }
    }),

  removeItem: (productId: string, variantId?: string, finishId?: string) =>
    set((state: CartState) => {
      const key = getCartKey(productId, variantId, finishId)
      const newItems = state.items.filter(
        (i: CartItem) => getCartKey(i.productId, i.variantId, i.finishId) !== key
      )
      return { ...recalculateTotals(newItems), items: newItems }
    }),

  clearCart: () => set({ items: [], totalQuantity: 0, totalPrice: 0 }),
}))
