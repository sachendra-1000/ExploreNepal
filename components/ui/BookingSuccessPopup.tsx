'use client'

import { CheckCircle, Mail, MapPin, Calendar, CreditCard, Download, Navigation, Phone } from 'lucide-react'
import Button from './Button'
import Modal from './Modal'
import { generateReceiptPDF, prepareReceiptData } from '@/lib/receiptGenerator'
import { useState } from 'react'

interface BookingSuccessPopupProps {
  isOpen: boolean
  onClose: () => void
  bookingData: {
    bookingId: string
    serviceName: string
    serviceType: string
    travelDate: string
    numberOfTravelers: number
    pickupLocation: string
    totalAmount: number
    paymentMethod: string
    customerName: string
    customerEmail: string
    customerPhone: string
    [key: string]: any
  }
}

export default function BookingSuccessPopup({ isOpen, onClose, bookingData }: BookingSuccessPopupProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownloadReceipt = async () => {
    try {
      setIsGenerating(true)
      const receiptData = prepareReceiptData(bookingData)
      await generateReceiptPDF(receiptData)
    } catch (error) {
      console.error('Error generating receipt:', error)
      alert('Failed to generate receipt. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Booking Successful" maxWidth="max-w-md">
      <div className="text-center space-y-6">
        <div className="flex justify-center text-green-500">
          <CheckCircle size={64} />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold">Thank You!</h2>
          <p className="text-gray-600">Your booking has been confirmed.</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2 text-sm border">
          <div className="flex justify-between">
            <span className="text-gray-500">Booking ID:</span>
            <span className="font-bold">{bookingData.bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Service:</span>
            <span className="font-bold">{bookingData.serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date:</span>
            <span className="font-bold">{bookingData.travelDate}</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="text-gray-500 font-bold">Total:</span>
            <span className="font-bold text-blue-600">Rs. {bookingData.totalAmount}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={handleDownloadReceipt} variant="outline" className="w-full" disabled={isGenerating}>
            <Download size={16} className="mr-2" />
            {isGenerating ? 'Generating...' : 'Download Receipt'}
          </Button>
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </div>
    </Modal>
  )
}
