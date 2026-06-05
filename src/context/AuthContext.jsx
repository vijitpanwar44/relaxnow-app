import React, { createContext, useContext, useState } from 'react'

const DEMO_USER = {
  email: 'demo@relaxnow.com',
  password: 'relax123',
  name: 'Demo User',
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('rn_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const login = (email, password) => {
    if (
      email.trim().toLowerCase() === DEMO_USER.email &&
      password === DEMO_USER.password
    ) {
      const u = { email: DEMO_USER.email, name: DEMO_USER.name }
      setUser(u)
      sessionStorage.setItem('rn_user', JSON.stringify(u))
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password.' }
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('rn_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
