import { api } from './client'

export interface ContactInfo {
  name: string
  phone: string
  address: string
}

export interface Booking {
  id: number
  bookingNumber: string
  serviceType: 'electrical' | 'plumbing'
  priority: 'normal' | 'urgent' | 'emergency'
  description: string
  contactInfo: ContactInfo
  scheduledTime: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  totalCost?: string
  rating?: number
  review?: string
  createdAt?: string
  updatedAt?: string
  completedAt?: string
}

export interface CreateBookingData {
  serviceType: 'electrical' | 'plumbing'
  priority?: 'normal' | 'urgent' | 'emergency'
  description: string
  contactInfo: ContactInfo
  scheduledTime: string
}

export interface BookingResponse {
  success: boolean
  booking: Booking
  message: string
}

export interface BookingsListResponse {
  bookings: Booking[]
  count: number
}

// Get all bookings
export async function getBookings(params?: { 
  limit?: number
  offset?: number 
}): Promise<Booking[]> {
  console.log('📋 Fetching bookings...', params)
  
  try {
    const response = await api.get<BookingsListResponse>('/api/bookings', { params })
    console.log('✅ Bookings fetched successfully')
    return response.data.bookings
  } catch (error) {
    console.error('❌ Error fetching bookings:', error)
    throw new Error('Failed to fetch bookings')
  }
}

// Get specific booking by ID or booking number
export async function getBooking(id: string | number): Promise<Booking> {
  console.log(`🔍 Fetching booking ${id}...`)
  
  try {
    const response = await api.get<{ booking: Booking }>(`/api/bookings/${id}`)
    console.log(`✅ Booking ${id} fetched successfully`)
    return response.data.booking
  } catch (error) {
    console.error(`❌ Error fetching booking ${id}:`, error)
    throw new Error('Failed to fetch booking')
  }
}

// Get user's own bookings
export async function getMyBookings(): Promise<Booking[]> {
  console.log('👤 Fetching my bookings...')
  
  try {
    const response = await api.get<BookingsListResponse>('/api/bookings/my')
    console.log('✅ My bookings fetched successfully')
    return response.data.bookings
  } catch (error) {
    console.error('❌ Error fetching my bookings:', error)
    throw new Error('Failed to fetch your bookings')
  }
}

// Create new booking
export async function createBooking(data: CreateBookingData): Promise<BookingResponse> {
  console.log('📝 Creating new booking...', data.serviceType)
  
  try {
    const response = await api.post<BookingResponse>('/api/bookings', data)
    console.log('✅ Booking created successfully:', response.data.booking.bookingNumber)
    return response.data
  } catch (error: any) {
    console.error('❌ Error creating booking:', error)
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    }
    
    throw new Error('Failed to create booking')
  }
}

// Cancel booking
export async function cancelBooking(bookingId: string, reason?: string): Promise<{ success: boolean; message: string }> {
  console.log(`🚫 Cancelling booking ${bookingId}...`)
  
  try {
    const response = await api.put(`/api/bookings/${bookingId}/cancel`, { reason })
    console.log(`✅ Booking ${bookingId} cancelled successfully`)
    return response.data
  } catch (error: any) {
    console.error(`❌ Error cancelling booking ${bookingId}:`, error)
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    }
    
    throw new Error('Failed to cancel booking')
  }
}

// Submit booking feedback
export async function submitBookingFeedback(
  bookingId: string,
  rating: number,
  review?: string
): Promise<{ success: boolean; message: string }> {
  console.log(`⭐ Submitting feedback for booking ${bookingId}...`)
  
  try {
    const response = await api.post(`/api/bookings/${bookingId}/feedback`, {
      rating,
      review: review || '',
    })
    console.log(`✅ Feedback submitted for booking ${bookingId}`)
    return response.data
  } catch (error: any) {
    console.error(`❌ Error submitting feedback for booking ${bookingId}:`, error)
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    }
    
    throw new Error('Failed to submit feedback')
  }
}