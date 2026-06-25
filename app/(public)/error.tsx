"use client"

import { useEffect } from "react"

type ErrorProps = {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to the console for debugging
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-lg w-full text-center bg-white rounded-2xl p-10 shadow-lg">
        <h1 className="text-3xl font-black mb-4 text-slate-900">Something went wrong</h1>
        <p className="mb-8 text-slate-600">An unexpected error occurred. Please try again.</p>
        <button
          onClick={() => reset()}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
