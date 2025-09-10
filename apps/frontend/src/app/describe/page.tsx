// apps/frontend/src/app/describe/page.tsx - FIXED VERSION
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Zap, Wrench } from 'lucide-react'

export default function DescribePage() {
  const router = useRouter()
  const [selectedService, setSelectedService] = useState<string>('')
  const [isEmergency, setIsEmergency] = useState(false)
  const [description, setDescription] = useState('')

  useEffect(() => {
    // Get service selection from previous page
    const service = sessionStorage.getItem('selectedService')
    const emergency = sessionStorage.getItem('isEmergency') === 'true'
    
    if (!service) {
      router.push('/services')
      return
    }
    
    setSelectedService(service)
    setIsEmergency(emergency)
  }, [router])

  const handleBack = () => {
    router.back()
  }

  const handleNext = () => {
    if (description.trim().length < 10) {
      alert('பிரச்சனையை விரிவாக விவரிக்கவும் / Please describe the problem in detail')
      return
    }
    
    // Store description and move to contact info
    sessionStorage.setItem('problemDescription', description.trim())
    router.push('/contact')
  }

  const handleQuickSelect = (quickDescription: string) => {
    setDescription(quickDescription)
  }

  // Quick issue templates based on service type
  const getQuickIssues = () => {
    if (selectedService === 'electrical') {
      return [
        'விசிறி ஓடவில்லை - Fan not working at all',
        'விளக்கு எரியவில்லை - Light bulb not turning on', 
        'சுவிட்ச் வேலை செய்யவில்லை - Switch not responding',
        'பவர் துண்டிக்கப்பட்டது - Power completely cut off',
        'ஷார்ட் சர்க்கிட் பிரச்சனை - Short circuit problem',
        'வயரிங் பழுதாகிவிட்டது - Wiring seems damaged'
      ]
    } else if (selectedService === 'plumbing') {
      return [
        'கழிவறை புளஷ் ஆகவில்லை - Toilet not flushing',
        'குழாயில் தண்ணீர் கசிவு - Pipe water leaking',
        'டேப்பில் தண்ணீர் வரவில்லை - No water from tap',
        'வாட்டர் ஹீட்டர் வேலை செய்யவில்லை - Water heater not working',
        'சிங்க் அடைத்து போயிருக்கு - Sink is blocked',
        'பாத்ரூமில் தண்ணீர் தேங்குது - Water pooling in bathroom'
      ]
    }
    return []
  }

  const serviceIcon = selectedService === 'electrical' ? <Zap className="w-6 h-6" /> : <Wrench className="w-6 h-6" />
  const serviceNameTa = selectedService === 'electrical' ? 'மின்சாரம்' : 'குழாய்'
  const serviceNameEn = selectedService === 'electrical' ? 'Electrical' : 'Plumbing'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                selectedService === 'electrical' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}>
                {serviceIcon}
                <span className="text-white">{serviceIcon}</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">{serviceNameTa} சேவை</h1>
                <p className="text-sm text-gray-600">{serviceNameEn} Service</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            பிரச்சனையை விவரிக்கவும்
          </h2>
          <p className="text-gray-600 mb-6">Describe Your Problem</p>

          {/* Quick Issues */}
          {getQuickIssues().length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                பொதுவான பிரச்சனைகள் • Common Issues
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getQuickIssues().map((issue, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSelect(issue)}
                    className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-sm text-gray-800">{issue}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              விரிவான விவரம் • Detailed Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="உங்கள் பிரச்சனையை விரிவாக எழுதுங்கள் / Describe your problem in detail..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                குறைந்தது 10 எழுத்துகள் • Minimum 10 characters
              </span>
              <span className="text-sm text-gray-500">
                {description.length}/500
              </span>
            </div>
          </div>

          {/* Emergency Badge */}
          {isEmergency && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-800 font-semibold">
                  அவசர சேவை • Emergency Service
                </span>
              </div>
              <p className="text-red-600 text-sm mt-1">
                கூடுதல் கட்டணம் பொருந்தும் • Additional charges apply
              </p>
            </div>
          )}

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={description.trim().length < 10}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            அடுத்த படி • Next Step
          </button>
        </div>
      </div>
    </div>
  )
}