import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function InlineLoader() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-6">
      <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center shadow-md">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </div>
      <div className="w-36 h-1 bg-stone-200 rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-amber-500 rounded-full shimmer-bar" />
      </div>
    </div>
  )
}

export default function ProtectedRoute({ children }) {
  const { user, authReady, isAuthenticating } = useAuth()
  const location = useLocation()

  // Clerk SDK still loading
  if (!authReady) return <InlineLoader />

  // Clerk user found but token not yet cached — avoid flashing redirect to login
  if (isAuthenticating) return <InlineLoader />

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}
