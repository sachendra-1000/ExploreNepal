import { 
  db
} from './firebase'
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore'

// ==================== USERS ====================

export const createUserProfile = async (uid, userData) => {
  try {
    await setDoc(doc(db, 'users', uid), {
      uid,
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      role: userData.role || 'tourist',
      businessType: userData.businessType || null,
      businessName: userData.businessName || null,
      location: userData.location || null,
      createdAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error creating user profile:', error)
    return { success: false, error: error.message }
  }
}

export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() }
    }
    return { success: false, error: 'User not found' }
  } catch (error) {
    console.error('Error getting user profile:', error)
    return { success: false, error: error.message }
  }
}

export const getUserRole = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      return { 
        role: data.role || 'tourist',
        businessType: data.businessType || null,
        businessName: data.businessName || null
      }
    }
    return { role: 'tourist', businessType: null, businessName: null }
  } catch (error) {
    console.error('Error getting user role:', error)
    return { role: 'tourist', businessType: null, businessName: null }
  }
}

// ==================== BOOKINGS ====================

export const createBooking = async (bookingData) => {
  try {
    const bookingRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true, id: bookingRef.id }
  } catch (error) {
    console.error('Error creating booking:', error)
    return { success: false, error: error.message }
  }
}

export const getUserBookings = async (userId) => {
  try {
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', userId)
    )
    const querySnapshot = await getDocs(q)
    const bookings = []
    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() })
    })
    return { success: true, data: bookings }
  } catch (error) {
    console.error('Error getting user bookings:', error)
    return { success: false, error: error.message }
  }
}

export const subscribeToUserBookings = (userId, callback) => {
  const q = query(
    collection(db, 'bookings'),
    where('userId', '==', userId)
  )
  
  return onSnapshot(q, (querySnapshot) => {
    const bookings = []
    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() })
    })
    callback(bookings)
  }, (error) => {
    console.error('Error in bookings subscription:', error)
  })
}

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId)
    await updateDoc(bookingRef, {
      status,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating booking status:', error)
    return { success: false, error: error.message }
  }
}

export const verifyPayment = async (bookingId, paymentStatus) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId)
    await updateDoc(bookingRef, {
      paymentStatus,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return { success: false, error: error.message }
  }
}

export const cancelBooking = async (bookingId) => {
  try {
    await deleteDoc(doc(db, 'bookings', bookingId))
    return { success: true }
  } catch (error) {
    console.error('Error canceling booking:', error)
    return { success: false, error: error.message }
  }
}

// ==================== HOTELS ====================

export const seedHotels = async () => {
  const hotels = [
    {
      name: 'Hotel Himalaya',
      location: 'Kathmandu',
      price: 80,
      rating: 4.5,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
      roomTypes: ['Standard', 'Deluxe', 'Suite'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Fish Tail Lodge',
      location: 'Pokhara',
      price: 120,
      rating: 4.7,
      amenities: ['Lake View', 'WiFi', 'Pool', 'Bar'],
      roomTypes: ['Standard', 'Deluxe', 'Family Suite'],
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Green Park Resort',
      location: 'Chitwan',
      price: 100,
      rating: 4.6,
      amenities: ['Jungle View', 'Pool', 'Safari', 'Restaurant'],
      roomTypes: ['Standard', 'Deluxe', 'Jungle Villa'],
      image: 'https://images.unsplash.com/photo-1562696299-e48abbf7a407?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Everest View Hotel',
      location: 'Namche Bazaar',
      price: 150,
      rating: 4.8,
      amenities: ['Mountain View', 'Heater', 'Restaurant', 'Guide Service'],
      roomTypes: ['Standard', 'Deluxe'],
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Lumbini Garden Hotel',
      location: 'Lumbini',
      price: 60,
      rating: 4.3,
      amenities: ['Garden View', 'WiFi', 'Meditation Hall', 'Restaurant'],
      roomTypes: ['Standard', 'Deluxe', 'Monastery View'],
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ]
  
  try {
    for (const hotel of hotels) {
      await addDoc(collection(db, 'hotels'), hotel)
    }
    // Hotels seeded successfully
    return { success: true }
  } catch (error) {
    console.error('Error seeding hotels:', error)
    return { success: false, error: error.message }
  }
}

export const getHotels = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'hotels'))
    const hotels = []
    querySnapshot.forEach((doc) => {
      hotels.push({ id: doc.id, ...doc.data() })
    })
    return { success: true, data: hotels }
  } catch (error) {
    console.error('Error getting hotels:', error)
    return { success: false, error: error.message }
  }
}

