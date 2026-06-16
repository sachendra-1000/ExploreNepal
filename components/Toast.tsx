'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

interface ToastProps {
  show: boolean
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  onClose?: () => void
}

export default function Toast({ show, type, message, onClose }: ToastProps) {
  useEffect(() => {
    if (show && onClose) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  }

  const bgColors = {
    success: 'bg-green-50 border-green-100',
    error: 'bg-red-50 border-red-100',
    info: 'bg-blue-50 border-blue-100',
    warning: 'bg-yellow-50 border-yellow-100',
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl min-w-[320px] max-w-[90%] ${bgColors[type]}`}
        >
          <div className="flex-shrink-0">
            {icons[type]}
          </div>
          <p className="flex-1 text-sm font-bold text-slate-800">{message}</p>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
