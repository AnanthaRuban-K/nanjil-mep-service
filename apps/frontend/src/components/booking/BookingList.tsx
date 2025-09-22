'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Phone, MapPin, Star, Clock, Filter } from 'lucide-react'
import { useMyBookings, useCancelBooking, useSubmitBookingFeedback } from '@/hooks/useBookings'
import { LoadingSpinner} from '@/components/ui/LoadingSpinner'
import {  ErrorMessage } from '@/components/ui/ErrorMessage'
import type { Booking } from '@/lib/api/bookings'

export function BookingList() {
  const router = useRouter()
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')

  const { data: bookings, isLoading, error, refetch } = useMyBookings()
  const cancelBookingMutation = useCancelBooking()
  const submitFeedbackMutation = useSubmitBookingFeedback()

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('இந்த பதிவை இரத்து செய்ய வேண்டுமா? / Do you want to cancel this booking?')) {
      return
    }

    try {
      await cancelBookingMutation.mutateAsync({ 
        bookingId, 
        reason: 'Customer requested cancellation' 
      })
      alert('பதிவு இரத்து செய்யப்பட்டது / Booking cancelled')
    } catch (error) {
      alert('பிழை ஏற்பட்டது / Error occurred')
    }
  }

  const handleSubmitRating = async () => {
    if (!selectedBooking || rating === 0) return

    try {
      await submitFeedbackMutation.mutateAsync({
        bookingId: selectedBooking.bookingNumber,
        rating,
        review
      })
      setShowRatingModal(false)
      setSelectedBooking(null)
      setRating(0)
      setReview('')
      alert('மதிப்பீடு சமர்ப்பிக்கப்பட்டது / Rating submitted')
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
        <LoadingSpinner size="lg" text="Loading your bookings..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ErrorMessage 
          error={error} 
          onRetry={refetch}
          className="max-w-md"
        />
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
              onClick={() => router.back()}
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
        {!bookings || bookings.length === 0 ? (
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
              onClick={() => router.push('/services')}
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
                      Booked: {new Date(booking.createdAt || '').toLocaleDateString('en-IN')}
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
                        disabled={cancelBookingMutation.isPending}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        {cancelBookingMutation.isPending ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}

                    {booking.status === 'completed' && !booking.rating && (
                      <button
                        onClick={() => {
                          setSelectedBooking(booking)
                          setShowRatingModal(true)
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Rate Service
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Booking Button */}
        {bookings && bookings.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => router.push('/services')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              + புதிய பதிவு (New Booking)
            </button>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Rate Service
                </h3>
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Booking: {selectedBooking.bookingNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    How was our service?
                  </p>
                </div>

                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Optional review..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRating}
                  disabled={rating === 0 || submitFeedbackMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {submitFeedbackMutation.isPending ? 'Submitting...' : 'Submit Rating'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}