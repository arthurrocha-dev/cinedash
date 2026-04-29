import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { signToken, verifyToken } from '@/shared/lib/jwt.mock'
import type { User } from '@/entities/user/model/user.types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

interface AuthActions {
  login: (email: string, password: string) => void
  logout: () => void
  rehydrate: () => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (email: string, _password: string) => {
        const name = email.split('@')[0] ?? email
        const token = signToken(email, name)
        const user: User = { id: crypto.randomUUID(), email, name }
        set({ user, token, isAuthenticated: true })
      },

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      rehydrate: () => {
        const { token } = get()
        if (!token) return
        const payload = verifyToken(token)
        if (!payload) {
          set({ user: null, token: null, isAuthenticated: false })
        }
      },
    }),
    {
      name: 'cinedash-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
)
