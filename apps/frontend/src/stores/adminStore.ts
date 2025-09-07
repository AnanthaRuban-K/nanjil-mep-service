import { create } from 'zustand'


interface AdminMetrics {
  todayBookings: number
  completedJobs: number
  pendingJobs: number
  emergencyJobs: number
  totalBookings: number
}

interface Booking {
  id: number
  bookingNumber: string
  status: string
  customerName: string
  date: string
}


interface AdminState {
  // Dashboard data
  allBookings: Booking[]
  metrics: AdminMetrics | null
  
  // Loading states
  isLoading: boolean
  
  // Actions
  fetchBookings: (filter?: string) => Promise<void>
  updateBookingStatus: (id: string, status: string) => Promise<void>
  fetchMetrics: () => Promise<void>
  setLoading: (loading: boolean) => void
}

export const useAdminStore = create<AdminState>((set, get) => ({
  allBookings: [],
  metrics: null,
  isLoading: false,

  fetchBookings: async (filter?: string) => {
    try {
      set({ isLoading: true })
      
      const queryParams = filter ? `?status=${filter}` : ''
      const response = await fetch(`/api/admin/bookings${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }

      const { bookings } = await response.json()
      
      set({ allBookings: bookings })
    } catch (error) {
      console.error('Fetch admin bookings error:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  updateBookingStatus: async (bookingId: string, status: string) => {
    try {
      set({ isLoading: true })
      
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        throw new Error('Failed to update booking status')
      }

      // Update local state
      set((state) => ({
        allBookings: state.allBookings.map(booking =>
          booking.bookingNumber === bookingId || booking.id === Number(bookingId)
            ? { ...booking, status: status as any }
            : booking
        )
      }))

      // Refresh metrics
      get().fetchMetrics()
    } catch (error) {
      console.error('Update booking status error:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  fetchMetrics: async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      
      if (!response.ok) {
        throw new Error('Failed to fetch metrics')
      }

      const { metrics } = await response.json()
      
      set({ metrics })
    } catch (error) {
      console.error('Fetch metrics error:', error)
      // Set default metrics on error
      set({
        metrics: {
          todayBookings: 0,
          completedJobs: 0,
          pendingJobs: 0,
          emergencyJobs: 0,
          totalBookings: 0
        }
      })
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  }
}))