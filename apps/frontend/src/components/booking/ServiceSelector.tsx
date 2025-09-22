'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Wrench, AlertTriangle } from 'lucide-react'
import { useServices } from '@/hooks'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
export function ServiceSelector() {
  const router = useRouter()
  const { data: services, isLoading, error, refetch } = useServices()

  // Update your ServiceSelector component's handleServiceSelect function

const handleServiceSelect = (serviceType: 'electrical' | 'plumbing', isEmergency = false) => {
  console.log('Service selected:', { serviceType, isEmergency })
  
  try {
    // Clear any existing booking data to start fresh
    sessionStorage.removeItem('problemDescription')
    sessionStorage.removeItem('contactInfo')
    sessionStorage.removeItem('scheduledTime')
    
    // Store new selection
    sessionStorage.setItem('selectedService', serviceType)
    sessionStorage.setItem('isEmergency', isEmergency.toString())
    
    // Verify the data was stored
    const storedService = sessionStorage.getItem('selectedService')
    const storedEmergency = sessionStorage.getItem('isEmergency')
    
    console.log('Data stored in sessionStorage:', { 
      storedService, 
      storedEmergency,
      success: storedService === serviceType 
    })
    
    if (storedService !== serviceType) {
      throw new Error('Failed to store service selection')
    }
    
    // Navigate to problem description with a small delay
    setTimeout(() => {
      router.push('/describe')
    }, 100)
    
  } catch (error) {
    console.error('Error storing service selection:', error)
    alert('Error saving service selection. Please try again.')
  }
}
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ←
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">எந்த சேவை வேண்டும்?</h1>
              <p className="text-sm text-gray-600">Which Service Do You Need?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Selection */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Electrical Service */}
          <button
            onClick={() => handleServiceSelect('electrical')}
            className="bg-white border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 rounded-3xl p-8 transition-all duration-300 hover:shadow-lg text-left group"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="bg-yellow-100 group-hover:bg-yellow-200 w-20 h-20 rounded-full flex items-center justify-center transition-colors">
                <Zap className="w-10 h-10 text-yellow-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              மின்சாரம்
            </h2>
            <p className="text-center text-gray-600 mb-4 font-medium">
              ELECTRICAL
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>விசிறி ஓடவில்லை • Fan Not Working</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>விளக்கு எரியவில்லை • Light Not Working</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>ஸ்விட்ச் பழுது • Switch Problem</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>வயரிங் பிரச்சனை • Wiring Issue</span>
              </div>
            </div>
          </button>

          {/* Plumbing Service */}
          <button
            onClick={() => handleServiceSelect('plumbing')}
            className="bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-3xl p-8 transition-all duration-300 hover:shadow-lg text-left group"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-100 group-hover:bg-blue-200 w-20 h-20 rounded-full flex items-center justify-center transition-colors">
                <Wrench className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              குழாய்
            </h2>
            <p className="text-center text-gray-600 mb-4 font-medium">
              PLUMBING
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>கழிவறை பிரச்சனை • Toilet Problem</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>குழாய் லீக்கேஜ் • Pipe Leakage</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>டேப் சரியாகவில்லை • Tap Not Working</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>வாட்டர் பிரச்சனை • Water Issue</span>
              </div>
            </div>
          </button>
        </div>

        {/* Emergency Service */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-400 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <AlertTriangle className="w-12 h-12 animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold text-center mb-2">
                🚨 அவசரம்
              </h2>
              <p className="text-center text-red-100 mb-4 font-medium text-lg">
                EMERGENCY
              </p>
              <p className="text-center text-red-100 mb-6">
                24 மணி நேரம் • உடனடி சேவை<br />
                24 Hours • Immediate Service
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handleServiceSelect('electrical', true)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm border border-white border-opacity-30 rounded-2xl p-4 transition-all duration-300"
                >
                  <Zap className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm font-semibold">பவர் கட் Emergency</div>
                  <div className="text-xs opacity-90">Power Cut</div>
                </button>
                <button
                  onClick={() => handleServiceSelect('plumbing', true)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm border border-white border-opacity-30 rounded-2xl p-4 transition-all duration-300"
                >
                  <Wrench className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm font-semibold">வாட்டர் லீக்கேஜ்</div>
                  <div className="text-xs opacity-90">Water Leakage</div>
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-red-100 text-sm">
                  அவசர கட்டணம் கூடுதல் • Emergency charges apply
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call Direct Option */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              அல்லது நேரடியாக அழைக்கவும்
            </h3>
            <p className="text-gray-600 mb-4">Or Call Directly</p>
            <button
              onClick={() => window.location.href = 'tel:1800-NANJIL'}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl inline-flex items-center space-x-2 transition-colors"
            >
              <span>📞 1800-NANJIL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}