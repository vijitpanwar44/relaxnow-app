import { Router } from 'express'
import { massagers } from '../../src/data/massagers.js'
import { store } from '../db/store.js'

const router = Router()

const DEFAULT_SLOTS = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00']

router.get('/:id/slots', (req, res) => {
  const massagerId = parseInt(req.params.id)
  const { date } = req.query
  if (!date) return res.status(400).json({ error: 'date query param required' })
  const massager = massagers.find(m => m.id === massagerId)
  if (!massager) return res.status(404).json({ error: 'Massager not found' })
  const allSlots = massager.timeSlots[date] || DEFAULT_SLOTS
  const available = allSlots.filter(slot => !store.isSlotBooked(massagerId, date, slot))
  res.json({ slots: available, date, massagerId })
})

// Submit massager onboarding application
router.post('/apply', async (req, res) => {
  const { name, phone, email, gender, sector, experience, specialties, languages, bio, certifications, idType, idNumber } = req.body || {}
  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'Name, phone, and email are required' })
  }
  const cleanPhone = String(phone).replace(/\D/g, '').slice(-10)
  if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
    return res.status(400).json({ error: 'Enter a valid 10-digit Indian mobile number' })
  }
  const application = store.createMassagerApplication({
    name: String(name).trim(),
    phone: cleanPhone,
    email: String(email).toLowerCase().trim(),
    gender: gender || '',
    sector: sector || '',
    experience: experience || '',
    specialties: Array.isArray(specialties) ? specialties : [],
    languages: Array.isArray(languages) ? languages : [],
    bio: bio || '',
    certifications: certifications || '',
    idType: idType || '',
    idNumber: idNumber || '',
  })
  res.status(201).json({ success: true, applicationId: application.id })
})

export default router
