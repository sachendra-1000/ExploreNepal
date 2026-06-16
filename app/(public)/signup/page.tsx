'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, createUserWithEmailAndPassword, updateProfile, googleProvider, signInWithPopup } from '@/lib/firebase'
import { createUserProfile } from '@/lib/firestore'
import Toast from '@/components/Toast'

export default function Signup() {
  const router = useRouter()
  const [userType, setUserType] = useState('tourist') // 'tourist' or 'provider'
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, type: 'success' as any, message: '' })
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessType: '',
    businessName: '',
    location: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message })
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 5000)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    // Provider-specific validation
    if (userType === 'provider') {
      if (!formData.businessType) newErrors.businessType = 'Business type is required'
      if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required'
      if (!formData.location.trim()) newErrors.location = 'Location is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )
      
      const user = userCredential.user
      
      // Update profile
      await updateProfile(user, {
        displayName: formData.fullName
      })
      
      // Create user profile in Firestore
      const userData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: userType,
        businessType: userType === 'provider' ? formData.businessType : null,
        businessName: userType === 'provider' ? formData.businessName : null,
        location: userType === 'provider' ? formData.location : null
      }
      
      await createUserProfile(user.uid, userData)
      
      showToast('success', 'Account created successfully!')
      
      // Redirect based on user type
      setTimeout(() => {
        if (userType === 'provider') {
          router.push('/provider-dashboard')
        } else {
          router.push('/')
        }
      }, 1500)
      
    } catch (error: any) {
      console.error('Signup error:', error)
      let errorMessage = 'Failed to create account'
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists'
          break
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address'
          break
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Use at least 6 characters'
          break
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection'
          break
        default:
          errorMessage = error.message
      }
      
      showToast('error', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Create user profile
      const userData = {
        name: user.displayName,
        email: user.email,
        phone: '',
        role: userType,
        businessType: userType === 'provider' ? 'Hotel' : null,
        businessName: userType === 'provider' ? user.displayName + ' Business' : null,
        location: userType === 'provider' ? 'Nepal' : null
      }
      
      await createUserProfile(user.uid, userData)
      
      showToast('success', 'Welcome! Account created with Google.')
      
      setTimeout(() => {
        if (userType === 'provider') {
          router.push('/provider-dashboard')
        } else {
          router.push('/')
        }
      }, 1500)
    } catch (error: any) {
      console.error('Google signup error:', error)
      let errorMessage = 'Google signup failed'
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Signup cancelled. Please try again.'
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup blocked. Please allow popups for this site.'
      }
      
      showToast('error', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-10 grid gap-12 rounded-[32px] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/50 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="space-y-6">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 text-2xl font-bold text-slate-900">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">EN</span>
                Explore Nepal
              </Link>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-slate-900">Create your account</h1>
              <p className="text-sm text-slate-500">Register as a Tourist or Service Provider to manage bookings and trips.</p>
            </div>

            <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-700">Joining as</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setUserType('tourist')}
                  className={`rounded-2xl border p-4 text-left transition ${userType === 'tourist' ? 'border-slate-900 bg-white shadow-sm' : 'border-slate-200 bg-transparent hover:border-slate-900'}`}
                >
                  <p className="text-sm font-semibold text-slate-900">Tourist</p>
                  <p className="mt-2 text-sm text-slate-500">Book trips, hotels and local tours.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('provider')}
                  className={`rounded-2xl border p-4 text-left transition ${userType === 'provider' ? 'border-slate-900 bg-white shadow-sm' : 'border-slate-200 bg-transparent hover:border-slate-900'}`}
                >
                  <p className="text-sm font-semibold text-slate-900">Provider</p>
                  <p className="mt-2 text-sm text-slate-500">Add services, manage bookings and grow your business.</p>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">G</span>
              Continue with Google as {userType === 'tourist' ? 'Tourist' : 'Provider'}
            </button>

            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span className="h-px flex-1 bg-slate-200"></span>
              or register with email
              <span className="h-px flex-1 bg-slate-200"></span>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 space-y-2 text-center">
              <h2 className="text-2xl font-semibold text-slate-900">Sign up</h2>
              <p className="text-sm text-slate-500">Start by entering your details below.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100 ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={loading}
                />
                {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100 ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}
                  placeholder="+977 98XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={loading}
                />
                {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {userType === 'provider' && (
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Business Type</label>
                    <select
                      className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100 ${errors.businessType ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      disabled={loading}
                    >
                      <option value="">Select business type</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Guide">Tour Guide</option>
                    </select>
                    {errors.businessType && <p className="mt-2 text-sm text-red-600">{errors.businessType}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Business Name</label>
                    <input
                      type="text"
                      className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100 ${errors.businessName ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}
                      placeholder="Your business name"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      disabled={loading}
                    />
                    {errors.businessName && <p className="mt-2 text-sm text-red-600">{errors.businessName}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Location</label>
                    <input
                      type="text"
                      className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100 ${errors.location ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}
                      placeholder="Business location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={loading}
                    />
                    {errors.location && <p className="mt-2 text-sm text-red-600">{errors.location}</p>}
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                <input
                  type="password"
                  className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100 ${errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}
                  placeholder="Create password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading}
                />
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Confirm Password</label>
                <input
                  type="password"
                  className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100 ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={loading}
                />
                {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creating account...' : `Sign up as ${userType === 'tourist' ? 'Tourist' : 'Provider'}`}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-slate-900 hover:text-slate-700">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  )
}
