import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Please enter both email and password.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const result = login(form.email, form.password)
    setLoading(false)
    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(result.error)
    }
  }

  const fillDemo = () => {
    setForm({ email: 'demo@relaxnow.com', password: 'relax123' })
    setError('')
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-stone-800 via-stone-700 to-amber-900 text-white flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-stone-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-md">
          <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center mb-8">
            <span className="text-white text-2xl font-bold">R</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Premium Massage<br />Booking Platform
          </h2>
          <p className="text-stone-300 text-lg leading-relaxed mb-10">
            Connect with certified male and female massage therapists. Book sessions, manage appointments, and relax.
          </p>
          <div className="space-y-4">
            {[
              { icon: '✓', text: 'Certified professional therapists' },
              { icon: '✓', text: 'Choose male or female massager' },
              { icon: '✓', text: 'Flexible time slots & easy booking' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {item.icon}
                </div>
                <span className="text-stone-200">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#faf9f7]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-2xl font-bold">R</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-stone-800 mb-2">Welcome back</h1>
          <p className="text-stone-500 mb-8">Sign in to your RelaxNow account</p>

          {/* Demo credentials hint */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-amber-800 mb-2">Demo Credentials</p>
            <div className="text-sm text-stone-600 space-y-1 font-mono">
              <p><span className="text-stone-400">Email:</span> demo@relaxnow.com</p>
              <p><span className="text-stone-400">Password:</span> relax123</p>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="mt-3 text-xs font-semibold text-amber-700 hover:text-amber-900 underline"
            >
              Click to auto-fill →
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="demo@relaxnow.com"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPass ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 text-base"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-stone-400 mt-8">
            This is a demo application for client presentation.
          </p>
        </div>
      </div>
    </div>
  )
}
