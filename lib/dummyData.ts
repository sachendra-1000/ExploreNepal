// Dummy types for demonstration
export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'user' | 'admin'
  createdAt: string
}

export interface Hotel {
  id: string
  name: string
  location: string
  price: number
  rating: number
  amenities: string[]
  roomTypes: string[]
  images: string[]
  description: string
  available: boolean
}

export interface Guide {
  id: string
  name: string
  experience: string
  specialization: string
  languages: string[]
  rating: number
  price: number
  image: string
  bio: string
  available: boolean
}

export interface BusRoute {
  id: string
  from: string
  to: string
  price: number
  duration: string
  departureTime: string
  arrivalTime: string
  type: 'tourist' | 'local' | 'luxury'
  available: boolean
}

export interface Booking {
  id: string
  type: 'hotel' | 'guide' | 'bus'
  status: 'pending' | 'confirmed' | 'rejected' | 'completed'
  userId: string
  userName: string
  userEmail: string
  serviceId: string
  serviceName: string
  serviceType: string
  price: number
  bookingDate: string
  travelDate: string
  paymentProof?: string
  paymentStatus: 'pending' | 'verified' | 'rejected'
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
}

export interface DashboardStats {
  totalUsers: number
  totalServices: number
  totalBookings: number
  totalRevenue: number
  pendingBookings: number
  confirmedBookings: number
  rejectedBookings: number
}

// Dummy Users
export const dummyUsers: User[] = [
  { id: 'u1', name: 'Ram Sharma', email: 'ram@gmail.com', phone: '9841234567', role: 'user', createdAt: '2024-01-15' },
  { id: 'u2', name: 'Sita Devi', email: 'sita@gmail.com', phone: '9849876543', role: 'user', createdAt: '2024-02-20' },
  { id: 'u3', name: 'Hari Prasad', email: 'hari@gmail.com', phone: '9851122334', role: 'user', createdAt: '2024-03-10' },
  { id: 'u4', name: 'Gita Kumari', email: 'gita@gmail.com', phone: '9865544332', role: 'user', createdAt: '2024-03-25' },
]

// Dummy Hotels
export const dummyHotels: Hotel[] = [
  { 
    id: 'h1', 
    name: 'Everest View Hotel', 
    location: 'Kathmandu', 
    price: 5000, 
    rating: 4.5, 
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
    roomTypes: ['Single', 'Double', 'Suite'],
    images: ['/hotel1.jpg'], 
    description: 'Luxury hotel with mountain views', 
    available: true
  },
  { 
    id: 'h2', 
    name: 'Pokhara Lakeside Resort', 
    location: 'Pokhara', 
    price: 3500, 
    rating: 4.2, 
    amenities: ['WiFi', 'Lake View', 'Garden', 'Bar'],
    roomTypes: ['Standard', 'Deluxe', 'Villa'],
    images: ['/hotel2.jpg'], 
    description: 'Beautiful resort by Phewa Lake', 
    available: true
  },
  { 
    id: 'h3', 
    name: 'Chitwan Jungle Lodge', 
    location: 'Chitwan', 
    price: 4500, 
    rating: 4.7, 
    amenities: ['Safari', 'Pool', 'Nature Walk', 'Cultural Show'],
    roomTypes: ['Cottage', 'Tree House', 'Deluxe'],
    images: ['/hotel3.jpg'], 
    description: 'Experience wildlife in luxury', 
    available: true
  },
]

// Dummy Guides
export const dummyGuides: Guide[] = [
  { 
    id: 'g1', 
    name: 'Bikash Gurung', 
    experience: '10 years', 
    specialization: 'Trekking', 
    languages: ['English', 'Nepali', 'Hindi'],
    rating: 4.8, 
    price: 3000, 
    image: '/guide1.jpg', 
    bio: 'Expert in Himalayan treks and mountaineering', 
    available: true
  },
  { 
    id: 'g2', 
    name: 'Maya Sherpa', 
    experience: '8 years', 
    specialization: 'Cultural Tours', 
    languages: ['English', 'Nepali', 'Tibetan'],
    rating: 4.9, 
    price: 2500, 
    image: '/guide2.jpg', 
    bio: 'Specialist in Buddhist monasteries and cultural sites', 
    available: true
  },
  { 
    id: 'g3', 
    name: 'Rajesh Tamang', 
    experience: '5 years', 
    specialization: 'Adventure Sports', 
    languages: ['English', 'Nepali'],
    rating: 4.5, 
    price: 2000, 
    image: '/guide3.jpg', 
    bio: 'Paragliding and rafting expert in Pokhara', 
    available: true
  },
]

