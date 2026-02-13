import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

interface AuthValue {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('fe-waterfall:is-logged-in') === '1'
  })

  const login = () => {
    setIsLoggedIn(true)
    localStorage.setItem('fe-waterfall:is-logged-in', '1')
  }

  const logout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('fe-waterfall:is-logged-in')
  }

  const value = useMemo(
    () => ({
      isLoggedIn,
      login,
      logout,
    }),
    [isLoggedIn],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used inside AuthProvider')
  }
  return context
}
