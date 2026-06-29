import { Router } from 'express'
import { store } from '../db/store.js'
import { requireAuth } from '../middleware/auth.js'
import { sendBookingNotification } from '../services/email.js'
import { massagers } from '../../src/data/massagers.js'

const router = Router()

// Confirm booking intent — no payment, no auth required (traffic/demand test)
router.post('/confirm-intent', async (req, res) => {
  const { massagerId, massagerName, massagerAvatar, massagerAccentColor, date, slot, duration, totalPrice, customerName, customerPhone, customerEmail, notes } = req.body

  if (!massagerId || !date || !slot || !duration || !customerName || !customerPhone || !customerEmail) {
    return res.status(400).json({ error: 'Missing required booking fields' })
  }

  if (store.isSlotBooked(massagerId, date, slot)) {
    return res.status(409).json({ error: 'This slot was just booked. Please choose another time.' })
  }

  const booking = store.createBooking({
    userId: 'guest',
    massagerId, massagerName, massagerAvatar, massagerAccentColor,
    date, slot, duration, totalPrice,
    customerName, customerPhone, customerEmail, notes: notes || '',
    paymentStatus: 'pay_on_arrival',
  })

  console.log(`[LEAD] ${customerName} | ${customerPhone} | ${customerEmail} | ${massagerName} | ${date} ${slot} | ₹${totalPrice}`)

  res.status(201).json({ booking })
})

// Create booking
router.post('/', requireAuth, async (req, res) => {
  const { massagerId, massagerName, massagerAvatar, massagerAccentColor, date, slot, duration, totalPrice, customerName, customerPhone, customerEmail, notes } = req.body

  if (!massagerId || !date || !slot || !duration) {
    return res.status(400).json({ error: 'massagerId, date, slot and duration are required' })
  }

  if (store.isSlotBooked(massagerId, date, slot)) {
    return res.status(409).json({ error: 'This slot was just booked by someone else. Please choose another.' })
  }

  const booking = store.createBooking({
    userId: req.user.id,
    massagerId, massagerName, massagerAvatar, massagerAccentColor,
    date, slot, duration, totalPrice,
    customerName, customerPhone, customerEmail, notes: notes || '',
  })

  // In-app notification for massager
  store.createNotification({
    massagerId,
    type: 'new_booking',
    title: 'New Booking Received',
    message: `${customerName} booked a ${duration}-min session on ${date} at ${slot} — ₹${Number(totalPrice).toLocaleString()}`,
    bookingId: booking.id,
    bookingNo: booking.bookingNo,
  })

  // Email notification (non-blocking)
  const massager = massagers.find(m => m.id === massagerId)
  if (massager?.email) {
    sendBookingNotification({
      massagerEmail: massager.email,
      massagerName,
      customerName, customerEmail, customerPhone, date, slot, duration, totalPrice,
      bookingNo: booking.bookingNo,
      notes: notes || '',
    }).catch(err => console.error('[Email error]', err.message))
  }

  res.status(201).json({ booking })
})

// Get bookings — customers see their own, massagers see bookings for them
router.get('/', requireAuth, (req, res) => {
  if (req.user.role === 'massager') {
    const bookings = store.getBookingsByMassager(req.user.massagerId)
    return res.json({ bookings })
  }
  const bookings = store.getBookings(req.user.id)
  res.json({ bookings })
})

export default router
