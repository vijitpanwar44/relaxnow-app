import { Router } from 'express'
import { store } from '../db/store.js'
import { requireMassager } from '../middleware/auth.js'

const router = Router()

// IMPORTANT: specific routes before /:id catch-all

router.get('/unread-count', requireMassager, (req, res) => {
  const count = store.getUnreadCount(req.user.massagerId)
  res.json({ count })
})

router.post('/mark-all-read', requireMassager, (req, res) => {
  store.markAllRead(req.user.massagerId)
  res.json({ success: true })
})

router.get('/', requireMassager, (req, res) => {
  const notifications = store.getNotifications(req.user.massagerId)
  res.json({ notifications })
})

router.patch('/:id/read', requireMassager, (req, res) => {
  const notif = store.markNotificationRead(req.params.id)
  if (!notif) return res.status(404).json({ error: 'Notification not found' })
  res.json({ notification: notif })
})

export default router