export const subscribeToHotels = (callback) => {
  return onSnapshot(collection(db, 'hotels'), (querySnapshot) => {
    const hotels = []
    querySnapshot.forEach((doc) => {
      hotels.push({ id: doc.id, ...doc.data() })
    })
    callback(hotels)
  })
}

// ==================== GUIDES ====================

export const seedGuides = async () => {
  const guides = [
    {
      name: 'Tenzing Sherpa',
      experience: '15 years',
      specialization: 'Everest Trekking',
      languages: ['English', 'Nepali', 'Sherpa'],
      rating: 5.0,
      price: 80,
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      availability: true
    },
    {
      name: 'Maya Gurung',
      experience: '10 years',
      specialization: 'Annapurna Circuit',
      languages: ['English', 'Nepali', 'Hindi'],
      rating: 4.9,
      price: 65,
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      availability: true
    },
    {
      name: 'Ram Tharu',
      experience: '8 years',
      specialization: 'Chitwan Wildlife',
      languages: ['English', 'Nepali', 'Tharu'],
      rating: 4.8,
      price: 50,
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
      availability: true
    },
    {
      name: 'Pasang Diki',
      experience: '12 years',
      specialization: 'Cultural Tours',
      languages: ['English', 'Nepali', 'Tibetan'],
      rating: 4.9,
      price: 70,
      image: 'https://randomuser.me/api/portraits/women/65.jpg',
      availability: true
    },
    {
      name: 'Bikash Tamang',
      experience: '6 years',
      specialization: 'Rock Climbing',
      languages: ['English', 'Nepali'],
      rating: 4.7,
      price: 55,
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
      availability: true
    }
  ]
  
  try {
    for (const guide of guides) {
      await addDoc(collection(db, 'guides'), guide)
    }
    // Guides seeded successfully
    return { success: true }
  } catch (error) {
    console.error('Error seeding guides:', error)
    return { success: false, error: error.message }
  }
}

export const getGuides = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'guides'))
    const guides = []
    querySnapshot.forEach((doc) => {
      guides.push({ id: doc.id, ...doc.data() })
    })
    return { success: true, data: guides }
  } catch (error) {
    console.error('Error getting guides:', error)
    return { success: false, error: error.message }
  }
}

export const subscribeToGuides = (callback) => {
  return onSnapshot(collection(db, 'guides'), (querySnapshot) => {
    const guides = []
    querySnapshot.forEach((doc) => {
      guides.push({ id: doc.id, ...doc.data() })
    })
    callback(guides)
  })
}

// ==================== BUS ROUTES ====================

export const seedBusRoutes = async () => {
  const routes = [
    { from: 'Kathmandu', to: 'Pokhara', price: 15, duration: '7-8 hours', type: 'Tourist Bus' },
    { from: 'Kathmandu', to: 'Chitwan', price: 12, duration: '5-6 hours', type: 'Tourist Bus' },
    { from: 'Kathmandu', to: 'Lumbini', price: 20, duration: '8-10 hours', type: 'Deluxe Bus' },
    { from: 'Pokhara', to: 'Chitwan', price: 18, duration: '4-5 hours', type: 'Tourist Bus' },
    { from: 'Kathmandu', to: 'Namche Bazaar', price: 25, duration: '12-14 hours', type: 'Jeep' },
    { from: 'Pokhara', to: 'Jomsom', price: 22, duration: '8-10 hours', type: 'Jeep' }
  ]
  
  try {
    for (const route of routes) {
      await addDoc(collection(db, 'busRoutes'), route)
    }
    // Bus routes seeded successfully
    return { success: true }
  } catch (error) {
    console.error('Error seeding bus routes:', error)
    return { success: false, error: error.message }
  }
}

export const getBusRoutes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'busRoutes'))
    const routes = []
    querySnapshot.forEach((doc) => {
      routes.push({ id: doc.id, ...doc.data() })
    })
    return { success: true, data: routes }
  } catch (error) {
    console.error('Error getting bus routes:', error)
    return { success: false, error: error.message }
  }
}

export const subscribeToBusRoutes = (callback) => {
  return onSnapshot(collection(db, 'busRoutes'), (querySnapshot) => {
    const routes = []
    querySnapshot.forEach((doc) => {
      routes.push({ id: doc.id, ...doc.data() })
    })
    callback(routes)
  })
}

