'use client'

import { useState, useEffect } from 'react'
import { Bus, MapPin, Clock, Star, Search, ShieldCheck, ChevronRight } from 'lucide-react'
import { subscribeToBusRoutes } from '@/lib/firestore'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

export default function BusServices() {
  const [routes, setRoutes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const unsubscribe = subscribeToBusRoutes((data: any[]) => {
      setRoutes(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const filteredRoutes = routes.filter(route => 
    route.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.to.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Syncing Bus Routes...</p>
      </div>
    </div>
  )

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/image/Kathmandu Valley.jpg" alt="Bus Services in Nepal" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />
        </div>
        <div className="container-custom relative z-10 text-center space-y-4 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <Bus size={14} />
            <span>Reliable Transport</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          >
            Intercity <span className="text-blue-500">Bus Services</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-lg font-medium max-w-2xl mx-auto"
          >
            Travel comfortably across major cities in Nepal with our premium bus partners and guaranteed departures.
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
              placeholder="Where do you want to go? (e.g. Pokhara, Kathmandu)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </motion.div>

        {/* Results List */}
        <div className="mt-16 max-w-5xl mx-auto space-y-6">
          <AnimatePresence mode='popLayout'>
            {filteredRoutes.map((route, i) => (
              <motion.div
                key={route.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-none shadow-lg shadow-slate-200/50 rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:scale-[1.01] transition-all duration-500">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      <div className="lg:w-1/4 bg-blue-600 p-8 flex flex-col items-center justify-center text-white space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                          <Bus size={32} />
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Vehicle Type</p>
                          <p className="text-sm font-black">{route.type}</p>
                        </div>
                      </div>

                      <div className="flex-1 p-8 lg:p-10 flex flex-col md:flex-row justify-between gap-10">
                        <div className="flex-1 space-y-8">
                          <div className="flex items-center justify-between md:justify-start md:gap-12 relative">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">From</p>
                              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{route.from}</h3>
                            </div>
                            
                            <div className="flex-1 md:flex-none flex items-center justify-center px-4">
                              <div className="h-px w-full md:w-20 bg-slate-100 relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm">
                                  <ChevronRight size={16} />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1 text-right md:text-left">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">To</p>
                              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{route.to}</h3>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-50">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                              <Clock size={16} className="text-blue-600" />
                              {route.duration}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                              <Star size={16} className="text-amber-400 fill-amber-400 border-none" />
                              {route.rating} Rating
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                              <ShieldCheck size={16} />
                              Instant Confirmation
                            </div>
                          </div>
                        </div>

                        <div className="md:w-48 flex flex-col items-center md:items-end justify-center gap-6 md:border-l md:border-slate-50 md:pl-10">
                          <div className="text-center md:text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Starting At</p>
                            <p className="text-3xl font-black text-blue-600 tracking-tighter">₨{route.price}</p>
                          </div>
                          <Button className="w-full rounded-xl py-4 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/10">
                            Book Ticket
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredRoutes.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-20 text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
              <Bus size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">No routes found</h3>
              <p className="text-slate-500 font-medium">We currently don't have active buses for this route.</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')}
              className="rounded-xl font-black text-xs uppercase tracking-widest"
            >
              Show All Routes
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
