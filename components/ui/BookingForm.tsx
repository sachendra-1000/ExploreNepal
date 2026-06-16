'use client'

import { useState } from 'react'
import { Calendar, MapPin, Users, CreditCard, Phone, Mail, Check, X, RefreshCw, ChevronRight, Star, ShieldCheck, Zap } from 'lucide-react'
import Button from './Button'
import Modal from './Modal'

interface BookingFormProps {
  isOpen: boolean
  onClose: () => void
  service: {
    id: string
    name: string
    type: 'hotel' | 'guide' | 'bus'
    price: number
    location?: string
    from?: string
    to?: string
    specialization?: string
    duration?: string
  }
  onSubmit: (bookingData: BookingFormData) => Promise<void>
}

export interface BookingFormData {
  serviceId: string
  serviceName: string
  serviceType: string
  travelDate: string
  numberOfPeople: number
  specialRequests: string
  contactName: string
  contactEmail: string
  contactPhone: string
  paymentMethod: 'esewa' | 'khalti' | 'bank' | 'cash'
}

export default function BookingForm({ isOpen, onClose, service, onSubmit }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: service.id,
    serviceName: service.name,
    serviceType: service.type,
    travelDate: '',
    numberOfPeople: 1,
    specialRequests: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    paymentMethod: 'esewa'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.travelDate) {
      setError('Please select a travel date')
      return
    }
    if (!formData.contactName || !formData.contactEmail || !formData.contactPhone) {
      setError('Please fill in all contact information')
      return
    }
    if (formData.numberOfPeople < 1) {
      setError('Number of people must be at least 1')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const totalPrice = formData.numberOfPeople * service.price

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reserve ${service.name}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Service Summary Card */}
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Selected Experience</span>
              <h3 className="text-2xl font-black tracking-tight">{service.name}</h3>
              <div className="flex items-center gap-3 text-slate-400 text-sm font-bold">
                <MapPin className="w-4 h-4 text-blue-400" />
                {service.type === 'bus' ? (
                  <span>{service.from} → {service.to}</span>
                ) : service.type === 'hotel' ? (
                  <span>{service.location}</span>
                ) : (
                  <span>{service.specialization} Expert</span>
                )}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[140px]">
              <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Base Price</p>
              <p className="text-2xl font-black">₨{service.price.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">per person</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Logistics
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Travel Date</label>
                <input
                  type="date"
                  value={formData.travelDate}
                  onChange={(e) => handleChange('travelDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-600 font-bold transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Number of Travelers</label>
                <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-2">
                  <button
                    type="button"
                    onClick={() => handleChange('numberOfPeople', Math.max(1, formData.numberOfPeople - 1))}
                    className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors shadow-sm"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                  <input
                    type="number"
                    value={formData.numberOfPeople}
                    onChange={(e) => handleChange('numberOfPeople', parseInt(e.target.value) || 1)}
                    min="1"
                    max="50"
                    className="flex-1 text-center bg-transparent border-none text-slate-900 font-black focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange('numberOfPeople', formData.numberOfPeople + 1)}
                    className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors shadow-sm"
                  >
                    <Check className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4" />
                Payment Method
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'esewa', label: 'eSewa', icon: Zap, color: 'emerald' },
                  { value: 'khalti', label: 'Khalti', icon: Star, color: 'violet' },
                  { value: 'bank', label: 'Bank', icon: ShieldCheck, color: 'blue' },
                  { value: 'cash', label: 'Arrival', icon: MapPin, color: 'slate' }
                ].map((method) => {
                  const Icon = method.icon
                  return (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => handleChange('paymentMethod', method.value as any)}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        formData.paymentMethod === method.value
                          ? `border-blue-600 bg-blue-50/50`
                          : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${formData.paymentMethod === method.value ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${formData.paymentMethod === method.value ? 'text-blue-900' : 'text-slate-500'}`}>{method.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact Details
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Full Name</label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-600 font-bold transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-600 font-bold transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    placeholder="+977"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-600 font-bold transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Special Requests</label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => handleChange('specialRequests', e.target.value)}
                  placeholder="Any dietary requirements or specific requests?"
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-600 font-bold transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Total & Submit */}
        <div className="pt-8 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between w-full sm:w-[300px]">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Total Amount</span>
                <span className="text-3xl font-black text-blue-900 tracking-tight">₨{totalPrice.toLocaleString()}</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 sm:flex-none h-14 px-8 rounded-2xl font-black text-slate-500"
                onClick={onClose}
                disabled={isSubmitting}
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                className="flex-1 sm:flex-none h-14 px-12 rounded-2xl font-black text-base shadow-2xl shadow-blue-600/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    PROCESSING...
                  </>
                ) : (
                  <>
                    CONFIRM BOOKING
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-3 animate-shake">
              <X className="w-5 h-5" />
              {error}
            </div>
          )}
        </div>
      </form>
    </Modal>
  )
}
