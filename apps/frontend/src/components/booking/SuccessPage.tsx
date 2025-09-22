"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Phone, MessageCircle, Home, Copy, Calendar, Clock, Star, ArrowRight } from "lucide-react"

interface SuccessPageProps {
  bookingId?: string
  bookingData?: {
    serviceType: string
    customerName: string
    scheduledTime: string
    totalCost: number
  }
}

export function SuccessPage({ bookingId, bookingData }: SuccessPageProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes in seconds

  // Countdown timer for callback
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleCopyBookingId = () => {
    if (bookingId) {
      navigator.clipboard.writeText(bookingId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleWhatsApp = () => {
    const message = `Hi! I just booked a service with Nanjil MEP. My booking ID is: ${bookingId || 'N/A'}`
    const whatsappUrl = `https://wa.me/1800NANJIL?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleCall = () => {
    window.location.href = "tel:1800-NANJIL"
  }

  const handleHome = () => {
    router.push("/")
  }

  const handleViewBookings = () => {
    router.push("/bookings")
  }

  const handleBookAnother = () => {
    router.push("/services")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-8 text-white text-center relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">பதிவு வெற்றிகரமாக முடிந்தது! 🎉</h1>
              <p className="text-xl opacity-90">Booking Confirmed Successfully!</p>
              <p className="text-green-100 mt-2">Your service request has been received and processed</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Booking ID */}
            {bookingId && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
                <div className="text-center">
                  <p className="text-blue-600 font-semibold mb-2">
                    உங்கள் பதிவு எண் (Your Booking Reference)
                  </p>
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-3xl font-bold text-blue-800 font-mono tracking-wider">{bookingId}</span>
                    <button
                      onClick={handleCopyBookingId}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Copy booking ID"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                  {copied && (
                    <p className="text-green-600 text-sm mt-2 animate-pulse">✓ Copied to clipboard!</p>
                  )}
                  <p className="text-blue-700 text-sm mt-2">
                    📱 Save this ID for tracking your service request
                  </p>
                </div>
              </div>
            )}

            {/* Service Summary */}
            {bookingData && (
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">📋 Service Summary</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Service Type:</p>
                    <p className="font-medium">{bookingData.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Customer:</p>
                    <p className="font-medium">{bookingData.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Scheduled Time:</p>
                    <p className="font-medium">{new Date(bookingData.scheduledTime).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Estimated Cost:</p>
                    <p className="font-medium">₹{bookingData.totalCost}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps Timeline */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-6">
              <h3 className="text-yellow-800 font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                அடுத்த நடவடிக்கைகள் (What Happens Next)
              </h3>
              
              {/* Countdown */}
              <div className="bg-yellow-100 rounded-lg p-4 mb-4 text-center">
                <p className="text-yellow-800 font-semibold">📞 Call Expected In:</p>
                <p className="text-2xl font-bold text-yellow-900">{formatTimeRemaining(timeRemaining)}</p>
                <p className="text-yellow-700 text-sm">எங்கள் டீம் உங்களை அழைக்கும்</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <p className="font-medium text-yellow-800">Immediate Confirmation Call</p>
                    <p className="text-yellow-700 text-sm">Our team will call within 30 minutes to confirm details</p>
                    <p className="text-yellow-600 text-xs">30 நிமிடத்தில் உறுதிப்படுத்தல் அழைப்பு</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <p className="font-medium text-yellow-800">Schedule Confirmation</p>
                    <p className="text-yellow-700 text-sm">Finalize appointment time and technician assignment</p>
                    <p className="text-yellow-600 text-xs">நேரம் மற்றும் டெக்னீஷியன் ஒதுக்கீடு</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <p className="font-medium text-yellow-800">Technician Arrival</p>
                    <p className="text-yellow-700 text-sm">Certified technician arrives at your location</p>
                    <p className="text-yellow-600 text-xs">சான்றிதழ் பெற்ற டெக்னீஷியன் வருகை</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                  <div>
                    <p className="font-medium text-yellow-800">Service Completion</p>
                    <p className="text-yellow-700 text-sm">Quality work completed and payment collection</p>
                    <p className="text-yellow-600 text-xs">தரமான வேலை மற்றும் பணம் செலுத்துதல்</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2 transform hover:scale-105 duration-200"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp Chat</span>
                </button>

                <button
                  onClick={handleCall}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2 transform hover:scale-105 duration-200"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Now</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={handleViewBookings}
                  className="flex flex-col items-center justify-center space-y-2 p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-medium">My Bookings</span>
                </button>
                
                <button
                  onClick={handleBookAnother}
                  className="flex flex-col items-center justify-center space-y-2 p-4 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                  <span className="text-sm font-medium">Book Again</span>
                </button>
                
                <button
                  onClick={handleHome}
                  className="flex flex-col items-center justify-center space-y-2 p-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span className="text-sm font-medium">Home</span>
                </button>
              </div>
            </div>

            {/* Rating Request */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 mb-6">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Rate Your Experience</h3>
                <p className="text-gray-600 text-sm">
                  Help us improve by rating your service experience after completion
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  சேவை முடிந்த பிறகு உங்கள் அனुபவத்தை மதிப்பிடுங்கள்
                </p>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="text-center">
                <h3 className="font-semibold text-red-800 mb-2">🚨 Emergency Support</h3>
                <p className="text-red-700 text-sm mb-3">
                  Need immediate assistance? Contact our 24/7 emergency line
                </p>
                <button
                  onClick={() => window.location.href = 'tel:1800-NANJIL'}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Emergency: 1800-NANJIL
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 text-center border-t">
            <p className="text-gray-600 font-medium mb-1">
              நன்றி! நாஞ்சில் MEP சேவை தேர்வு செய்ததற்கு ❤️
            </p>
            <p className="text-gray-500 text-sm">
              Thank you for choosing Nanjil MEP Service
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Quality service • Fair pricing • Customer satisfaction guaranteed
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}