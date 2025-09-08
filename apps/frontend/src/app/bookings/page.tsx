'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Phone, MapPin, Star, Clock } from 'lucide-react'

interface Booking {
  id: number
  bookingNumber: string
  serviceType: 'electrical' | 'plumbing'
  description: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  scheduledTime: string
  createdAt: string
  rating?: number
  review?: string
}

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/bookings/my')
      
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  const handleNewBooking = () => {
    router.push('/services')
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('இந்த பதிவை இரத்து செய்ய வேண்டுமா? / Do you want to cancel this booking?')) {
      return
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'PUT'
      })

      if (response.ok) {
        fetchBookings() // Refresh the list
        alert('பதிவு இரத்து செய்யப்பட்டது / Booking cancelled')
      }
    } catch (error) {
      alert('பிழை ஏற்பட்டது / Error occurred')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'confirmed': return 'text-blue-600 bg-blue-100'
      case 'in_progress': return 'text-purple-600 bg-purple-100'
      case 'completed': return 'text-green-600 bg-green-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'காத்திருக்கும் (Pending)'
      case 'confirmed': return 'உறுதி செய்யப்பட்டது (Confirmed)'
      case 'in_progress': return 'நடைபெறுகிறது (In Progress)'
      case 'completed': return 'முடிந்தது (Completed)'
      case 'cancelled': return 'இரத்து செய்யப்பட்டது (Cancelled)'
      default: return status
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    )
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
              <h1 className="text-xl font-bold text-gray-800">எனது பதிவுகள்</h1>
              <p className="text-sm text-gray-600">My Bookings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Bookings Yet
            </h3>
            <p className="text-gray-600 mb-6">
              இதுவரை எந்த பதிவும் இல்லை / You haven't made any bookings yet
            </p>
            <button
              onClick={handleNewBooking}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              + புதிய பதிவு (New Booking)
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking: Booking) => (
              <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`w-3 h-3 rounded-full ${
                        booking.status === 'completed' ? 'bg-green-500' :
                        booking.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></span>
                      <span className="font-bold text-lg">#{booking.bookingNumber}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Service:</p>
                        <p className="font-medium">
                          {booking.serviceType === 'electrical' ? 'மின்சாரம் (Electrical)' : 'குழாய் (Plumbing)'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Scheduled:</p>
                        <p className="font-medium">
                          {new Date(booking.scheduledTime).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">Issue:</p>
                      <p className="text-gray-800">{booking.description}</p>
                    </div>

                    {booking.status === 'completed' && booking.rating && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Rating:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= (booking.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {booking.review && (
                          <p className="text-sm text-gray-700 mt-1">"{booking.review}"</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>
                      Booked: {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.location.href = 'tel:1800-NANJIL'}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                      Call Us
                    </button>
                    
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleCancelBooking(booking.bookingNumber)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Booking Button */}
        {bookings.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={handleNewBooking}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              + புதிய பதிவு (New Booking)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}