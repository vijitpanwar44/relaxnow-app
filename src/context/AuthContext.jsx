import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { useUser, useSession, useClerk } from '@clerk/clerk-react'

const AuthContext = createContext(null)

const MASSAGER_KEY = 'rn_massager_token'
const CLERK_TOKEN_KEY = 'rn_clerk_token'

function parseJwt(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp && payload.exp * 1000 < Date.now()) return null
    return payload
  } catch { return null }
}

function getStoredMassager() {
  const t = localStorage.getItem(MASSAGER_KEY)
  return t ? parseJwt(t) : null
}

export function getToken() {
  return localStorage.getItem(MASSAGER_KEY) || localStorage.getItem(CLERK_TOKEN_KEY) || null
}

export function AuthProvider({ children }) {
  const { user: clerkUser, isLoaded } = useUser()
  const { session } = useSession()
  const { signOut } = useClerk()
  const [massagerUser, setMassagerUser] = useState(getStoredMassager)
  // tokenReady: true once the Clerk session token is cached in localStorage
  const [tokenReady, setTokenReady] = useState(() => !!localStorage.getItem(CLERK_TOKEN_KEY))

  useEffect(() => {
    if (!session) {
      localStorage.removeItem(CLERK_TOKEN_KEY)
      setTokenReady(false)
      return
    }
    const refresh = async () => {
      const token = await session.getToken()
      if (token) {
        localStorage.setItem(CLERK_TOKEN_KEY, token)
        setTokenReady(true)
      }
    }
    refresh()
    const interval = setInterval(refresh, 50_000)
    return () => clearInterval(interval)
  }, [session])

  // user is only non-null once the token is available for API calls
  const user = useMemo(() => {
    if (massagerUser) return massagerUser
    if (isLoaded && clerkUser && tokenReady) return {
      id: clerkUser.id,
      name: clerkUser.fullName || clerkUser.primaryEmailAddress?.emailAddress || '',
      email: clerkUser.primaryEmailAddress?.emailAddress || '',
      avatar: clerkUser.imageUrl || null,
      role: 'customer',
    }
    return null
  }, [massagerUser, isLoaded, clerkUser?.id, tokenReady])

  const loginMassager = async (email, password) => {
    try {
      const res = await fetch('/api/auth/massager/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem(MASSAGER_KEY, data.token)
        setMassagerUser(parseJwt(data.token))
        return { success: true }
      }
      return { success: false, error: data.error || 'Invalid email or password' }
    } catch {
      return { success: false, error: 'Network error. Is the server running?' }
    }
  }

  const logout = async () => {
    localStorage.removeItem(MASSAGER_KEY)
    localStorage.removeItem(CLERK_TOKEN_KEY)
    setMassagerUser(null)
    setTokenReady(false)
    if (session) await signOut()
    try { await fetch('/api/auth/logout', { method: 'POST' }) } catch {}
  }

  const authReady = !!massagerUser || isLoaded

  return (
    <AuthContext.Provider value={{ user, loginMassager, logout, authReady }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
