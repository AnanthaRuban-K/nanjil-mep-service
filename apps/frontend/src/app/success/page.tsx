'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Phone, MessageCircle, Home, Copy } from 'lucide-react'

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [bookingId, setBookingId] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const id = searchParams.get('bookingId')
    if (id) {
      setBookingId(id)
    } else {
      // If no booking ID, redirect to home
      setTimeout(() => router.push('/'), 3000)
    }
  }, [searchParams, router])

  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(bookingId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsApp = () => {
    const message = `Hi! I just booked a service. My booking ID is: ${bookingId}`
    const whatsappUrl = `https://wa.me/1800NANJIL?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleCall = () => {
    window.location.href = 'tel:1800-NANJIL'
  }

  const handleHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            பதிவு முடிந்தது!
          </h1>
          <p className="text-xl text-gray-600">Booking Confirmed!</p>
        </div>

        {/* Booking ID */}
        {bookingId && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
            <p className="text-blue-600 font-medium mb-2">
              உங்கள் பதிவு எண் (Your Booking ID)
            </p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl font-bold text-blue-800">{bookingId}</span>
              <button
                onClick={handleCopyBookingId}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                title="Copy booking ID"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            {copied && (
              <p className="text-green-600 text-sm mt-1">Copied!</p>
            )}
          </div>
        )}

        {/* Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
          <p className="text-yellow-800 font-medium mb-2">
            📞 எங்கள் ஊழியர்கள் 30 நிமிடத்தில் அழைப்பார்கள்
          </p>
          <p className="text-yellow-700 text-sm">
            Our team will call you within 30 minutes
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-6">
          <button
            onClick={handleWhatsApp}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>💬 WhatsApp மூலம் பேசு</span>
          </button>

          <button
            onClick={handleCall}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <Phone className="w-5 h-5" />
            <span>📞 உடனே அழை (Call Now)</span>
          </button>

          <button
            onClick={handleHome}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>🏠 முகப்பு (Home)</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            நன்றி! நாஞ்சில் MEP சேவை தேர்வு செய்ததற்கு
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Thank you for choosing Nanjil MEP Service
          </p>
        </div>
      </div>
    </div>
  )
}