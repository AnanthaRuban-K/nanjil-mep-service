import { api } from './client'
import { Booking } from './bookings'

export interface DashboardStats {
  today: {
    bookings: number
    completed: number
    pending: number
    inProgress: number
    revenue: number
  }
  overall: {
    totalBookings: number
    completedJobs: number
    pendingJobs: number
    emergencyJobs: number
    totalRevenue: number
  }
}

export interface AdminBooking extends Booking {
  // Admin-specific fields can be added here
}

export interface UpdateBookingStatusData {
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
}

export interface DashboardStatsResponse {
  success: boolean
  metrics: DashboardStats
  error?: string
}

export interface AdminBookingsResponse {
  success: boolean
  bookings: AdminBooking[]
  count?: number
  error?: string
}

export interface UpdateBookingStatusResponse {
  success: boolean
  message: string
  status: string
  notes?: string
  error?: string
}

// Get dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  console.log('📊 Fetching dashboard statistics...')
  
  try {
    const response = await api.get<DashboardStatsResponse>('/api/admin/dashboard')
    
    if (!response.data.success) {
      throw new Error('Failed to fetch dashboard stats')
    }
    
    console.log('✅ Dashboard stats fetched successfully')
    return response.data.metrics
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error)
    throw new Error('Failed to load dashboard statistics')
  }
}

// Get admin bookings with filters
export async function getAdminBookings(params?: {
  status?: string
  limit?: number
  offset?: number
}): Promise<AdminBooking[]> {
  console.log('📋 Fetching admin bookings...', params)
  
  try {
    const response = await api.get<AdminBookingsResponse>('/api/admin/bookings', {
      params: {
        limit: params?.limit || 50,
        offset: params?.offset || 0,
        ...(params?.status && { status: params.status })
      }
    })
    
    // Handle different response formats
    if (response.data.success && Array.isArray(response.data.bookings)) {
      console.log(`✅ Fetched ${response.data.bookings.length} admin bookings`)
      return response.data.bookings
    } else if (Array.isArray(response.data)) {
      console.log(`✅ Fetched ${response.data.length} admin bookings (array format)`)
      return response.data as AdminBooking[]
    } else {
      console.warn('⚠️ Unexpected API response format:', response.data)
      return []
    }
  } catch (error) {
    console.error('❌ Error fetching admin bookings:', error)
    throw new Error('Failed to load bookings')
  }
}

// Update booking status
export async function updateBookingStatus(
  bookingId: number | string,
  statusData: UpdateBookingStatusData
): Promise<UpdateBookingStatusResponse> {
  console.log(`🔄 Updating booking ${bookingId} status to ${statusData.status}`)
  
  try {
    const response = await api.put<UpdateBookingStatusResponse>(
      `/api/admin/bookings/${bookingId}/status`,
      statusData
    )
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to update booking status')
    }
    
    console.log(`✅ Booking ${bookingId} status updated successfully`)
    return response.data
  } catch (error: any) {
    console.error('❌ Error updating booking status:', error)
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    }
    
    throw new Error('Failed to update booking status')
  }
}

// Get booking by ID (admin version with more details)
export async function getAdminBookingById(bookingId: number): Promise<AdminBooking> {
  console.log(`🔍 Fetching admin booking ${bookingId}...`)
  
  try {
    const response = await api.get<{ success: boolean; booking: AdminBooking }>(`/api/admin/bookings/${bookingId}`)
    
    if (!response.data.success) {
      throw new Error('Booking not found')
    }
    
    console.log(`✅ Admin booking ${bookingId} fetched successfully`)
    return response.data.booking
  } catch (error) {
    console.error(`❌ Error fetching admin booking ${bookingId}:`, error)
    throw new Error('Failed to load booking details')
  }
}