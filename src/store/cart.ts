import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import sha1 from 'js-sha1'

export interface CartItem {
  id: string
  productId: string
  name: string
  image: string
  color: string
  size: string
  quantity: number
  price: number
  designUrl?: string
  placements?: Record<string, {
    imageUrl: string
    file?: File
  } | null>
  customDesign?: {
    imageUrl: string
    position: { x: number; y: number }
    scale: number
    rotation: number
  }
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        // Generate unique hash based on full customization data
        const customizationData = {
          productId: item.productId,
          color: item.color,
          size: item.size,
          placements: item.placements || {},
          designUrl: item.designUrl || '',
          customDesign: item.customDesign || null,
        }
        
        // Remove File objects for hashing (they can't be serialized)
        const hashableData = JSON.parse(JSON.stringify(customizationData, (key, value) => {
          if (key === 'file') return undefined
          return value
        }))
        
        const customHash = sha1(JSON.stringify(hashableData))
        
        const newItem = { 
          ...item, 
          id: customHash,
          quantity: item.quantity || 1
        }
        
        // Check if item with same hash already exists
        const existingItem = get().items.find(i => i.id === customHash)
        
        if (existingItem) {
          // If exists, increment quantity
          set((state) => ({
            items: state.items.map(i => 
              i.id === customHash
                ? { ...i, quantity: i.quantity + (item.quantity || 1) } 
                : i
            )
          }))
        } else {
          // Add new item
          set((state) => ({
            items: [...state.items, newItem]
          }))
        }
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
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
)