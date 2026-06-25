'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import Toast from '@/components/Toast'
import { useAuth } from '@/context/AuthContext'
import { subscribeToUserBookings, cancelBooking } from '@/lib/firestore'
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
  MessageCircle,
  ArrowLeft,
  MoreVertical,
  Trash2
} from 'lucide-react'

// Types
interface Booking {
  id: string
  serviceName?: string
  hotelName?: string
  guideName?: string
  packageName?: string
  userName: string
  userEmail: string
  price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'processing' | 'completed'
  paymentStatus: 'pending' | 'verified' | 'rejected'
  createdAt: any
  type: string
  travelDate: string
  numberOfTravelers?: number
  pickupLocation?: string
}

function MyBookingsContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ show: false, type: 'success' as any, message: '' })
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all')

  // Load bookings
  useEffect(() => {
    if (!user?.uid) return

    const unsubscribe = subscribeToUserBookings(user.uid, (data: Booking[]) => {
      setBookings(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user?.uid])

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ show: true, type, message })
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      const result = await cancelBooking(bookingId)
      if (result.success) {
        showToast('success', 'Booking cancelled successfully')
      } else {
        showToast('error', 'Failed to cancel booking')
      }
    }
  }

  // Filter bookings
  const filteredBookings = activeFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === activeFilter)

  // Status badge styles
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-600'
      case 'pending': return 'bg-amber-100 text-amber-600'
      case 'cancelled': return 'bg-rose-100 text-rose-600'
      case 'completed': return 'bg-blue-100 text-blue-600'
      default: return 'bg-slate-100 text-slate-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return CheckCircle2
      case 'pending': return Clock
      case 'cancelled': return X
      case 'completed': return CheckCircle2
      default: return AlertCircle
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    if (date.toDate) {
      return date.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/image/Phewa Lake.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        <div className="container-custom relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4">
            My Bookings
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl font-medium">
            Track and manage your adventures with Explore Nepal.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4">
            {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">No bookings yet</h3>
              <p className="text-slate-500 font-medium mb-8">Ready to plan your next adventure?</p>
              <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors">
                Explore Services
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map(booking => {
                const StatusIcon = getStatusIcon(booking.status)
                return (
                  <div 
                    key={booking.id} 
                    className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shrink-0">
                          <StatusIcon className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="text-xl font-black text-slate-900 truncate">{booking.serviceName || booking.hotelName || booking.guideName || booking.packageName || 'Service'}</h3>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusBadgeStyle(booking.status)}`}>
                              {booking.status}
                            </span>
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500">
                              {booking.type}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Booked on {formatDate(booking.createdAt)}</span>
                            </div>
                            {booking.travelDate && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>Travel date: {booking.travelDate}</span>
                              </div>
                            )}
                            {booking.numberOfTravelers && (
                              <div className="flex items-center gap-2">
                                <span className="text-slate-600 font-bold">{booking.numberOfTravelers}</span>
                                <span>traveler{booking.numberOfTravelers !== 1 ? 's' : ''}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 lg:flex-shrink-0">
                        <div className="text-right">
                          <p className="text-2xl font-black text-blue-600">Rs. {booking.price.toLocaleString()}</p>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                            Payment: {booking.paymentStatus}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {booking.status === 'confirmed' && (
                            <>
                              <button className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                                <Download className="w-5 h-5 text-slate-600" />
                              </button>
                              <button className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                                <MessageCircle className="w-5 h-5 text-slate-600" />
                              </button>
                            </>
                          )}
                          {(booking.status === 'pending' || booking.status === 'confirmed') && (
                            <button 
                              onClick={() => handleCancelBooking(booking.id)}
                              className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function MyBookings() {
  return (
    <ProtectedRoute>
      <MyBookingsContent />
    </ProtectedRoute>
  )
}
