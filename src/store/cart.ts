import { create } from 'zustand'

export interface CartItem {
  id: string
  productId: string
  productType: string
  productName: string
  size: string
  color: string
  quantity: number
  price: number
  designUrl?: string
  customDesign?: {
    imageUrl: string
    position: { x: number; y: number }
    scale: number
    rotation: number
  }
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (item) => {
    const id = Math.random().toString(36).substring(2, 15)
    set((state) => ({
      items: [...state.items, { ...item, id }]
    }))
  },
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== id)
    }))
  },
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id)
      return
    }
    set((state) => ({
      items: state.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    }))
  },
  clearCart: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0)
  },
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }
}))