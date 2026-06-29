import jwt from 'jsonwebtoken'
import { verifyToken as verifyClerkToken } from '@clerk/backend'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production'

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const token = header.slice(7)

  // Try our own JWT first (massager accounts)
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    return next()
  } catch {}

  // Try Clerk session token (customer accounts)
  try {
    const payload = await verifyClerkToken(token, { secretKey: process.env.CLERK_SECRET_KEY })
    req.user = { id: payload.sub, role: 'customer' }
    return next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export async function requireMassager(req, res, next) {
  await requireAuth(req, res, () => {
    if (req.user?.role !== 'massager') {
      return res.status(403).json({ error: 'Massager access required' })
    }
    next()
  })
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}
