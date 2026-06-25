'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import AdminRoute from '@/components/AdminRoute'
import Toast from '@/components/Toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  Search,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  UserPlus,
  ShieldCheck,
  Ban,
  Clock,
  DollarSign,
  Package,
  MapPin,
  Star,
  Hotel,
  Compass,
  Bus,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Activity,
  UserCircle,
  MessageCircle,
  Upload,
  Sparkles
} from 'lucide-react'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { 
  subscribeToAllUsers, 
  updateUser, 
  deleteUser, 
  subscribeToAllBookings, 
  getDashboardStats,
  blockUser,
  subscribeToHotels,
  subscribeToGuides,
  subscribeToPackages,
  subscribeToBusRoutes,
  subscribeToLocalTours,
  deleteHotel,
  deleteGuide,
  deletePackage,
  deleteBusRoute,
  deleteLocalTour,
  updateBookingStatus,
  verifyPayment,
  createHotel,
  updateHotel,
  createGuide,
  updateGuide,
  createPackage,
  updatePackage,
  createBusRoute,
  updateBusRoute,
  createLocalTour,
  updateLocalTour,
  uploadImage,
  deleteImage
} from '@/lib/firestore'

import AdminChat from '@/components/AdminChat'

// Types
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'tourist' | 'provider' | 'admin';
  blocked?: boolean;
  createdAt?: any;
}

interface Booking {
  id: string;
  serviceName: string;
  userName: string;
  userEmail: string;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'processing';
  paymentStatus: 'pending' | 'verified' | 'rejected';
  createdAt: any;
  type: string;
}

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminDashboardContent />
    </AdminRoute>
  )
}

