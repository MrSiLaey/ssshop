import { create } from 'zustand'

// Types
export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    })
  },

  setLoading: (loading) => {
    set({ isLoading: loading })
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  },
}))
