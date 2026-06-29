import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { store } from '../db/store.js'

const clientID = process.env.GOOGLE_CLIENT_ID || ''
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || ''
const serverURL = process.env.SERVER_URL || 'http://localhost:3001'

if (clientID && clientSecret) {
  passport.use(new GoogleStrategy(
    { clientID, clientSecret, callbackURL: `${serverURL}/api/auth/google/callback` },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = store.findUserByGoogleId(profile.id)
        if (!user) {
          user = store.createUser({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || '',
            avatar: profile.photos?.[0]?.value || null,
            role: 'customer',
          })
        }
        done(null, user)
      } catch (err) {
        done(err)
      }
    }
  ))
}

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => {
  const user = store.findUserById(id)
  done(null, user || false)
})