// ==================== ADMIN FUNCTIONS ====================

export const subscribeToAllBookings = (callback) => {
  return onSnapshot(
    query(collection(db, 'bookings'), orderBy('createdAt', 'desc')),
    (querySnapshot) => {
      const bookings = []
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() })
      })
      callback(bookings)
    }
  )
}

// Hotel CRUD
export const createHotel = async (hotelData) => {
  try {
    const docRef = await addDoc(collection(db, 'hotels'), {
      ...hotelData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating hotel:', error)
    return { success: false, error: error.message }
  }
}

export const updateHotel = async (hotelId, hotelData) => {
  try {
    await updateDoc(doc(db, 'hotels', hotelId), {
      ...hotelData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating hotel:', error)
    return { success: false, error: error.message }
  }
}

export const deleteHotel = async (hotelId) => {
  try {
    await deleteDoc(doc(db, 'hotels', hotelId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting hotel:', error)
    return { success: false, error: error.message }
  }
}

// Guide CRUD
export const createGuide = async (guideData) => {
  try {
    const docRef = await addDoc(collection(db, 'guides'), {
      ...guideData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating guide:', error)
    return { success: false, error: error.message }
  }
}

export const updateGuide = async (guideId, guideData) => {
  try {
    await updateDoc(doc(db, 'guides', guideId), {
      ...guideData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating guide:', error)
    return { success: false, error: error.message }
  }
}

export const deleteGuide = async (guideId) => {
  try {
    await deleteDoc(doc(db, 'guides', guideId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting guide:', error)
    return { success: false, error: error.message }
  }
}

// ==================== USERS MANAGEMENT ====================

export const subscribeToAllUsers = (callback) => {
  return onSnapshot(
    query(collection(db, 'users'), orderBy('createdAt', 'desc')),
    (querySnapshot) => {
      const users = []
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() })
      })
      callback(users)
    }
  )
}

export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'))
    const users = []
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() })
    })
    return { success: true, data: users }
  } catch (error) {
    console.error('Error getting users:', error)
    return { success: false, error: error.message }
  }
}

export const updateUser = async (userId, userData) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...userData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating user:', error)
    return { success: false, error: error.message }
  }
}

export const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, 'users', userId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: error.message }
  }
}

export const blockUser = async (userId, blocked) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      blocked: blocked,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error blocking user:', error)
    return { success: false, error: error.message }
  }
}

// ==================== BUS ROUTES CRUD ====================

