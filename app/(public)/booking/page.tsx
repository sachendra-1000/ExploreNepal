'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import Toast from '@/components/Toast'
import { useAuth } from '@/context/AuthContext'
import { subscribeToHotels, subscribeToGuides, createBooking } from '@/lib/firestore'
import BookingForm, { BookingFormData } from '@/components/ui/BookingForm'
import BookingSuccessPopup from '@/components/ui/BookingSuccessPopup'
import { CartItem, getCart, getSelectedService, clearSelectedService, clearCart } from '@/lib/cartUtils'
import { Hotel as HotelIcon, Compass, ArrowLeft, ShieldCheck, Star, Calendar } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

// Types
type ToastType = 'success' | 'error' | 'warning' | 'info'

type ToastState = {
  show: boolean
  type: ToastType | ''
  message: string
}

interface Hotel {
  id: string
  name: string
  location: string
  price: number
}

interface Guide {
  id: string
  name: string
  specialization: string
  price: number
}

function BookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  
  // Get URL parameters
  const urlType = (searchParams?.get('type') as 'hotel' | 'guide' | null) ?? null
  const preselectedId = searchParams?.get('id') ?? null
  const preselectedName = searchParams?.get('name') ?? null
  
  // State
  const [bookingType, setBookingType] = useState<'hotel' | 'guide' | null>(urlType)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<ToastState>({ show: false, type: '', message: '' })
  
  // Smart booking state
  const [selectedService, setSelectedService] = useState<CartItem | null>(null)
  const [isFromCart, setIsFromCart] = useState(false)
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false)
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false)
  const [bookingResult, setBookingResult] = useState<any>(null)
  
  // Load hotels and guides from Firestore
  useEffect(() => {
    setLoading(true)
    
    const unsubHotels = subscribeToHotels((data: Hotel[]) => {
      setHotels(data)
    })
    
    const unsubGuides = subscribeToGuides((data: Guide[]) => {
      setGuides(data)
      setLoading(false)
    })

    return () => {
      unsubHotels()
      unsubGuides()
    }
  }, [])

  // Smart auto-fill logic
  useEffect(() => {
    // Check if user is coming from cart
    const cart = getCart()
    if (cart.length > 0) {
      const cartItem = cart[0]
      setSelectedService(cartItem)
      setIsFromCart(true)
      setBookingType(cartItem.type as 'hotel' | 'guide')
      setIsBookingFormOpen(true)
      return
    }

    // Check if user is coming from direct booking
    const selectedService = getSelectedService()
    if (selectedService) {
      setSelectedService(selectedService)
      setIsFromCart(false)
      setBookingType(selectedService.type as 'hotel' | 'guide')
      setIsBookingFormOpen(true)
      clearSelectedService()
      return
    }

    // Check URL params
    if (preselectedId && preselectedName && urlType) {
      const service: CartItem = {
        id: preselectedId,
        name: preselectedName,
        type: urlType,
        price: urlType === 'hotel' 
          ? hotels.find(h => h.id === preselectedId)?.price || 0
          : guides.find(g => g.id === preselectedId)?.price || 0
      }
      setSelectedService(service)
      setIsFromCart(false)
      setIsBookingFormOpen(true)
    }
  }, [preselectedId, preselectedName, urlType, hotels, guides])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message })
  }

  const handleTypeSelect = (type: 'hotel' | 'guide') => {
    setBookingType(type)
    setIsBookingFormOpen(false)
  }

  const handleBookingSubmit = async (bookingData: BookingFormData) => {
    if (!user) {
      router.push('/login?redirect=/booking')
      return
    }

    setSubmitting(true)

    const finalPrice = (bookingData.numberOfPeople || 1) * (selectedService?.price || 0)

    let bookingDataForFirestore: any = {
      userId: user.uid,
      userEmail: user.email,
      userName: bookingData.contactName || '',
      type: bookingData.serviceType,
      phone: bookingData.contactPhone || '',
      specialRequests: bookingData.specialRequests || '',
      status: 'pending',
      travelDate: bookingData.travelDate,
      numberOfTravelers: bookingData.numberOfPeople || 1,
      pickupLocation: '',
      paymentMethod: bookingData.paymentMethod,
      totalAmount: finalPrice,
      price: finalPrice,
      discount: 0
    }

    if (bookingData.serviceType === 'hotel') {
      const hotel = hotels.find(h => h.id === bookingData.serviceId)
      if (!hotel) {
        showToast('error', 'Please select a hotel')
        setSubmitting(false)
        return
      }
      
      bookingDataForFirestore = {
        ...bookingDataForFirestore,
        hotelId: hotel.id,
        hotelName: hotel.name,
        location: hotel.location
      }
    } else if (bookingData.serviceType === 'guide') {
      const guide = guides.find(g => g.id === bookingData.serviceId)
      if (!guide) {
        showToast('error', 'Please select a guide')
        setSubmitting(false)
        return
      }
      
      bookingDataForFirestore = {
        ...bookingDataForFirestore,
        guideId: guide.id,
        guideName: guide.name,
        specialization: guide.specialization
      }
    }

    const result = await createBooking(bookingDataForFirestore)
    
    if (result.success) {
      if (isFromCart) {
        clearCart()
      }

      setBookingResult({
        bookingId: result.id || 'BK' + Date.now(),
        serviceName: bookingData.serviceName,
        serviceType: bookingData.serviceType,
        travelDate: bookingData.travelDate,
        numberOfTravelers: bookingData.numberOfPeople || 1,
        pickupLocation: '',
        totalAmount: finalPrice,
        paymentMethod: bookingData.paymentMethod,
        customerName: bookingData.contactName || '',
        customerEmail: bookingData.contactEmail || user.email,
        customerPhone: bookingData.contactPhone || ''
      })
      
      setIsSuccessPopupOpen(true)
      setIsBookingFormOpen(false)
    } else {
      showToast('error', 'Failed to create booking. Please try again.')
    }
    
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <Toast 
        show={toast.show} 
        type={toast.type as any} 
        message={toast.message} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/image/Phewa Lake.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold mb-6">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Secure Reservation</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4">
            {selectedService ? (
              <>Book <span className="text-blue-400">{selectedService.name}</span></>
            ) : (
              <>Start Your <span className="text-blue-400">Journey</span></>
            )}
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto font-medium">
            {selectedService 
              ? `Complete your reservation for ${selectedService.name} and get ready for an unforgettable experience in Nepal.`
              : 'Choose your preferred service and fill in the details to secure your spot for the adventure of a lifetime.'
            }
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          {!isBookingFormOpen && (
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-900">What would you like to book?</h2>
                <p className="text-slate-500 font-medium">Select a category to see available options</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card 
                  className={`group rounded-[3rem] border-2 transition-all cursor-pointer overflow-hidden ${bookingType === 'hotel' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 hover:border-blue-200'}`}
                  onClick={() => handleTypeSelect('hotel')}
                >
                  <CardContent className="p-10 text-center space-y-6">
                    <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
                      <HotelIcon className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Premium Stays</h3>
                      <p className="text-slate-500 font-medium">Hotels, Resorts & Guest Houses</p>
                    </div>
                    <Button variant={bookingType === 'hotel' ? 'primary' : 'secondary'} className="w-full rounded-2xl">
                      Select Hotels
                    </Button>
                  </CardContent>
                </Card>

                <Card 
                  className={`group rounded-[3rem] border-2 transition-all cursor-pointer overflow-hidden ${bookingType === 'guide' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 hover:border-blue-200'}`}
                  onClick={() => handleTypeSelect('guide')}
                >
                  <CardContent className="p-10 text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                      <Compass className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Expert Guides</h3>
                      <p className="text-slate-500 font-medium">Local Experts & Specializations</p>
                    </div>
                    <Button variant={bookingType === 'guide' ? 'primary' : 'secondary'} className="w-full rounded-2xl">
                      Select Guides
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {bookingType && (
                <div className="max-w-2xl mx-auto pt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100 space-y-8">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-black text-slate-900">
                        {bookingType === 'hotel' ? 'Available Hotels' : 'Available Guides'}
                      </h4>
                      <Button variant="ghost" size="sm" onClick={() => setBookingType(null)} className="text-blue-600 font-black">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        CHANGE TYPE
                      </Button>
                    </div>

                    <div className="relative group">
                      <select 
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 text-slate-900 font-black focus:ring-2 focus:ring-blue-600 transition-all appearance-none cursor-pointer"
                        onChange={(e) => {
                          const val = e.target.value
                          if (bookingType === 'hotel') {
                            const hotel = hotels.find(h => h.id === val)
                            if (hotel) {
                              setSelectedService({
                                id: hotel.id,
                                name: hotel.name,
                                type: 'hotel',
                                price: hotel.price,
                                location: hotel.location
                              })
                              setIsBookingFormOpen(true)
                            }
                          } else {
                            const guide = guides.find(g => g.id === val)
                            if (guide) {
                              setSelectedService({
                                id: guide.id,
                                name: guide.name,
                                type: 'guide',
                                price: guide.price,
                                specialization: guide.specialization
                              })
                              setIsBookingFormOpen(true)
                            }
                          }
                        }}
                      >
                        <option value="">Choose an option...</option>
                        {bookingType === 'hotel' ? (
                          hotels.map((hotel) => (
                            <option key={hotel.id} value={hotel.id}>
                              {hotel.name} — ₨{hotel.price.toLocaleString()}/night
                            </option>
                          ))
                        ) : (
                          guides.map((guide) => (
                            <option key={guide.id} value={guide.id}>
                              {guide.name} — ₨{guide.price.toLocaleString()}/day
                            </option>
                          ))
                        )}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ArrowLeft className="w-5 h-5 rotate-[270deg]" />
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4" /> Verified
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-orange-400 uppercase tracking-widest">
                        <Star className="w-4 h-4 fill-orange-400" /> Best Rated
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Booking Form Modal */}
      {selectedService && (
        <BookingForm
          isOpen={isBookingFormOpen}
          onClose={() => setIsBookingFormOpen(false)}
          service={{
            id: selectedService.id,
            name: selectedService.name,
            type: selectedService.type as 'hotel' | 'guide' | 'bus',
            price: selectedService.price,
            location: (selectedService as any).location,
            specialization: (selectedService as any).specialization
          }}
          onSubmit={handleBookingSubmit}
        />
      )}

      {/* Booking Success Popup */}
      {bookingResult && (
        <BookingSuccessPopup
          isOpen={isSuccessPopupOpen}
          onClose={() => {
            setIsSuccessPopupOpen(false)
            router.push('/bookings')
          }}
          bookingData={bookingResult}
        />
      )}
    </div>
  )
}

export default function Booking() {
  return (
    <ProtectedRoute>
      <BookingContent />
    </ProtectedRoute>
  )
}
