'use client'

interface StatusBadgeProps {
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'active' | 'inactive' | 'verified' | string
  children?: React.ReactNode
}

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  verified: 'bg-blue-100 text-blue-800',
}

export default function StatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
      {children || status}
    </span>
  )
}
