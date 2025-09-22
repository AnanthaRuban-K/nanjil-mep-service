// app/services/page.tsx
'use client'
import { useAuth } from '@/hooks/useAuth'
import { RoleGuard } from '@/components/RoleGuard'
import CustomerLayout from '@/components/layouts/CustomerLayout'
import { LoginButton } from '@/components/LoginButton'
import { ServiceSelector } from '@/components/booking/ServiceSelector'

export default function ServicesPage() {
  const { isSignedIn } = useAuth()

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          எங்கள் சேவைகள் • Our Services
        </h1>
        
        {/* Show services to everyone, but booking requires auth */}
        <ServiceSelector />
        
        {!isSignedIn && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8 text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              சேவை பதிவு செய்ய உள்நுழையுங்கள்
            </h3>
            <p className="text-blue-600 mb-4">
              Login required to book services
            </p>
            <LoginButton />
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}

// Service booking with protection
function ServiceGrid() {
  const { isSignedIn } = useAuth()
  
  const handleServiceClick = (serviceType: string) => {
    if (!isSignedIn) {
      // Show login prompt
      const confirm = window.confirm(
        'சேவை பதிவு செய்ய உள்நுழைய வேண்டும். உள்நுழைய விரும்புகிறீர்களா?\n' +
        'Login required to book service. Do you want to login?'
      )
      if (confirm) {
        window.location.href = '/sign-in'
      }
      return
    }
    
    // User is logged in, proceed with booking
    sessionStorage.setItem('selectedService', serviceType)
    window.location.href = '/describe'
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Electrical Service */}
      <div className="bg-white rounded-xl p-6 shadow-lg border">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-yellow-500 p-3 rounded-lg">
            <span className="text-white text-2xl">⚡</span>
          </div>
          <div>
            <h3 className="text-xl font-bold">மின்சார சேவை</h3>
            <p className="text-gray-600">Electrical Service</p>
          </div>
        </div>
        <ul className="space-y-2 mb-6">
          <li>• விசிறி மற்றும் விளக்கு பழுது</li>
          <li>• வயரிங் பிரச்சனைகள்</li>
          <li>• ஸ்விட்ச் மற்றும் சாக்கெட்</li>
        </ul>
        <button
          onClick={() => handleServiceClick('electrical')}
          className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
        >
          இப்போது பதிவு செய்யுங்கள் • Book Now
        </button>
      </div>

      {/* Plumbing Service */}
      <div className="bg-white rounded-xl p-6 shadow-lg border">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-blue-500 p-3 rounded-lg">
            <span className="text-white text-2xl">🔧</span>
          </div>
          <div>
            <h3 className="text-xl font-bold">குழாய் சேவை</h3>
            <p className="text-gray-600">Plumbing Service</p>
          </div>
        </div>
        <ul className="space-y-2 mb-6">
          <li>• குழாய் கசிவு பழுது</li>
          <li>• கழிவறை பழுது</li>
          <li>• வாட்டர் ஹீட்டர் பிரச்சனை</li>
        </ul>
        <button
          onClick={() => handleServiceClick('plumbing')}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          இப்போது பதிவு செய்யுங்கள் • Book Now
        </button>
      </div>
    </div>
  )
}