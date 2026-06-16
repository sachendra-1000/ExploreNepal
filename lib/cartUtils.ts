// Cart utilities for localStorage management

export interface CartItem {
  id: string
  name: string
  type: 'hotel' | 'guide' | 'bus' | 'package'
  price: number
  image?: string
  location?: string
  specialization?: string
  from?: string
  to?: string
  duration?: string
  quantity?: number
  date?: string
}

export interface Coupon {
  code: string
  discount: number
  type: 'percentage' | 'fixed'
  minAmount?: number
  maxDiscount?: number
  valid: boolean
}

// Get cart from localStorage
export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return []
  const cart = localStorage.getItem('bookingCart')
  return cart ? JSON.parse(cart) : []
}

// Add item to cart
export const addToCart = (item: CartItem) => {
  const cart = getCart()
  const existingIndex = cart.findIndex(i => i.id === item.id)
  
  if (existingIndex >= 0) {
    cart[existingIndex] = item
  } else {
    cart.push(item)
  }
  
  localStorage.setItem('bookingCart', JSON.stringify(cart))
}

// Remove item from cart
export const removeFromCart = (id: string) => {
  const cart = getCart()
  const updatedCart = cart.filter(item => item.id !== id)
  localStorage.setItem('bookingCart', JSON.stringify(updatedCart))
}

// Clear cart
export const clearCart = () => {
  localStorage.removeItem('bookingCart')
}

// Get cart total
export const getCartTotal = (): number => {
  const cart = getCart()
  return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0)
}

// Get cart item count
export const getCartCount = (): number => {
  const cart = getCart()
  return cart.length
}

// Validate coupon code
export const validateCoupon = (code: string, total: number): Coupon => {
  const coupons: Record<string, Coupon> = {
    'NEPAL10': { code: 'NEPAL10', discount: 10, type: 'percentage', minAmount: 5000, valid: true },
    'EXPLORE20': { code: 'EXPLORE20', discount: 20, type: 'percentage', minAmount: 10000, valid: true },
    'FLAT500': { code: 'FLAT500', discount: 500, type: 'fixed', minAmount: 3000, valid: true },
    'FIRSTBOOK': { code: 'FIRSTBOOK', discount: 15, type: 'percentage', minAmount: 2000, valid: true },
  }
  
  const coupon = coupons[code.toUpperCase()]
  
  if (!coupon) {
    return { code: '', discount: 0, type: 'percentage', valid: false }
  }
  
  if (coupon.minAmount && total < coupon.minAmount) {
    return { ...coupon, valid: false }
  }
  
  return coupon
}

// Apply coupon discount
export const applyCoupon = (total: number, coupon: Coupon): number => {
  if (!coupon.valid) return total
  
  if (coupon.type === 'percentage') {
    const discount = total * (coupon.discount / 100)
    const finalDiscount = coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount
    return total - finalDiscount
  } else {
    return total - coupon.discount
  }
}

// Store selected service for direct booking
export const setSelectedService = (service: CartItem) => {
  localStorage.setItem('selectedService', JSON.stringify(service))
}

// Get selected service for direct booking
export const getSelectedService = (): CartItem | null => {
  if (typeof window === 'undefined') return null
  const service = localStorage.getItem('selectedService')
  return service ? JSON.parse(service) : null
}

// Clear selected service
export const clearSelectedService = () => {
  localStorage.removeItem('selectedService')
}
