'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Wrench, Phone, MapPin, Star, Clock, Shield } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  const handleBookService = () => {
    router.push('/services')
  }

  const handleEmergencyCall = () => {
    window.location.href = 'tel:1800-NANJIL'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">நாஞ்சில் MEP சேவை</h1>
                <p className="text-sm text-gray-600">Nanjil MEP Service</p>
              </div>
            </div>
            <button
              onClick={handleEmergencyCall}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium animate-pulse"
            >
              <Phone className="w-4 h-4 inline mr-2" />
              அவசரம்
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            மின்சாரம் • குழாய் • அவசர சேவை
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Electrical • Plumbing • Emergency Service
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            வீட்டு மின்சாரம் மற்றும் குழாய் பிரச்சனைகளுக்கு நம்பகமான சேவை
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Electrical Service */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-yellow-100">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Zap className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2 text-gray-800">
              மின்சாரம்
            </h3>
            <p className="text-center text-gray-600 text-sm mb-4">Electrical</p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• விசிறி சரி செய்தல் (Fan Repair)</li>
              <li>• விளக்கு பொருத்துதல் (Light Fitting)</li>
              <li>• சுவிட்ச் மாற்றுதல் (Switch Replacement)</li>
              <li>• வயரிங் சரிசெய்தல் (Wiring Fix)</li>
            </ul>
          </div>

          {/* Plumbing Service */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Wrench className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2 text-gray-800">
              குழாய்
            </h3>
            <p className="text-center text-gray-600 text-sm mb-4">Plumbing</p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• குழாய் லீக்கேஜ் (Pipe Leakage)</li>
              <li>• கழிவறை சரிசெய்தல் (Toilet Repair)</li>
              <li>• டேப் மாற்றுதல் (Tap Replacement)</li>
              <li>• வாட்டர் டேங்க் (Water Tank Service)</li>
            </ul>
          </div>

          {/* Emergency Service */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-red-100">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2 text-gray-800">
              அவசரம்
            </h3>
            <p className="text-center text-gray-600 text-sm mb-4">Emergency</p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• 24 மணி நேரம் (24 Hours)</li>
              <li>• உடனடி சேவை (Immediate)</li>
              <li>• பவர் கட் (Power Cut)</li>
              <li>• வாட்டர் லீக்கேஜ் (Water Leakage)</li>
            </ul>
          </div>
        </div>

        {/* Main Action Button */}
        <div className="text-center mb-12">
          <button
            onClick={handleBookService}
            className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 min-h-[60px]"
          >
            🏠 சேவை பதிவு செய்யுங்கள்
            <div className="text-sm font-normal">Book Service</div>
          </button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800">விரைவான சேவை</h4>
            <p className="text-sm text-gray-600">Quick Service</p>
          </div>
          <div className="text-center">
            <Star className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800">தரமான வேலை</h4>
            <p className="text-sm text-gray-600">Quality Work</p>
          </div>
          <div className="text-center">
            <MapPin className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800">உள்ளூர் சேவை</h4>
            <p className="text-sm text-gray-600">Local Service</p>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-bold text-red-800 mb-2">
            அவசர சேவைக்கு உடனே அழைக்கவும்
          </h3>
          <p className="text-red-600 mb-4">For Emergency Service Call Immediately</p>
          <button
            onClick={handleEmergencyCall}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl inline-flex items-center space-x-2"
          >
            <Phone className="w-5 h-5" />
            <span>1800-NANJIL</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            நாஞ்சில் MEP சேவை - நம்பகமான வீட்டு சேவைகள்
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Nanjil MEP Service - Trusted Home Services
          </p>
        </div>
      </div>
    </div>
  )
}

// REMOVED COMPLEX FEATURES:
// - Voice input
// - Location detection
// - Product catalog links
// - Team showcases
// - Performance metrics
// - Multi-language switcher (kept simple Tamil/English)
// - Complex animations