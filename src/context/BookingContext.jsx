import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth, getToken } from './AuthContext.jsx'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])

  // Fetch bookings whenever user ID changes (customers only)
  useEffect(() => {
    if (!user?.id || user.role === 'massager') {
      setBookings([])
      return
    }
    const token = getToken()
    fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(({ bookings }) => setBookings(bookings || []))
      .catch(() => setBookings([]))
  }, [user?.id])

  const addBooking = async (bookingData) => {
    const token = getToken()
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(bookingData),
    })
    let data
    try { data = await res.json() } catch { throw new Error('Server error. Please try again.') }
    if (!res.ok) throw new Error(data.error || 'Booking failed')
    setBookings(prev => [...prev, data.booking])
    return data.booking
  }

  return (
    <BookingContext.Provider value={{ bookings, addBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => useContext(BookingContext)
