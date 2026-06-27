'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { 
  auth, 
  onAuthStateChanged,
  signOut,
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  db
} from '@/lib/firebase'
import { getUserRole, createUserProfile } from '@/lib/firestore'
import { doc, getDoc } from 'firebase/firestore'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Handle redirect result on initial load
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result?.user) {
          // User signed in via redirect, onAuthStateChanged will handle setting user
          console.log('Google redirect sign in successful')
        }
      } catch (err) {
        console.error('Error handling redirect result:', err)
      }
    }

    handleRedirect()

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
          
          // Check if user profile exists (getUserRole returns default if not exists)
          const docRef = doc(db, 'users', firebaseUser.uid)
          const docSnap = await getDoc(docRef)
          
          if (!docSnap.exists()) {
            // Create new user profile
            await createUserProfile(firebaseUser.uid, {
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              phone: '',
              role: 'tourist',
              businessType: null,
              businessName: null,
              location: null
            })
          }
          
          if (roleData) {
            setUser(prev => ({
              ...prev,
              role: roleData.role || 'tourist',
              businessType: roleData.businessType || null,
              businessName: roleData.businessName || null
            }))
          }
        } catch (err) {
          console.error('Error fetching user role or creating profile:', err)
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
      // Check if it's a mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      if (isMobile) {
        // Use redirect for mobile
        await signInWithRedirect(auth, googleProvider)
        return { success: true, redirecting: true }
      } else {
        // Use popup for desktop
        const result = await signInWithPopup(auth, googleProvider)
        return { success: true, user: result.user }
      }
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