// Dummy Bus Routes
export const dummyBusRoutes: BusRoute[] = [
  { 
    id: 'b1', 
    from: 'Kathmandu', 
    to: 'Pokhara', 
    price: 1000, 
    duration: '7 hours',
    departureTime: '07:00 AM',
    arrivalTime: '02:00 PM',
    type: 'tourist',
    available: true
  },
  { 
    id: 'b2', 
    from: 'Kathmandu', 
    to: 'Chitwan', 
    price: 800, 
    duration: '5 hours',
    departureTime: '08:00 AM',
    arrivalTime: '01:00 PM',
    type: 'tourist',
    available: true
  },
  { 
    id: 'b3', 
    from: 'Pokhara', 
    to: 'Lumbini', 
    price: 1200, 
    duration: '8 hours',
    departureTime: '06:30 AM',
    arrivalTime: '02:30 PM',
    type: 'luxury',
    available: true
  },
  { 
    id: 'b4', 
    from: 'Kathmandu', 
    to: 'Pokhara', 
    price: 500, 
    duration: '8 hours',
    departureTime: '09:00 AM',
    arrivalTime: '05:00 PM',
    type: 'local',
    available: true
  },
]

// Dummy Bookings
export const dummyBookings: Booking[] = [
  { 
    id: 'bk1', 
    type: 'hotel', 
    status: 'confirmed', 
    userId: 'u1', 
    userName: 'Ram Sharma', 
    userEmail: 'ram@gmail.com',
    serviceId: 'h1', 
    serviceName: 'Everest View Hotel', 
    serviceType: 'Deluxe Room',
    price: 5000, 
    bookingDate: '2024-04-01',
    travelDate: '2024-05-15',
    paymentProof: '/payment1.jpg',
    paymentStatus: 'verified',
    createdAt: '2024-04-01'
  },
  { 
    id: 'bk2', 
    type: 'guide', 
    status: 'pending', 
    userId: 'u2', 
    userName: 'Sita Devi', 
    userEmail: 'sita@gmail.com',
    serviceId: 'g1', 
    serviceName: 'Bikash Gurung', 
    serviceType: 'Trekking Guide',
    price: 3000, 
    bookingDate: '2024-04-05',
    travelDate: '2024-05-20',
    paymentProof: '/payment2.jpg',
    paymentStatus: 'pending',
    createdAt: '2024-04-05'
  },
  { 
    id: 'bk3', 
    type: 'bus', 
    status: 'pending', 
    userId: 'u3', 
    userName: 'Hari Prasad', 
    userEmail: 'hari@gmail.com',
    serviceId: 'b1', 
    serviceName: 'Kathmandu-Pokhara Express', 
    serviceType: 'Tourist Bus',
    price: 1000, 
    bookingDate: '2024-04-08',
    travelDate: '2024-05-25',
    paymentStatus: 'pending',
    createdAt: '2024-04-08'
  },
  { 
    id: 'bk4', 
    type: 'hotel', 
    status: 'rejected', 
    userId: 'u4', 
    userName: 'Gita Kumari', 
    userEmail: 'gita@gmail.com',
    serviceId: 'h2', 
    serviceName: 'Pokhara Lakeside Resort', 
    serviceType: 'Standard Room',
    price: 3500, 
    bookingDate: '2024-04-10',
    travelDate: '2024-05-30',
    paymentProof: '/payment3.jpg',
    paymentStatus: 'rejected',
    createdAt: '2024-04-10'
  },
  { 
    id: 'bk5', 
    type: 'guide', 
    status: 'confirmed', 
    userId: 'u1', 
    userName: 'Ram Sharma', 
    userEmail: 'ram@gmail.com',
    serviceId: 'g2', 
    serviceName: 'Maya Sherpa', 
    serviceType: 'Cultural Guide',
    price: 2500, 
    bookingDate: '2024-04-12',
    travelDate: '2024-06-01',
    paymentProof: '/payment4.jpg',
    paymentStatus: 'verified',
    createdAt: '2024-04-12'
  },
]

// Dummy Notifications
export const dummyNotifications: Notification[] = [
  { id: 'n1', title: 'Booking Confirmed', message: 'Your hotel booking has been confirmed', type: 'success', read: false, createdAt: '2024-04-15' },
  { id: 'n2', title: 'Payment Received', message: 'Payment verification in progress', type: 'info', read: false, createdAt: '2024-04-14' },
  { id: 'n3', title: 'New Message', message: 'You have a new message from your guide', type: 'info', read: true, createdAt: '2024-04-13' },
  { id: 'n4', title: 'Booking Rejected', message: 'Your booking request was rejected', type: 'error', read: true, createdAt: '2024-04-12' },
]

// Dummy Stats
export const dummyStats: DashboardStats = {
  totalUsers: 124,
  totalServices: 10,
  totalBookings: 456,
  totalRevenue: 1250000,
  pendingBookings: 23,
  confirmedBookings: 389,
  rejectedBookings: 44
}
