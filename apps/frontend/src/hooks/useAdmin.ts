import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as adminApi from '@/lib/api/admin'

export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  bookings: () => [...adminKeys.all, 'bookings'] as const,
  bookingsList: (params?: any) => [...adminKeys.bookings(), 'list', params] as const,
  booking: (id: string | number) => [...adminKeys.bookings(), id] as const,
  customers: () => [...adminKeys.all, 'customers'] as const,
  customersList: (params?: any) => [...adminKeys.customers(), 'list', params] as const,
}

// Dashboard
export function useAdminDashboardStats() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: adminApi.getDashboardStats,
    refetchInterval: 30000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 429) {
        return false
      }
      return failureCount < 2
    },
  })
}

// Bookings
export function useAdminBookings(params?: {
  page?: number
  limit?: number
  status?: string
  priority?: string
  serviceType?: string
  search?: string
}) {
  const apiParams = {
    limit: params?.limit || 20,
    offset: params?.page ? (params.page - 1) * (params.limit || 20) : 0,
    ...(params?.status && { status: params.status }),
    ...(params?.priority && { priority: params.priority }),
    ...(params?.serviceType && { serviceType: params.serviceType }),
    ...(params?.search && { search: params.search }),
  }

  return useQuery({
    queryKey: adminKeys.bookingsList(params),
    queryFn: () => adminApi.getAdminBookings(apiParams),
    refetchInterval: 30000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 429) {
        return false
      }
      return failureCount < 2
    },
  })
}

export function useAdminBooking(id: number | string) {
  return useQuery({
    queryKey: adminKeys.booking(id),
    queryFn: () => adminApi.getBookingById(id),
    enabled: !!id,
    retry: 2,
  })
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bookingId, status, notes }: { bookingId: number | string; status: string; notes?: string }) =>
      adminApi.updateBookingStatus(bookingId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.bookings() })
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard() })
    },
  })
}

// Customers
export function useAdminCustomers(params?: {
  page?: number
  limit?: number
  search?: string
  status?: string
  sortBy?: string
}) {
  const apiParams = {
    limit: params?.limit || 20,
    offset: params?.page ? (params.page - 1) * (params.limit || 20) : 0,
    ...(params?.search && { search: params.search }),
    ...(params?.status && { status: params.status }),
    ...(params?.sortBy && { sortBy: params.sortBy }),
  }

  return useQuery({
    queryKey: adminKeys.customersList(params),
    queryFn: () => adminApi.getAdminCustomers(apiParams),
    refetchInterval: 60000,
    retry: 2,
  })
}

export function useCustomerOperations() {
  const queryClient = useQueryClient()

  const updateCustomer = useMutation({
    mutationFn: ({ customerId, data }: { customerId: number; data: any }) =>
      adminApi.updateCustomer(customerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.customers() })
    },
  })

  const blockCustomer = useMutation({
    mutationFn: (customerId: number) => adminApi.blockCustomer(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.customers() })
    },
  })

  const unblockCustomer = useMutation({
    mutationFn: (customerId: number) => adminApi.unblockCustomer(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.customers() })
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