'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, signInWithEmailAndPassword, googleProvider, signInWithPopup, sendPasswordResetEmail } from '@/lib/firebase'
import { getUserRole } from '@/lib/firestore'
import Toast from '@/components/Toast'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false)
  const [toast, setToast] = useState({ show: false, type: 'success' as any, message: '' })
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const showToast = (type: string, message: string) => {
    setToast({ show: true, type, message })
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 5000)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    
    if (!forgotPasswordMode && !formData.password) newErrors.password = 'Password is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      if (forgotPasswordMode) {
        // Send password reset email
        await sendPasswordResetEmail(auth, formData.email)
        showToast('success', 'Password reset email sent! Check your inbox.')
        setForgotPasswordMode(false)
      } else {
        // Sign in with Firebase
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        )
        
        const user = userCredential.user
        
        // Get user role from Firestore
        const roleData = await getUserRole(user.uid)
        
        showToast('success', 'Welcome back!')
        
        // Redirect based on role
        setTimeout(() => {
          if (roleData.role === 'admin') {
            router.push('/admin')
          } else if (roleData.role === 'provider') {
            router.push('/provider-dashboard')
          } else {
            router.push('/')
          }
        }, 1500)
      }
      
    } catch (error: any) {
      console.error('Error:', error)
      let errorMessage = 'Operation failed'
      
      if (forgotPasswordMode) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email'
            break
          case 'auth/invalid-email':
            errorMessage = 'Invalid email format'
            break
          default:
            errorMessage = error.message
        }
      } else {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email'
            break
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password'
            break
          case 'auth/invalid-email':
            errorMessage = 'Invalid email format'
            break
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled'
            break
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later'
            break
          default:
            errorMessage = error.message
        }
      }
      
      showToast('error', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Get user role from Firestore
      const roleData = await getUserRole(user.uid)
      
      showToast('success', 'Welcome!')
      
      // Redirect based on role
      setTimeout(() => {
        if (roleData.role === 'admin') {
          router.push('/admin')
        } else if (roleData.role === 'provider') {
          router.push('/provider-dashboard')
        } else {
          router.push('/')
        }
      }, 1500)
    } catch (error: any) {
      console.error('Google login error:', error)
      let errorMessage = 'Google login failed'
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Login cancelled'
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup blocked. Please allow popups'
      }
      
      showToast('error', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-3 text-2xl font-bold text-slate-900">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">EN</span>
            Explore Nepal
          </Link>
          <p className="mt-3 text-sm text-slate-500">
            {forgotPasswordMode ? 'Reset your password to continue your adventure.' : 'Sign in to access trips, bookings, and your dashboard.'}
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/50">
          <div className="mb-8 space-y-3 text-center">
            <h1 className="text-3xl font-semibold text-slate-900">
              {forgotPasswordMode ? 'Reset Password' : 'Welcome back'}
            </h1>
            <p className="text-sm text-slate-500">
              {forgotPasswordMode ? 'Enter your email to receive a reset link.' : 'Sign in to continue your adventure.'}
            </p>
          </div>

          {!forgotPasswordMode && (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="mb-5 flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">G</span>
                Continue with Google
              </button>

              <div className="mb-6 flex items-center gap-3 text-sm text-slate-400">
                <span className="h-px flex-1 bg-slate-200"></span>
                or continue with email
                <span className="h-px flex-1 bg-slate-200"></span>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {!forgotPasswordMode && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordMode(true)}
                    className="text-sm font-semibold text-slate-900 hover:text-slate-700"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100 ${errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading}
                />
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (forgotPasswordMode ? 'Sending reset link...' : 'Signing in...') : (forgotPasswordMode ? 'Send Reset Link' : 'Sign in')}
            </button>

            {forgotPasswordMode && (
              <button
                type="button"
                onClick={() => setForgotPasswordMode(false)}
                disabled={loading}
                className="mt-3 w-full text-sm font-semibold text-slate-900 hover:text-slate-700"
              >
                Back to login
              </button>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {forgotPasswordMode ? (
              <>Remember your password?{' '}
              <button onClick={() => setForgotPasswordMode(false)} className="font-semibold text-slate-900 hover:text-slate-700">
                Sign in
              </button>
              </>
            ) : (
              <>Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-slate-900 hover:text-slate-700">
                Create one
              </Link>
              </>
            )}
          </p>
        </div>
      </div>

      <Toast show={toast.show} type={toast.type === 'success' ? 'success' : 'error'} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  )
}
