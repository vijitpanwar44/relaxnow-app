import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const SPECIALTIES = ['Swedish', 'Deep Tissue', 'Aromatherapy', 'Sports Massage', 'Thai Massage', 'Ayurvedic', 'Shiatsu', 'Hot Stone', 'Prenatal', 'Reflexology', 'Trigger Point', 'Abhyanga']
const LANGUAGES = ['Hindi', 'English', 'Punjabi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Malayalam', 'Gujarati', 'Kannada']
const SECTORS = [
  'Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 5', 'Sector 6', 'Sector 7', 'Sector 8', 'Sector 9', 'Sector 10',
  'Sector 11', 'Sector 12', 'Sector 14', 'Sector 15', 'Sector 15A', 'Sector 16', 'Sector 16A', 'Sector 17', 'Sector 18',
  'Sector 19', 'Sector 20', 'Sector 21', 'Sector 22', 'Sector 23', 'Sector 24', 'Sector 25', 'Sector 26', 'Sector 27',
  'Sector 28', 'Sector 29', 'Sector 30', 'Sector 31', 'Sector 32', 'Sector 33', 'Sector 34', 'Sector 35', 'Sector 36',
  'Sector 37', 'Sector 38', 'Sector 39', 'Sector 40', 'Sector 41', 'Sector 44', 'Sector 45', 'Sector 46', 'Sector 47',
  'Sector 48', 'Sector 49', 'Sector 50', 'Sector 51', 'Sector 52', 'Sector 53', 'Sector 55', 'Sector 56', 'Sector 57',
  'Sector 58', 'Sector 61', 'Sector 62', 'Sector 63', 'Sector 65', 'Sector 66', 'Sector 67', 'Sector 68', 'Sector 70',
  'Sector 71', 'Sector 72', 'Sector 73', 'Sector 74', 'Sector 75', 'Sector 76', 'Sector 77', 'Sector 78', 'Sector 79',
  'Sector 82', 'Sector 100', 'Sector 101', 'Sector 104', 'Sector 105', 'Sector 107', 'Sector 108', 'Sector 110',
  'Sector 119', 'Sector 120', 'Sector 121', 'Sector 122', 'Sector 123', 'Sector 125', 'Sector 126', 'Sector 128',
  'Sector 129', 'Sector 130', 'Sector 131', 'Sector 132', 'Sector 133', 'Sector 134', 'Sector 135', 'Sector 136',
  'Sector 137', 'Sector 143', 'Sector 144', 'Sector 150', 'Sector 151', 'Sector 152', 'Sector 153', 'Sector 154',
  'Sector 155', 'Sector 156', 'Sector 158', 'Sector 159', 'Sector 160', 'Sector 161', 'Sector 162', 'Sector 163',
  'Sector 164', 'Sector 165', 'Sector 166', 'Sector 167', 'Sector 168', 'Sector 169',
]

const STEPS = ['Personal Info', 'Professional Info', 'Documents']

const INITIAL = {
  name: '', phone: '', email: '', gender: '', sector: '',
  experience: '', specialties: [], languages: [], bio: '', certifications: '',
  idType: '', idNumber: '',
}

