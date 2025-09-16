// src/hooks/useAdmin.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getDashboardStats, 
  getAdminBookings, 
  updateBookingStatus 
} from '@/lib/api/admin';
import { 
  Booking, 
  DashboardStats, 
  BookingsQueryParams,
  UpdateBookingStatusRequest
} from '@/lib/types/admin';

// Query Keys
export const adminQueryKeys = {
  all: ['admin'] as const,
  dashboardStats: () => [...adminQueryKeys.all, 'dashboard', 'stats'] as const,
  bookings: (params?: BookingsQueryParams) => [...adminQueryKeys.all, 'bookings', params] as const,
  booking: (id: number) => [...adminQueryKeys.all, 'booking', id] as const,
} as const;

/**
 * Hook to fetch dashboard statistics
 */
export function useAdminDashboardStats() {
  return useQuery({
    queryKey: adminQueryKeys.dashboardStats(),
    queryFn: getDashboardStats,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook to fetch admin bookings with optional filters
 */
export function useAdminBookings(params: BookingsQueryParams = {}) {
  return useQuery({
    queryKey: adminQueryKeys.bookings(params),
    queryFn: () => getAdminBookings(params),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    staleTime: 25000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook to update booking status
 */
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      bookingId, 
      statusData 
    }: { 
      bookingId: number; 
      statusData: UpdateBookingStatusRequest 
    }) => {
      return updateBookingStatus(bookingId, statusData);
    },
    
    onMutate: async ({ bookingId, statusData }) => {
      // Cancel any outgoing refetches for bookings
      await queryClient.cancelQueries({ 
        queryKey: adminQueryKeys.all 
      });

      // Snapshot the previous bookings data
      const previousBookings = queryClient.getQueriesData({ 
        queryKey: [...adminQueryKeys.all, 'bookings']
      });

      // Optimistically update all booking queries
      queryClient.setQueriesData<Booking[]>(
        { queryKey: [...adminQueryKeys.all, 'bookings'] },
        (oldBookings) => {
          if (!oldBookings) return oldBookings;
          
          return oldBookings.map(booking => 
            booking.id === bookingId 
              ? { 
                  ...booking, 
                  status: statusData.status as any,
                  updatedAt: new Date().toISOString()
                }
              : booking
          );
        }
      );

      return { previousBookings };
    },

    onError: (error, variables, context) => {
      console.error('❌ Failed to update booking status:', error);
      
      // Rollback optimistic updates
      if (context?.previousBookings) {
        context.previousBookings.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSuccess: (data, { bookingId }) => {
      console.log(`✅ Booking ${bookingId} status updated successfully`);
      
      // Invalidate and refetch dashboard stats to get updated counts
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.dashboardStats()
      });
    },

    onSettled: () => {
      // Always refetch bookings after mutation settles
      queryClient.invalidateQueries({
        queryKey: [...adminQueryKeys.all, 'bookings']
      });
    }
  });
}

/**
 * Hook to manually refresh admin data
 */
export function useAdminDataRefresh() {
  const queryClient = useQueryClient();

  const refreshAll = async () => {
    console.log('🔄 Manually refreshing all admin data...');
    
    await queryClient.invalidateQueries({
      queryKey: adminQueryKeys.all
    });
    
    console.log('✅ Admin data refresh completed');
  };

  const refreshBookings = async (params?: BookingsQueryParams) => {
    console.log('🔄 Refreshing bookings data...', params);
    
    await queryClient.invalidateQueries({
      queryKey: adminQueryKeys.bookings(params)
    });
    
    console.log('✅ Bookings data refresh completed');
  };

  const refreshStats = async () => {
    console.log('🔄 Refreshing dashboard stats...');
    
    await queryClient.invalidateQueries({
      queryKey: adminQueryKeys.dashboardStats()
    });
    
    console.log('✅ Dashboard stats refresh completed');
  };

  return {
    refreshAll,
    refreshBookings,
    refreshStats
  };
}