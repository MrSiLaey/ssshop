import { create } from 'zustand'

// Product Filter State
export interface ProductFilters {
  category: string | null
  search: string
  minPrice: number | null
  maxPrice: number | null
  type: 'ALL' | 'PHYSICAL' | 'DIGITAL'
  sortBy: 'createdAt' | 'price' | 'name'
  sortOrder: 'asc' | 'desc'
}

interface ProductFilterState {
  filters: ProductFilters
  
  // Actions
  setCategory: (category: string | null) => void
  setSearch: (search: string) => void
  setPriceRange: (min: number | null, max: number | null) => void
  setType: (type: ProductFilters['type']) => void
  setSort: (sortBy: ProductFilters['sortBy'], sortOrder: ProductFilters['sortOrder']) => void
  resetFilters: () => void
}

const defaultFilters: ProductFilters = {
  category: null,
  search: '',
  minPrice: null,
  maxPrice: null,
  type: 'ALL',
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

export const useProductFilterStore = create<ProductFilterState>((set) => ({
  filters: defaultFilters,

  setCategory: (category) => {
    set((state) => ({
      filters: { ...state.filters, category },
    }))
  },

  setSearch: (search) => {
    set((state) => ({
      filters: { ...state.filters, search },
    }))
  },

  setPriceRange: (minPrice, maxPrice) => {
    set((state) => ({
      filters: { ...state.filters, minPrice, maxPrice },
    }))
  },

  setType: (type) => {
    set((state) => ({
      filters: { ...state.filters, type },
    }))
  },

  setSort: (sortBy, sortOrder) => {
    set((state) => ({
      filters: { ...state.filters, sortBy, sortOrder },
    }))
  },

  resetFilters: () => {
    set({ filters: defaultFilters })
  },
}))

// UI State Store
interface UIState {
  isSidebarOpen: boolean
  isMobileMenuOpen: boolean
  isCartOpen: boolean
  isSearchOpen: boolean
  
  // Actions
  toggleSidebar: () => void
  toggleMobileMenu: () => void
  toggleCart: () => void
  toggleSearch: () => void
  closeMobileMenu: () => void
  closeCart: () => void
  closeSearch: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  isCartOpen: false,
  isSearchOpen: false,

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }))
  },

  toggleMobileMenu: () => {
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }))
  },

  toggleCart: () => {
    set((state) => ({ isCartOpen: !state.isCartOpen }))
  },

  toggleSearch: () => {
    set((state) => ({ isSearchOpen: !state.isSearchOpen }))
  },

  closeMobileMenu: () => {
    set({ isMobileMenuOpen: false })
  },

  closeCart: () => {
    set({ isCartOpen: false })
  },

  closeSearch: () => {
    set({ isSearchOpen: false })
  },
}))

// Notification Store
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

interface NotificationState {
  notifications: Notification[]
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = crypto.randomUUID()
    const newNotification = { ...notification, id }

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }))

    // Auto remove after duration (default 5 seconds)
    const duration = notification.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(id)
      }, duration)
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  clearNotifications: () => {
    set({ notifications: [] })
  },
}))
