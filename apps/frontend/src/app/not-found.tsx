// Create apps/frontend/src/app/not-found.tsx
// This file MUST exist and MUST NOT import Html

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            பக்கம் கிடைக்கவில்லை
          </h2>
          <p className="text-lg text-gray-600">
            Page Not Found
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-500">
            நீங்கள் தேடும் பக்கம் கிடைக்கவில்லை அல்லது நகர்த்தப்பட்டுள்ளது
          </p>
          <p className="text-gray-500 text-sm">
            The page you're looking for doesn't exist or has been moved
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            🏠 முகப்பு பக்கம் (Home)
          </a>
          
          <div className="mt-4">
            <a
              href="/services"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mr-4"
            >
              சேவைகள் (Services)
            </a>
            <a
              href="tel:1800-NANJIL"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              📞 அழைக்கவும் (Call)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}