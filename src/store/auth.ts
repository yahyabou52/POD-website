import { create } from 'zustand'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      // TODO: Implement actual login API call
      console.log('Login:', { email, password })
      // Mock successful login
      setTimeout(() => {
        const mockUser = { id: '1', email, name: 'John Doe' }
        set({ user: mockUser, isAuthenticated: true, isLoading: false })
      }, 1000)
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true })
    try {
      // TODO: Implement actual register API call
      console.log('Register:', { email, password, name })
      // Mock successful registration
      setTimeout(() => {
        const mockUser = { id: '1', email, name }
        set({ user: mockUser, isAuthenticated: true, isLoading: false })
      }, 1000)
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false })
  },
  setUser: (user) => {
    set({ user, isAuthenticated: !!user })
  }
}))