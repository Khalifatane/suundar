import { useSyncExternalStore } from 'react'
import {
  CART_UPDATE_EVENT,
  formatPrice,
  getCart,
  getCartCount,
  getCartSubtotal,
  removeFromCart,
  setCart,
} from '@/lib/store.js'

export interface CartItem {
  id: string
  product_id: string
  title: string
  price: number
  originalPrice: number | null
  image: string
  color: string
  size: string
  quantity: number
  href: string
}

function getCartSnapshot() {
  const items = getCart() as CartItem[]

  return {
    items,
    count: getCartCount(items),
    subtotal: getCartSubtotal(items),
  }
}

function subscribeToCartStore(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  window.addEventListener(CART_UPDATE_EVENT, onStoreChange)
  window.addEventListener('storage', onStoreChange)

  return () => {
    window.removeEventListener(CART_UPDATE_EVENT, onStoreChange)
    window.removeEventListener('storage', onStoreChange)
  }
}

export function updateCartItemQuantity(itemId: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(itemId)
    return
  }

  const nextCart = getCart().map((item) =>
    item.id === itemId
      ? {
          ...item,
          quantity,
        }
      : item,
  )

  setCart(nextCart)
}

export function useCart() {
  const snapshot = useSyncExternalStore(subscribeToCartStore, getCartSnapshot, getCartSnapshot)

  const saleDiscount = snapshot.items.reduce((sum, item) => {
    const originalPrice = Number(item.originalPrice || 0)
    const itemDiscount = originalPrice > item.price ? (originalPrice - item.price) * item.quantity : 0
    return sum + itemDiscount
  }, 0)

  return {
    ...snapshot,
    saleDiscount,
    formattedSubtotal: formatPrice(snapshot.subtotal),
    formattedSaleDiscount: formatPrice(saleDiscount),
    formattedTotal: formatPrice(snapshot.subtotal),
    removeItem: removeFromCart,
    updateQuantity: updateCartItemQuantity,
  }
}
