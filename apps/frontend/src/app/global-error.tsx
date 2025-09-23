'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ஏதோ தவறு நடந்தது • Something went wrong!
            </h2>
            <p className="text-gray-600 mb-6">
              தொழில்நுட்ப பிரச்சனை ஏற்பட்டுள்ளது • A technical error has occurred.
            </p>
            <button
              onClick={() => reset()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              மீண்டும் முயற்சிக்க • Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}