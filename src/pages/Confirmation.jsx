import React from 'react'
import { useLocation, Link } from 'react-router-dom'

function formatDateDisplay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export default function Confirmation() {
  const { state } = useLocation()
  const booking = state?.booking

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-700 mb-4">No booking found</h2>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      {/* Success Icon */}
      <div className="text-center mb-10">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-stone-800 mb-2">Booking Confirmed!</h1>
        <p className="text-stone-500">Your relaxation session has been successfully booked.</p>
      </div>

      {/* Booking Card */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white"
            style={{ backgroundColor: booking.massagerAccentColor }}
          >
            {booking.massagerAvatar}
          </div>
          <div>
            <h2 className="font-bold text-stone-800 text-lg">{booking.massagerName}</h2>
            <p className="text-stone-500 text-sm">Your massage therapist</p>
          </div>
          <div className="ml-auto">
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              ✓ Confirmed
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
              📅
            </div>
            <div>
              <p className="text-xs text-stone-400 font-medium">DATE</p>
              <p className="text-stone-800 font-semibold">{formatDateDisplay(booking.date)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
              🕐
            </div>
            <div>
              <p className="text-xs text-stone-400 font-medium">TIME & DURATION</p>
              <p className="text-stone-800 font-semibold">{booking.slot} · {booking.duration} minutes</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
              👤
            </div>
            <div>
              <p className="text-xs text-stone-400 font-medium">BOOKED FOR</p>
              <p className="text-stone-800 font-semibold">{booking.customerName}</p>
              <p className="text-stone-500 text-sm">{booking.customerPhone} · {booking.customerEmail}</p>
            </div>
          </div>

          {booking.notes && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                📝
              </div>
              <div>
                <p className="text-xs text-stone-400 font-medium">SPECIAL REQUESTS</p>
                <p className="text-stone-700 text-sm">{booking.notes}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-stone-400">Booking ID</p>
              <p className="text-stone-600 font-mono text-sm">#{booking.bookingNo || booking.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-400">{booking.paymentStatus === 'pay_on_arrival' ? 'Pay on Arrival' : 'Total Paid'}</p>
              <p className="text-2xl font-bold text-amber-700">₹{booking.totalPrice.toLocaleString()}</p>
            </div>
          </div>
          {booking.paymentId && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs text-green-700 font-semibold">Payment Successful</p>
                <p className="text-xs text-green-600 font-mono">{booking.paymentId}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-sm text-blue-700">
        <p className="font-semibold mb-1">📱 What's next?</p>
        <p>A confirmation has been sent to <strong>{booking.customerEmail}</strong>. The therapist will contact you on <strong>{booking.customerPhone}</strong> before the session.</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/my-bookings" className="flex-1 btn-primary text-center">
          View My Bookings
        </Link>
        <Link to="/massagers" className="flex-1 btn-outline text-center">
          Book Another Session
        </Link>
      </div>
    </div>
  )
}
