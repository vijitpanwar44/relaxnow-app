import React from 'react'
import { Link } from 'react-router-dom'
import { useBooking } from '../context/BookingContext.jsx'

function formatDateDisplay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

export default function MyBookings() {
  const { bookings } = useBooking()

  if (bookings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="text-7xl mb-6">📅</div>
        <h1 className="text-3xl font-bold text-stone-800 mb-3">No bookings yet</h1>
        <p className="text-stone-500 mb-8 text-lg">You haven't made any bookings. Find a therapist and book your first session!</p>
        <Link to="/massagers" className="btn-primary text-lg">Browse Massagers</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-stone-800 mb-1">My Bookings</h1>
          <p className="text-stone-500">{bookings.length} session{bookings.length !== 1 ? 's' : ''} booked</p>
        </div>
        <Link to="/massagers" className="btn-primary">+ New Booking</Link>
      </div>

      <div className="space-y-4">
        {[...bookings].reverse().map((booking) => (
          <div key={booking.id} className="card p-5">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0"
                style={{ backgroundColor: booking.massagerAccentColor }}
              >
                {booking.massagerAvatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h3 className="font-bold text-stone-800">{booking.massagerName}</h3>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    ✓ Confirmed
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-500">
                  <span className="flex items-center gap-1">
                    <span>📅</span> {formatDateDisplay(booking.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>🕐</span> {booking.slot}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>⏱</span> {booking.duration} min
                  </span>
                </div>
                {booking.notes && (
                  <p className="text-stone-400 text-sm mt-1.5 italic">"{booking.notes}"</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl font-bold text-amber-700">₹{booking.totalPrice.toLocaleString()}</p>
                <p className="text-xs text-stone-400 mt-0.5">#{booking.id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
