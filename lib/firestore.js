import { 
  db,
  storage
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
  limit,
  writeBatch,
  increment
} from 'firebase/firestore'
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

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

export const deleteBooking = async (bookingId) => {
  try {
    await deleteDoc(doc(db, 'bookings', bookingId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting booking:', error)
    return { success: false, error: error.message }
  }
}

export const updateBooking = async (bookingId, bookingData) => {
  try {
    await updateDoc(doc(db, 'bookings', bookingId), {
      ...bookingData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating booking:', error)
    return { success: false, error: error.message }
  }
}

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
    }
  ]
  
  try {
    for (const hotel of hotels) {
      await addDoc(collection(db, 'hotels'), hotel)
    }
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
    }
  ]
  
  try {
    for (const guide of guides) {
      await addDoc(collection(db, 'guides'), guide)
    }
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

// ==================== BUS ROUTES ====================

export const seedBusRoutes = async () => {
  const routes = [
    { from: 'Kathmandu', to: 'Pokhara', price: 15, duration: '7-8 hours', type: 'Tourist Bus' },
    { from: 'Kathmandu', to: 'Chitwan', price: 12, duration: '5-6 hours', type: 'Tourist Bus' }
  ]
  
  try {
    for (const route of routes) {
      await addDoc(collection(db, 'busRoutes'), route)
    }
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

// ==================== PACKAGES ====================

export const subscribeToPackages = (callback) => {
  return onSnapshot(
    query(collection(db, 'packages'), orderBy('createdAt', 'desc')),
    (querySnapshot) => {
      const packages = []
      querySnapshot.forEach((doc) => {
        packages.push({ id: doc.id, ...doc.data() })
      })
      callback(packages)
    }
  )
}

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

// ==================== DESTINATIONS ====================

export const subscribeToDestinations = (callback) => {
  return onSnapshot(
    query(collection(db, 'destinations'), orderBy('createdAt', 'desc')),
    (querySnapshot) => {
      const destinations = []
      querySnapshot.forEach((doc) => {
        destinations.push({ id: doc.id, ...doc.data() })
      })
      callback(destinations)
    }
  )
}

export const createDestination = async (destinationData) => {
  try {
    const docRef = await addDoc(collection(db, 'destinations'), {
      ...destinationData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating destination:', error)
    return { success: false, error: error.message }
  }
}

export const updateDestination = async (destinationId, destinationData) => {
  try {
    await updateDoc(doc(db, 'destinations', destinationId), {
      ...destinationData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating destination:', error)
    return { success: false, error: error.message }
  }
}

export const deleteDestination = async (destinationId) => {
  try {
    await deleteDoc(doc(db, 'destinations', destinationId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting destination:', error)
    return { success: false, error: error.message }
  }
}

// ==================== LOCAL TOURS ====================

export const subscribeToLocalTours = (callback) => {
  return onSnapshot(
    query(collection(db, 'localTours'), orderBy('createdAt', 'desc')),
    (querySnapshot) => {
      const tours = []
      querySnapshot.forEach((doc) => {
        tours.push({ id: doc.id, ...doc.data() })
      })
      callback(tours)
    }
  )
}

export const createLocalTour = async (tourData) => {
  try {
    const docRef = await addDoc(collection(db, 'localTours'), {
      ...tourData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating local tour:', error)
    return { success: false, error: error.message }
  }
}

export const updateLocalTour = async (tourId, tourData) => {
  try {
    await updateDoc(doc(db, 'localTours', tourId), {
      ...tourData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating local tour:', error)
    return { success: false, error: error.message }
  }
}

export const deleteLocalTour = async (tourId) => {
  try {
    await deleteDoc(doc(db, 'localTours', tourId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting local tour:', error)
    return { success: false, error: error.message }
  }
}

// ==================== EVENTS ====================

export const subscribeToEvents = (callback) => {
  return onSnapshot(
    query(collection(db, 'events'), orderBy('createdAt', 'desc')),
    (querySnapshot) => {
      const events = []
      querySnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() })
      })
      callback(events)
    }
  )
}

export const createEvent = async (eventData) => {
  try {
    const docRef = await addDoc(collection(db, 'events'), {
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating event:', error)
    return { success: false, error: error.message }
  }
}

export const updateEvent = async (eventId, eventData) => {
  try {
    await updateDoc(doc(db, 'events', eventId), {
      ...eventData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating event:', error)
    return { success: false, error: error.message }
  }
}

export const deleteEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, 'events', eventId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting event:', error)
    return { success: false, error: error.message }
  }
}

// ==================== GALLERY ====================

export const subscribeToGallery = (callback) => {
  return onSnapshot(
    query(collection(db, 'gallery'), orderBy('createdAt', 'desc')),
    (querySnapshot) => {
      const gallery = []
      querySnapshot.forEach((doc) => {
        gallery.push({ id: doc.id, ...doc.data() })
      })
      callback(gallery)
    }
  )
}

export const createGalleryItem = async (itemData) => {
  try {
    const docRef = await addDoc(collection(db, 'gallery'), {
      ...itemData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating gallery item:', error)
    return { success: false, error: error.message }
  }
}

export const updateGalleryItem = async (itemId, itemData) => {
  try {
    await updateDoc(doc(db, 'gallery', itemId), {
      ...itemData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating gallery item:', error)
    return { success: false, error: error.message }
  }
}

export const deleteGalleryItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, 'gallery', itemId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting gallery item:', error)
    return { success: false, error: error.message }
  }
}

// ==================== BLOG ====================

export const subscribeToBlogs = (callback) => {
  return onSnapshot(
    query(collection(db, 'blogs'), orderBy('createdAt', 'desc')),
    (querySnapshot) => {
      const blogs = []
      querySnapshot.forEach((doc) => {
        blogs.push({ id: doc.id, ...doc.data() })
      })
      callback(blogs)
    }
  )
}

export const createBlog = async (blogData) => {
  try {
    const docRef = await addDoc(collection(db, 'blogs'), {
      ...blogData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating blog:', error)
    return { success: false, error: error.message }
  }
}

export const updateBlog = async (blogId, blogData) => {
  try {
    await updateDoc(doc(db, 'blogs', blogId), {
      ...blogData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating blog:', error)
    return { success: false, error: error.message }
  }
}

export const deleteBlog = async (blogId) => {
  try {
    await deleteDoc(doc(db, 'blogs', blogId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting blog:', error)
    return { success: false, error: error.message }
  }
}

// ==================== TESTIMONIALS ====================

export const subscribeToTestimonials = (callback) => {
  return onSnapshot(
    query(collection(db, 'testimonials'), orderBy('createdAt', 'desc')),
    (querySnapshot) => {
      const testimonials = []
      querySnapshot.forEach((doc) => {
        testimonials.push({ id: doc.id, ...doc.data() })
      })
      callback(testimonials)
    }
  )
}

export const createTestimonial = async (testimonialData) => {
  try {
    const docRef = await addDoc(collection(db, 'testimonials'), {
      ...testimonialData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return { success: false, error: error.message }
  }
}

export const updateTestimonial = async (testimonialId, testimonialData) => {
  try {
    await updateDoc(doc(db, 'testimonials', testimonialId), {
      ...testimonialData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return { success: false, error: error.message }
  }
}

export const deleteTestimonial = async (testimonialId) => {
  try {
    await deleteDoc(doc(db, 'testimonials', testimonialId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return { success: false, error: error.message }
  }
}

// ==================== FAQ ====================

export const subscribeToFaqs = (callback) => {
  return onSnapshot(
    query(collection(db, 'faqs'), orderBy('order', 'asc')),
    (querySnapshot) => {
      const faqs = []
      querySnapshot.forEach((doc) => {
        faqs.push({ id: doc.id, ...doc.data() })
      })
      callback(faqs)
    }
  )
}

export const createFaq = async (faqData) => {
  try {
    const docRef = await addDoc(collection(db, 'faqs'), {
      ...faqData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating FAQ:', error)
    return { success: false, error: error.message }
  }
}

export const updateFaq = async (faqId, faqData) => {
  try {
    await updateDoc(doc(db, 'faqs', faqId), {
      ...faqData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating FAQ:', error)
    return { success: false, error: error.message }
  }
}

export const deleteFaq = async (faqId) => {
  try {
    await deleteDoc(doc(db, 'faqs', faqId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    return { success: false, error: error.message }
  }
}

// ==================== CONTACT MESSAGES ====================

export const subscribeToContactMessages = (callback) => {
  return onSnapshot(
    query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc')),
    (querySnapshot) => {
      const messages = []
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() })
      })
      callback(messages)
    }
  )
}

export const createContactMessage = async (messageData) => {
  try {
    const docRef = await addDoc(collection(db, 'contactMessages'), {
      ...messageData,
      createdAt: serverTimestamp(),
      read: false
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating contact message:', error)
    return { success: false, error: error.message }
  }
}

export const updateContactMessage = async (messageId, messageData) => {
  try {
    await updateDoc(doc(db, 'contactMessages', messageId), {
      ...messageData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating contact message:', error)
    return { success: false, error: error.message }
  }
}

export const deleteContactMessage = async (messageId) => {
  try {
    await deleteDoc(doc(db, 'contactMessages', messageId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting contact message:', error)
    return { success: false, error: error.message }
  }
}

// ==================== IMAGE UPLOAD ====================

export const uploadImage = async (file, path = 'uploads') => {
  try {
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          resolve({ success: true, url: downloadURL })
        }
      )
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return { success: false, error: error.message }
  }
}

export const deleteImage = async (imageUrl) => {
  try {
    const storageRef = ref(storage, imageUrl)
    await deleteObject(storageRef)
    return { success: true }
  } catch (error) {
    console.error('Error deleting image:', error)
    return { success: false, error: error.message }
  }
}

// ==================== TRANSPORTATION ====================

export const subscribeToTransportation = (callback) => {
  return onSnapshot(
    query(collection(db, 'transportation'), orderBy('createdAt', 'desc')),
    (querySnapshot) => {
      const transportation = []
      querySnapshot.forEach((doc) => {
        transportation.push({ id: doc.id, ...doc.data() })
      })
      callback(transportation)
    }
  )
}

export const createTransportation = async (transportData) => {
  try {
    const docRef = await addDoc(collection(db, 'transportation'), {
      ...transportData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating transportation:', error)
    return { success: false, error: error.message }
  }
}

export const updateTransportation = async (transportId, transportData) => {
  try {
    await updateDoc(doc(db, 'transportation', transportId), {
      ...transportData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating transportation:', error)
    return { success: false, error: error.message }
  }
}

export const deleteTransportation = async (transportId) => {
  try {
    await deleteDoc(doc(db, 'transportation', transportId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting transportation:', error)
    return { success: false, error: error.message }
  }
}

// ==================== HERO SLIDES ====================

export const subscribeToHeroSlides = (callback) => {
  return onSnapshot(
    query(collection(db, 'heroSlides'), orderBy('order', 'asc')),
    (querySnapshot) => {
      const slides = []
      querySnapshot.forEach((doc) => {
        slides.push({ id: doc.id, ...doc.data() })
      })
      callback(slides)
    }
  )
}

export const createHeroSlide = async (slideData) => {
  try {
    const docRef = await addDoc(collection(db, 'heroSlides'), {
      ...slideData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating hero slide:', error)
    return { success: false, error: error.message }
  }
}

export const updateHeroSlide = async (slideId, slideData) => {
  try {
    await updateDoc(doc(db, 'heroSlides', slideId), {
      ...slideData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating hero slide:', error)
    return { success: false, error: error.message }
  }
}

export const deleteHeroSlide = async (slideId) => {
  try {
    await deleteDoc(doc(db, 'heroSlides', slideId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting hero slide:', error)
    return { success: false, error: error.message }
  }
}

// ==================== HOME CONTENT ====================

export const subscribeToHomeContent = (callback) => {
  return onSnapshot(doc(db, 'settings', 'homeContent'), (docSnap) => {
    callback(docSnap.exists() ? docSnap.data() : null)
  })
}

export const updateHomeContent = async (contentData) => {
  try {
    await setDoc(doc(db, 'settings', 'homeContent'), {
      ...contentData,
      updatedAt: serverTimestamp()
    }, { merge: true })
    return { success: true }
  } catch (error) {
    console.error('Error updating home content:', error)
    return { success: false, error: error.message }
  }
}

// ==================== ABOUT CONTENT ====================

export const subscribeToAboutContent = (callback) => {
  return onSnapshot(doc(db, 'settings', 'aboutContent'), (docSnap) => {
    callback(docSnap.exists() ? docSnap.data() : null)
  })
}

export const updateAboutContent = async (contentData) => {
  try {
    await setDoc(doc(db, 'settings', 'aboutContent'), {
      ...contentData,
      updatedAt: serverTimestamp()
    }, { merge: true })
    return { success: true }
  } catch (error) {
    console.error('Error updating about content:', error)
    return { success: false, error: error.message }
  }
}

// ==================== PRIVACY POLICY ====================

export const subscribeToPrivacyPolicy = (callback) => {
  return onSnapshot(doc(db, 'settings', 'privacyPolicy'), (docSnap) => {
    callback(docSnap.exists() ? docSnap.data() : null)
  })
}

export const updatePrivacyPolicy = async (policyData) => {
  try {
    await setDoc(doc(db, 'settings', 'privacyPolicy'), {
      ...policyData,
      updatedAt: serverTimestamp()
    }, { merge: true })
    return { success: true }
  } catch (error) {
    console.error('Error updating privacy policy:', error)
    return { success: false, error: error.message }
  }
}

// ==================== TERMS & CONDITIONS ====================

export const subscribeToTermsConditions = (callback) => {
  return onSnapshot(doc(db, 'settings', 'termsConditions'), (docSnap) => {
    callback(docSnap.exists() ? docSnap.data() : null)
  })
}

export const updateTermsConditions = async (termsData) => {
  try {
    await setDoc(doc(db, 'settings', 'termsConditions'), {
      ...termsData,
      updatedAt: serverTimestamp()
    }, { merge: true })
    return { success: true }
  } catch (error) {
    console.error('Error updating terms & conditions:', error)
    return { success: false, error: error.message }
  }
}

// ==================== CONTACT INFO ====================

export const subscribeToContactInfo = (callback) => {
  return onSnapshot(doc(db, 'settings', 'contactInfo'), (docSnap) => {
    callback(docSnap.exists() ? docSnap.data() : null)
  })
}

export const updateContactInfo = async (infoData) => {
  try {
    await setDoc(doc(db, 'settings', 'contactInfo'), {
      ...infoData,
      updatedAt: serverTimestamp()
    }, { merge: true })
    return { success: true }
  } catch (error) {
    console.error('Error updating contact info:', error)
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

// ==================== SITE SETTINGS ====================

export const getSiteSettings = async () => {
  try {
    const docRef = doc(db, 'settings', 'site')
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() }
    }
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

export const markNotificationRead = async (notificationId) => {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true
    })
    return { success: true }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return { success: false, error: error.message }
  }
}

export const deleteNotification = async (notificationId) => {
  try {
    await deleteDoc(doc(db, 'notifications', notificationId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting notification:', error)
    return { success: false, error: error.message }
  }
}

// ==================== CHAT ====================

export const sendChatMessage = async (messageData) => {
  try {
    const docRef = await addDoc(collection(db, 'chatMessages'), {
      ...messageData,
      timestamp: serverTimestamp(),
      read: false
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error sending chat message:', error)
    return { success: false, error: error.message }
  }
}

export const subscribeToChatMessages = (callback) => {
  const q = query(
    collection(db, 'chatMessages'),
    orderBy('timestamp', 'asc')
  )
  return onSnapshot(q, (querySnapshot) => {
    const messages = []
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() })
    })
    callback(messages)
  }, (error) => {
    console.error('Error in chat messages subscription:', error)
  })
}

export const markMessageAsRead = async (messageId) => {
  try {
    await updateDoc(doc(db, 'chatMessages', messageId), {
      read: true
    })
    return { success: true }
  } catch (error) {
    console.error('Error marking message as read:', error)
    return { success: false, error: error.message }
  }
}

export const deleteChatMessage = async (messageId) => {
  try {
    await deleteDoc(doc(db, 'chatMessages', messageId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting chat message:', error)
    return { success: false, error: error.message }
  }
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
