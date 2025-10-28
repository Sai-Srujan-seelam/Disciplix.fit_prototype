import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService, type RegisterData, type LoginData } from '@/services/authService'

interface User {
  id: string
  email: string
  name: string
  verified: boolean
  avatar?: string
  subscription?: {
    tier: string
    status: string
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  register: (data: RegisterData) => Promise<void>
  login: (data: LoginData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => void
  clearError: () => void
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.register(data)
          // Don't set user as authenticated since email verification is required
          set({
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Registration failed'
          set({
            isLoading: false,
            error: errorMessage
          })
          throw error
        }
      },

      login: async (data: LoginData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.login(data)
          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed'
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage
          })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await authService.logout()
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })
        }
      },

      refreshUser: () => {
        const user = authService.getCurrentUser()
        const isAuthenticated = authService.isAuthenticated()
        set({ user, isAuthenticated })
      },

      clearError: () => {
        set({ error: null })
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
