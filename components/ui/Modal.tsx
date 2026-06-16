'use client'

import { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  maxWidth?: string
}

export default function Modal({ isOpen, onClose, title, children, size = 'md', maxWidth }: ModalProps) {
  const modalSizeClass = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  }

  const widthClass = maxWidth ?? modalSizeClass[size]
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg shadow-xl w-full ${widthClass} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
