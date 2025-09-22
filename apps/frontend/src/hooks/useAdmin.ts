// File: src/hooks/useAdmin.ts - CLEAN VERSION (Uses existing API client)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api/client' // Use your existing API client

// Types
export interface AdminBooking {
  id: number
  bookingNumber: string
  customerName?: string
  customerPhone?: string
  service: string
  serviceType: 'electrical' | 'plumbing'
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'normal' | 'urgent' | 'emergency'
  scheduledTime: string
  description: string
  address: string
  createdAt: string
}

export interface DashboardStats {
  totalBookings?: number
  pendingBookings?: number
  completedBookings?: number
  activeCustomers?: number
  monthlyRevenue?: number
  averageRating?: number
  emergencyBookings?: number
  techniciansActive?: number
}

export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  totalBookings?: number
  completedBookings?: number
  totalRevenue?: number
  status: 'active' | 'inactive' | 'blocked'
  createdAt: string
}

// Query Keys
export const adminQueryKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminQueryKeys.all, 'dashboard'] as const,
  stats: () => [...adminQueryKeys.dashboard(), 'stats'] as const,
  bookings: () => [...adminQueryKeys.all, 'bookings'] as const,
  bookingsList: (params?: Record<string, any>) => [...adminQueryKeys.bookings(), 'list', params] as const,
  booking: (id: string | number) => [...adminQueryKeys.bookings(), 'detail', id] as const,
  customers: () => [...adminQueryKeys.all, 'customers'] as const,
} as const

// Dashboard Stats Hook
export function useAdminDashboardStats() {
  return useQuery({
    queryKey: adminQueryKeys.stats(),
    queryFn: async () => {
      const response = await api.get('/api/admin/dashboard')
      return response.data
    },
    refetchInterval: 30000,
    staleTime: 25000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// Admin Bookings Hook
export function useAdminBookings(params: {
  page?: number
  limit?: number
  status?: string
  priority?: string
  serviceType?: string
  search?: string
} = {}) {
  // Convert page to offset for API
  const apiParams = {
    limit: params.limit || 20,
    offset: params.page ? (params.page - 1) * (params.limit || 20) : 0,
    ...(params.status && { status: params.status }),
    ...(params.priority && { priority: params.priority }),
    ...(params.serviceType && { serviceType: params.serviceType }),
    ...(params.search && { search: params.search }),
  }

  return useQuery({
    queryKey: adminQueryKeys.bookingsList(params),
    queryFn: async () => {
      const response = await api.get('/api/admin/bookings', { params: apiParams })
      return response.data
    },
    refetchInterval: 30000,
    staleTime: 25000,
    retry: 3,
  })
}

// Admin Customers Hook
export function useAdminCustomers(params: {
  page?: number
  limit?: number
  search?: string
  status?: string
  sortBy?: string
} = {}) {
  // Convert page to offset for API
  const apiParams = {
    limit: params.limit || 20,
    offset: params.page ? (params.page - 1) * (params.limit || 20) : 0,
    ...(params.search && { search: params.search }),
    ...(params.status && { status: params.status }),
    ...(params.sortBy && { sortBy: params.sortBy }),
  }

  return useQuery({
    queryKey: [...adminQueryKeys.customers(), params],
    queryFn: async () => {
      const response = await api.get('/api/admin/customers', { params: apiParams })
      return response.data
    },
    refetchInterval: 60000,
    staleTime: 30000,
    retry: 3,
  })
}

// Update Booking Status Hook
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ bookingId, status, notes }: { 
      bookingId: number | string
      status: string
      notes?: string 
    }) => {
      if (!bookingId || !status) {
        throw new Error('Booking ID and status are required')
      }

      const response = await api.put(`/api/admin/bookings/${bookingId}/status`, {
        status, 
        notes
      })
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.bookings() })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats() })
      console.log(`✅ Booking ${variables.bookingId} status updated to ${variables.status}`)
    },
    onError: (error: Error) => {
      console.error('❌ Status update error:', error)
    },
  })
}

// Customer Operations Hook
export function useCustomerOperations() {
  const queryClient = useQueryClient()

  const updateCustomer = useMutation({
    mutationFn: async ({ customerId, data }: { customerId: number; data: any }) => {
      if (!customerId || !data) {
        throw new Error('Customer ID and data are required')
      }

      const response = await api.put(`/api/admin/customers/${customerId}`, data)
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.customers() })
      console.log(`✅ Customer ${variables.customerId} updated`)
    },
    onError: (error: Error) => {
      console.error('❌ Customer update error:', error)
    },
  })

  const blockCustomer = useMutation({
    mutationFn: async (customerId: number) => {
      if (!customerId) {
        throw new Error('Customer ID is required')
      }

      const response = await api.post(`/api/admin/customers/${customerId}/block`, { 
        blocked: true 
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.customers() })
      console.log('✅ Customer blocked')
    },
    onError: (error: Error) => {
      console.error('❌ Customer block error:', error)
    },
  })

  const unblockCustomer = useMutation({
    mutationFn: async (customerId: number) => {
      if (!customerId) {
        throw new Error('Customer ID is required')
      }

      const response = await api.post(`/api/admin/customers/${customerId}/unblock`, { 
        blocked: false 
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.customers() })
      console.log('✅ Customer unblocked')
    },
    onError: (error: Error) => {
      console.error('❌ Customer unblock error:', error)
    },
  })

  return { 
    updateCustomer, 
    blockCustomer, 
    unblockCustomer,
    isUpdating: updateCustomer.isPending,
    isBlocking: blockCustomer.isPending,
    isUnblocking: unblockCustomer.isPending,
  }
}

// Get single booking
export function useAdminBooking(id: number | string) {
  return useQuery({
    queryKey: adminQueryKeys.booking(id),
    queryFn: async () => {
      const response = await api.get(`/api/admin/bookings/${id}`)
      return response.data
    },
    enabled: !!id,
    staleTime: 60000,
    retry: 3,
  })
}

// Data refresh hook
export function useAdminDataRefresh() {
  const queryClient = useQueryClient()

  return {
    refreshAll: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats() }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.bookings() }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.customers() }),
      ])
      console.log('✅ Admin data refreshed')
    },
    refreshDashboard: async () => {
      await queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats() })
    },
    refreshBookings: async () => {
      await queryClient.invalidateQueries({ queryKey: adminQueryKeys.bookings() })
    },
    refreshCustomers: async () => {
      await queryClient.invalidateQueries({ queryKey: adminQueryKeys.customers() })
    },
  }
}