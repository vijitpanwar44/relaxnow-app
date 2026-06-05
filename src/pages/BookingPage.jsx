import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { massagers } from '../data/massagers.js'
import { useBooking } from '../context/BookingContext.jsx'

const massageDurations = [
  { value: 60, label: '60 min', multiplier: 1 },
  { value: 90, label: '90 min', multiplier: 1.4 },
  { value: 120, label: '120 min', multiplier: 1.8 },
]

function getDatesForNext7Days() {
  const dates = []
  for (let i = 1; i <= 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    dates.push(d)
  }
  return dates
}

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function formatDateDisplay(date) {
  return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addBooking } = useBooking()
  const massager = massagers.find((m) => m.id === parseInt(id))

  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [duration, setDuration] = useState(60)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' })
  const [errors, setErrors] = useState({})

  if (!massager) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-700 mb-4">Massager not found</h2>
        <Link to="/massagers" className="btn-primary">Back to Listings</Link>
      </div>
    )
  }

  const dates = getDatesForNext7Days()
  const selectedDateKey = selectedDate ? formatDate(selectedDate) : null
  const availableSlots = selectedDateKey ? (massager.timeSlots[selectedDateKey] || []) : []
  const selectedDuration = massageDurations.find(d => d.value === duration)
  const totalPrice = Math.round(massager.price * selectedDuration.multiplier)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) e.phone = 'Enter valid 10-digit number'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter valid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleConfirm = () => {
    if (!validate()) return
    const booking = addBooking({
      massagerId: massager.id,
      massagerName: massager.name,
      massagerAvatar: massager.avatar,
      massagerAccentColor: massager.accentColor,
      date: selectedDateKey,
      slot: selectedSlot,
      duration,
      totalPrice,
      customerName: form.name,
      customerPhone: form.phone,
      customerEmail: form.email,
      notes: form.notes,
    })
    navigate('/confirmation', { state: { booking } })
  }

  const steps = ['Date & Time', 'Duration', 'Your Details']

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to={`/massagers/${id}`} className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 mb-6 text-sm transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to profile
      </Link>

      <h1 className="text-3xl font-bold text-stone-800 mb-8">Book a Session</h1>

      {/* Massager Summary */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-8 flex items-center gap-4">
        {massager.photo ? (
          <img src={massager.photo} alt={massager.name} className="w-14 h-14 rounded-xl object-cover object-top shrink-0" />
        ) : (
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white shrink-0"
            style={{ backgroundColor: massager.accentColor }}
          >
            {massager.avatar}
          </div>
        )}
        <div className="flex-1">
          <h2 className="font-semibold text-stone-800">{massager.name}</h2>
          <p className="text-stone-500 text-sm">{massager.specialties.join(' · ')}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-stone-400">Base price</p>
          <p className="font-bold text-amber-700">₹{massager.price.toLocaleString()}/hr</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-0 mb-10">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i + 1 < step ? 'bg-green-500 text-white' :
                  i + 1 === step ? 'bg-amber-600 text-white ring-4 ring-amber-100' :
                  'bg-stone-200 text-stone-500'
                }`}
              >
                {i + 1 < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs mt-1 font-medium ${i + 1 === step ? 'text-amber-700' : 'text-stone-400'}`}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mb-5 mx-1 ${i + 1 < step ? 'bg-green-400' : 'bg-stone-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Date & Time */}
      {step === 1 && (
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-stone-800 mb-6">Select Date</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-8">
            {dates.map((date) => {
              const key = formatDate(date)
              const hasSlots = massager.timeSlots[key]?.length > 0
              const isSelected = selectedDate && formatDate(selectedDate) === key
              return (
                <button
                  key={key}
                  disabled={!hasSlots}
                  onClick={() => { setSelectedDate(date); setSelectedSlot(null) }}
                  className={`p-3 rounded-xl text-center transition-all border-2 ${
                    isSelected
                      ? 'bg-amber-600 border-amber-600 text-white'
                      : hasSlots
                      ? 'border-stone-200 hover:border-amber-400 text-stone-700'
                      : 'border-stone-100 text-stone-300 cursor-not-allowed bg-stone-50'
                  }`}
                >
                  <div className="text-xs font-medium">{date.toLocaleDateString('en-IN', { weekday: 'short' })}</div>
                  <div className="text-lg font-bold my-0.5">{date.getDate()}</div>
                  <div className="text-xs">{date.toLocaleDateString('en-IN', { month: 'short' })}</div>
                </button>
              )
            })}
          </div>

          {selectedDate && (
            <>
              <h3 className="text-xl font-semibold text-stone-800 mb-4">
                Available Slots — {formatDateDisplay(selectedDate)}
              </h3>
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 px-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                        selectedSlot === slot
                          ? 'bg-amber-600 border-amber-600 text-white'
                          : 'border-stone-200 hover:border-amber-400 text-stone-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-stone-400 text-center py-6">No slots available on this date</p>
              )}
            </>
          )}

          {!selectedDate && (
            <div className="text-center py-8 text-stone-400">
              <div className="text-4xl mb-2">📅</div>
              <p>Select a date to see available time slots</p>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              disabled={!selectedDate || !selectedSlot}
              onClick={() => setStep(2)}
              className={`btn-primary ${!selectedDate || !selectedSlot ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Duration */}
      {step === 2 && (
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-stone-800 mb-6">Choose Duration</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {massageDurations.map((d) => {
              const price = Math.round(massager.price * d.multiplier)
              return (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${
                    duration === d.value
                      ? 'border-amber-600 bg-amber-50'
                      : 'border-stone-200 hover:border-amber-300'
                  }`}
                >
                  <div className="text-2xl font-bold text-stone-800 mb-1">{d.label}</div>
                  <div className={`text-lg font-semibold ${duration === d.value ? 'text-amber-700' : 'text-stone-500'}`}>
                    ₹{price.toLocaleString()}
                  </div>
                  {d.value === 90 && (
                    <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Most Popular
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Summary */}
          <div className="bg-stone-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-stone-700 mb-3 text-sm">Booking Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-stone-500">Massager</span><span className="font-medium">{massager.name}</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Date</span><span className="font-medium">{selectedDate && formatDateDisplay(selectedDate)}</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Time</span><span className="font-medium">{selectedSlot}</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Duration</span><span className="font-medium">{duration} min</span></div>
              <div className="flex justify-between border-t border-stone-200 pt-2 mt-2">
                <span className="font-semibold text-stone-800">Total</span>
                <span className="font-bold text-amber-700 text-base">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="btn-outline">← Back</button>
            <button onClick={() => setStep(3)} className="btn-primary">Continue →</button>
          </div>
        </div>
      )}

      {/* Step 3: Details */}
      {step === 3 && (
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-stone-800 mb-6">Your Details</h3>
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${errors.name ? 'border-red-400' : 'border-stone-200'}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone Number *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="10-digit mobile number"
                maxLength={10}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${errors.phone ? 'border-red-400' : 'border-stone-200'}`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${errors.email ? 'border-red-400' : 'border-stone-200'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Special Requests (optional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any specific areas to focus on, health conditions, preferences..."
                rows={3}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>
          </div>

          {/* Final Summary */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-amber-800 mb-3 text-sm">Confirm Your Booking</h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-stone-500">Massager</span><span className="font-medium">{massager.name}</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Date & Time</span><span className="font-medium">{selectedDate && formatDateDisplay(selectedDate)}, {selectedSlot}</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Duration</span><span className="font-medium">{duration} minutes</span></div>
              <div className="flex justify-between border-t border-amber-200 pt-2 mt-1">
                <span className="font-bold text-stone-800">Total Amount</span>
                <span className="font-bold text-amber-700 text-base">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="btn-outline">← Back</button>
            <button onClick={handleConfirm} className="btn-primary">
              Confirm Booking ✓
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
