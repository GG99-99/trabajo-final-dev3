import { createContext, useContext, useState, type ReactNode } from 'react'
import type { UserCredentials } from '@final/shared'

type AuthState = {
  user: UserCredentials | null
  setUser: (u: UserCredentials | null) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserCredentials | null>(null)

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
