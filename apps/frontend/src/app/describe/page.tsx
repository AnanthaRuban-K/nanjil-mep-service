// apps/frontend/src/app/describe/page.tsx - SIMPLIFIED PROBLEM DESCRIPTION
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
        'கழிவறை ப்ளஷ் ஆகவில்லை - Toilet not flushing',
        'குழாயில் தண்ணீர் கசிவு - Pipe water leaking',
        'டேப்பில் தண்ணீர் வரவில்லை - No water from tap',
        'வாட்டர் ஹீட்டர் வேலை செய்யவில்லை - Water heater not working',
        'சின்க் அடைத்து போயிருக்கு - Sink is blocked',
        'பாத்ரூமில் தண்ணீர் தேங்குது - Water pooling in bathroom'
      ]
    }
    return []
  }

  const serviceIcon = selectedService === 'electrical' ? Zap : Wrench
  const serviceColor = selectedService === 'electrical' ? 'yellow' : 'blue'
  const serviceName = selectedService === 'electrical' ? 'மின்சாரம் (Electrical)' : 'குழாய் (Plumbing)'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">பிரச்சனை என்ன?</h1>
              <p className="text-sm text-gray-600">What's the Problem?</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Service Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center space-x-4">
            <div className={`bg-${serviceColor}-100 p-3 rounded-full`}>
              {React.createElement(serviceIcon, { 
                className: `w-6 h-6 text-${serviceColor}-600` 
              })}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">
                தேர்ந்தெடுத்த சேவை: {serviceName}
              </h2>
              {isEmergency && (
                <span className="inline-block bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full mt-1">
                  🚨 அவசரம் (Emergency)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Problem Description */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            பிரச்சனையை விவரிக்கவும்
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            Describe the problem in detail (minimum 10 characters)
          </p>
          
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="உங்கள் பிரச்சனையை விரிவாக எழுதுங்கள்... 
Write your problem in detail..."
            className="w-full h-32 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
            style={{ fontFamily: 'Noto Sans Tamil, sans-serif' }}
          />
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {description.length} characters (minimum 10 required)
            </span>
            <span className={`text-sm ${description.length >= 10 ? 'text-green-600' : 'text-red-500'}`}>
              {description.length >= 10 ? '✓ Ready' : '✗ Too short'}
            </span>
          </div>
        </div>

        {/* Quick Issue Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            பொதுவான பிரச்சனைகள்
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            Common Issues - Click to select quickly
          </p>
          
          <div className="grid gap-3">
            {getQuickIssues().map((issue, index) => (
              <button
                key={index}
                onClick={() => handleQuickSelect(issue)}
                className={`text-left p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                  description === issue
                    ? `border-${serviceColor}-500 bg-${serviceColor}-50`
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    description === issue ? `bg-${serviceColor}-500` : 'bg-gray-400'
                  }`}></div>
                  <span className="text-gray-800 font-medium">{issue}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <div className="text-center">
          <button
            onClick={handleNext}
            disabled={description.trim().length < 10}
            className={`font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 min-w-[200px] ${
              description.trim().length >= 10
                ? 'bg-green-500 hover:bg-green-600 text-white hover:shadow-xl transform hover:-translate-y-1'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            அடுத்தது: உங்கள் விபரங்கள் →
            <div className="text-sm font-normal">Next: Your Details</div>
          </button>
        </div>
      </div>
    </div>
  )
}

// REMOVED COMPLEX FEATURES:
// - Voice input/recording
// - Photo upload functionality  
// - Auto-translation between Tamil/English
// - AI-powered problem categorization
// - Location-specific issue templates
// - Integration with inventory to suggest parts needed