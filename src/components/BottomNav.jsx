import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useBooking } from '../context/BookingContext.jsx'

const HIDDEN_PATHS = ['/login', '/massager/login', '/massager/apply', '/auth/callback']

function isTabActive(tabPath, current) {
  if (tabPath === '/') return current === '/'
  if (tabPath === '/massagers') return current.startsWith('/massagers') || current.startsWith('/book/')
  return current === tabPath || current.startsWith(tabPath + '/')
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}
function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}
function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

export default function BottomNav() {
  const { user } = useAuth()
  const { bookings } = useBooking()
  const location = useLocation()

  if (!user || user.role === 'massager') return null
  if (HIDDEN_PATHS.includes(location.pathname)) return null

  const tabs = [
    { to: '/',           icon: <HomeIcon />,     label: 'Home' },
    { to: '/massagers',  icon: <PeopleIcon />,   label: 'At Home' },
    { to: '/my-bookings',icon: <CalendarIcon />, label: 'Bookings', badge: bookings.length },
    { to: '/spas',       icon: <SparkleIcon />,  label: 'Spa',      soon: true },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-stone-100 shadow-[0_-2px_16px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex h-14">
        {tabs.map(tab => {
          const active = isTabActive(tab.to, location.pathname)
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors active:bg-stone-50 ${
                active ? 'text-amber-600' : 'text-stone-400'
              }`}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-amber-600 rounded-full" />
              )}
              <span className="w-[22px] h-[22px] relative">
                {tab.icon}
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-amber-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold px-[3px] leading-none">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
                {tab.soon && (
                  <span className="absolute -top-2 -right-3 text-[8px] font-bold bg-amber-100 text-amber-600 px-1 rounded-full leading-4">
                    Soon
                  </span>
                )}
              </span>
              <span className={`text-[10px] font-semibold ${active ? 'text-amber-600' : 'text-stone-400'}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
