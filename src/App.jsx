import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { BookingProvider } from './context/BookingContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Massagers from './pages/Massagers.jsx'
import MassagerProfile from './pages/MassagerProfile.jsx'
import BookingPage from './pages/BookingPage.jsx'
import Confirmation from './pages/Confirmation.jsx'
import MyBookings from './pages/MyBookings.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <div className="min-h-screen bg-[#faf9f7]">
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/massagers" element={<ProtectedRoute><Massagers /></ProtectedRoute>} />
              <Route path="/massagers/:id" element={<ProtectedRoute><MassagerProfile /></ProtectedRoute>} />
              <Route path="/book/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
              <Route path="/confirmation" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
              <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            </Routes>
          </div>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