export default function MassagerApply() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INITIAL)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [applicationId, setApplicationId] = useState('')

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const toggleArr = (key, val) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
    }))
  }

  const validateStep = () => {
    setError('')
    if (step === 0) {
      if (!form.name.trim()) return 'Full name is required'
      if (!form.phone || form.phone.replace(/\D/g, '').length !== 10) return 'Enter a valid 10-digit mobile number'
      if (!form.email || !form.email.includes('@')) return 'Enter a valid email address'
      if (!form.gender) return 'Select your gender'
      if (!form.sector) return 'Select your sector in Noida'
    }
    if (step === 1) {
      if (!form.experience) return 'Select years of experience'
      if (form.specialties.length === 0) return 'Select at least one specialty'
      if (!form.bio.trim() || form.bio.trim().length < 30) return 'Write a brief bio (at least 30 characters)'
    }
    if (step === 2) {
      if (!form.idType) return 'Select ID document type'
      if (!form.idNumber.trim()) return 'Enter your ID number'
    }
    return null
  }

  const handleNext = () => {
    const err = validateStep()
    if (err) { setError(err); return }
    setStep(s => s + 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validateStep()
    if (err) { setError(err); return }
    setLoading(true)
    setError('')
    try {
      const id = crypto.randomUUID()
      const applications = JSON.parse(localStorage.getItem('hw_massager_applications') || '[]')
      applications.push({ id, ...form, phone: form.phone.replace(/\D/g, ''), submittedAt: new Date().toISOString() })
      localStorage.setItem('hw_massager_applications', JSON.stringify(applications))
      setApplicationId(id)
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-stone-800 mb-3">Application Submitted!</h1>
        <p className="text-stone-600 mb-4">
          Thank you, <strong>{form.name}</strong>! Our team will review your application and contact you at <strong>{form.phone}</strong> within 48 hours.
        </p>
        <div className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 mb-8 text-sm font-mono text-stone-500">
          Application ID: <strong className="text-stone-800">{applicationId.slice(0, 8).toUpperCase()}</strong>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-sm text-blue-700 text-left">
          <p className="font-semibold mb-2">What happens next?</p>
          <ul className="space-y-1.5 list-disc list-inside">
            <li>Our team reviews your application (24–48 hrs)</li>
            <li>We'll call you on <strong>{form.phone}</strong> for a brief interview</li>
            <li>Document verification (Aadhaar / Police clearance)</li>
            <li>Background check completion</li>
            <li>Onboarding & profile activation</li>
          </ul>
        </div>
        <Link to="/massager/login" className="btn-primary inline-block">
          Go to Massager Login
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Apply as a Massager</h1>
        <p className="text-stone-500">Join RelaxNow and start earning. Verified therapists only.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                i < step ? 'bg-amber-600 border-amber-600 text-white' :
                i === step ? 'bg-white border-amber-600 text-amber-600' :
                'bg-white border-stone-200 text-stone-400'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs mt-1 font-medium ${i === step ? 'text-amber-700' : 'text-stone-400'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-16 mx-1 mb-4 ${i < step ? 'bg-amber-600' : 'bg-stone-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="card p-6 sm:p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2 mb-6">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Step 0: Personal Info */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-stone-800 mb-1">Personal Information</h2>
            <p className="text-stone-500 text-sm mb-6">Tell us about yourself</p>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name *</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="Your full name" className="input-field" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Mobile Number *</label>
                <div className="flex">
                  <span className="flex items-center px-3 border border-r-0 border-stone-200 rounded-l-xl bg-stone-50 text-stone-600 text-sm font-medium">+91</span>
                  <input type="tel" inputMode="numeric" maxLength={10} value={form.phone}
                    onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98765 43210"
                    className="flex-1 border border-stone-200 rounded-r-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Gender *</label>
                <select value={form.gender} onChange={e => set('gender', e.target.value)} className="input-field">
                  <option value="">Select</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email Address *</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="your@email.com" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Your Sector in Noida *</label>
              <select value={form.sector} onChange={e => set('sector', e.target.value)} className="input-field">
                <option value="">Select sector</option>
                {SECTORS.map(s => <option key={s} value={s}>{s}, Noida</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Step 1: Professional Info */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-stone-800 mb-1">Professional Information</h2>
            <p className="text-stone-500 text-sm mb-6">Your experience and skills</p>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Years of Experience *</label>
              <select value={form.experience} onChange={e => set('experience', e.target.value)} className="input-field">
                <option value="">Select</option>
                {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'year' : 'years'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Specialties * <span className="text-stone-400 font-normal">(select all that apply)</span></label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleArr('specialties', s)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      form.specialties.includes(s)
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Languages <span className="text-stone-400 font-normal">(select all you speak)</span></label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(l => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => toggleArr('languages', l)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      form.languages.includes(l)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-blue-400'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">About You *</label>
              <textarea
                value={form.bio}
                onChange={e => set('bio', e.target.value)}
                rows={4}
                placeholder="Describe your background, training, and approach to massage therapy..."
                className="input-field resize-none"
              />
              <p className="text-xs text-stone-400 mt-1">{form.bio.length} characters (min 30)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Certifications & Training</label>
              <textarea
                value={form.certifications}
                onChange={e => set('certifications', e.target.value)}
                rows={3}
                placeholder="e.g. Diploma in Massage Therapy (Kerala Ayurveda Academy, 2019), ITEC Certificate, etc."
                className="input-field resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Documents */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-stone-800 mb-1">Document Verification</h2>
            <p className="text-stone-500 text-sm mb-6">Required for background check and ID verification</p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-800 mb-1">Why we need this</p>
              <p className="text-sm text-amber-700">
                We verify the identity of every massager to ensure safety for our customers. Your information is kept strictly confidential.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Government ID Type *</label>
              <select value={form.idType} onChange={e => set('idType', e.target.value)} className="input-field">
                <option value="">Select ID type</option>
                <option value="aadhaar">Aadhaar Card</option>
                <option value="pan">PAN Card</option>
                <option value="driving_license">Driving License</option>
                <option value="passport">Passport</option>
                <option value="voter_id">Voter ID</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">ID Number *</label>
              <input
                type="text"
                value={form.idNumber}
                onChange={e => set('idNumber', e.target.value.toUpperCase())}
                placeholder={form.idType === 'aadhaar' ? 'XXXX XXXX XXXX' : form.idType === 'pan' ? 'ABCDE1234F' : 'Enter ID number'}
                className="input-field font-mono"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">Physical documents required at onboarding</p>
                  <p className="text-sm text-blue-700">
                    Our team will ask you to present the original ID, certifications, and a recent passport photo during your in-person onboarding meeting. Police verification clearance will also be processed at that stage.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-stone-700">Verification Process Includes:</p>
              {[
                { icon: '🪪', label: 'Government ID verification' },
                { icon: '🛡', label: 'Police clearance certificate' },
                { icon: '🎓', label: 'Certification validation' },
                { icon: '📞', label: 'Reference check (previous employers / clients)' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 text-sm text-stone-600">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className={`flex gap-3 mt-8 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
          {step > 0 && (
            <button
              type="button"
              onClick={() => { setStep(s => s - 1); setError('') }}
              className="btn-outline px-6"
            >
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={handleNext} className="btn-primary px-8">
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary px-8 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting…
                </>
              ) : 'Submit Application'}
            </button>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-stone-400 mt-6">
        Already have an account?{' '}
        <Link to="/massager/login" className="text-amber-600 hover:text-amber-800 font-medium">Sign in here</Link>
      </p>
    </div>
  )
}
