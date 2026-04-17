import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { UserCredentials } from '@final/shared'

const STORAGE_KEY = 'obsidian_user'

type AuthState = {
  user: UserCredentials | null
  setUser: (u: UserCredentials | null) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserCredentials | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? (JSON.parse(stored) as UserCredentials) : null
    } catch {
      return null
    }
  })

  const setUser = (u: UserCredentials | null) => {
    setUserState(u)
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    else localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
