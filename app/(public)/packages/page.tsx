'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Compass, Clock, Tag, Star, MapPin } from 'lucide-react'
import { subscribeToPackages } from '@/lib/firestore'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

// Skeleton Loader Component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl ${className}`} />
)

export default function Packages() {
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToPackages((data: any[]) => {
      setPackages(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="container-custom">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6">
            <Compass size={14} />
            <span>Explore Nepal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Tour Packages in Nepal</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Skeleton loaders while fetching data
            [...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 rounded-[1.5rem]" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))
          ) : packages.length > 0 ? (
            packages.map((pkg) => (
              <Card key={pkg.id} className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 group">
                <div className="relative h-48 overflow-hidden">
                  {pkg.image ? (
                    <Image
                      src={pkg.image}
                      alt={pkg.title || pkg.name}
                      fill
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <Compass className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight line-clamp-1">{pkg.title || pkg.name}</h3>
                    <div className="flex items-center text-amber-400">
                      <Star size={18} className="fill-current" />
                      <span className="ml-1 text-slate-700 font-black">{pkg.rating || 4.5}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-slate-500 font-medium">
                    {pkg.duration && (
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2" />
                        <span>{pkg.duration}</span>
                      </div>
                    )}
                    {pkg.category && (
                      <div className="flex items-center">
                        <Tag size={16} className="mr-2" />
                        <span>{pkg.category}</span>
                      </div>
                    )}
                    {pkg.location && (
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2" />
                        <span>{pkg.location}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-slate-600 font-medium line-clamp-3">{pkg.description}</p>

                  <div className="pt-6 flex items-center justify-between border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-black text-blue-600">
                        {pkg.price ? (typeof pkg.price === 'number' ? `₨${pkg.price.toLocaleString()}` : `₨${pkg.price}`) : 'Contact us'}
                      </span>
                    </div>
                    <Link 
                      href={`/booking?type=package&id=${pkg.id}&name=${encodeURIComponent(pkg.title || pkg.name)}&price=${pkg.price || 0}`} 
                      className="no-underline"
                    >
                      <Button size="sm" className="rounded-xl font-black uppercase tracking-widest">Book Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Empty state when no data available
            <div className="col-span-full py-24 text-center">
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto">
                  <Compass className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">No tour packages available</h3>
                <p className="text-slate-500 font-medium">Check back soon for amazing tour packages in Nepal!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
