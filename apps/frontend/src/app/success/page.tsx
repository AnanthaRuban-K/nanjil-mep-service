"use client"
import React, { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, Phone, MessageCircle, Home, Copy, Calendar, Clock } from "lucide-react"

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [bookingId, setBookingId] = useState<string>("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const id = searchParams.get("bookingId")
    if (id) {
      setBookingId(id)
    } else {
      // If no booking ID, redirect to home after 3 seconds
      setTimeout(() => router.push("/"), 3000)
    }
  }, [searchParams, router])

  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(bookingId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsApp = () => {
    const message = `Hi! I just booked a service. My booking ID is: ${bookingId}`
    const whatsappUrl = `https://wa.me/9384851596NANJIL?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleCall = () => {
    window.location.href = "tel:9384851596-NANJIL"
  }

  const handleHome = () => {
    router.push("/")
  }

  const handleViewBookings = () => {
    router.push("/bookings")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100 rounded-full translate-y-12 -translate-x-12 opacity-30"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Success Icon with animation */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">பதிவு முடிந்தது! 🎉</h1>
            <p className="text-xl text-gray-600">Booking Confirmed!</p>
            <p className="text-sm text-gray-500 mt-2">Your service request has been successfully submitted</p>
          </div>

          {/* Booking ID */}
          {bookingId && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
              <p className="text-blue-600 font-medium mb-2">
                உங்கள் பதிவு எண் (Your Booking ID)
              </p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl font-bold text-blue-800 font-mono">{bookingId}</span>
                <button
                  onClick={handleCopyBookingId}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Copy booking ID"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              {copied && (
                <p className="text-green-600 text-sm mt-1 animate-fade-in">✓ Copied to clipboard!</p>
              )}
              <p className="text-blue-700 text-xs mt-2">Save this ID for future reference</p>
            </div>
          )}

          {/* Information Timeline */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
            <h3 className="text-yellow-800 font-semibold mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              என்ன நடக்கும்? (What happens next?)
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                <div>
                  <p className="text-yellow-800 font-medium">Call within 30 minutes</p>
                  <p className="text-yellow-700 text-sm">எங்கள் ஊழியர்கள் 30 நிமிடத்தில் அழைப்பார்கள்</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                <div>
                  <p className="text-yellow-800 font-medium">Confirm appointment</p>
                  <p className="text-yellow-700 text-sm">நேரம் உறுதிப்படுத்தல்</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                <div>
                  <p className="text-yellow-800 font-medium">Technician arrives</p>
                  <p className="text-yellow-700 text-sm">டெக்னீஷியன் வருகை</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-6">
            <button
              onClick={handleWhatsApp}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2 transform hover:scale-105 duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              <span>💬 WhatsApp மூலம் பேச</span>
            </button>

            <button
              onClick={handleCall}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2 transform hover:scale-105 duration-200"
            >
              <Phone className="w-5 h-5" />
              <span>📞 உடனே அழை (Call Now)</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleViewBookings}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>My Bookings</span>
              </button>
              
              <button
                onClick={handleHome}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>முகப்பு (Home)</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              நன்றி! நாஞ்சில் MEP சேவை தேர்வு செய்ததற்கு ❤️
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Thank you for choosing Nanjil MEP Service
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Need help? Call us anytime at 1800-NANJIL
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}