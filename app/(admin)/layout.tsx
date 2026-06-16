import type { Metadata } from 'next'
import '@/styles/admin.css'

export const metadata: Metadata = {
  title: 'Admin Panel - Explore Nepal',
  description: 'Management suite for Explore Nepal',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  )
}
