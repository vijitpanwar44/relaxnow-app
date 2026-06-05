import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { massagers } from '../data/massagers.js'
import MassagerCard from '../components/MassagerCard.jsx'

const sortOptions = [
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

  useEffect(() => {
    const g = searchParams.get('gender')
    if (g) setGenderFilter(g)
  }, [searchParams])

  const handleGender = (gender) => {
    setGenderFilter(gender)
    if (gender === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ gender })
    }
  }

  const filtered = massagers
    .filter((m) => {
      if (genderFilter !== 'all' && m.gender !== genderFilter) return false
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) &&
          !m.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()))) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'experience') return b.experience - a.experience
      return 0
    })

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-stone-800 mb-2">Find Your Massager</h1>
        <p className="text-stone-500">Browse certified professionals and book your perfect session</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-8 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>

        {/* Gender Filter */}
        <div className="flex gap-2">
          {['all', 'female', 'male'].map((g) => (
            <button
              key={g}
              onClick={() => handleGender(g)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                genderFilter === g
                  ? g === 'female'
                    ? 'bg-pink-500 border-pink-500 text-white'
                    : g === 'male'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-stone-800 border-stone-800 text-white'
                  : 'border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
            >
              {g === 'all' ? 'All' : g === 'female' ? '♀ Female' : '♂ Male'}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 border-2 border-stone-200 rounded-xl text-sm font-medium text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-stone-500 text-sm">
        Showing <span className="font-semibold text-stone-800">{filtered.length}</span> therapist{filtered.length !== 1 ? 's' : ''}
        {genderFilter !== 'all' && (
          <span> · {genderFilter === 'female' ? '♀ Female' : '♂ Male'} only</span>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((m) => (
            <MassagerCard key={m.id} massager={m} />
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
