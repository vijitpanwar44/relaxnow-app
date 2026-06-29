import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { SignIn } from '@clerk/clerk-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (user && user.role === 'massager') navigate('/massager/dashboard', { replace: true })
    else if (user) navigate(from, { replace: true })
  }, [user])

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-stone-800 via-stone-700 to-amber-900 text-white flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-stone-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Home Wellness</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">Your Wellness,<br />At Home & Beyond</h2>
          <p className="text-stone-300 text-lg leading-relaxed mb-10">
            Certified therapists at your doorstep, or book a verified local spa — all in one trusted platform.
          </p>
          <div className="space-y-4">
            {[
              'Certified professional therapists',
              'ID verified massagers',
              'Flexible time slots & easy booking',
              'Visit a local spa — coming soon',
            ].map(text => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                <span className="text-stone-200">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Clerk Sign In */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#faf9f7]">
        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full max-w-md',
              card: 'shadow-none border border-stone-200 rounded-2xl',
            },
          }}
          signUpUrl="/login"
        />
      </div>
    </div>
  )
}
