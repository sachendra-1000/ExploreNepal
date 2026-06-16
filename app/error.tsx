"use client"

import { useEffect } from "react"

type ErrorProps = {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to the console for debugging
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-2xl font-semibold mb-4">Something went wrong</h1>
        <p className="mb-6 text-muted">An unexpected error occurred.</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    </div>
  )
}
