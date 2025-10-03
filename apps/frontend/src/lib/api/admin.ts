import { api } from './client'

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

export interface ContactInfo {
  name: string
  phone: string
  address: string
  email?: string
}

export interface AdminBooking {
  id: number
  bookingNumber: string
  serviceType: string
  priority: string
  status: string
  description: string
  contactInfo: ContactInfo
  scheduledTime: string
  totalCost?: string
  actualCost?: string
  createdAt?: string
  updatedAt?: string
  completedAt?: string
}

export interface Customer {
  id: number
  name: string
  phone: string
  address: string | null
  language: string
  isActive: string
  clerkUserId: string | null
  createdAt: Date | null
  updatedAt: Date | null
}

// Dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get('/api/admin/dashboard')
  return response.data.metrics
}

// Bookings
export async function getAdminBookings(params?: {
  status?: string
  limit?: number
  offset?: number
  priority?: string
}) {
  const response = await api.get('/api/admin/bookings', { params })
  return response.data
}

export async function getBookingById(id: number | string) {
  const response = await api.get(`/api/admin/bookings/${id}`)
  return response.data.booking
}

export async function updateBookingStatus(id: number | string, status: string, notes?: string) {
  const response = await api.put(`/api/admin/bookings/${id}/status`, { status, notes })
  return response.data
}

// Customers
export async function getAdminCustomers(params?: {
  search?: string
  status?: string
  sortBy?: string
  limit?: number
  offset?: number
}) {
  const response = await api.get('/api/admin/customers', { params })
  return response.data
}

export async function updateCustomer(id: number, data: any) {
  const response = await api.put(`/api/admin/customers/${id}`, data)
  return response.data
}

export async function blockCustomer(id: number) {
  const response = await api.post(`/api/admin/customers/${id}/block`, { blocked: true })
  return response.data
}

export async function unblockCustomer(id: number) {
  const response = await api.post(`/api/admin/customers/${id}/unblock`, { blocked: false })
  return response.data
}

// Analytics
export async function getCustomerAnalytics() {
  const response = await api.get('/api/admin/analytics/customers')
  return response.data.analytics
}

export async function getServiceAnalytics() {
  const response = await api.get('/api/admin/analytics/services')
  return response.data.analytics
}

export async function getRevenueAnalytics(period: string = 'month') {
  const response = await api.get('/api/admin/analytics/revenue', { params: { period } })
  return response.data.analytics
}