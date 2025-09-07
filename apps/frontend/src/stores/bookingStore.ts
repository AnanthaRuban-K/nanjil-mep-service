// apps/frontend/src/stores/bookingStore.ts - SIMPLIFIED BOOKING STORE
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ContactInfo {
  name: string
  phone: string
  address: string
}

interface Booking {
  id?: number
  bookingNumber?: string
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
  completedAt?: string
}

interface BookingState {
  // Current booking flow
  currentBooking: Partial<Booking>
  
  // User's bookings
  myBookings: Booking[]
  
  // Loading states
  isLoading: boolean
  
  // Actions
  updateBookingStep: (data: Partial<Booking>) => void
  submitBooking: () => Promise<string>
  fetchMyBookings: () => Promise<void>
  cancelBooking: (id: string) => Promise<void>
  rateService: (id: string, rating: number, review: string) => Promise<void>
  clearCurrentBooking: () => void
  setLoading: (loading: boolean) => void
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      currentBooking: {},
      myBookings: [],
      isLoading: false,

      updateBookingStep: (data: Partial<Booking>) => {
        set((state) => ({
          currentBooking: {
            ...state.currentBooking,
            ...data
          }
        }))
      },

      submitBooking: async () => {
        const { currentBooking } = get()
        
        if (!currentBooking.serviceType || !currentBooking.description || !currentBooking.contactInfo || !currentBooking.scheduledTime) {
          throw new Error('Missing required booking information')
        }

        try {
          set({ isLoading: true })
          
          const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              serviceType: currentBooking.serviceType,
              priority: currentBooking.priority || 'normal',
              description: currentBooking.description,
              contactInfo: currentBooking.contactInfo,
              scheduledTime: currentBooking.scheduledTime
            })
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to create booking')
          }

          const { booking } = await response.json()
          
          // Add to user's bookings
          set((state) => ({
            myBookings: [booking, ...state.myBookings]
          }))

          return booking.bookingNumber
        } catch (error) {
          console.error('Submit booking error:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      fetchMyBookings: async () => {
        try {
          set({ isLoading: true })
          
          const response = await fetch('/api/bookings/my')
          
          if (!response.ok) {
            throw new Error('Failed to fetch bookings')
          }

          const { bookings } = await response.json()
          
          set({ myBookings: bookings })
        } catch (error) {
          console.error('Fetch bookings error:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      cancelBooking: async (bookingId: string) => {
        try {
          set({ isLoading: true })
          
          const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
            method: 'PUT'
          })

          if (!response.ok) {
            throw new Error('Failed to cancel booking')
          }

          // Update local state
          set((state) => ({
            myBookings: state.myBookings.map(booking => 
              booking.bookingNumber === bookingId || booking.id === Number(bookingId)
                ? { ...booking, status: 'cancelled' }
                : booking
            )
          }))
        } catch (error) {
          console.error('Cancel booking error:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      rateService: async (bookingId: string, rating: number, review: string) => {
        try {
          const response = await fetch(`/api/bookings/${bookingId}/feedback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rating, review })
          })

          if (!response.ok) {
            throw new Error('Failed to submit rating')
          }

          // Update local state
          set((state) => ({
            myBookings: state.myBookings.map(booking =>
              booking.bookingNumber === bookingId || booking.id === Number(bookingId)
                ? { ...booking, rating, review }
                : booking
            )
          }))
        } catch (error) {
          console.error('Rate service error:', error)
          throw error
        }
      },

      clearCurrentBooking: () => {
        set({ currentBooking: {} })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      }
    }),
    {
      name: 'booking-storage',
      partialize: (state) => ({
        // Only persist user's bookings, not current booking flow
        myBookings: state.myBookings
      })
    }
  )
)