'use client'

import { Calendar, MapPin, Users, CreditCard, Check, X, AlertCircle } from 'lucide-react'
import { CartItem } from '@/lib/cartUtils'

interface BookingSummarySidebarProps {
  service: CartItem | null
  numberOfTravelers: number
  travelDate: string
  pickupLocation: string
  paymentMethod: string
  couponDiscount: number
  isSticky?: boolean
}

export default function BookingSummarySidebar({
  service,
  numberOfTravelers,
  travelDate,
  pickupLocation,
  paymentMethod,
  couponDiscount,
  isSticky = true
}: BookingSummarySidebarProps) {
  const basePrice = service?.price || 0
  const subtotal = basePrice * numberOfTravelers
  const total = subtotal - couponDiscount

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${isSticky ? 'sticky top-24' : ''}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-4">
        <h3 className="text-white font-bold text-lg">Booking Summary</h3>
        <p className="text-blue-100 text-sm">Review your booking details</p>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Service Info */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">{service?.name}</h4>
              <p className="text-sm text-gray-500">
                {service?.type === 'bus' ? `${service.from} → ${service.to}` : 
                 service?.type === 'hotel' ? service.location : 
                 service?.specialization}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Travel Date</p>
              <p className="font-medium text-gray-900">{travelDate || 'Not selected'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Travelers</p>
              <p className="font-medium text-gray-900">{numberOfTravelers} person(s)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Pickup Location</p>
              <p className="font-medium text-gray-900 capitalize">{pickupLocation || 'Not selected'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="font-medium text-gray-900 capitalize">{paymentMethod || 'Not selected'}</p>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price per person</span>
            <span className="font-medium">Rs. {basePrice}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Number of travelers</span>
            <span className="font-medium">× {numberOfTravelers}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">Rs. {subtotal}</span>
          </div>
          
          {couponDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span className="font-medium flex items-center gap-1">
                <Check className="w-4 h-4" />
                Coupon Discount
              </span>
              <span className="font-medium">- Rs. {couponDiscount}</span>
            </div>
          )}

          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900 text-lg">Total</span>
              <span className="text-2xl font-bold text-blue-600">Rs. {total}</span>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-orange-800">
              <p className="font-medium mb-1">Important Notes:</p>
              <ul className="space-y-1 text-orange-700">
                <li>• Bring valid ID proof</li>
                <li>• Arrive 15 minutes early</li>
                <li>• Contact support for changes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
