// Create apps/frontend/src/app/error.tsx
// This handles runtime errors

'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">⚠️ பிழை</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            ஏதோ தவறு நடந்துள்ளது
          </h2>
          <p className="text-lg text-gray-600">
            Something went wrong
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-500">
            தொழில்நுட்ப பிரச்சனை ஏற்பட்டுள்ளது. மீண்டும் முயற்சி செய்யவும்
          </p>
          <p className="text-gray-500 text-sm">
            A technical issue occurred. Please try again
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <button
            onClick={reset}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors mr-4"
          >
            🔄 மீண்டும் முயற்சி (Try Again)
          </button>
          
          <a
            href="/"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            🏠 முகப்பு (Home)
          </a>
          
          <div className="mt-4">
            <a
              href="tel:1800-NANJIL"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              📞 உதவிக்கு அழைக்கவும் (Call for Help)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}