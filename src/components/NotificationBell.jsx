import React, { useState, useEffect, useRef } from 'react'
import { useAuth, getToken } from '../context/AuthContext.jsx'

export default function NotificationBell() {
  const { user } = useAuth()
  const [count, setCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const intervalRef = useRef(null)

  if (user?.role !== 'massager') return null

  const fetchCount = async () => {
    try {
      const res = await fetch('/api/notifications/unread-count', {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (res.ok) {
        const { count } = await res.json()
        setCount(count)
      }
    } catch {}
  }

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (res.ok) {
        const { notifications } = await res.json()
        setNotifications(notifications || [])
      }
    } catch {}
  }

  useEffect(() => {
    fetchCount()
    intervalRef.current = setInterval(fetchCount, 30000)
    return () => clearInterval(intervalRef.current)
  }, [user])

  const handleOpen = async () => {
    const next = !open
    setOpen(next)
    if (next) await fetchNotifications()
  }

  const markRead = async (id) => {
    await fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    setCount(prev => Math.max(0, prev - 1))
  }

  const markAllRead = async (e) => {
    e.stopPropagation()
    await fetch('/api/notifications/mark-all-read', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setCount(0)
  }

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
        title="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-stone-100 z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
              <span className="font-semibold text-stone-800 text-sm">Notifications</span>
              {count > 0 && (
                <button onClick={markAllRead} className="text-xs text-amber-600 hover:text-amber-800 font-medium">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto divide-y divide-stone-50">
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="text-3xl mb-2">🔔</div>
                  <p className="text-stone-400 text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => !n.read && markRead(n.id)}
                    className={`px-4 py-3 flex items-start gap-3 transition-colors ${
                      !n.read ? 'bg-amber-50 hover:bg-amber-100 cursor-pointer' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-amber-500' : 'bg-stone-200'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-800">{n.title}</p>
                      <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{n.message}</p>
                      {n.bookingNo && (
                        <p className="text-xs text-amber-600 font-medium mt-1">Booking #{n.bookingNo}</p>
                      )}
                      <p className="text-xs text-stone-400 mt-1">
                        {new Date(n.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
