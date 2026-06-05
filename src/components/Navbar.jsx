import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { bookings } = useBooking()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/massagers', label: 'Find Massager' },
    { to: '/my-bookings', label: 'My Bookings', badge: bookings.length },
  ]

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    setMenuOpen(false)
    navigate('/login')
  }

  if (location.pathname === '/login') return null

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <span className="text-xl font-semibold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>
              RelaxNow
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {link.label}
                {link.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 text-white text-xs rounded-full flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors"
                >
                  <div className="w-7 h-7 bg-amber-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name[0]}
                  </div>
                  <span className="text-sm font-medium text-stone-700">{user.name}</span>
                  <svg className={`w-4 h-4 text-stone-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-stone-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs text-stone-400">Signed in as</p>
                      <p className="text-sm font-medium text-stone-700 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === link.to
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {link.label}
                {link.badge > 0 && (
                  <span className="w-5 h-5 bg-amber-600 text-white text-xs rounded-full flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            {user && (
              <>
                <div className="px-4 py-2 mt-1 border-t border-stone-100">
                  <p className="text-xs text-stone-400">Signed in as <span className="font-medium text-stone-600">{user.email}</span></p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </nav>
  )
}
