import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { useUser, useSession, useClerk } from '@clerk/clerk-react'

const AuthContext = createContext(null)

const MASSAGER_KEY = 'rn_massager_token'
const CLERK_TOKEN_KEY = 'rn_clerk_token'

// Hardcoded massager accounts (frontend-only, demo app)
const MASSAGER_ACCOUNTS = [
  { massagerId: 1,  email: 'priya@relaxnow.com',  name: 'Priya Sharma',  password: 'relax@123' },
  { massagerId: 3,  email: 'kavya@relaxnow.com',  name: 'Kavya Nair',    password: 'relax@123' },
  { massagerId: 4,  email: 'rahul@relaxnow.com',  name: 'Rahul Mehta',   password: 'relax@123' },
  { massagerId: 5,  email: 'arjun@relaxnow.com',  name: 'Arjun Kapoor',  password: 'relax@123' },
  { massagerId: 6,  email: 'vikram@relaxnow.com', name: 'Vikram Singh',  password: 'relax@123' },
  { massagerId: 7,  email: 'meera@relaxnow.com',  name: 'Meera Joshi',   password: 'relax@123' },
  { massagerId: 8,  email: 'sakura@relaxnow.com', name: 'Sakura Tanaka', password: 'relax@123' },
  { massagerId: 9,  email: 'nisha@relaxnow.com',  name: 'Nisha Patel',   password: 'relax@123' },
  { massagerId: 10, email: 'divya@relaxnow.com',  name: 'Divya Reddy',   password: 'relax@123' },
]

function getStoredMassager() {
  try { return JSON.parse(localStorage.getItem(MASSAGER_KEY) || 'null') } catch { return null }
}

export function getToken() {
  return localStorage.getItem(CLERK_TOKEN_KEY) || null
}

export function AuthProvider({ children }) {
  const { user: clerkUser, isLoaded } = useUser()
  const { session } = useSession()
  const { signOut } = useClerk()
  const [massagerUser, setMassagerUser] = useState(getStoredMassager)
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
    const account = MASSAGER_ACCOUNTS.find(m => m.email === email && m.password === password)
    if (account) {
      const userData = { id: account.email, email: account.email, name: account.name, role: 'massager', massagerId: account.massagerId }
      localStorage.setItem(MASSAGER_KEY, JSON.stringify(userData))
      setMassagerUser(userData)
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }

  const logout = async () => {
    localStorage.removeItem(MASSAGER_KEY)
    localStorage.removeItem(CLERK_TOKEN_KEY)
    setMassagerUser(null)
    setTokenReady(false)
    if (session) await signOut()
  }

  const authReady = !!massagerUser || isLoaded

  return (
    <AuthContext.Provider value={{ user, loginMassager, logout, authReady }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
