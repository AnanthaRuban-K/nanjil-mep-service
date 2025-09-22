import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getBookings,
  getBooking,
  getMyBookings,
  createBooking,
  cancelBooking,
  submitBookingFeedback,
  type Booking,
  type CreateBookingData
} from '@/lib/api/bookings'

// Query Keys
export const bookingQueryKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...bookingQueryKeys.lists(), filters] as const,
  details: () => [...bookingQueryKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...bookingQueryKeys.details(), id] as const,
  myBookings: () => [...bookingQueryKeys.all, 'my'] as const,
} as const

// Get all bookings
export function useBookings(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: bookingQueryKeys.list(params),
    queryFn: () => getBookings(params),
    staleTime: 30000, // 30 seconds
    retry: 3,
  })
}

// Get specific booking by ID or booking number
export function useBooking(id: string | number) {
  return useQuery({
    queryKey: bookingQueryKeys.detail(id),
    queryFn: () => getBooking(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute
    retry: 3,
  })
}

// Get user's own bookings
export function useMyBookings() {
  return useQuery({
    queryKey: bookingQueryKeys.myBookings(),
    queryFn: getMyBookings,
    staleTime: 30000,
    retry: 3,
  })
}

// Create new booking
export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      // Invalidate and refetch booking lists
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.myBookings() })
      
      // Add the new booking to the cache
      queryClient.setQueryData(
        bookingQueryKeys.detail(data.booking.id),
        data.booking
      )
      
      console.log('✅ Booking created successfully:', data.booking.bookingNumber)
    },
    onError: (error: any) => {
      console.error('❌ Failed to create booking:', error)
    },
  })
}

// Cancel booking
export function useCancelBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason?: string }) =>
      cancelBooking(bookingId, reason),
    onMutate: async ({ bookingId }) => {
      // Optimistically update the booking status
      await queryClient.cancelQueries({ queryKey: bookingQueryKeys.detail(bookingId) })
      
      const previousBooking = queryClient.getQueryData(bookingQueryKeys.detail(bookingId))
      
      queryClient.setQueryData(bookingQueryKeys.detail(bookingId), (old: Booking) => ({
        ...old,
        status: 'cancelled' as const,
        updatedAt: new Date().toISOString(),
      }))

      return { previousBooking }
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousBooking) {
        queryClient.setQueryData(
          bookingQueryKeys.detail(variables.bookingId),
          context.previousBooking
        )
      }
      console.error('❌ Failed to cancel booking:', error)
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.myBookings() })
      
      console.log('✅ Booking cancelled successfully')
    },
  })
}

// Submit booking feedback/rating
export function useSubmitBookingFeedback() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      bookingId, 
      rating, 
      review 
    }: { 
      bookingId: string; 
      rating: number; 
      review?: string 
    }) => submitBookingFeedback(bookingId, rating, review),
    onSuccess: (data, variables) => {
      // Update the booking with the new rating and review
      queryClient.setQueryData(
        bookingQueryKeys.detail(variables.bookingId),
        (old: Booking) => ({
          ...old,
          rating: variables.rating,
          review: variables.review,
          updatedAt: new Date().toISOString(),
        })
      )
      
      // Invalidate lists to ensure they show updated data
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.myBookings() })
      
      console.log('✅ Feedback submitted successfully')
    },
    onError: (error) => {
      console.error('❌ Failed to submit feedback:', error)
    },
  })
}