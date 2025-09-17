// apps/frontend/src/app/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          பக்கம் கிடைக்கவில்லை
        </h2>
        <p className="text-gray-600 mb-6">Page Not Found</p>
        <a
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          🏠 முகப்பு பக்கம் (Home)
        </a>
      </div>
    </div>
  )
}