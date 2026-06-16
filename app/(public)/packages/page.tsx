'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Compass, Clock, Tag, Star } from 'lucide-react'
import { subscribeToPackages } from '@/lib/firestore'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

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

  if (loading) return <div className="text-center py-20">Loading Packages...</div>

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Tour Packages in Nepal</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Card key={pkg.id}>
              <div className="h-48 overflow-hidden">
                <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
              </div>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold line-clamp-1">{pkg.title}</h3>
                  <div className="flex items-center text-orange-400">
                    <Star size={16} className="fill-current" />
                    <span className="ml-1 text-gray-700 font-medium">{pkg.rating}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag size={16} className="mr-1" />
                    <span>{pkg.category}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2">{pkg.description}</p>

                <div className="pt-4 flex items-center justify-between border-t">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">₨{pkg.price}</span>
                  </div>
                  <Link href={`/packages/${pkg.id}`}>
                    <Button size="sm">Book Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