export const createBusRoute = async (routeData) => {
  try {
    const docRef = await addDoc(collection(db, 'busRoutes'), {
      ...routeData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating bus route:', error)
    return { success: false, error: error.message }
  }
}

export const updateBusRoute = async (routeId, routeData) => {
  try {
    await updateDoc(doc(db, 'busRoutes', routeId), {
      ...routeData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating bus route:', error)
    return { success: false, error: error.message }
  }
}

export const deleteBusRoute = async (routeId) => {
  try {
    await deleteDoc(doc(db, 'busRoutes', routeId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting bus route:', error)
    return { success: false, error: error.message }
  }
}

// ==================== BOOKING MANAGEMENT ====================

export const deleteBooking = async (bookingId) => {
  try {
    await deleteDoc(doc(db, 'bookings', bookingId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting booking:', error)
    return { success: false, error: error.message }
  }
}

// ==================== SITE SETTINGS ====================

export const getSiteSettings = async () => {
  try {
    const docRef = doc(db, 'settings', 'site')
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() }
    }
    // Return default settings
    return {
      success: true,
      data: {
        siteName: 'Explore Nepal',
        logo: '',
        contactEmail: 'info@explorenepal.com',
        contactPhone: '+977 1 4123456',
        address: 'Thamel, Kathmandu, Nepal',
        socialLinks: {
          facebook: '',
          instagram: '',
          twitter: '',
          youtube: ''
        },
        homepage: {
          heroTitle: 'Discover the Magic of Nepal',
          heroSubtitle: 'Experience the majestic Himalayas, rich cultural heritage, and thrilling adventures',
          featuredDestinations: [],
          bannerImage: ''
        }
      }
    }
  } catch (error) {
    console.error('Error getting site settings:', error)
    return { success: false, error: error.message }
  }
}

export const updateSiteSettings = async (settings) => {
  try {
    await setDoc(doc(db, 'settings', 'site'), {
      ...settings,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating site settings:', error)
    return { success: false, error: error.message }
  }
}

export const subscribeToSiteSettings = (callback) => {
  return onSnapshot(doc(db, 'settings', 'site'), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data())
    } else {
      callback(null)
    }
  })
}

// ==================== ANALYTICS ====================

export const getDashboardStats = async () => {
  try {
    // Get total users
    const usersSnapshot = await getDocs(collection(db, 'users'))
    const totalUsers = usersSnapshot.size

    // Get total bookings
    const bookingsSnapshot = await getDocs(collection(db, 'bookings'))
    const totalBookings = bookingsSnapshot.size

    // Calculate revenue
    let totalRevenue = 0
    let pendingBookings = 0
    let confirmedBookings = 0
    let cancelledBookings = 0

    bookingsSnapshot.forEach((doc) => {
      const booking = doc.data()
      if (booking.price) {
        totalRevenue += booking.price
      }
      if (booking.status === 'pending') pendingBookings++
      else if (booking.status === 'confirmed') confirmedBookings++
      else if (booking.status === 'cancelled') cancelledBookings++
    })

    // Get recent bookings (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentBookingsQuery = query(
      collection(db, 'bookings'),
      where('createdAt', '>=', thirtyDaysAgo),
      orderBy('createdAt', 'desc')
    )
    const recentBookingsSnapshot = await getDocs(recentBookingsQuery)
    const recentBookings = recentBookingsSnapshot.size

    return {
      success: true,
      data: {
        totalUsers,
        totalBookings,
        totalRevenue,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        recentBookings
      }
    }
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    return { success: false, error: error.message }
  }
}

// ==================== REVIEWS ====================

export const subscribeToReviews = (callback) => {
  return onSnapshot(
    query(collection(db, 'reviews'), orderBy('createdAt', 'desc')),
    (querySnapshot) => {
      const reviews = []
      querySnapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() })
      })
      callback(reviews)
    }
  )
}

export const deleteReview = async (reviewId) => {
  try {
    await deleteDoc(doc(db, 'reviews', reviewId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting review:', error)
    return { success: false, error: error.message }
  }
}

// ==================== NOTIFICATIONS ====================

export const createNotification = async (notificationData) => {
  try {
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notificationData,
      createdAt: serverTimestamp(),
      read: false
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating notification:', error)
    return { success: false, error: error.message }
  }
}

export const subscribeToNotifications = (callback) => {
  return onSnapshot(
    query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(50)),
    (querySnapshot) => {
      const notifications = []
      querySnapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() })
      })
      callback(notifications)
    }
  )
}

// ==================== PROVIDER FUNCTIONS ====================

export const subscribeToProviderBookings = (providerId, callback) => {
  // This function queries bookings related to this provider's hotels/guides
  // For now, we'll return all bookings and filter client-side
  return onSnapshot(
    query(collection(db, 'bookings'), orderBy('createdAt', 'desc')),
    (querySnapshot) => {
      const bookings = []
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() })
      })
      callback(bookings)
    }
  )
}

// ==================== PACKAGES CRUD ====================

