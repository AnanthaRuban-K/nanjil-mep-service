// File: src/types/booking.ts - Fixed Booking Types
export interface ContactInfo {
  name: string
  phone: string
  address: string
  email?: string
}

export interface Booking {
  id: number
  bookingNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  serviceType: 'electrical' | 'plumbing'
  service: string
  priority: 'normal' | 'urgent' | 'emergency'
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  description: string
  contactInfo: ContactInfo
  scheduledTime: string
  estimatedCost?: number
  actualCost?: number
  technicianName?: string
  technicianPhone?: string
  rating?: number
  review?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  cancellationReason?: string // Added this field
  adminNotes?: string // Added this field
}

export interface CreateBookingData {
  serviceType: 'electrical' | 'plumbing'
  priority?: 'normal' | 'urgent' | 'emergency'
  description: string
  contactInfo: ContactInfo
  scheduledTime: string
}

export interface UpdateBookingStatusData {
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  technicianName?: string
  technicianPhone?: string
  actualCost?: number
  notes?: string
}

export interface BookingResponse {
  success: boolean
  booking: Booking
  message: string
}

export interface BookingsListResponse {
  success: boolean
  bookings: Booking[]
  count: number
  total?: number
  pagination?: {
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
  }
}

export interface AdminBooking extends Booking {
  address: string // Flattened from contactInfo for admin view
}

export interface CancelBookingData {
  bookingId: string
  reason?: string
}

export interface FeedbackData {
  rating: number
  review?: string
}