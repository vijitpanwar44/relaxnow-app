import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistance } from '../utils/geo.js'

export default function MassagerCard({ massager, distance }) {
  const { id, name, gender, experience, rating, reviews, specialties, price, location, photo, avatar, color, accentColor, badges = [] } = massager

  return (
    <div className="card group cursor-pointer">
      <Link to={`/massagers/${id}`}>
        <div className="relative">
          <div className="h-56 relative overflow-hidden bg-stone-100">
            {photo ? (
              <img
                src={photo}
                alt={name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: color }}>
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold shadow-md"
                  style={{ backgroundColor: accentColor, color: '#fff' }}
                >
                  {avatar}
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                gender === 'female' ? 'bg-pink-500/90 text-white' : 'bg-blue-600/90 text-white'
              }`}>
                {gender === 'female' ? '♀ Female' : '♂ Male'}
              </span>
              {distance != null && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-sm flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {formatDistance(distance)}
                </span>
              )}
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="text-lg font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
                  {name}
                </h3>
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {badges.includes('id_verified') && (
                      <span className="inline-flex items-center gap-0.5 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        ✓ ID Verified
                      </span>
                    )}
                    {badges.includes('certified') && (
                      <span className="inline-flex items-center gap-0.5 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                        🎓 Certified
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm shrink-0 ml-2">
                <span className="text-amber-500">★</span>
                <span className="font-semibold text-stone-700">{rating}</span>
                <span className="text-stone-400">({reviews})</span>
              </div>
            </div>

            <p className="text-stone-500 text-sm mb-3 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {specialties.slice(0, 3).map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full font-medium">
                  {s}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <div>
                <span className="text-xs text-stone-400">Starting from</span>
                <p className="text-amber-700 font-bold text-lg">₹{price.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-stone-400">{experience} yrs exp.</p>
                <span className="inline-block mt-1 bg-amber-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium group-hover:bg-amber-700 transition-colors">
                  Book Now
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
