import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface User {
  id: string
  name?: string
  email?: string
  phone?: string
  role?: string
}

interface AuthState {
  user: User | null
  language: 'ta' | 'en'
  isAdmin: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setLanguage: (lang: 'ta' | 'en') => void
  setAdmin: (isAdmin: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      language: 'ta',
      isAdmin: false,

      setUser: (user: User | null) => {
        set({ user })
      },

      setLanguage: (language: 'ta' | 'en') => {
        set({ language })
      },

      setAdmin: (isAdmin: boolean) => {
        set({ isAdmin })
      },

      logout: () => {
        set({
          user: null,
          isAdmin: false
        })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        language: state.language
      })
    }
  )
)

// REMOVED COMPLEX STORES:
// - productStore (no inventory management)
// - teamStore (no team assignment)
// - locationStore (no GPS tracking)
// - performanceStore (no analytics)
// - notificationStore (simplified)
// - cacheStore (simplified API calls)