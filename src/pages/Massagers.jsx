import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { massagers } from '../data/massagers.js'
import MassagerCard from '../components/MassagerCard.jsx'
import { haversineKm, formatDistance, AREA_PRESETS } from '../utils/geo.js'

const sortOptions = [
  { value: 'nearest', label: 'Nearest First' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'experience', label: 'Most Experienced' },
]

export default function Massagers() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [genderFilter, setGenderFilter] = useState(searchParams.get('gender') || 'all')
  const [sortBy, setSortBy] = useState('rating')
  const [search, setSearch] = useState('')

  const [userLocation, setUserLocation] = useState(null)
  const [locationStatus, setLocationStatus] = useState('idle') // idle | requesting | granted | denied
  const [manualArea, setManualArea] = useState('')

  useEffect(() => {
    const g = searchParams.get('gender')
    if (g) setGenderFilter(g)
  }, [searchParams])

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('denied')
      return
    }
    setLocationStatus('requesting')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocationStatus('granted')
        setSortBy('nearest')
      },
      () => {
        setLocationStatus('denied')
      },
      { timeout: 8000 }
    )
  }, [])

  const handleManualArea = (label) => {
    const area = AREA_PRESETS.find(a => a.label === label)
    if (area) {
      setManualArea(label)
      setUserLocation({ lat: area.lat, lng: area.lng })
      setSortBy('nearest')
    }
  }

  const handleGender = (gender) => {
    setGenderFilter(gender)
    if (gender === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ gender })
    }
  }

  const withDistance = massagers.map(m => ({
    ...m,
    distance: userLocation ? haversineKm(userLocation.lat, userLocation.lng, m.lat, m.lng) : null,
  }))

  const filtered = withDistance
    .filter((m) => {
      if (genderFilter !== 'all' && m.gender !== genderFilter) return false
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) &&
          !m.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()))) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'nearest' && a.distance != null && b.distance != null) return a.distance - b.distance
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'experience') return b.experience - a.experience
      return 0
    })

  const effectiveSortOptions = userLocation
    ? sortOptions
    : sortOptions.filter(o => o.value !== 'nearest')

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      <div className="mb-5">
        <h1 className="text-2xl md:text-4xl font-bold text-stone-800 mb-1">Find Your Massager</h1>
        <p className="text-stone-500 text-sm md:text-base">Browse certified professionals near you</p>
      </div>

      {/* Location Banner */}
      {locationStatus === 'requesting' && (
        <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Detecting your location to show nearest massagers…
        </div>
      )}

      {locationStatus === 'granted' && (
        <div className="mb-6 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Showing massagers sorted by distance from your location
        </div>
      )}

      {locationStatus === 'denied' && (
        <div className="mb-6 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3">
          <p className="text-sm text-stone-600 mb-2 font-medium">Location access denied — pick your area manually:</p>
          <div className="flex flex-wrap gap-2">
            {AREA_PRESETS.map(a => (
              <button
                key={a.label}
                onClick={() => handleManualArea(a.label)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                  manualArea === a.label
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : 'border-stone-300 text-stone-600 hover:border-amber-400 hover:text-amber-700'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-3">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-2xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        />
      </div>

      {/* Filter chips row — horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-6">
        {['all', 'female', 'male'].map((g) => (
          <button
            key={g}
            onClick={() => handleGender(g)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all border-2 ${
              genderFilter === g
                ? g === 'female'
                  ? 'bg-pink-500 border-pink-500 text-white'
                  : g === 'male'
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-stone-800 border-stone-800 text-white'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
            }`}
          >
            {g === 'all' ? 'All' : g === 'female' ? '♀ Female' : '♂ Male'}
          </button>
        ))}
        <div className="shrink-0 h-8 w-px bg-stone-200 self-center" />
        {effectiveSortOptions.map((o) => (
          <button
            key={o.value}
            onClick={() => setSortBy(o.value)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all border-2 ${
              sortBy === o.value
                ? 'bg-amber-600 border-amber-600 text-white'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-stone-500 text-sm">
        Showing <span className="font-semibold text-stone-800">{filtered.length}</span> therapist{filtered.length !== 1 ? 's' : ''}
        {genderFilter !== 'all' && (
          <span> · {genderFilter === 'female' ? '♀ Female' : '♂ Male'} only</span>
        )}
        {sortBy === 'nearest' && userLocation && (
          <span> · sorted by distance</span>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((m) => (
            <MassagerCard key={m.id} massager={m} distance={m.distance} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-stone-700 mb-2">No therapists found</h3>
          <p className="text-stone-500">Try adjusting your filters</p>
          <button
            onClick={() => { setSearch(''); handleGender('all') }}
            className="mt-4 btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
