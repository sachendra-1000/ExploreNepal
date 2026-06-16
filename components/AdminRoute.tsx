'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      // For development/testing, we might want to bypass this
      // router.push('/login')
    }
  }, [user, loading, router])

  // Completely bypassed for development/testing as per previous state
  return <>{children}</>
}