function AdminDashboardContent() {
  const router = useRouter()
  const { user, logout } = useAuth()
  
  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [serviceTab, setServiceTab] = useState<'hotels' | 'guides' | 'packages' | 'bus' | 'local-tours'>('hotels')
  const [toast, setToast] = useState({ show: false, type: 'success' as any, message: '' })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Data States
  const [users, setUsers] = useState<User[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [hotels, setHotels] = useState<any[]>([])
  const [guides, setGuides] = useState<any[]>([])
  const [packages, setPackages] = useState<any[]>([])
  const [busRoutes, setBusRoutes] = useState<any[]>([])
  const [localTours, setLocalTours] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)

  // Modal States
  const [showUserModal, setShowUserModal] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingService, setEditingService] = useState<any | null>(null)
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'tourist' as 'tourist' | 'provider' | 'admin'
  })
  const [serviceFormData, setServiceFormData] = useState({
    name: '',
    category: 'Hotel',
    location: '',
    shortDescription: '',
    fullDescription: '',
    price: '',
    discountPrice: '',
    rating: 4.5,
    duration: '',
    capacity: '',
    available: true,
    images: [] as string[],
    highlights: '',
    status: 'active'
  })
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // Load Data
  useEffect(() => {
    setLoading(true)
    
    const unsubUsers = subscribeToAllUsers((data: any) => setUsers(data))
    const unsubBookings = subscribeToAllBookings((data: any) => setBookings(data))
    const unsubHotels = subscribeToHotels((data: any) => setHotels(data))
    const unsubGuides = subscribeToGuides((data: any) => setGuides(data))
    const unsubPackages = subscribeToPackages((data: any) => setPackages(data))
    const unsubBus = subscribeToBusRoutes((data: any) => setBusRoutes(data))
    const unsubLocalTours = subscribeToLocalTours((data: any) => setLocalTours(data))

    const fetchStats = async () => {
      const result = await getDashboardStats()
      if (result.success) setStats(result.data)
      setLoading(false)
    }

    fetchStats()

    return () => {
      unsubUsers(); unsubBookings(); unsubHotels(); unsubGuides(); unsubPackages(); unsubBus(); unsubLocalTours();
    }
  }, [])

  const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    setToast({ show: true, type, message })
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  // User Handlers
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUser) {
      const result = await updateUser(editingUser.id, userFormData)
      if (result.success) {
        showToast('success', 'User updated successfully')
        setShowUserModal(false)
      } else showToast('error', 'Failed to update user')
    }
  }

  const handleBlockUser = async (u: User) => {
    const result = await blockUser(u.id, !u.blocked)
    if (result.success) showToast('success', `User ${!u.blocked ? 'blocked' : 'unblocked'}`)
  }

  const handleDeleteUser = async (id: string) => {
    if (confirm('Delete this user permanently?')) {
      const result = await deleteUser(id)
      if (result.success) showToast('success', 'User deleted')
    }
  }

  // Service Handlers
  const handleOpenServiceModal = (item?: any) => {
    setEditingService(item || null)
    if (item) {
      // Pre-fill form data
      const formData = {
        name: item.name || item.title || '',
        category: item.category || 'Hotel',
        location: item.location || '',
        shortDescription: item.shortDescription || '',
        fullDescription: item.fullDescription || item.description || '',
        price: item.price?.toString() || '',
        discountPrice: item.discountPrice?.toString() || '',
        rating: item.rating || 4.5,
        duration: item.duration || '',
        capacity: item.capacity?.toString() || '',
        available: item.available !== false,
        images: item.images || (item.image ? [item.image] : []),
        highlights: item.highlights?.join(', ') || '',
        status: item.status || 'active'
      }
      setServiceFormData(formData)
      setPreviewImages(formData.images)
    } else {
      setServiceFormData({
        name: '',
        category: 'Hotel',
        location: '',
        shortDescription: '',
        fullDescription: '',
        price: '',
        discountPrice: '',
        rating: 4.5,
        duration: '',
        capacity: '',
        available: true,
        images: [],
        highlights: '',
        status: 'active'
      })
      setPreviewImages([])
    }
    setSelectedImages([])
    setShowServiceModal(true)
  }

  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedImages(files)
      
      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file))
      setPreviewImages([...previewImages, ...newPreviews])
    }
  }

  // Remove image from preview
  const handleRemoveImage = (index: number) => {
    const newPreviews = [...previewImages]
    newPreviews.splice(index, 1)
    setPreviewImages(newPreviews)
    
    // If it was a selected file, remove from selectedImages too
    if (index >= previewImages.length - selectedImages.length) {
      const fileIndex = index - (previewImages.length - selectedImages.length)
      const newSelected = [...selectedImages]
      newSelected.splice(fileIndex, 1)
      setSelectedImages(newSelected)
    } else {
      // It's an existing image from Firestore, remove from form data
      setServiceFormData({
        ...serviceFormData,
        images: newPreviews
      })
    }
  }

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    let result

    try {
      let uploadedImageUrls = [...serviceFormData.images]

      // Upload new images to Firebase Storage
      if (selectedImages.length > 0) {
        const uploadPromises = selectedImages.map(file => 
          uploadImage(file, `services/${serviceTab}`)
        )
        const uploadResults = await Promise.all(uploadPromises)
        const newUrls = uploadResults
          .filter(res => res.success)
          .map(res => res.url)
        uploadedImageUrls = [...uploadedImageUrls, ...newUrls]
      }

      // Parse numeric fields
      const dataToSave: any = {
        ...serviceFormData,
        images: uploadedImageUrls,
        price: parseFloat(serviceFormData.price) || 0,
        discountPrice: serviceFormData.discountPrice ? parseFloat(serviceFormData.discountPrice) : null,
        rating: serviceFormData.rating || 4.5,
        capacity: serviceFormData.capacity ? parseInt(serviceFormData.capacity) : null
      }
      
      // Parse highlights (comma separated to array)
      if (dataToSave.highlights) {
        dataToSave.highlights = dataToSave.highlights.split(',').map((h: string) => h.trim()).filter(Boolean)
      }

      if (editingService) {
        switch (serviceTab) {
          case 'hotels':
            result = await updateHotel(editingService.id, dataToSave)
            break
          case 'guides':
            result = await updateGuide(editingService.id, dataToSave)
            break
          case 'packages':
            result = await updatePackage(editingService.id, dataToSave)
            break
          case 'local-tours':
            result = await updateLocalTour(editingService.id, dataToSave)
            break
          case 'bus':
            result = await updateBusRoute(editingService.id, dataToSave)
            break
        }
      } else {
        switch (serviceTab) {
          case 'hotels':
            result = await createHotel(dataToSave)
            break
          case 'guides':
            result = await createGuide(dataToSave)
            break
          case 'packages':
            result = await createPackage(dataToSave)
            break
          case 'local-tours':
            result = await createLocalTour(dataToSave)
            break
          case 'bus':
            result = await createBusRoute(dataToSave)
            break
        }
      }

      if (result.success) {
        showToast('success', editingService ? 'Service updated successfully' : 'Service added successfully')
        setShowServiceModal(false)
        setSelectedImages([])
        setPreviewImages([])
      } else {
        showToast('error', 'Failed to save service')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      showToast('error', 'Failed to save service')
    }
    setIsUploading(false)
  }

  const resetServiceForm = () => {
    setServiceFormData({
      name: '',
      category: 'Hotel',
      location: '',
      shortDescription: '',
      fullDescription: '',
      price: '',
      discountPrice: '',
      rating: 4.5,
      duration: '',
      capacity: '',
      available: true,
      images: [],
      highlights: '',
      status: 'active'
    })
    setSelectedImages([])
    setPreviewImages([])
  }

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    const result = await updateBookingStatus(bookingId, status)
    if (result.success) showToast('success', `Booking ${status}`)
    else showToast('error', 'Failed to update booking')
  }

  const handleVerifyPayment = async (bookingId: string, status: string) => {
    const result = await verifyPayment(bookingId, status)
    if (result.success) showToast('success', `Payment ${status}`)
    else showToast('error', 'Failed to verify payment')
  }

  // Sidebar Items
  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { id: 'ai-settings', label: 'AI Settings', icon: Sparkles, href: '/admin/ai-settings' },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'services', label: 'Services', icon: Package },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'payments', label: 'Finance', icon: CreditCard },
    { id: 'chat', label: 'Support', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  // Stats
  const statsCards = [
    { title: 'Total Revenue', value: `Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, trend: '+12.5%', color: 'rose' },
    { title: 'Total Users', value: stats?.totalUsers || users.length, icon: Users, trend: '+8.2%', color: 'blue' },
    { title: 'Confirmed Bookings', value: stats?.confirmedBookings || 0, icon: CheckCircle2, trend: '+15.3%', color: 'emerald' },
    { title: 'Pending Tasks', value: stats?.pendingBookings || 0, icon: Clock, trend: '-2.4%', color: 'amber' },
  ]

  // Filtered Data
  const filteredUsers = useMemo(() => 
    users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())),
  [users, searchQuery])

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans selection:bg-indigo-100 selection:text-indigo-900`}>
      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Premium Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0, x: sidebarOpen ? 0 : -280 }}
        className="fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 overflow-hidden shadow-2xl lg:shadow-none"
      >
        <div className="flex flex-col h-full w-[280px]">
          {/* Logo Section */}
          <div className="p-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center group hover:scale-110 transition-transform duration-300">
                <img 
                  src="/image/logo_explorenepal-removebg-preview.png" 
                  alt="Explore Nepal Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">ExploreNepal</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Management Suite</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {sidebarItems.map((item) => (
              item.href ? (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    activeTab === item.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-bold tracking-tight">{item.label}</span>
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    activeTab === item.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-bold tracking-tight">{item.label}</span>
                  {activeTab === item.id && (
                    <motion.div layoutId="activePill" className="ml-auto w-1.5 h-6 bg-white/40 rounded-full" />
                  )}
                </button>
              )
            ))}
          </nav>

          {/* User Profile in Sidebar */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-black">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black truncate">Administrator</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className={`transition-all duration-500 ${sidebarOpen ? 'lg:ml-[280px]' : 'ml-0'}`}>
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-8 py-4">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Menu className="w-6 h-6 text-slate-500" />
              </button>
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 font-medium">
                <span>Admin</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-indigo-600 dark:text-indigo-400 font-bold capitalize tracking-tight">{activeTab}</span>
              </div>
            </div>

            <div className="flex-1 max-w-xl relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Global command search..."
                className="w-full pl-12 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-all">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white dark:border-slate-800 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Pages */}
        <main className="p-8 max-w-7xl mx-auto space-y-8">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Welcome Section */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h2>
                  <p className="text-slate-500 font-medium mt-1">Real-time platform performance and core metrics.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
                    <Download className="w-4 h-4" /> Export Data
                  </button>
                  <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors">
                    <Plus className="w-4 h-4" /> Quick Action
                  </button>
                </div>
              </div>

              {/* Core Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((card, i) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative p-6 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 hover:border-indigo-600 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-${card.color}-100 dark:bg-${card.color}-900/30 flex items-center justify-center text-${card.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                        <card.icon className="w-6 h-6" />
                      </div>
                      <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${card.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {card.trend}
                      </div>
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.title}</p>
                    <h3 className="text-2xl font-black mt-1">{card.value}</h3>
                  </motion.div>
                ))}
              </div>

              {/* Main Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Area Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-black tracking-tight">Financial Performance</h3>
                      <p className="text-sm text-slate-500 font-medium">Monthly revenue and booking volume analysis.</p>
                    </div>
                    <select className="bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-xs font-bold px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-600/20">
                      <option>Last 6 Months</option>
                      <option>Last 12 Months</option>
                    </select>
                  </div>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'Jan', rev: 450000, book: 120 },
                        { name: 'Feb', rev: 520000, book: 145 },
                        { name: 'Mar', rev: 480000, book: 132 },
                        { name: 'Apr', rev: 610000, book: 189 },
                        { name: 'May', rev: 590000, book: 167 },
                        { name: 'Jun', rev: 720000, book: 210 },
                      ]}>
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#1e293b' : '#f1f5f9'} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                        <Tooltip 
                          contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '1rem', background: darkMode ? '#1e293b' : '#fff'}}
                          itemStyle={{fontSize: '12px', fontWeight: 800}}
                        />
                        <Area type="monotone" dataKey="rev" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#chartGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Distribution Pie Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                  <h3 className="text-xl font-black tracking-tight mb-2">Service Mix</h3>
                  <p className="text-sm text-slate-500 font-medium mb-8">Booking distribution across categories.</p>
                  <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[
                          { name: 'Hotels', value: 45, color: '#4f46e5' },
                          { name: 'Tours', value: 25, color: '#8b5cf6' },
                          { name: 'Guides', value: 20, color: '#ec4899' },
                          { name: 'Transport', value: 10, color: '#f59e0b' },
                        ]} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                          {[
                            { name: 'Hotels', value: 45, color: '#4f46e5' },
                            { name: 'Tours', value: 25, color: '#8b5cf6' },
                            { name: 'Guides', value: 20, color: '#ec4899' },
                            { name: 'Transport', value: 10, color: '#f59e0b' },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{borderRadius: '1rem', border: 'none', fontWeight: 800}} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {[{l: 'Hotels', c: 'indigo'}, {l: 'Tours', c: 'violet'}, {l: 'Guides', c: 'pink'}, {l: 'Transport', c: 'amber'}].map(i => (
                      <div key={i.l} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-${i.c}-500`} />
                        <span className="text-xs font-bold text-slate-500">{i.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Grid: Recent Bookings & System Health */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bookings Table */}
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black tracking-tight">Recent Activity</h3>
                    <Link href="/admin/bookings" className="text-xs font-black text-indigo-600 uppercase tracking-wider hover:underline">View All Records</Link>
                  </div>
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((b) => (
                      <div key={b.id} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 font-black shrink-0">
                          {b.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black truncate text-slate-900 dark:text-white">{b.userName}</p>
                          <p className="text-xs text-slate-500 font-bold truncate">{b.serviceName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-indigo-600">Rs. {b.price.toLocaleString()}</p>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {b.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Status / Quick Insights */}
                <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                        <Activity className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black tracking-tight">System Pulse</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 flex-1">
                      {[
                        { l: 'API Latency', v: '45ms', s: 'Optimal' },
                        { l: 'DB Connections', v: '1.2k', s: 'Normal' },
                        { l: 'Active Users', v: '842', s: '+12% peak' },
                        { l: 'Error Rate', v: '0.02%', s: 'Healthy' },
                      ].map(i => (
                        <div key={i.l} className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                          <p className="text-[10px] font-bold uppercase opacity-60 tracking-widest mb-1">{i.l}</p>
                          <p className="text-xl font-black">{i.v}</p>
                          <p className="text-[9px] font-black mt-1 text-white/40">{i.s}</p>
                        </div>
                      ))}
                    </div>

                    <button className="w-full mt-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm shadow-xl hover:bg-slate-50 transition-colors">
                      Detailed Health Report
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* USERS MANAGEMENT TAB */}
          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tight">System Directory</h2>
                  <p className="text-slate-500 font-medium mt-1">Total of {users.length} authenticated profiles.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" placeholder="Search profiles..." 
                      value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600/20 outline-none w-64 font-medium"
                    />
                  </div>
                  <button onClick={() => { setEditingUser(null); setShowUserModal(true); }} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors">
                    <UserPlus className="w-4 h-4" /> Add User
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">User Identity</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Authorization</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Registration</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 font-black shrink-0">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-black text-slate-900 dark:text-white truncate">{u.name}</p>
                                <p className="text-xs text-slate-500 font-medium truncate">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              u.role === 'admin' ? 'bg-indigo-100 text-indigo-600' :
                              u.role === 'provider' ? 'bg-violet-100 text-violet-600' :
                              'bg-slate-100 text-slate-500'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${u.blocked ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`} />
                              <span className="text-xs font-black uppercase tracking-tight text-slate-600 dark:text-slate-400">{u.blocked ? 'Blacklisted' : 'Operational'}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <p className="text-xs font-bold text-slate-500">{u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Jan 12, 2024'}</p>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingUser(u); setUserFormData({ name: u.name, email: u.email, phone: u.phone, role: u.role }); setShowUserModal(true); }} className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => handleBlockUser(u)} className={`p-2 rounded-lg transition-colors ${u.blocked ? 'hover:bg-emerald-50 text-emerald-600' : 'hover:bg-amber-50 text-amber-600'}`}>{u.blocked ? <ShieldCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}</button>
                              <button onClick={() => handleDeleteUser(u.id)} className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* SERVICES MANAGEMENT TAB */}
          {activeTab === 'services' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tight">Catalog Management</h2>
                  <p className="text-slate-500 font-medium mt-1">Orchestrate your inventory across all verticals.</p>
                </div>
                <button onClick={() => handleOpenServiceModal()} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black flex items-center gap-2 shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all hover:-translate-y-1">
                  <Plus className="w-5 h-5" /> Register New Asset
                </button>
              </div>

              {/* Sub-tabs for Service Types */}
              <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
                {[
                  { id: 'hotels', label: 'Hotels', icon: Hotel },
                  { id: 'guides', label: 'Guides', icon: Compass },
                  { id: 'packages', label: 'Packages', icon: Package },
                  { id: 'local-tours', label: 'Local Tours', icon: MapPin },
                  { id: 'bus', label: 'Transport', icon: Bus },
                ].map((t: any) => (
                  <button
                    key={t.id}
                    onClick={() => setServiceTab(t.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      serviceTab === t.id ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-600'
                    }`}
                  >
                    <t.icon className="w-4 h-4" /> {t.label}
                  </button>
                ))}
              </div>

              {/* Service Grid/List */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {(serviceTab === 'hotels' ? hotels : serviceTab === 'guides' ? guides : serviceTab === 'packages' ? packages : serviceTab === 'local-tours' ? localTours : busRoutes).map((item: any) => (
                  <motion.div 
                    layout
                    key={item.id} 
                    className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 overflow-hidden group hover:border-indigo-600 transition-all shadow-sm hover:shadow-xl"
                  >
                    <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-900 relative">
                      {item.image ? (
                        <img src={item.image} alt={item.name || item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300"><Package className="w-12 h-12" /></div>
                      )}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={() => handleOpenServiceModal(item)} className="p-2.5 bg-white/90 backdrop-blur shadow-lg rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
                        <button onClick={async () => {
                          if (confirm('Delete this item permanently?')) {
                            try {
                              let result
                              switch (serviceTab) {
                                case 'hotels':
                                  result = await deleteHotel(item.id)
                                  break
                                case 'guides':
                                  result = await deleteGuide(item.id)
                                  break
                                case 'packages':
                                  result = await deletePackage(item.id)
                                  break
                                case 'local-tours':
                                  result = await deleteLocalTour(item.id)
                                  break
                                case 'bus':
                                  result = await deleteBusRoute(item.id)
                                  break
                              }
                              if (result.success) {
                                showToast('success', 'Item deleted successfully')
                              }
                            } catch (error) {
                              showToast('error', 'Failed to delete item')
                            }
                          }
                        }} className="p-2.5 bg-white/90 backdrop-blur shadow-lg rounded-xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur rounded-lg text-[10px] font-black uppercase text-indigo-600 shadow-lg">Rs. {typeof item.price === 'number' ? item.price.toLocaleString() : item.price || '0'}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-black tracking-tight mb-1">{item.name || item.title}</h4>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-4">
                        <MapPin className="w-3 h-3" /> {item.location || item.specialization || 'National Network'}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-black">{item.rating || '4.5'}</span>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                          item.available ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                          {item.available ? 'Available' : 'Sold Out'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* BOOKINGS MANAGEMENT TAB */}
          {activeTab === 'bookings' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tight">Booking Ledger</h2>
                  <p className="text-slate-500 font-medium mt-1">Manage and monitor all platform reservations.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" placeholder="Search bookings..." 
                      className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600/20 outline-none w-64 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer & Service</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Financials</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Booking Status</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Payment</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {bookings.map((b) => (
                        <tr key={b.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 font-black shrink-0">
                                {b.userName.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-black text-slate-900 dark:text-white truncate">{b.userName}</p>
                                <p className="text-xs text-indigo-600 font-bold truncate">{b.serviceName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <p className="text-sm font-black text-slate-900 dark:text-white">Rs. {b.price.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{b.type || 'Standard'}</p>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' :
                              b.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                              b.status === 'cancelled' ? 'bg-rose-100 text-rose-600' :
                              'bg-slate-100 text-slate-500'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                b.paymentStatus === 'verified' ? 'bg-emerald-500' :
                                b.paymentStatus === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
                              }`} />
                              <span className="text-xs font-black uppercase tracking-tight text-slate-600 dark:text-slate-400">{b.paymentStatus}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {b.status === 'pending' && (
                                <>
                                  <button onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"><CheckCircle2 className="w-4 h-4" /></button>
                                  <button onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all"><X className="w-4 h-4" /></button>
                                </>
                              )}
                              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* FINANCE & PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tight">Financial Operations</h2>
                  <p className="text-slate-500 font-medium mt-1">Audit and verify all platform transactions.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
                    <Filter className="w-4 h-4" /> Filter Pending
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-emerald-500 text-white rounded-[2rem] shadow-lg shadow-emerald-500/20">
                  <p className="text-xs font-black uppercase tracking-widest opacity-60">Verified Revenue</p>
                  <h3 className="text-2xl font-black mt-1">Rs. {(stats?.totalRevenue || 0).toLocaleString()}</h3>
                </div>
                <div className="p-6 bg-amber-500 text-white rounded-[2rem] shadow-lg shadow-amber-500/20">
                  <p className="text-xs font-black uppercase tracking-widest opacity-60">Awaiting Verification</p>
                  <h3 className="text-2xl font-black mt-1">Rs. {bookings.filter(b => b.paymentStatus === 'pending').reduce((acc, curr) => acc + curr.price, 0).toLocaleString()}</h3>
                </div>
                <div className="p-6 bg-indigo-500 text-white rounded-[2rem] shadow-lg shadow-indigo-500/20">
                  <p className="text-xs font-black uppercase tracking-widest opacity-60">Active Refund Requests</p>
                  <h3 className="text-2xl font-black mt-1">0</h3>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <h4 className="text-lg font-black">Transaction Audit</h4>
                  <span className="text-xs font-bold text-slate-400">Real-time update stream</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Transaction ID</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Payer</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Amount</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verification Status</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Audit Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {bookings.filter(b => b.paymentStatus).map((b) => (
                        <tr key={b.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all">
                          <td className="px-8 py-5">
                            <p className="text-xs font-black font-mono uppercase text-slate-400">{b.id.substring(0, 12)}...</p>
                          </td>
                          <td className="px-8 py-5">
                            <p className="text-sm font-black">{b.userName}</p>
                            <p className="text-[10px] text-slate-500 font-bold">{b.userEmail}</p>
                          </td>
                          <td className="px-8 py-5">
                            <p className="text-sm font-black text-indigo-600">Rs. {b.price.toLocaleString()}</p>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              b.paymentStatus === 'verified' ? 'bg-emerald-100 text-emerald-600' :
                              b.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-600' :
                              'bg-rose-100 text-rose-600'
                            }`}>
                              {b.paymentStatus}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            {b.paymentStatus === 'pending' ? (
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleVerifyPayment(b.id, 'verified')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all">Approve</button>
                                <button onClick={() => handleVerifyPayment(b.id, 'rejected')} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">Reject</button>
                              </div>
                            ) : (
                              <span className="text-[10px] font-black text-slate-300 uppercase">Archived</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* PLATFORM SETTINGS TAB */}
          {activeTab === 'chat' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <AdminChat />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl space-y-8">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Platform Settings</h2>
                <p className="text-slate-500 font-medium mt-1">Global site-wide configuration and security protocols.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  {/* General Config */}
                  <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-indigo-600">Site Configuration</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Application Name</label>
                        <input type="text" defaultValue="ExploreNepal" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600/20" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Support Email</label>
                        <input type="email" defaultValue="support@explorenepal.com" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600/20" />
                      </div>
                    </div>
                  </div>

                  {/* Security Config */}
                  <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-rose-600">Security & Authentication</h4>
                    <div className="space-y-4">
                      {[
                        { l: 'Two-Factor Authentication', d: 'Enforce 2FA for all administrative accounts.', enabled: true },
                        { l: 'Provider Verification', d: 'Manual approval required for new service providers.', enabled: true },
                        { l: 'Automatic Backups', d: 'Backup database and assets every 24 hours.', enabled: false },
                      ].map(s => (
                        <div key={s.l} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                          <div>
                            <p className="text-sm font-black">{s.l}</p>
                            <p className="text-xs text-slate-500 font-medium">{s.d}</p>
                          </div>
                          <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${s.enabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${s.enabled ? 'left-7' : 'left-1'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-600/20">
                    <h4 className="text-lg font-black tracking-tight mb-4">Admin Access</h4>
                    <p className="text-xs font-medium opacity-80 mb-6 leading-relaxed">Changes here affect the entire platform. Please proceed with extreme caution.</p>
                    <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm shadow-xl hover:bg-slate-50 transition-colors">
                      Save All Changes
                    </button>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                    <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/20 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Trash2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-sm font-black">Maintenance Mode</h4>
                    <p className="text-[10px] text-slate-500 font-medium mt-1 mb-6">Take the platform offline for updates.</p>
                    <button className="w-full py-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">Enable Mode</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Modern User Modal */}
      <AnimatePresence>
        {showUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUserModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="px-10 pt-10 pb-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black tracking-tight">{editingUser ? 'Update Profile' : 'New Directory Entry'}</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Fill in the required security parameters.</p>
                </div>
                <button onClick={() => setShowUserModal(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors text-slate-400"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleUserSubmit} className="p-10 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                    <div className="relative">
                      <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input type="text" required value={userFormData.name} onChange={(e) => setUserFormData({...userFormData, name: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Reference</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input type="email" required disabled={!!editingUser} value={userFormData.email} onChange={(e) => setUserFormData({...userFormData, email: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 font-bold disabled:opacity-50" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Clearance / Role</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['tourist', 'provider', 'admin'].map(r => (
                      <button 
                        key={r} type="button" onClick={() => setUserFormData({...userFormData, role: r as any})}
                        className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          userFormData.role === r ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setShowUserModal(false)} className="flex-1 py-4 rounded-2xl font-black text-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all">Abort</button>
                  <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all">Confirm Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Service Modal */}
      <AnimatePresence>
        {showServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowServiceModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="px-10 pt-10 pb-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black tracking-tight">{editingService ? 'Update Service' : 'Add New Service'}</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Enter details for the new {serviceTab}.</p>
                </div>
                <button onClick={() => setShowServiceModal(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors text-slate-400"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleServiceSubmit} className="p-10 space-y-8 max-h-[90vh] overflow-y-auto">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <span className="text-indigo-600 font-black text-xs">1</span>
                    </div>
                    <h4 className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase">Basic Information</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Service Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={serviceFormData.name} 
                        onChange={(e) => setServiceFormData({...serviceFormData, name: e.target.value})} 
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 font-bold"
                        placeholder="Enter service name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category *</label>
                      <select 
                        value={serviceFormData.category} 
                        onChange={(e) => setServiceFormData({...serviceFormData, category: e.target.value})} 
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 font-bold"
                      >
                        <option value="Hotel">Hotel</option>
                        <option value="Tour">Tour</option>
                        <option value="Trek">Trek</option>
                        <option value="Vehicle">Vehicle</option>
                        <option value="Guide">Guide</option>
                        <option value="Local Tour">Local Tour</option>
                        <option value="Adventure">Adventure</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location *</label>
                      <input 
                        type="text" 
                        required 
                        value={serviceFormData.location} 
                        onChange={(e) => setServiceFormData({...serviceFormData, location: e.target.value})} 
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 font-bold"
                        placeholder="Enter location"
                      />
                    </div>
                    
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Short Description</label>
                      <input 
                        type="text" 
                        value={serviceFormData.shortDescription} 
                        onChange={(e) => setServiceFormData({...serviceFormData, shortDescription: e.target.value})} 
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 font-bold"
                        placeholder="Brief description"
                      />
                    </div>
                    
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Description</label>
                      <textarea 
                        value={serviceFormData.fullDescription} 
                        onChange={(e) => setServiceFormData({...serviceFormData, fullDescription: e.target.value})} 
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 font-bold resize-none"
                        rows={3}
                        placeholder="Detailed description"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <span className="text-emerald-600 font-black text-xs">2</span>
                    </div>
                    <h4 className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase">Pricing</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price (Rs.) *</label>
                      <input 
                        type="number" 
                        required 
                        value={serviceFormData.price} 
                        onChange={(e) => setServiceFormData({...serviceFormData, price: e.target.value})} 
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 font-bold"
                        placeholder="Enter price"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Discount Price (Rs.)</label>
                      <input 
                        type="number" 
                        value={serviceFormData.discountPrice} 
                        onChange={(e) => setServiceFormData({...serviceFormData, discountPrice: e.target.value})} 
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 font-bold"
                        placeholder="Enter discount price (optional)"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rating (0-5)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        min="0" 
                        max="5" 
                        value={serviceFormData.rating} 
                        onChange={(e) => setServiceFormData({...serviceFormData, rating: parseFloat(e.target.value)})} 
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 font-bold"
                        placeholder="4.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <span className="text-amber-600 font-black text-xs">3</span>
                    </div>
                    <h4 className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase">Service Details</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Duration</label>
                      <input 
                        type="text" 
                        value={serviceFormData.duration} 
                        onChange={(e) => setServiceFormData({...serviceFormData, duration: e.target.value})} 
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 font-bold"
                        placeholder="e.g., 2 hours"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Capacity</label>
                      <input 
                        type="number" 
                        value={serviceFormData.capacity} 
                        onChange={(e) => setServiceFormData({...serviceFormData, capacity: e.target.value})} 
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 font-bold"
                        placeholder="e.g., 10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</label>
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          {serviceFormData.available ? 'Active' : 'Inactive'}
                        </span>
                        <div 
                          onClick={() => setServiceFormData({...serviceFormData, available: !serviceFormData.available})} 
                          className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${serviceFormData.available ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${serviceFormData.available ? 'left-7' : 'left-1'}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Highlights (comma separated)</label>
                    <input 
                      type="text" 
                      value={serviceFormData.highlights} 
                      onChange={(e) => setServiceFormData({...serviceFormData, highlights: e.target.value})} 
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 font-bold"
                      placeholder="e.g., Guided tour, Refreshments, Transportation"
                    />
                  </div>
                </div>

                {/* Media Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                      <span className="text-rose-600 font-black text-xs">4</span>
                    </div>
                    <h4 className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase">Media</h4>
                  </div>
                  
                  {/* Image Upload Area */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Images</label>
                    
                    {/* Image Previews */}
                    {previewImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {previewImages.map((img, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={img} 
                              alt={`Preview ${index + 1}`} 
                              className="w-full h-32 object-cover rounded-2xl"
                            />
                            <button 
                              type="button" 
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* File Input */}
                    <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl bg-slate-50 dark:bg-slate-800 cursor-pointer hover:border-indigo-400 transition-all">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Upload size={36} className="text-slate-400" />
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-slate-400">
                          PNG, JPG, JPEG up to 10MB
                        </p>
                      </div>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageSelect} 
                      />
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowServiceModal(false)
                      resetServiceForm()
                    }} 
                    className="flex-1 py-4 rounded-2xl font-black text-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={resetServiceForm} 
                    className="px-6 py-4 rounded-2xl font-black text-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all"
                  >
                    Reset
                  </button>
                  <button 
                    type="submit" 
                    disabled={isUploading} 
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      editingService ? 'Save Changes' : 'Add Service'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  )
}
