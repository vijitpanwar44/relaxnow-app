import { Router } from 'express'
import passport from 'passport'
import bcrypt from 'bcryptjs'
import { createClerkClient, verifyToken } from '@clerk/backend'
import { store } from '../db/store.js'
import { signToken, requireAuth } from '../middleware/auth.js'
import { sendOtp } from '../services/sms.js'

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY || '' })

const router = Router()
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const googleEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

// Google OAuth — redirects to Google
router.get('/google', (req, res, next) => {
  if (!googleEnabled) {
    return res.status(503).json({ error: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.' })
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next)
})

// Google callback
router.get('/google/callback',
  (req, res, next) => {
    if (!googleEnabled) return res.redirect(`${FRONTEND_URL}/login?error=oauth_not_configured`)
    passport.authenticate('google', { session: true, failureRedirect: `${FRONTEND_URL}/login?error=oauth_failed` })(req, res, next)
  },
  (req, res) => {
    const u = req.user
    const token = signToken({ id: u.id, email: u.email, name: u.name, role: 'customer', avatar: u.avatar || null })
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`)
  }
)

// Demo customer login (keep for Vercel demo)
router.post('/demo/login', (req, res) => {
  const { email, password } = req.body || {}
  if (email === 'demo@relaxnow.com' && password === 'relax123') {
    let user = store.findUserByGoogleId('demo-user')
    if (!user) {
      user = store.createUser({ googleId: 'demo-user', name: 'Demo User', email: 'demo@relaxnow.com', avatar: null, role: 'customer' })
    }
    const token = signToken({ id: user.id, email: user.email, name: user.name, role: 'customer', avatar: null })
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: 'customer' } })
  }
  res.status(401).json({ error: 'Invalid credentials' })
})

// Clerk token exchange — frontend sends Clerk session token, we return our JWT
router.post('/clerk', async (req, res) => {
  const { token: clerkToken } = req.body || {}
  if (!clerkToken) return res.status(400).json({ error: 'Token required' })
  try {
    const payload = await verifyToken(clerkToken, { secretKey: process.env.CLERK_SECRET_KEY })
    const clerkUserId = payload.sub
    const clerkUser = await clerkClient.users.getUser(clerkUserId)
    const email = clerkUser.emailAddresses[0]?.emailAddress || ''
    const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email
    const avatar = clerkUser.imageUrl || null
    let user = store.findUserByGoogleId(clerkUserId)
    if (!user) user = store.createUser({ googleId: clerkUserId, name, email, avatar, role: 'customer' })
    const jwt = signToken({ id: user.id, email: user.email, name: user.name, role: 'customer', avatar: user.avatar })
    res.json({ token: jwt, user: { id: user.id, email: user.email, name: user.name, role: 'customer' } })
  } catch (err) {
    console.error('[Clerk auth error]', err.message)
    res.status(401).json({ error: 'Invalid Clerk token' })
  }
})

// Massager login
router.post('/massager/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  const account = store.findMassagerAccount(email.toLowerCase().trim())
  if (!account) return res.status(401).json({ error: 'Invalid email or password' })

  const valid = await bcrypt.compare(password, account.passwordHash)
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' })

  const payload = { id: `massager_${account.massagerId}`, email: account.email, name: account.name, role: 'massager', massagerId: account.massagerId }
  const token = signToken(payload)
  res.json({ token, user: payload })
})

// Get current user from JWT
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

// Logout
router.post('/logout', (req, res) => {
  if (req.logout) req.logout(() => {})
  res.json({ success: true })
})

// Send OTP to phone
router.post('/otp/send', async (req, res) => {
  const { phone } = req.body || {}
  const cleaned = String(phone || '').replace(/\D/g, '').slice(-10)
  if (!cleaned || !/^[6-9]\d{9}$/.test(cleaned)) {
    return res.status(400).json({ error: 'Enter a valid 10-digit Indian mobile number' })
  }
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  store.saveOtp(cleaned, otp)
  store.savePhoneLead(cleaned)
  console.log(`[LEAD] Phone: ${cleaned}`)
  await sendOtp(cleaned, otp).catch(err => console.error('[OTP send error]', err.message))
  const isDev = process.env.NODE_ENV !== 'production'
  res.json({ success: true, ...(isDev ? { devOtp: otp } : {}) })
})

// Verify OTP and log in
router.post('/otp/verify', async (req, res) => {
  const { phone, otp, name } = req.body || {}
  const cleaned = String(phone || '').replace(/\D/g, '').slice(-10)
  if (!cleaned || !otp) return res.status(400).json({ error: 'Phone and OTP required' })

  const record = store.findValidOtp(cleaned, String(otp))
  if (!record) return res.status(401).json({ error: 'Invalid or expired OTP. Please try again.' })

  store.markOtpUsed(record.id)

  let user = store.findUserByPhone(cleaned)
  if (!user) {
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Please enter your name to create your account.', isNewUser: true })
    }
    user = store.createPhoneUser(cleaned, String(name).trim())
  }

  const token = signToken({ id: user.id, phone: user.phone, name: user.name, role: 'customer', avatar: null })
  res.json({ token, user: { id: user.id, phone: user.phone, name: user.name, role: 'customer' } })
})

// Whether Google OAuth is configured (for frontend to show/hide the button)
router.get('/config', (req, res) => {
  res.json({ googleEnabled })
})

export default router
