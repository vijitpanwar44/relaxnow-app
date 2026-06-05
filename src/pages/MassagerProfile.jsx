import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { massagers } from '../data/massagers.js'

const reviewsData = [
  { name: 'Sneha R.', rating: 5, comment: 'Absolutely amazing session! Felt completely rejuvenated.', date: '2 days ago' },
  { name: 'Amit K.', rating: 5, comment: 'Professional, punctual, and incredibly skilled. Highly recommend!', date: '1 week ago' },
  { name: 'Meera P.', rating: 4, comment: 'Great technique for deep tissue. Will definitely book again.', date: '2 weeks ago' },
]

export default function MassagerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const massager = massagers.find((m) => m.id === parseInt(id))
  const [activeTab, setActiveTab] = useState('about')

  if (!massager) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-700 mb-4">Massager not found</h2>
        <Link to="/massagers" className="btn-primary">Back to Listings</Link>
      </div>
    )
  }

  const { name, gender, age, experience, rating, reviews, specialties, bio, price, location, avatar, color, accentColor, languages } = massager

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link to="/massagers" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 mb-6 text-sm transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to all massagers
      </Link>

      {/* Profile Header */}
      <div className="card mb-6">
        <div className="h-40 w-full" style={{ background: `linear-gradient(135deg, ${color} 0%, ${accentColor}33 100%)` }} />
        <div className="px-6 pb-6 -mt-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-xl border-4 border-white"
              style={{ backgroundColor: accentColor }}
            >
              {avatar}
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold text-stone-800">{name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${gender === 'female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                  {gender === 'female' ? '♀ Female' : '♂ Male'}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <div className="flex items-center gap-1 text-amber-500">
                  <span className="text-lg">★</span>
                  <span className="font-bold text-stone-700 text-lg">{rating}</span>
                  <span className="text-stone-400 text-sm">({reviews} reviews)</span>
                </div>
                <span className="text-stone-400">·</span>
                <span className="text-stone-500 text-sm">{experience} years experience</span>
                <span className="text-stone-400">·</span>
                <span className="text-stone-500 text-sm flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {location}
                </span>
              </div>
            </div>
            <div className="sm:ml-auto text-right">
              <p className="text-xs text-stone-400 mb-1">Session starts from</p>
              <p className="text-3xl font-bold text-amber-700">₹{price.toLocaleString()}</p>
              <button
                onClick={() => navigate(`/book/${id}`)}
                className="mt-3 btn-primary w-full sm:w-auto"
              >
                Book Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Age', value: `${age} years` },
          { label: 'Experience', value: `${experience} years` },
          { label: 'Sessions Done', value: `${reviews}+` },
          { label: 'Languages', value: languages.join(', ') },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-xs text-stone-400 mb-1">{item.label}</p>
            <p className="font-semibold text-stone-800 text-sm">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-stone-100 px-6 flex gap-0">
          {['about', 'specialties', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'about' && (
            <div>
              <h3 className="font-semibold text-stone-800 mb-3">About {name}</h3>
              <p className="text-stone-600 leading-relaxed">{bio}</p>
            </div>
          )}

          {activeTab === 'specialties' && (
            <div>
              <h3 className="font-semibold text-stone-800 mb-4">Specializations</h3>
              <div className="flex flex-wrap gap-3">
                {specialties.map((s) => (
                  <div key={s} className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-xl">
                    <span className="text-amber-600">✓</span>
                    <span className="font-medium">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="font-semibold text-stone-800 mb-4">Client Reviews</h3>
              <div className="space-y-4">
                {reviewsData.map((r, i) => (
                  <div key={i} className="border border-stone-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center text-xs font-bold text-stone-600">
                          {r.name[0]}
                        </div>
                        <span className="font-medium text-stone-800 text-sm">{r.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500 text-sm">{'★'.repeat(r.rating)}</span>
                        <span className="text-stone-400 text-xs">{r.date}</span>
                      </div>
                    </div>
                    <p className="text-stone-600 text-sm">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Book CTA */}
      <div className="mt-6 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-bold text-stone-800 text-lg">Ready to book with {name}?</h3>
          <p className="text-stone-500 text-sm mt-1">Pick a date and time that works for you</p>
        </div>
        <button
          onClick={() => navigate(`/book/${id}`)}
          className="btn-primary whitespace-nowrap"
        >
          Book Now — ₹{price.toLocaleString()}
        </button>
      </div>
    </div>
  )
}
