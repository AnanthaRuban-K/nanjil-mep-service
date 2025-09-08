'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Phone, MapPin, Calendar, Clock } from 'lucide-react'

export default function SummaryPage() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Collect all booking data from sessionStorage
    const service = sessionStorage.getItem('selectedService')
    const isEmergency = sessionStorage.getItem('isEmergency') === 'true'
    const description = sessionStorage.getItem('problemDescription')
    const contactInfo = JSON.parse(sessionStorage.getItem('contactInfo') || '{}')
    const scheduledTime = sessionStorage.getItem('scheduledTime')

    if (!service || !description || !contactInfo.name || !scheduledTime) {
      router.push('/services')
      return
    }

    setBookingData({
      serviceType: service,
      priority: isEmergency ? 'emergency' : 'normal',
      description,
      contactInfo,
      scheduledTime
    })
  }, [router])

  const handleBack = () => {
    router.back()
  }

  const calculateCost = () => {
    const baseCost = bookingData.serviceType === 'electrical' ? 300 : 350
    const emergencyMultiplier = bookingData.priority === 'emergency' ? 1.5 : 1
    const travelCharge = 50
    return Math.round((baseCost * emergencyMultiplier) + travelCharge)
  }

  const handleConfirm = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })

      if (!response.ok) {
        throw new Error('Failed to create booking')
      }

      const result = await response.json()
      
      // Clear session storage
      sessionStorage.clear()
      
      // Redirect to success page with booking ID
      router.push(`/success?bookingId=${result.booking.bookingNumber}`)
      
    } catch (error) {
      console.error('Booking submission error:', error)
      alert('பதிவு செய்வதில் பிழை ஏற்பட்டது / Error creating booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return date.toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
              <h1 className="text-xl font-bold text-gray-800">விபரங்களை சரிபார்</h1>
              <p className="text-sm text-gray-600">Confirm Booking Details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Booking Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            📋 பதிவு விபரங்கள் (Booking Details)
          </h2>

          <div className="space-y-6">
            {/* Service Info */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className={`p-3 rounded-full ${
                bookingData.serviceType === 'electrical' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                <div className={`w-6 h-6 ${
                  bookingData.serviceType === 'electrical' ? 'text-yellow-600' : 'text-blue-600'
                }`}>
                  {bookingData.serviceType === 'electrical' ? '⚡' : '🚰'}
                </div>
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  🔧 சேவை: {bookingData.serviceType === 'electrical' ? 'மின்சாரம் (Electrical)' : 'குழாய் (Plumbing)'}
                </div>
                {bookingData.priority === 'emergency' && (
                  <div className="text-red-600 font-medium">🚨 அவசர சேவை (Emergency Service)</div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-600">பெயர் (Name)</div>
                    <div className="font-semibold">{bookingData.contactInfo?.name}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-600">மொபைல் (Mobile)</div>
                    <div className="font-semibold">{bookingData.contactInfo?.phone}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <div className="text-sm text-gray-600">முகவரி (Address)</div>
                    <div className="font-semibold">{bookingData.contactInfo?.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm text-blue-600">நேரம் (Scheduled Time)</div>
                <div className="font-semibold text-gray-800">
                  {bookingData.scheduledTime && formatDateTime(bookingData.scheduledTime)}
                </div>
              </div>
            </div>

            {/* Problem Description */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-600 mb-2">📝 பிரச்சனை (Problem Description)</div>
              <div className="font-semibold text-gray-800">{bookingData.description}</div>
            </div>

            {/* Cost */}
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-green-600">💰 கட்டணம் (Payment)</div>
                  <div className="text-lg font-bold text-green-800">
                    ₹{calculateCost()}/-
                  </div>
                </div>
                <div className="text-right text-sm text-green-700">
                  <div>சேவை பார்த்த பிறகு கொடுக்கவும்</div>
                  <div>Pay after service completion</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="text-center">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 min-w-[250px] ${
              isSubmitting
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-xl transform hover:-translate-y-1'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                பதிவு செய்கிறோம்...
              </>
            ) : (
              <>
                ✅ உறுதிப்படுத்து (CONFIRM)
                <div className="text-sm font-normal">Confirm Booking</div>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}