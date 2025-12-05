import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
  isDigital: boolean
}

interface CartState {
  items: CartItem[]
  isLoading: boolean
  total: number
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setItems: (items: CartItem[]) => void
  setLoading: (loading: boolean) => void
  
  // Computed
  getItemCount: () => number
  getSubtotal: () => number
  getItem: (productId: string) => CartItem | undefined
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      get total() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      addItem: (item) => {
        const { items } = get()
        const existingItem = items.find((i) => i.productId === item.productId)

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({
            items: [...items, { ...item, id: crypto.randomUUID() }],
          })
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((i) => i.productId !== productId),
        })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      setItems: (items) => {
        set({ items })
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      },

      getItem: (productId) => {
        return get().items.find((i) => i.productId === productId)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
