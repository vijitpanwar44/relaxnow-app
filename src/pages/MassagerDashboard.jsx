import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, getToken } from '../context/AuthContext.jsx'
import { massagers } from '../data/massagers.js'

function formatDateDisplay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function MassagerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [notifications, setNotifications] = useState([])
  const [activeTab, setActiveTab] = useState('bookings')
  const [loading, setLoading] = useState(true)

  const massager = massagers.find(m => m.id === user?.massagerId)

  useEffect(() => {
    if (!user) { navigate('/massager/login', { replace: true }); return }
    if (user.role !== 'massager') { navigate('/', { replace: true }); return }
    loadData()
  }, [user])

  const loadData = async () => {
    setLoading(true)
    const token = getToken()
    try {
      const [bRes, nRes] = await Promise.all([
        fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } }),
      ])
      if (bRes.ok) setBookings((await bRes.json()).bookings || [])
      if (nRes.ok) setNotifications((await nRes.json()).notifications || [])
    } finally {
      setLoading(false)
    }
  }

  const markRead = async (id) => {
    await fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = async () => {
    await fetch('/api/notifications/mark-all-read', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleLogout = async () => {
    await logout()
    navigate('/massager/login')
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const upcoming = bookings.filter(b => new Date(b.date + 'T23:59:59') >= new Date()).sort((a, b) => new Date(a.date + 'T' + a.slot) - new Date(b.date + 'T' + b.slot))
  const past = bookings.filter(b => new Date(b.date + 'T23:59:59') < new Date()).sort((a, b) => new Date(b.date) - new Date(a.date))

  if (!user || user.role !== 'massager') return null

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          {massager?.photo ? (
            <img src={massager.photo} alt={user.name} className="w-16 h-16 rounded-2xl object-cover object-center" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {user.name[0]}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Welcome, {user.name.split(' ')[0]}</h1>
            <p className="text-stone-500 text-sm">{user.email}</p>
            <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {massager?.specialties?.slice(0, 2).join(' · ')}
            </span>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl border border-red-200 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Bookings', value: bookings.length, color: 'text-stone-800' },
          { label: 'Upcoming', value: upcoming.length, color: 'text-blue-600' },
          { label: 'Completed', value: past.length, color: 'text-green-600' },
          { label: 'Unread Alerts', value: unreadCount, color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-stone-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b border-stone-100 flex">
          {[
            { key: 'bookings', label: 'Bookings', badge: upcoming.length },
            { key: 'notifications', label: 'Notifications', badge: unreadCount },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.key ? 'border-blue-600 text-blue-700' : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
              {tab.badge > 0 && (
                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                  activeTab === tab.key ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-16 text-stone-400">
              <svg className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Loading…
            </div>
          ) : activeTab === 'bookings' ? (
            <div>
              {upcoming.length > 0 && (
                <>
                  <h3 className="font-semibold text-stone-700 mb-3 text-sm uppercase tracking-wide">Upcoming</h3>
                  <div className="space-y-3 mb-6">
                    {upcoming.map(b => (
                      <BookingCard key={b.id} booking={b} highlight />
                    ))}
                  </div>
                </>
              )}
              {past.length > 0 && (
                <>
                  <h3 className="font-semibold text-stone-400 mb-3 text-sm uppercase tracking-wide">Past</h3>
                  <div className="space-y-3">
                    {past.map(b => (
                      <BookingCard key={b.id} booking={b} />
                    ))}
                  </div>
                </>
              )}
              {bookings.length === 0 && (
                <div className="text-center py-16 text-stone-400">
                  <div className="text-5xl mb-3">📅</div>
                  <p className="font-medium">No bookings yet</p>
                  <p className="text-sm mt-1">Bookings will appear here as clients book with you.</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              {unreadCount > 0 && (
                <div className="flex justify-end mb-4">
                  <button onClick={markAllRead} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Mark all as read
                  </button>
                </div>
              )}
              {notifications.length === 0 ? (
                <div className="text-center py-16 text-stone-400">
                  <div className="text-5xl mb-3">🔔</div>
                  <p className="font-medium">No notifications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => !n.read && markRead(n.id)}
                      className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                        !n.read ? 'bg-amber-50 border-amber-200 cursor-pointer hover:bg-amber-100' : 'border-stone-100'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-amber-500' : 'bg-stone-200'}`} />
                      <div>
                        <p className="font-semibold text-stone-800 text-sm">{n.title}</p>
                        <p className="text-stone-600 text-sm mt-0.5">{n.message}</p>
                        {n.bookingNo && <p className="text-xs text-amber-600 font-medium mt-1">#{n.bookingNo}</p>}
                        <p className="text-xs text-stone-400 mt-1">
                          {new Date(n.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BookingCard({ booking: b, highlight }) {
  return (
    <div className={`p-4 rounded-xl border ${highlight ? 'border-blue-200 bg-blue-50' : 'border-stone-100'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-stone-800">{b.customerName}</span>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">✓ Confirmed</span>
            {b.bookingNo && <span className="text-xs text-stone-400">#{b.bookingNo}</span>}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-stone-500">
            <span>📅 {b.date}</span>
            <span>🕐 {b.slot}</span>
            <span>⏱ {b.duration} min</span>
          </div>
          {b.customerEmail && (
            <p className="text-xs text-stone-400 mt-1">{b.customerEmail} · {b.customerPhone}</p>
          )}
          {b.notes && <p className="text-sm text-stone-500 mt-1 italic">"{b.notes}"</p>}
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-amber-700 text-lg">₹{Number(b.totalPrice).toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
