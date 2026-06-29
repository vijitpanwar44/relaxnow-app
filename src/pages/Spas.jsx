import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const mockSpas = [
  {
    id: 1,
    name: 'Serene Spa & Wellness',
    location: 'Sector 18, Noida',
    rating: 4.8,
    reviews: 124,
    services: ['Swedish Massage', 'Deep Tissue', 'Facials', 'Steam Room'],
    priceFrom: 1200,
    image: null,
    color: '#d97706',
    badge: 'Top Rated',
  },
  {
    id: 2,
    name: 'The Wellness Studio',
    location: 'Sector 62, Noida',
    rating: 4.6,
    reviews: 89,
    services: ['Thai Massage', 'Aromatherapy', 'Hot Stone', 'Body Wrap'],
    priceFrom: 999,
    image: null,
    color: '#7c3aed',
    badge: 'New',
  },
  {
    id: 3,
    name: 'Tranquil Touch Spa',
    location: 'Greater Noida West',
    rating: 4.7,
    reviews: 201,
    services: ['Couples Massage', 'Sports Massage', 'Reflexology', 'Sauna'],
    priceFrom: 1500,
    image: null,
    color: '#0f766e',
    badge: 'Premium',
  },
]

export default function Spas() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleNotify = (e) => {
    e.preventDefault()
    if (email.trim()) setSubmitted(true)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Coming Soon Hero */}
      <div className="relative bg-gradient-to-br from-stone-800 via-stone-700 to-amber-900 rounded-3xl overflow-hidden p-10 mb-10 text-white text-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-stone-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-amber-600/80 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-wider">
            <span className="w-2 h-2 bg-amber-300 rounded-full animate-pulse" />
            Coming Soon
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Book a Spa Slot<br />
            <span className="text-amber-400">Near You</span>
          </h1>
          <p className="text-stone-300 text-lg mb-8 leading-relaxed">
            We're onboarding verified local spas in Noida & Greater Noida. Book a slot, walk in, and enjoy a premium spa experience — all through the same trusted platform.
          </p>

          {/* Notify form */}
          {submitted ? (
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-green-300 px-6 py-3 rounded-xl font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              You're on the list! We'll notify you when spas go live.
            </div>
          ) : (
            <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap">
                Notify Me
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Two modes explanation */}
      <div className="grid md:grid-cols-2 gap-5 mb-12">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
          <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center text-white text-xl mb-4">🏠</div>
          <h3 className="text-xl font-bold text-stone-800 mb-2">At Home</h3>
          <p className="text-stone-600 text-sm leading-relaxed mb-3">
            A verified therapist comes to your location. You choose the time, we send the professional.
          </p>
          <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Available Now</span>
          <div className="mt-4">
            <Link to="/massagers" className="text-amber-700 font-semibold text-sm hover:underline">
              Browse therapists →
            </Link>
          </div>
        </div>
        <div className="bg-stone-50 border-2 border-stone-200 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <span className="bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">Coming Soon</span>
          </div>
          <div className="w-12 h-12 bg-stone-300 rounded-xl flex items-center justify-center text-stone-600 text-xl mb-4">🧖</div>
          <h3 className="text-xl font-bold text-stone-800 mb-2">Visit a Spa</h3>
          <p className="text-stone-600 text-sm leading-relaxed mb-3">
            Browse verified local spas, pick a service, book a slot, and walk in. Full spa ambience, professionally managed.
          </p>
          <span className="inline-block bg-stone-200 text-stone-500 text-xs font-bold px-3 py-1 rounded-full">In Progress</span>
        </div>
      </div>

      {/* Mock Spa Listings */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-stone-800">Spas Coming to the Platform</h2>
            <p className="text-stone-500 text-sm mt-1">We're currently onboarding these verified spas in Noida</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {mockSpas.map(spa => (
            <div key={spa.id} className="relative bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden group">
              {/* Coming soon overlay */}
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-2">
                <span className="bg-stone-800 text-white text-xs font-bold px-4 py-2 rounded-full">Coming Soon</span>
                <span className="text-stone-500 text-xs">Launching in Noida</span>
              </div>

              {/* Card content (blurred behind overlay) */}
              <div className="h-28 w-full flex items-center justify-center" style={{ backgroundColor: spa.color + '22' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: spa.color + '33' }}>
                  🧖
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-stone-800 text-sm leading-tight">{spa.name}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full ml-2 shrink-0"
                    style={{ backgroundColor: spa.color + '22', color: spa.color }}>
                    {spa.badge}
                  </span>
                </div>
                <p className="text-stone-400 text-xs flex items-center gap-1 mb-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {spa.location}
                </p>
                <div className="flex items-center gap-1 text-amber-500 text-xs mb-3">
                  ★ <span className="text-stone-700 font-semibold">{spa.rating}</span>
                  <span className="text-stone-400">({spa.reviews} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {spa.services.slice(0, 3).map(s => (
                    <span key={s} className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                  <div>
                    <p className="text-xs text-stone-400">Starts from</p>
                    <p className="font-bold text-stone-700">₹{spa.priceFrom.toLocaleString()}</p>
                  </div>
                  <button disabled className="text-xs bg-stone-200 text-stone-400 px-4 py-2 rounded-xl font-semibold cursor-not-allowed">
                    Book Slot
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
