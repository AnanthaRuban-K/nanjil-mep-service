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
  scheduledTime: string | Date
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  totalCost?: string
  rating?: number
  review?: string
  createdAt?: string | Date
  updatedAt?: string | Date
  completedAt?: string | Date
}

export interface AdminMetrics {
  todayBookings: number
  completedJobs: number
  pendingJobs: number
  emergencyJobs: number
  totalBookings: number
}

export type BookingStatus = Booking['status']
export type ServiceType = Booking['serviceType']
export type Priority = Booking['priority']