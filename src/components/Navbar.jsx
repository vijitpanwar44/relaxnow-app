import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import NotificationBell from './NotificationBell.jsx'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { bookings } = useBooking()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const isMassager = user?.role === 'massager'

  const customerLinks = [
    { to: '/', label: 'Home' },
    { to: '/massagers', label: 'At Home' },
    { to: '/spas', label: 'Visit a Spa', soon: true },
    { to: '/my-bookings', label: 'My Bookings', badge: bookings.length },
  ]

  const massagerLinks = [
    { to: '/massager/dashboard', label: 'Dashboard' },
  ]

  const navLinks = isMassager ? massagerLinks : customerLinks

  const handleLogout = async () => {
    await logout()
    setProfileOpen(false)
    setMenuOpen(false)
    navigate(isMassager ? '/massager/login' : '/login')
  }

  const isLoginPage = location.pathname === '/login' || location.pathname === '/massager/login'

  if (isLoginPage) {
    return (
      <nav className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>
              Home Wellness
            </span>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={isMassager ? '/massager/dashboard' : '/'} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>
              Home Wellness
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  location.pathname === link.to
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {link.label}
                {link.soon && (
                  <span className="text-[10px] font-bold bg-amber-600 text-white px-1.5 py-0.5 rounded-full leading-none">
                    Soon
                  </span>
                )}
                {link.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 text-white text-xs rounded-full flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {/* Notification bell — massagers only */}
            <NotificationBell />

            {user && (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${isMassager ? 'bg-blue-600' : 'bg-amber-600'}`}>
                      {user.name[0]}
                    </div>
                  )}
                  <span className="text-sm font-medium text-stone-700">{user.name.split(' ')[0]}</span>
                  <svg className={`w-4 h-4 text-stone-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs text-stone-400">Signed in as</p>
                      <p className="text-sm font-medium text-stone-700 truncate">{user.email}</p>
                      {isMassager && (
                        <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Massager</span>
                      )}
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

          <button className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-3 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === link.to ? 'bg-amber-50 text-amber-700' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  {link.label}
                  {link.soon && (
                    <span className="text-[10px] font-bold bg-amber-600 text-white px-1.5 py-0.5 rounded-full leading-none">Soon</span>
                  )}
                </span>
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
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
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

      {profileOpen && <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />}
    </nav>
  )
}
