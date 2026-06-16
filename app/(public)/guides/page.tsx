'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { UserCheck, Star, Languages, Briefcase, Search, Compass, ChevronRight, Award } from 'lucide-react'
import { subscribeToGuides } from '@/lib/firestore'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

export default function Guides() {
  const [guides, setGuides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const unsubscribe = subscribeToGuides((data: any[]) => {
      setGuides(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const filteredGuides = guides.filter(guide => 
    guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (guide.specialty || guide.specialization || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Finding Expert Guides...</p>
      </div>
    </div>
  )

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/image/Annapurna Base Camp.jpg" alt="Guides in Nepal" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />
        </div>
        <div className="container-custom relative z-10 text-center space-y-4 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <UserCheck size={14} />
            <span>Local Experts</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          >
            Professional <span className="text-blue-500">Guides</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-lg font-medium max-w-2xl mx-auto"
          >
            Explore Nepal through the eyes of our certified local guides who bring stories and traditions to life.
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
              placeholder="Search by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/20 transition-all font-bold text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </motion.div>

        {/* Results Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredGuides.map((guide, i) => (
              <motion.div
                key={guide.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-none shadow-lg shadow-slate-200/50 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                  <div className="relative h-72 overflow-hidden shrink-0">
                    <img src={guide.image} alt={guide.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    
                    <div className="absolute top-6 right-6">
                      <div className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-slate-900 text-xs font-black flex items-center gap-1.5 shadow-lg">
                        <Star size={14} className="fill-amber-400 text-amber-400 border-none" />
                        {guide.rating}
                      </div>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="px-3 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                          Certified Guide
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight">{guide.name}</h3>
                    </div>
                  </div>

                  <CardContent className="p-8 flex-1 flex flex-col space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                        <Award size={14} />
                        {guide.specialty || guide.specialization || 'General Expert'}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <Briefcase size={14} className="text-slate-400" />
                            {guide.experience} Years
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Languages</p>
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <Languages size={14} className="text-slate-400" />
                            {(guide.languages || []).length || 1} Native
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Rate / Day</p>
                        <p className="text-xl font-black text-blue-600">₨{guide.price}</p>
                      </div>
                      <Link href={`/guides/${guide.id}`}>
                        <Button size="sm" className="rounded-xl px-6 py-3 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-600/10">
                          Hire Guide
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredGuides.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-20 text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
              <Compass size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">No guides found</h3>
              <p className="text-slate-500 font-medium">Try searching for a different name or specialty.</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')}
              className="rounded-xl font-black text-xs uppercase tracking-widest"
            >
              Show All Guides
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
