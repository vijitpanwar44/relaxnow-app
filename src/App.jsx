import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { BookingProvider } from './context/BookingContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import AuthCallback from './pages/AuthCallback.jsx'
import Home from './pages/Home.jsx'
import Massagers from './pages/Massagers.jsx'
import MassagerProfile from './pages/MassagerProfile.jsx'
import BookingPage from './pages/BookingPage.jsx'
import Confirmation from './pages/Confirmation.jsx'
import MyBookings from './pages/MyBookings.jsx'
import MassagerLogin from './pages/MassagerLogin.jsx'
import MassagerDashboard from './pages/MassagerDashboard.jsx'
import MassagerApply from './pages/MassagerApply.jsx'
import Spas from './pages/Spas.jsx'
import BottomNav from './components/BottomNav.jsx'

function AppLoader() {
  return (
    <div className="fixed inset-0 bg-[#faf9f7] flex flex-col items-center justify-center z-50">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <span className="text-2xl font-semibold text-stone-800" style={{ fontFamily: 'Playfair Display, serif' }}>
          Home Wellness
        </span>
      </div>
      <div className="w-48 h-1 bg-stone-200 rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-amber-500 rounded-full shimmer-bar" />
      </div>
    </div>
  )
}

function AppContent() {
  const location = useLocation()
  const { authReady } = useAuth()

  if (!authReady) return <AppLoader />

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Navbar />
      <main key={location.key} className="page-enter pb-20 md:pb-0">
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/massager/login" element={<MassagerLogin />} />
          <Route path="/massager/apply" element={<MassagerApply />} />

          {/* Customer protected */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/massagers" element={<ProtectedRoute><Massagers /></ProtectedRoute>} />
          <Route path="/massagers/:id" element={<ProtectedRoute><MassagerProfile /></ProtectedRoute>} />
          <Route path="/book/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/confirmation" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/spas" element={<ProtectedRoute><Spas /></ProtectedRoute>} />

          {/* Massager portal */}
          <Route path="/massager/dashboard" element={<MassagerDashboard />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <AppContent />
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
