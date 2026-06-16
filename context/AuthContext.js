'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { 
  auth, 
  onAuthStateChanged,
  signOut,
  googleProvider,
  signInWithPopup
} from '@/lib/firebase'
import { getUserRole } from '@/lib/firestore'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Set user immediately with basic auth data for faster UI render
        const basicUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          phoneNumber: firebaseUser.phoneNumber,
          role: 'tourist', // Default role, will update async
          businessType: null,
          businessName: null
        }
        setUser(basicUser)
        setLoading(false)
        
        // Fetch role data asynchronously (non-blocking)
        try {
          const roleData = await getUserRole(firebaseUser.uid)
          if (roleData) {
            setUser(prev => ({
              ...prev,
              role: roleData.role || 'tourist',
              businessType: roleData.businessType || null,
              businessName: roleData.businessName || null
            }))
          }
        } catch (err) {
          console.error('Error fetching user role:', err)
        }
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      return { success: true }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return { success: true, user: result.user }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    loading,
    error,
    logout,
    signInWithGoogle,
    isAuthenticated: !!user,
    isTourist: user?.role === 'tourist',
    isProvider: user?.role === 'provider'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
