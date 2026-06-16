'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Star, 
  MapPin, 
  Bed, 
  Wifi, 
  Utensils, 
  Dumbbell, 
  Phone, 
  Mail,
  ArrowLeft,
  Heart,
  Hotel as HotelIcon
} from 'lucide-react'
import Toast from '@/components/Toast'
import { subscribeToHotels, createBooking } from '@/lib/firestore'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function HotelDetail() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const hotelId = Array.isArray(params?.id) ? params.id[0] : params?.id
  
  const [hotel, setHotel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [toast, setToast] = useState<any>({ show: false, type: 'success', message: '' })

  useEffect(() => {
    const unsubscribe = subscribeToHotels((hotels: any[]) => {
      const found = hotels.find(h => h.id === hotelId)
      setHotel(found)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [hotelId])

  if (loading) return <div className="text-center py-20">Loading...</div>
  if (!hotel) return <div className="text-center py-20">Hotel not found</div>

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container-custom py-8">
        <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-blue-600 mb-8">
          <ArrowLeft size={20} className="mr-2" /> Back to Hotels
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <img src={hotel.image} alt={hotel.name} className="w-full rounded-lg shadow-lg" />
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{hotel.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-orange-400">
                <Star size={20} className="fill-current" />
                <span className="ml-1 text-gray-900 font-bold">{hotel.rating}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <MapPin size={20} className="mr-1" />
                <span>{hotel.location}</span>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">{hotel.description}</p>

            <div className="pt-6 border-t">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-blue-600">₨{hotel.price}</span>
                <span className="text-gray-500">/night</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button size="lg" className="flex-1">Book This Hotel</Button>
              <Button variant="outline" size="lg">
                <Heart size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
