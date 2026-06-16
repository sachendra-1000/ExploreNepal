import type { Metadata } from 'next'
import { AuthProvider } from '@/context/AuthContext'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Explore Nepal',
  description: 'Discover tours, hotels, guides, and travel experiences across Nepal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
