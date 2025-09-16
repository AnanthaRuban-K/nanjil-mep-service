// src/lib/api/admin.ts
import { api } from './client';
import { 
  BookingsResponse, 
  DashboardStatsResponse, 
  UpdateBookingStatusRequest, 
  UpdateBookingStatusResponse,
  BookingsQueryParams,
  Booking,
  DashboardStats
} from '@/lib/types/admin';

/**
 * Fetch dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  console.log('📊 Fetching dashboard statistics...');
  
  try {
    const response = await api.get<DashboardStatsResponse>('/api/admin/dashboard');
    
    if (!response.data.success) {
      throw new Error('Failed to fetch dashboard stats');
    }
    
    console.log('✅ Dashboard stats fetched successfully');
    return response.data.metrics;
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    throw new Error('Failed to load dashboard statistics');
  }
}

/**
 * Fetch all bookings for admin with optional filters
 */
export async function getAdminBookings(params: BookingsQueryParams = {}): Promise<Booking[]> {
  console.log('📋 Fetching admin bookings...', params);
  
  try {
    const response = await api.get<BookingsResponse>('/api/bookings', {
      params: {
        limit: params.limit || 20,
        offset: params.offset || 0,
        ...(params.status && { status: params.status })
      }
    });
    
    // Handle different response formats from your current API
    if (response.data.success && Array.isArray(response.data.bookings)) {
      console.log(`✅ Fetched ${response.data.bookings.length} bookings`);
      return response.data.bookings;
    } else if (Array.isArray(response.data)) {
      console.log(`✅ Fetched ${response.data.length} bookings (array format)`);
      return response.data as Booking[];
    } else {
      console.warn('⚠️ Unexpected API response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching bookings:', error);
    throw new Error('Failed to load bookings');
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  bookingId: number, 
  statusData: UpdateBookingStatusRequest
): Promise<UpdateBookingStatusResponse> {
  console.log(`🔄 Updating booking ${bookingId} status to ${statusData.status}`);
  
  try {
    const response = await api.put<UpdateBookingStatusResponse>(
      `/api/bookings/${bookingId}/status`,
      statusData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to update booking status');
    }
    
    console.log(`✅ Booking ${bookingId} status updated successfully`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error updating booking status:', error);
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    throw new Error('Failed to update booking status');
  }
}

/**
 * Get booking by ID (if needed)
 */
export async function getBookingById(bookingId: number): Promise<Booking> {
  console.log(`🔍 Fetching booking ${bookingId}...`);
  
  try {
    const response = await api.get<{ success: boolean; booking: Booking }>(`/api/bookings/${bookingId}`);
    
    if (!response.data.success) {
      throw new Error('Booking not found');
    }
    
    console.log(`✅ Booking ${bookingId} fetched successfully`);
    return response.data.booking;
  } catch (error) {
    console.error(`❌ Error fetching booking ${bookingId}:`, error);
    throw new Error('Failed to load booking details');
  }
}