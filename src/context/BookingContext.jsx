import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext.jsx'

const BookingContext = createContext(null)

const BOOKINGS_KEY = 'hw_bookings'

function getAllBookings() {
  try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]') } catch { return [] }
}

function saveAllBookings(bookings) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
}

export function BookingProvider({ children }) {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    if (!user?.id || user.role === 'massager') {
      setBookings([])
      return
    }
    const all = getAllBookings()
    setBookings(all.filter(b => b.userId === user.id))
  }, [user?.id])

  const addBooking = async (bookingData) => {
    const all = getAllBookings()
    const n = all.length + 1
    const booking = {
      id: crypto.randomUUID(),
      bookingNo: `HW${String(n).padStart(4, '0')}`,
      userId: user.id,
      ...bookingData,
      status: 'confirmed',
      paymentStatus: 'pay_on_arrival',
      createdAt: new Date().toISOString(),
    }
    all.push(booking)
    saveAllBookings(all)

    // Create notification for massager
    const notifKey = `hw_notifications_${bookingData.massagerId}`
    const notifs = JSON.parse(localStorage.getItem(notifKey) || '[]')
    notifs.unshift({
      id: crypto.randomUUID(),
      type: 'new_booking',
      title: 'New Booking Received',
      message: `${bookingData.customerName} booked a ${bookingData.duration}-min session on ${bookingData.date} at ${bookingData.slot} — ₹${Number(bookingData.totalPrice).toLocaleString()}`,
      bookingNo: booking.bookingNo,
      read: false,
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem(notifKey, JSON.stringify(notifs))

    setBookings(prev => [...prev, booking])
    return booking
  }

  return (
    <BookingContext.Provider value={{ bookings, addBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export function getBookingsForMassager(massagerId) {
  return getAllBookings().filter(b => b.massagerId === massagerId)
}

export const useBooking = () => useContext(BookingContext)
