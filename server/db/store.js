import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, 'data.json')

const MASSAGER_SEED = [
  { massagerId: 1,  email: 'priya@relaxnow.com',  name: 'Priya Sharma'  },
  { massagerId: 3,  email: 'kavya@relaxnow.com',  name: 'Kavya Nair'    },
  { massagerId: 4,  email: 'rahul@relaxnow.com',  name: 'Rahul Mehta'   },
  { massagerId: 5,  email: 'arjun@relaxnow.com',  name: 'Arjun Kapoor'  },
  { massagerId: 6,  email: 'vikram@relaxnow.com', name: 'Vikram Singh'  },
  { massagerId: 7,  email: 'meera@relaxnow.com',  name: 'Meera Joshi'   },
  { massagerId: 8,  email: 'sakura@relaxnow.com', name: 'Sakura Tanaka' },
  { massagerId: 9,  email: 'nisha@relaxnow.com',  name: 'Nisha Patel'   },
  { massagerId: 10, email: 'divya@relaxnow.com',  name: 'Divya Reddy'   },
]

function initData() {
  if (existsSync(DB_PATH)) {
    const data = JSON.parse(readFileSync(DB_PATH, 'utf8'))
    // Migrate: add new collections if missing
    if (!data.otps) data.otps = []
    if (!data.massagerApplications) data.massagerApplications = []
    if (!data.phoneLeads) data.phoneLeads = []
    return data
  }
  const defaultHash = bcrypt.hashSync('relax@123', 10)
  const data = {
    users: [],
    bookings: [],
    notifications: [],
    otps: [],
    massagerApplications: [],
    phoneLeads: [],
    massagerAccounts: MASSAGER_SEED.map((m, i) => ({
      id: i + 1,
      ...m,
      passwordHash: defaultHash,
    })),
  }
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
  return data
}

let db = initData()

function save() {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

export const store = {
  // Users
  findUserByGoogleId: (googleId) => db.users.find(u => u.googleId === googleId) || null,
  findUserById: (id) => db.users.find(u => u.id === id) || null,
  findUserByPhone: (phone) => db.users.find(u => u.phone === phone) || null,
  createUser: (data) => {
    const user = { id: crypto.randomUUID(), ...data, createdAt: new Date().toISOString() }
    db.users.push(user)
    save()
    return user
  },
  createPhoneUser: (phone, name) => {
    const user = { id: crypto.randomUUID(), phone, name, email: null, googleId: null, role: 'customer', avatar: null, createdAt: new Date().toISOString() }
    db.users.push(user)
    save()
    return user
  },

  // Phone leads — captured on OTP send
  savePhoneLead: (phone) => {
    const existing = db.phoneLeads.find(l => l.phone === phone)
    if (existing) { existing.lastSeen = new Date().toISOString(); save(); return }
    db.phoneLeads.push({ phone, capturedAt: new Date().toISOString(), lastSeen: new Date().toISOString() })
    save()
  },

  // OTPs
  saveOtp: (phone, otp) => {
    db.otps = db.otps.filter(o => o.phone !== phone)
    const record = { id: crypto.randomUUID(), phone, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), used: false }
    db.otps.push(record)
    save()
    return record
  },
  findValidOtp: (phone, otp) => {
    const now = new Date().toISOString()
    return db.otps.find(o => o.phone === phone && o.otp === otp && !o.used && o.expiresAt > now) || null
  },
  markOtpUsed: (id) => {
    const o = db.otps.find(o => o.id === id)
    if (o) { o.used = true; save() }
  },

  // Massager accounts
  findMassagerAccount: (email) => db.massagerAccounts.find(m => m.email === email) || null,

  // Massager applications
  createMassagerApplication: (data) => {
    const app = { id: crypto.randomUUID(), ...data, status: 'pending', submittedAt: new Date().toISOString() }
    db.massagerApplications.push(app)
    save()
    return app
  },
  getMassagerApplications: () => db.massagerApplications,

  // Bookings
  getBookings: (userId) => db.bookings.filter(b => b.userId === userId),
  getBookingsByMassager: (massagerId) => db.bookings.filter(b => b.massagerId === massagerId),
  createBooking: (data) => {
    const n = db.bookings.length + 1
    const booking = {
      id: crypto.randomUUID(),
      bookingNo: `RN${String(n).padStart(4, '0')}`,
      ...data,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }
    db.bookings.push(booking)
    save()
    return booking
  },
  isSlotBooked: (massagerId, date, slot) =>
    db.bookings.some(b => b.massagerId === massagerId && b.date === date && b.slot === slot),

  // Notifications
  getNotifications: (massagerId) =>
    db.notifications
      .filter(n => n.massagerId === massagerId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  getUnreadCount: (massagerId) =>
    db.notifications.filter(n => n.massagerId === massagerId && !n.read).length,
  createNotification: (data) => {
    const notif = { id: crypto.randomUUID(), ...data, read: false, createdAt: new Date().toISOString() }
    db.notifications.push(notif)
    save()
    return notif
  },
  markNotificationRead: (id) => {
    const n = db.notifications.find(n => n.id === id)
    if (n) { n.read = true; save() }
    return n || null
  },
  markAllRead: (massagerId) => {
    db.notifications.filter(n => n.massagerId === massagerId).forEach(n => { n.read = true })
    save()
  },
}
