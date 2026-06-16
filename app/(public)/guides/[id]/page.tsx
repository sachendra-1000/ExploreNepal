'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Star, 
  MapPinned, 
  Phone, 
  Mail,
  ArrowLeft,
  ShieldCheck,
  Heart,
  Navigation
} from 'lucide-react'
import { subscribeToGuides } from '@/lib/firestore'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function GuideDetail() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const guideId = Array.isArray(params?.id) ? params.id[0] : params?.id
  
  const [guide, setGuide] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!guideId) {
      setLoading(false)
      return
    }

    const unsubscribe = subscribeToGuides((guides: any[]) => {
      const found = guides.find(g => g.id === guideId)
      setGuide(found)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [guideId])

  if (loading) return <div className="text-center py-20">Loading...</div>
  if (!guide) return <div className="text-center py-20">Guide not found</div>

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container-custom py-8">
        <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-blue-600 mb-8">
          <ArrowLeft size={20} className="mr-2" /> Back to Guides
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <img src={guide.image} alt={guide.name} className="w-full rounded-lg shadow-lg aspect-square object-cover" />
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{guide.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-orange-400">
                <Star size={20} className="fill-current" />
                <span className="ml-1 text-gray-900 font-bold">{guide.rating}</span>
              </div>
              <div className="flex items-center text-blue-600 font-medium">
                {guide.specialty || guide.specialization}
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">{guide.description || guide.bio}</p>

            <div className="grid grid-cols-2 gap-4 py-6 border-y">
              <div>
                <span className="text-gray-500 text-sm">Experience</span>
                <p className="font-bold">{guide.experience} Years</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Languages</span>
                <p className="font-bold">{(guide.languages || []).join(', ')}</p>
              </div>
            </div>

            <div className="pt-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-blue-600">₨{guide.price}</span>
                <span className="text-gray-500">/day</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button size="lg" className="flex-1">Hire This Guide</Button>
              <Button variant="outline" size="lg">
                <Heart size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
