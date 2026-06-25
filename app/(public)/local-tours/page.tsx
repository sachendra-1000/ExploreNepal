'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, Clock, Search, Compass, CheckCircle, ChevronRight } from 'lucide-react'
import { subscribeToLocalTours } from '@/lib/firestore'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

// Skeleton Loader Component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl ${className}`} />
)

export default function LocalTours() {
  const [tours, setTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const unsubscribe = subscribeToLocalTours((data: any[]) => {
      setTours(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const filteredTours = tours.filter(tour => 
    (tour.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tour.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/image/Kathmandu Heritage Tour.jpg" alt="Local Tours in Nepal" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />
        </div>
        <div className="container-custom relative z-10 text-center space-y-4 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <Compass size={14} />
            <span>Authentic Experiences</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          >
            Local <span className="text-blue-500">Tours</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-lg font-medium max-w-2xl mx-auto"
          >
            Discover the real Nepal with local guides and immersive cultural experiences.
          </motion.p>
        </div>
      </section>

      <div className="container-custom -mt-12 relative z-20 px-4">
        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 max-w-3xl mx-auto"
        >
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by tour name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </motion.div>

        {/* Results Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode='popLayout'>
            {loading ? (
              // Skeleton loaders while fetching data
              [...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="border-none shadow-lg shadow-slate-200/50 rounded-[2.5rem] overflow-hidden h-full flex flex-col">
                    <Skeleton className="h-64 shrink-0" />
                    <div className="p-8 flex-1 flex flex-col space-y-6">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-3/4" />
                      <div className="pt-6 border-t border-slate-50 mt-auto">
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : filteredTours.length > 0 ? (
              filteredTours.map((tour, i) => (
                <motion.div
                  key={tour.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="border-none shadow-lg shadow-slate-200/50 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                    <div className="relative h-64 overflow-hidden shrink-0">
                      {tour.image ? (
                        <Image
                          src={tour.image}
                          alt={tour.name}
                          fill
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                          <Compass className="w-12 h-12 text-slate-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {tour.duration && (
                        <div className="absolute top-6 left-6">
                          <div className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-blue-600 text-[10px] font-black uppercase tracking-widest shadow-lg">
                            <Clock size={12} className="inline mr-1" />
                            {tour.duration}
                          </div>
                        </div>
                      )}

                      <div className="absolute top-6 right-6">
                        <div className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-slate-900 text-xs font-black flex items-center gap-1.5 shadow-lg">
                          <Star size={14} className="fill-amber-400 text-amber-400" />
                          {tour.rating || 4.5}
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-8 flex-1 flex flex-col space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <MapPin size={12} className="text-blue-600" />
                          {tour.location || 'Nepal'}
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{tour.name}</h3>
                        {tour.description && (
                          <p className="text-slate-600 font-medium text-sm">{tour.description}</p>
                        )}
                      </div>

                      {tour.highlights && tour.highlights.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Highlights</p>
                          <div className="flex flex-wrap gap-2">
                            {tour.highlights.slice(0, 3).map((highlight: string, index: number) => (
                              <div key={index} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold">
                                <CheckCircle size={12} />
                                {highlight}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Price</p>
                          <p className="text-xl font-black text-blue-600">
                            {tour.price ? (typeof tour.price === 'number' ? `₨${tour.price.toLocaleString()}` : `₨${tour.price}`) : 'Contact us'}
                          </p>
                        </div>
                        <Link href="/booking" className="no-underline">
                          <Button size="sm" className="rounded-xl px-6 py-3 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-600/10">
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              // Empty state when no data available
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center space-y-6"
              >
                <div className="w-24 h-24 rounded-[2rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <Compass size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {searchQuery ? 'No tours found' : 'No tours available'}
                  </h3>
                  <p className="text-slate-500 font-medium">
                    {searchQuery 
                      ? 'Try searching for a different name or location.' 
                      : 'Check back soon for amazing local tours in Nepal!'}
                  </p>
                </div>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery('')}
                    className="rounded-xl font-black text-xs uppercase tracking-widest"
                  >
                    Show All Tours
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
