'use client'

import { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`bg-white border rounded-lg shadow-sm overflow-hidden ${className}`}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: CardProps) {
  return (
    <div className={`px-6 py-4 border-b ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }: CardProps) {
  return (
    <h3 className={`text-xl font-semibold ${className}`}>
      {children}
    </h3>
  )
}

export function CardContent({ children, className = '' }: CardProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }: CardProps) {
  return (
    <div className={`px-6 py-4 border-t bg-gray-50 ${className}`}>
      {children}
    </div>
  )
}
