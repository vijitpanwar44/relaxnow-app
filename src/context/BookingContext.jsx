import React, { createContext, useContext, useState } from 'react'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([])
  const [currentBooking, setCurrentBooking] = useState(null)

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: Date.now(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }
    setBookings((prev) => [...prev, newBooking])
    return newBooking
  }

  return (
    <BookingContext.Provider value={{ bookings, currentBooking, setCurrentBooking, addBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => useContext(BookingContext)
