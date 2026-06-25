import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-lg w-full text-center bg-white rounded-2xl p-10 shadow-lg">
        <h1 className="text-5xl font-black mb-4 text-blue-600">404</h1>
        <h2 className="text-2xl font-semibold mb-2 text-slate-900">Page not found</h2>
        <p className="mb-8 text-slate-600">This admin page doesn't exist or has been moved.</p>
        <Link href="/admin" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors inline-block">
          Back to Admin Dashboard
        </Link>
      </div>
    </div>
  )
}
