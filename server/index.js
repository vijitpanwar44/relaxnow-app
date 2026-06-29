import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import bookingRoutes from './routes/bookings.js'
import massagerRoutes from './routes/massagersApi.js'
import notificationRoutes from './routes/notifications.js'
import paymentRoutes from './routes/payments.js'
import './config/passport.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(cors({ origin: FRONTEND_URL, credentials: true }))
app.use(express.json())
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 10 * 60 * 1000 },
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/massagers', massagerRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/payments', paymentRoutes)

// In production, Express serves the built Vite frontend
if (process.env.NODE_ENV === 'production') {
  const dist = join(__dirname, '../dist')
  app.use(express.static(dist))
  app.get('*', (req, res) => res.sendFile(join(dist, 'index.html')))
}

app.listen(PORT, () => {
  console.log(`RelaxNow server on http://localhost:${PORT}`)
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.log('  ⚠  Google OAuth not configured — set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET in .env')
  }
})
