import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const ChatWidget = dynamic(() => import('@/components/ChatWidget'), {
  ssr: false,
  loading: () => null,
})

export const metadata: Metadata = {
  title: 'Explore Nepal - Discover the Himalayan Paradise',
  description: 'Experience the beauty of Nepal - trekking, culture, wildlife, and adventure tourism',
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        {children}
      </main>
      <ChatWidget />
      <Footer />
    </>
  )
}