export const createPackage = async (packageData) => {
  try {
    const docRef = await addDoc(collection(db, 'packages'), {
      ...packageData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating package:', error)
    return { success: false, error: error.message }
  }
}

export const updatePackage = async (packageId, packageData) => {
  try {
    await updateDoc(doc(db, 'packages', packageId), {
      ...packageData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating package:', error)
    return { success: false, error: error.message }
  }
}

export const deletePackage = async (packageId) => {
  try {
    await deleteDoc(doc(db, 'packages', packageId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting package:', error)
    return { success: false, error: error.message }
  }
}

export const getPackages = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'packages'))
    const packages = []
    querySnapshot.forEach((doc) => {
      packages.push({ id: doc.id, ...doc.data() })
    })
    return { success: true, data: packages }
  } catch (error) {
    console.error('Error getting packages:', error)
    return { success: false, error: error.message }
  }
}

export const subscribeToPackages = (callback) => {
  return onSnapshot(collection(db, 'packages'), (querySnapshot) => {
    const packages = []
    querySnapshot.forEach((doc) => {
      packages.push({ id: doc.id, ...doc.data() })
    })
    callback(packages)
  })
}

export const seedPackages = async () => {
  const defaultPackages = [
    {
      title: 'Kathmandu Heritage Tour',
      duration: '3 Days',
      price: 15000,
      image: '/image/Boudhanath Stupa.jpg',
      category: 'Cultural',
      rating: 4.8,
      reviews: 156,
      inclusions: ['Hotel', 'Guide', 'Breakfast', 'Entry Fees'],
      highlights: ['Pashupatinath Temple', 'Boudhanath Stupa', 'Patan Durbar Square', 'Swayambhunath'],
      description: 'Explore the rich cultural heritage of Kathmandu Valley with expert guides.',
      featured: true,
      available: true
    },
    {
      title: 'Pokhara Lakeside Retreat',
      duration: '4 Days',
      price: 25000,
      image: '/image/Phewa Lake.jpg',
      category: 'Relaxation',
      rating: 4.9,
      reviews: 234,
      inclusions: ['Resort', 'Boating', 'Sarangkot Sunrise', 'Paragliding'],
      highlights: ['Phewa Lake', 'World Peace Pagoda', 'Davis Falls', 'Gupteshwor Cave'],
      description: 'Relax by the lake and enjoy adventure activities in Pokhara.',
      featured: true,
      available: true
    },
    {
      title: 'Chitwan Wildlife Safari',
      duration: '3 Days',
      price: 22000,
      image: '/image/Chitwan National Park.jpg',
      category: 'Wildlife',
      rating: 4.7,
      reviews: 189,
      inclusions: ['Jungle Lodge', 'Safari', 'Meals', 'Guide'],
      highlights: ['Elephant Safari', 'Canoe Ride', 'Jeep Safari', 'Bird Watching'],
      description: 'Experience Nepal\'s wildlife in Chitwan National Park.',
      featured: false,
      available: true
    },
    {
      title: 'Everest Base Camp Trek',
      duration: '14 Days',
      price: 85000,
      image: '/image/Everest Base Camp.jpg',
      category: 'Adventure',
      rating: 4.9,
      reviews: 412,
      inclusions: ['Tea Houses', 'Guide', 'Porter', 'Permits', 'Flights'],
      highlights: ['Namche Bazaar', 'Tengboche Monastery', 'Kala Patthar', 'Everest View'],
      description: 'The ultimate trekking adventure to the roof of the world.',
      featured: true,
      available: true
    },
    {
      title: 'Annapurna Circuit',
      duration: '12 Days',
      price: 65000,
      image: '/image/Annapurna Base Camp.jpg',
      category: 'Adventure',
      rating: 4.8,
      reviews: 298,
      inclusions: ['Tea Houses', 'Guide', 'Porter', 'Permits'],
      highlights: ['Thorong La Pass', 'Muktinath', 'Manang', 'Tilicho Lake'],
      description: 'Complete the world-famous Annapurna Circuit trek.',
      featured: false,
      available: true
    },
    {
      title: 'Lumbini Spiritual Journey',
      duration: '2 Days',
      price: 12000,
      image: '/image/Lumbini.jpg',
      category: 'Spiritual',
      rating: 4.6,
      reviews: 87,
      inclusions: ['Hotel', 'Guide', 'Meditation Session'],
      highlights: ['Maya Devi Temple', 'Sacred Garden', 'Monasteries', 'Peace Pagoda'],
      description: 'Peaceful pilgrimage to the birthplace of Lord Buddha.',
      featured: false,
      available: true
    }
  ]

  try {
    for (const pkg of defaultPackages) {
      await addDoc(collection(db, 'packages'), {
        ...pkg,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    }
    // Packages seeded successfully
    return { success: true }
  } catch (error) {
    console.error('Error seeding packages:', error)
    return { success: false, error: error.message }
  }
}

// ==================== CATEGORIES CRUD ====================

export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'))
    const categories = []
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() })
    })
    return { success: true, data: categories }
  } catch (error) {
    console.error('Error getting categories:', error)
    return { success: false, error: error.message }
  }
}

export const subscribeToCategories = (callback) => {
  return onSnapshot(collection(db, 'categories'), (querySnapshot) => {
    const categories = []
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() })
    })
    callback(categories)
  })
}

export const addCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), {
      ...categoryData,
      createdAt: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error adding category:', error)
    return { success: false, error: error.message }
  }
}

export const deleteCategory = async (categoryId) => {
  try {
    await deleteDoc(doc(db, 'categories', categoryId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { success: false, error: error.message }
  }
}


