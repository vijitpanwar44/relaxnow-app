import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { massagers } from '../data/massagers.js'

const services = [
  { icon: '💆', title: 'Swedish Massage', desc: 'Gentle full-body relaxation therapy' },
  { icon: '🔥', title: 'Hot Stone', desc: 'Heated stones melt away tension' },
  { icon: '💪', title: 'Deep Tissue', desc: 'Targets deep muscle layers' },
  { icon: '🌿', title: 'Aromatherapy', desc: 'Essential oils for mind & body' },
  { icon: '🧘', title: 'Thai Massage', desc: 'Stretching & pressure techniques' },
  { icon: '⚽', title: 'Sports Massage', desc: 'Recovery for active bodies' },
]

const stats = [
  { value: '500+', label: 'Happy Clients' },
  { value: '9', label: 'Expert Massagers' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '8+', label: 'Massage Types' },
]

export default function Home() {
  const navigate = useNavigate()
  const topMassagers = massagers.sort((a, b) => b.rating - a.rating).slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-stone-800 via-stone-700 to-amber-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-stone-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Professional massagers available today
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
              Your Perfect
              <span className="block text-amber-400">Relaxation</span>
              Awaits
            </h1>
            <p className="text-lg text-stone-300 mb-10 leading-relaxed">
              Choose from our certified male and female massage therapists. Book your ideal session with transparent pricing and flexible time slots.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Link
                to="/massagers?gender=female"
                className="flex items-center justify-center gap-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                <span className="text-xl">♀</span>
                Female Massagers
              </Link>
              <Link
                to="/massagers?gender=male"
                className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                <span className="text-xl">♂</span>
                Male Massagers
              </Link>
              <Link
                to="/spas"
                className="flex items-center justify-center gap-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 relative"
              >
                <span className="text-xl">🧖</span>
                Visit a Spa
                <span className="absolute -top-2 -right-2 bg-white text-amber-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none shadow">Soon</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-amber-600 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold">{s.value}</div>
                <div className="text-amber-100 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Choose Mode */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-stone-800 mb-3">How Would You Like to Relax?</h2>
          <p className="text-stone-500 text-lg">At home with a verified therapist, or at a local spa — you choose</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/massagers?gender=female"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-50 to-rose-100 border-2 border-pink-200 hover:border-pink-400 p-8 flex items-center gap-5 transition-all hover:shadow-xl"
          >
            <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-105 transition-transform shrink-0">
              ♀
            </div>
            <div>
              <h3 className="text-xl font-bold text-pink-800 mb-1">Female Therapist</h3>
              <p className="text-pink-600 text-sm">{massagers.filter(m => m.gender === 'female').length} at-home therapists</p>
              <span className="inline-block mt-2 text-sm font-semibold text-pink-700 group-hover:underline">
                View profiles →
              </span>
            </div>
          </Link>
          <Link
            to="/massagers?gender=male"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 hover:border-blue-400 p-8 flex items-center gap-5 transition-all hover:shadow-xl"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg group-hover:scale-105 transition-transform shrink-0">
              ♂
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-1">Male Therapist</h3>
              <p className="text-blue-600 text-sm">{massagers.filter(m => m.gender === 'male').length} at-home therapists</p>
              <span className="inline-block mt-2 text-sm font-semibold text-blue-700 group-hover:underline">
                View profiles →
              </span>
            </div>
          </Link>
          <Link
            to="/spas"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-200 hover:border-amber-400 p-8 flex items-center gap-5 transition-all hover:shadow-xl"
          >
            <div className="absolute top-3 right-3">
              <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Soon</span>
            </div>
            <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-105 transition-transform shrink-0">
              🧖
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-800 mb-1">Visit a Spa</h3>
              <p className="text-amber-600 text-sm">Book a slot at a verified local spa</p>
              <span className="inline-block mt-2 text-sm font-semibold text-amber-700 group-hover:underline">
                See what's coming →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="bg-stone-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-stone-800 mb-3">Our Services</h2>
            <p className="text-stone-500 text-lg">Expertly delivered massage therapies for every need</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {services.map((s) => (
              <div key={s.title} className="bg-white rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{s.icon}</div>
                <h4 className="font-semibold text-stone-800 mb-1">{s.title}</h4>
                <p className="text-stone-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-bold text-stone-800 mb-1">Top Rated</h2>
            <p className="text-stone-500">Our highest-rated therapists</p>
          </div>
          <Link to="/massagers" className="text-amber-600 font-semibold hover:underline text-sm">
            View all →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {topMassagers.map((m) => (
            <Link key={m.id} to={`/massagers/${m.id}`}>
              <div className="card group p-6">
                <div className="flex items-center gap-4 mb-4">
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.name}
                      className="w-14 h-14 rounded-full object-cover object-top"
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white"
                      style={{ backgroundColor: m.accentColor }}
                    >
                      {m.avatar}
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
                      {m.name}
                    </h4>
                    <div className="flex items-center gap-1 text-sm text-amber-500">
                      ★ <span className="text-stone-700 font-semibold">{m.rating}</span>
                      <span className="text-stone-400">({m.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {m.specialties.slice(0, 2).map((s) => (
                    <span key={s} className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">{m.experience} yrs exp.</span>
                  <span className="font-bold text-amber-700">₹{m.price.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Spa Coming Soon teaser */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="relative bg-gradient-to-br from-stone-800 to-stone-900 rounded-3xl overflow-hidden p-10 text-white flex flex-col md:flex-row items-center gap-8">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-amber-400 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 flex-1">
            <span className="inline-flex items-center gap-2 bg-amber-600/80 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              <span className="w-2 h-2 bg-amber-300 rounded-full animate-pulse" />
              Coming Soon
            </span>
            <h2 className="text-3xl font-bold mb-3">Visit a Spa Near You</h2>
            <p className="text-stone-300 leading-relaxed mb-2">
              We're onboarding verified local spas in Noida & Greater Noida. Browse slots, book online, walk in.
            </p>
            <p className="text-stone-400 text-sm">Same platform. Same trust. Full spa experience.</p>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-4 text-center shrink-0">
            <div className="text-6xl">🧖</div>
            <Link
              to="/spas"
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-3 rounded-xl transition-colors"
            >
              See What's Coming
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-700 py-16 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Ready to Relax?</h2>
          <p className="text-amber-100 text-lg mb-8">
            Book your session in under 2 minutes. Choose your massager, pick a time, and unwind.
          </p>
          <Link
            to="/massagers"
            className="inline-block bg-white text-amber-700 font-bold px-10 py-4 rounded-xl hover:bg-amber-50 transition-colors shadow-lg text-lg"
          >
            Browse All Massagers
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-8 text-center text-sm">
        <p>© 2026 Home Wellness. All rights reserved.</p>
        <p className="mt-1">Professional massage booking platform</p>
      </footer>
    </div>
  )
}
