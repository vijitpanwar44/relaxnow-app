import { Router } from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { requireAuth } from '../middleware/auth.js'
import { store } from '../db/store.js'
import { massagers } from '../../src/data/massagers.js'
import { sendBookingNotification } from '../services/email.js'
import { sendBookingConfirmationSms } from '../services/sms.js'

const router = Router()

function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys not configured')
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

// Create Razorpay order
router.post('/create-order', requireAuth, async (req, res) => {
  const { amount } = req.body
  if (!amount || amount < 1) return res.status(400).json({ error: 'Invalid amount' })

  try {
    const rp = getRazorpay()
    const order = await rp.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    })
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('[Razorpay create-order]', err.message)
    res.status(500).json({ error: err.message || 'Payment gateway error' })
  }
})

// Verify payment signature + create booking
router.post('/verify', requireAuth, async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, bookingData } = req.body

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment fields' })
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: 'Payment verification failed — invalid signature' })
  }

  const {
    massagerId, massagerName, massagerAvatar, massagerAccentColor,
    date, slot, duration, totalPrice,
    customerName, customerPhone, customerEmail, notes,
  } = bookingData

  if (!massagerId || !date || !slot || !duration) {
    return res.status(400).json({ error: 'Incomplete booking data' })
  }

  if (store.isSlotBooked(massagerId, date, slot)) {
    return res.status(409).json({ error: 'This slot was just booked by someone else. Please choose another.' })
  }

  const booking = store.createBooking({
    userId: req.user.id,
    massagerId, massagerName, massagerAvatar, massagerAccentColor,
    date, slot, duration, totalPrice,
    customerName, customerPhone, customerEmail, notes: notes || '',
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    paymentStatus: 'paid',
  })

  store.createNotification({
    massagerId,
    type: 'new_booking',
    title: 'New Booking Received',
    message: `${customerName} booked a ${duration}-min session on ${date} at ${slot} — ₹${Number(totalPrice).toLocaleString()}`,
    bookingId: booking.id,
    bookingNo: booking.bookingNo,
  })

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

  // SMS confirmation to customer
  if (customerPhone) {
    sendBookingConfirmationSms(customerPhone, {
      customerName, massagerName, date, slot, totalPrice,
      bookingNo: booking.bookingNo,
    }).catch(err => console.error('[SMS error]', err.message))
  }

  res.status(201).json({ booking })
})

export default router
