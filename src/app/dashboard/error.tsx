'use client'
 
import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-sm">
        <AlertCircle className="w-10 h-10" />
      </div>
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Something went wrong!</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          We had trouble loading your dashboard data. This might be a temporary issue.
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm"
      >
        Try again
      </button>
    </div>
  )
}
