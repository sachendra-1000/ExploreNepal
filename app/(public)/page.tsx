'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Users, 
  MapPin, 
  UserCheck, 
  Calendar, 
  Briefcase, 
  Hotel, 
  Bus, 
  Compass, 
  Mountain, 
  Headphones,
  ArrowRight,
  Globe,
  Star,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import {
  subscribeToDestinations,
  subscribeToPackages,
  subscribeToHotels,
  subscribeToGuides,
  subscribeToHeroSlides,
  subscribeToHomeContent,
  subscribeToTestimonials
} from '@/lib/firestore'

// Skeleton Loader Component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl ${className}`} />
)

export default function Home() {
  // State for data
  const [destinations, setDestinations] = useState<any[]>([])
  const [packages, setPackages] = useState<any[]>([])
  const [hotels, setHotels] = useState<any[]>([])
  const [guides, setGuides] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const services = [
    { icon: Briefcase, title: 'Tour Packages', description: 'Curated travel packages for every type of traveler.', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600', hover: 'group-hover:bg-blue-600' },
    { icon: Hotel, title: 'Luxury Hotels', description: 'Handpicked premium accommodations across Nepal.', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600', hover: 'group-hover:bg-emerald-600' },
    { icon: Bus, title: 'Bus Services', description: 'Reliable and comfortable intercity transport.', color: 'violet', bg: 'bg-violet-50', text: 'text-violet-600', hover: 'group-hover:bg-violet-600' },
    { icon: Compass, title: 'Local Guides', description: 'Professional local experts for authentic experiences.', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-600', hover: 'group-hover:bg-amber-600' },
    { icon: Mountain, title: 'Adventure', description: 'Trekking, rafting, and adrenaline activities.', color: 'rose', bg: 'bg-rose-50', text: 'text-rose-600', hover: 'group-hover:bg-rose-600' },
    { icon: Headphones, title: '24/7 Support', description: 'Dedicated assistance for your entire journey.', color: 'indigo', bg: 'bg-indigo-50', text: 'text-indigo-600', hover: 'group-hover:bg-indigo-600' }
  ]

  // Subscribe to Firestore data
  useEffect(() => {
    const unsubDestinations = subscribeToDestinations(setDestinations)
    const unsubPackages = subscribeToPackages(setPackages)
    const unsubHotels = subscribeToHotels(setHotels)
    const unsubGuides = subscribeToGuides(setGuides)
    const unsubTestimonials = subscribeToTestimonials(setTestimonials)

    // Simulate loading for better UX
    const timer = setTimeout(() => setLoading(false), 1000)

    return () => {
      unsubDestinations()
      unsubPackages()
      unsubHotels()
      unsubGuides()
      unsubTestimonials()
      clearTimeout(timer)
    }
  }, [])

  // Get featured places (use first 3 destinations or hotels if available)
  const featuredPlaces = destinations.slice(0, 3).length > 0 
    ? destinations.slice(0, 3) 
    : hotels.slice(0, 3)

  // Calculate stats from data
  const stats = [
    { 
      number: `${packages.length > 0 ? packages.length : '0'}`, 
      label: 'Tour Packages', 
      icon: Briefcase, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      number: `${destinations.length > 0 ? destinations.length : '0'}`, 
      label: 'Destinations', 
      icon: MapPin, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      number: `${guides.length > 0 ? guides.length : '0'}`, 
      label: 'Expert Guides', 
      icon: UserCheck, 
      color: 'text-violet-600', 
      bg: 'bg-violet-50' 
    },
    { 
      number: `${hotels.length > 0 ? hotels.length : '0'}`, 
      label: 'Hotels', 
      icon: Hotel, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50' 
    }
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0"
          >
            <Image
              src="/image/Everest Base Camp.jpg"
              alt="Nepal"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent z-10" />
        </div>
        
        <div className="container-custom relative z-20 px-4 w-full">
          <div className="max-w-3xl space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 backdrop-blur-md border border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <Globe size={14} />
              <span>Explore the Himalayas</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter"
            >
              Discover Nepal's <span className="text-blue-500">Magic</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-slate-300 text-base md:text-lg max-w-lg font-medium leading-relaxed"
            >
              Experience breathtaking landscapes and ancient traditions in the Himalayas.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/packages">
                  <Button size="lg" className="rounded-2xl py-5 px-8 shadow-2xl shadow-blue-600/20 font-black text-xs md:text-sm uppercase tracking-widest">
                    Explore Packages
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="rounded-2xl py-5 px-8 bg-white/5 border-white/20 text-white hover:bg-white hover:text-slate-900 font-black text-xs md:text-sm uppercase tracking-widest backdrop-blur-sm transition-all">
                    Contact Us
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => window.scrollBy({ top: window.innerHeight * 0.5, behavior: 'smooth' })}
        >
          <div className="text-white/60 text-xs font-black uppercase tracking-widest mb-2 hover:text-white/80 transition-colors">
            Scroll Down
          </div>
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2 hover:border-white/60 transition-colors">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-white/60 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white relative">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <stat.icon size={28} />
                </div>
                <div className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{stat.number}</div>
                <div className="text-sm font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-24 bg-slate-50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                <MapPin size={12} />
                <span>Popular Choice</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Featured Destinations</h2>
            </div>
            <Link href="/packages" className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-widest group">
              View All Packages
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              // Skeleton loaders while fetching data
              [...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="aspect-[4/5] rounded-[2.5rem] bg-slate-200 dark:bg-slate-800" />
                </motion.div>
              ))
            ) : featuredPlaces.length > 0 ? (
              featuredPlaces.map((place, i) => (
                <motion.div
                  key={place.id || i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
                    {place.image ? (
                      <Image
                        src={place.image}
                        alt={place.name || 'Destination'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute top-6 right-6">
                      <div className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-black flex items-center gap-1.5">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        {place.rating || 4.5}
                      </div>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 space-y-2">
                      <p className="text-xs font-black text-blue-400 uppercase tracking-widest">{place.location || 'Nepal'}</p>
                      <h3 className="text-2xl font-black text-white tracking-tight">{place.name || place.title}</h3>
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <span className="text-lg font-black text-white">
                          {place.price ? (typeof place.price === 'number' ? `Rs. ${place.price.toLocaleString()}` : place.price) : 'Contact us'}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // Empty state when no data available
              <div className="col-span-full py-20 text-center">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto">
                    <MapPin className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">No destinations available</h3>
                  <p className="text-slate-500 font-medium">Check back soon for amazing destinations in Nepal!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Premium Travel Services</h2>
            <p className="text-slate-500 text-lg font-medium">We provide end-to-end solutions for a seamless and memorable adventure in Nepal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500 h-full group">
                  <CardContent className="p-10 space-y-6">
                    <div className={`w-16 h-16 rounded-2xl ${service.bg} ${service.text} flex items-center justify-center ${service.hover} group-hover:text-white transition-all duration-500`}>
                      <service.icon size={32} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">{service.title}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed">{service.description}</p>
                    </div>
                    <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-blue-600 transition-colors">
                      Learn More <ChevronRight size={14} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 z-0" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -ml-48 -mb-48" />
        
        <div className="container-custom relative z-10 text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.3em]">
              <ShieldCheck size={14} />
              <span>Secure Booking</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">Ready for your Nepal Adventure?</h2>
            <p className="text-blue-100 text-xl font-medium opacity-90 max-w-2xl mx-auto">
              Join thousands of travelers who have explored the magical landscapes of Nepal with our expert team.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/signup">
              <Button variant="outline" size="lg" className="rounded-2xl py-6 px-12 bg-white text-blue-600 border-none hover:bg-slate-100 font-black text-sm uppercase tracking-widest shadow-2xl">
                Join Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="rounded-2xl py-6 px-12 bg-transparent border-white/30 text-white hover:bg-white/10 font-black text-sm uppercase tracking-widest backdrop-blur-sm">
                Get a Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
