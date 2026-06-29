import React, { useState, useEffect } from 'react'
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
  const [apiSlots, setApiSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [termsError, setTermsError] = useState(false)

  if (!massager) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-700 mb-4">Massager not found</h2>
        <Link to="/massagers" className="btn-primary">Back to Listings</Link>
      </div>
    )
  }

  // Fetch available slots from API when date changes
  useEffect(() => {
    if (!selectedDate || !massager) return
    const dateKey = formatDate(selectedDate)
    setSlotsLoading(true)
    setApiSlots([])
    fetch(`/api/massagers/${massager.id}/slots?date=${dateKey}`)
      .then(r => r.json())
      .then(({ slots }) => { setApiSlots(slots || []); setSlotsLoading(false) })
      .catch(() => { setApiSlots([]); setSlotsLoading(false) })
  }, [selectedDate, massager?.id])

  const dates = getDatesForNext7Days()
  const selectedDateKey = selectedDate ? formatDate(selectedDate) : null
  const availableSlots = apiSlots
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

  const handleConfirmBooking = async () => {
    if (!validate()) return
    if (!termsAccepted) { setTermsError(true); return }
    setTermsError(false)
    setSubmitting(true)
    setBookingError('')

    try {
      const booking = await addBooking({
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
    } catch (err) {
      setBookingError(err.message || 'Booking failed. Please try again.')
      setSubmitting(false)
    }
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
          <img src={massager.photo} alt={massager.name} className="w-14 h-14 rounded-xl object-cover object-center shrink-0" />
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
              const isSelected = selectedDate && formatDate(selectedDate) === key
              return (
                <button
                  key={key}
                  onClick={() => { setSelectedDate(date); setSelectedSlot(null) }}
                  className={`p-3 rounded-xl text-center transition-all border-2 ${
                    isSelected
                      ? 'bg-amber-600 border-amber-600 text-white'
                      : 'border-stone-200 hover:border-amber-400 text-stone-700'
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
              {slotsLoading ? (
                <div className="flex items-center gap-2 text-stone-400 py-4">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Checking availability…
                </div>
              ) : availableSlots.length > 0 ? (
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

          {/* Terms & Conditions */}
          <div className={`border rounded-xl p-4 mb-5 ${termsError ? 'border-red-300 bg-red-50' : 'border-stone-200 bg-stone-50'}`}>
            <h4 className="font-semibold text-stone-800 text-sm mb-2 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Terms & Conditions
            </h4>
            <div className="text-xs text-stone-600 leading-relaxed space-y-1.5 mb-3 max-h-28 overflow-y-auto pr-1">
              <p>RelaxNow is a professional massage therapy booking platform. By confirming this booking, you agree to the following:</p>
              <p><strong>1. Therapeutic purpose only.</strong> This platform is strictly for booking licensed, professional therapeutic massage services. It must not be used for any sexual purpose, escort service, or any activity that violates Indian law.</p>
              <p><strong>2. No sexual activity.</strong> Any form of sexual solicitation, sexual contact, or indecent behaviour towards a massage therapist is strictly prohibited and constitutes a criminal offence under the Indian Penal Code (IPC Sections 354, 354A, 509 and related provisions).</p>
              <p><strong>3. User accountability.</strong> If the user engages in any illegal activity, sexually inappropriate behaviour, or any act that violates Indian law on the premises or during the session, the user shall be solely and entirely responsible for all legal, civil, and criminal consequences. RelaxNow, its owners, and its therapists bear no liability whatsoever for such conduct.</p>
              <p><strong>4. Not a sex platform.</strong> RelaxNow is NOT and must not be treated as a sex platform or adult entertainment service. Any such misuse will result in immediate cancellation, reporting to law enforcement, and permanent ban from the platform.</p>
              <p><strong>5. Consent.</strong> Therapists have the right to terminate a session at any time if they feel unsafe, uncomfortable, or if the client behaves inappropriately. No refund will be issued in such cases.</p>
            </div>
            <label className={`flex items-start gap-3 cursor-pointer group`}>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={e => { setTermsAccepted(e.target.checked); if (e.target.checked) setTermsError(false) }}
                className="mt-0.5 w-4 h-4 rounded border-stone-300 accent-amber-600 cursor-pointer shrink-0"
              />
              <span className="text-xs text-stone-700 leading-relaxed">
                I have read and agree to the Terms & Conditions. I confirm that I am booking this session strictly for professional therapeutic massage purposes and will not engage in any illegal, sexual, or inappropriate activity. I understand that I alone will be legally responsible for any violation of Indian law during or in connection with this booking.
              </span>
            </label>
            {termsError && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                You must accept the Terms & Conditions to proceed.
              </p>
            )}
          </div>

          {bookingError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {bookingError}
            </div>
          )}
          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="btn-outline" disabled={submitting}>← Back</button>
            <button onClick={handleConfirmBooking} disabled={submitting} className="btn-primary flex items-center gap-2">
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Confirming…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Confirm Booking — Pay on Arrival
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
