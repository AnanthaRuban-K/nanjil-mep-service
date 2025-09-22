// File: src/hooks/index.ts - CORRECTED AND UNIFIED VERSION

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from '@clerk/nextjs'
import apiClient from "@/lib/api/client";

// ---------------- TYPE DEFINITIONS ----------------
export interface ContactInfo {
  name: string
  phone: string
  address: string
  email?: string
}

export interface Booking {
  id: number
  bookingNumber: string
  serviceType: 'electrical' | 'plumbing'
  priority: 'normal' | 'urgent' | 'emergency'
  description: string
  contactInfo: ContactInfo
  scheduledTime: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  totalCost?: string
  actualCost?: string
  rating?: number
  review?: string
  createdAt?: string
  updatedAt?: string
  completedAt?: string
}

export interface CreateBookingData {
  serviceType: 'electrical' | 'plumbing'
  priority?: 'normal' | 'urgent' | 'emergency'
  description: string
  contactInfo: ContactInfo
  scheduledTime: string
}

export interface BookingResponse {
  success: boolean
  booking: Booking
  message: string
}

export interface BookingsListResponse {
  success?: boolean
  bookings: Booking[]
  count: number
  total?: number
  message?: string
  pagination?: {
    limit: number
    offset: number
    hasMore: boolean
  }
}

export interface Service {
  id: number
  name_en: string
  name_ta: string
  category: 'electrical' | 'plumbing'
  description_en?: string
  description_ta?: string
  baseCost: string
  isActive: string
}

// ---------------- QUERY KEYS ----------------
export const authQueryKeys = {
  all: ["auth"] as const,
  user: () => [...authQueryKeys.all, "user"] as const,
  profile: () => [...authQueryKeys.all, "profile"] as const,
  session: () => [...authQueryKeys.all, "session"] as const,
} as const;

export const adminQueryKeys = {
  all: ["admin"] as const,
  dashboard: () => [...adminQueryKeys.all, "dashboard"] as const,
  stats: () => [...adminQueryKeys.dashboard(), "stats"] as const,
  bookings: () => [...adminQueryKeys.all, "bookings"] as const,
  bookingsList: (params?: Record<string, any>) => [...adminQueryKeys.bookings(), 'list', params] as const,
} as const;

export const bookingQueryKeys = {
  all: ["bookings"] as const,
  lists: () => [...bookingQueryKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) => [
    ...bookingQueryKeys.lists(),
    { filters },
  ] as const,
  details: () => [...bookingQueryKeys.all, "detail"] as const,
  detail: (id: number | string) => [...bookingQueryKeys.details(), id] as const,
  myBookings: () => [...bookingQueryKeys.all, "my"] as const,
} as const;

export const serviceQueryKeys = {
  all: ["services"] as const,
  lists: () => [...serviceQueryKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) => [
    ...serviceQueryKeys.lists(),
    { filters },
  ] as const,
  details: () => [...serviceQueryKeys.all, "detail"] as const,
  detail: (id: number | string) => [...serviceQueryKeys.details(), id] as const,
  available: () => [...serviceQueryKeys.all, "available"] as const,
} as const;

// ---------------- PARAMETER INTERFACES ----------------
interface BookingParams {
  limit?: number;
  offset?: number;
  status?: string;
  serviceType?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface CancelBookingData {
  bookingId: string;
  reason?: string;
}

interface FeedbackData {
  bookingId: string;
  rating: number;
  review?: string;
}

// ---------------- BOOKING HOOKS ----------------
export function useBookings(params?: BookingParams) {
  return useQuery<BookingsListResponse>({
    queryKey: bookingQueryKeys.list(params),
    queryFn: async (): Promise<BookingsListResponse> => {
      try {
        console.log('📋 Fetching bookings with params:', params);
        const res = await apiClient.get("/api/bookings", { params });
        console.log('✅ Bookings response:', res.data);
        return res.data;
      } catch (error) {
        console.error('❌ Error fetching bookings:', error);
        throw error;
      }
    },
    staleTime: 30000,
    retry: 3,
    refetchOnWindowFocus: false,
  });
}

export function useBooking(id: string | number) {
  return useQuery<Booking>({
    queryKey: bookingQueryKeys.detail(id),
    queryFn: async (): Promise<Booking> => {
      try {
        const res = await apiClient.get(`/api/bookings/${id}`);
        return res.data.booking;
      } catch (error) {
        console.error(`❌ Error fetching booking ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 60000,
    retry: 3,
  });
}

export function useMyBookings() {
  const { user, isLoaded, isSignedIn } = useUser();

  return useQuery<Booking[]>({
    queryKey: bookingQueryKeys.myBookings(),
    queryFn: async (): Promise<Booking[]> => {
      if (!isLoaded) {
        throw new Error('Clerk is still loading');
      }

      try {
        // Build params and headers based on Clerk user data
        const params: Record<string, string> = {};
        const headers: Record<string, string> = {};

        if (isSignedIn && user) {
          if (user.phoneNumbers[0]?.phoneNumber) {
            params.phone = user.phoneNumbers[0].phoneNumber;
            headers['user-phone'] = user.phoneNumbers[0].phoneNumber;
          }
          if (user.emailAddresses[0]?.emailAddress) {
            params.email = user.emailAddresses[0].emailAddress;
            headers['user-email'] = user.emailAddresses[0].emailAddress;
          }
          if (user.id) {
            params.userId = user.id;
            headers['user-id'] = user.id;
          }
        }

        console.log('👤 Fetching my bookings with params:', params);
        const res = await apiClient.get("/api/bookings/my", { 
          params,
          headers 
        });
        
        return res.data.bookings || [];
      } catch (error: any) {
        // Handle 400 errors gracefully (user not authenticated)
        if (error.response?.status === 400) {
          console.log('ℹ️ User not authenticated, returning empty array');
          return [];
        }
        console.error('❌ Error fetching my bookings:', error);
        throw error;
      }
    },
    enabled: isLoaded,
    staleTime: 30000,
    retry: (failureCount, error) => {
      // Don't retry 400 errors
      if ((error as any)?.response?.status === 400) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  
  return useMutation<BookingResponse, Error, CreateBookingData>({
    mutationFn: async (data: CreateBookingData): Promise<BookingResponse> => {
      try {
        // Debug: Log the data being sent
        console.log('📤 Sending booking data:', JSON.stringify(data, null, 2));
        console.log('📋 Field validation check:');
        console.log('serviceType:', data.serviceType, typeof data.serviceType);
        console.log('description:', data.description, typeof data.description);
        console.log('contactInfo:', data.contactInfo, typeof data.contactInfo);
        console.log('scheduledTime:', data.scheduledTime, typeof data.scheduledTime);
        
        if (data.contactInfo) {
          console.log('contactInfo.name:', data.contactInfo.name, typeof data.contactInfo.name);
          console.log('contactInfo.phone:', data.contactInfo.phone, typeof data.contactInfo.phone);
          console.log('contactInfo.address:', data.contactInfo.address, typeof data.contactInfo.address);
        }
        
        // Temporarily remove validation to test
        /* 
        if (!data.serviceType || !data.description || !data.contactInfo || !data.scheduledTime) {
          throw new Error('Missing required fields');
        }
        
        if (!data.contactInfo.name || !data.contactInfo.phone || !data.contactInfo.address) {
          throw new Error('Complete contact information required');
        }
        */
        
        const res = await apiClient.post("/api/bookings", data);
        console.log('✅ Booking creation response:', res.data);
        return res.data;
      } catch (error: any) {
        // Debug: Log the full error response
        console.error('❌ Full error response:', error.response?.data);
        console.error('❌ Error status:', error.response?.status);
        console.error('❌ Error message:', error.message);
        throw error;
      }
    },
    onSuccess: (response) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.myBookings() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.bookings() });
      
      // Add new booking to cache
      if (response.booking) {
        queryClient.setQueryData(
          bookingQueryKeys.detail(response.booking.id),
          response.booking
        );
      }
      
      console.log('✅ Booking created successfully:', response.booking?.bookingNumber);
    },
    onError: (error) => {
      console.error('❌ Failed to create booking:', error);
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  
  return useMutation<BookingResponse, Error, CancelBookingData>({
    mutationFn: async (data: CancelBookingData): Promise<BookingResponse> => {
      try {
        const res = await apiClient.put(`/api/bookings/${data.bookingId}/cancel`, {
          reason: data.reason,
        });
        return res.data;
      } catch (error) {
        console.error('❌ Error cancelling booking:', error);
        throw error;
      }
    },
    onSuccess: (response, variables) => {
      // Update the booking in cache
      if (response.booking) {
        queryClient.setQueryData(
          bookingQueryKeys.detail(variables.bookingId),
          response.booking
        );
      }
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.myBookings() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.bookings() });
      
      console.log('✅ Booking cancelled successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to cancel booking:', error);
    },
  });
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient();
  
  return useMutation<BookingResponse, Error, FeedbackData>({
    mutationFn: async (data: FeedbackData): Promise<BookingResponse> => {
      try {
        const res = await apiClient.post(`/api/bookings/${data.bookingId}/feedback`, {
          rating: data.rating,
          review: data.review,
        });
        return res.data;
      } catch (error) {
        console.error('❌ Error submitting feedback:', error);
        throw error;
      }
    },
    onSuccess: (response, variables) => {
      // Update the booking in cache
      if (response.booking) {
        queryClient.setQueryData(
          bookingQueryKeys.detail(variables.bookingId),
          response.booking
        );
      }
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.myBookings() });
      
      console.log('✅ Feedback submitted successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to submit feedback:', error);
    },
  });
}

// ---------------- SERVICE HOOKS ----------------
export function useServices(category?: "electrical" | "plumbing") {
  return useQuery<Service[]>({
    queryKey: serviceQueryKeys.list({ category }),
    queryFn: async (): Promise<Service[]> => {
      try {
        const res = await apiClient.get("/api/services", { 
          params: category ? { category } : {} 
        });
        return res.data.services || res.data;
      } catch (error) {
        console.error('❌ Error fetching services:', error);
        throw error;
      }
    },
    staleTime: 300000, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  });
}

export function useService(id: string | number) {
  return useQuery<Service>({
    queryKey: serviceQueryKeys.detail(id),
    queryFn: async (): Promise<Service> => {
      try {
        const res = await apiClient.get(`/api/services/${id}`);
        return res.data.service || res.data;
      } catch (error) {
        console.error(`❌ Error fetching service ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 300000,
    retry: 3,
  });
}

// ---------------- ADMIN HOOKS ----------------
export function useAdminDashboardStats() {
  return useQuery({
    queryKey: adminQueryKeys.stats(),
    queryFn: async () => {
      try {
        const res = await apiClient.get("/api/admin/dashboard");
        return res.data;
      } catch (error) {
        console.error('❌ Error fetching admin dashboard stats:', error);
        throw error;
      }
    },
    refetchInterval: 30000,
    staleTime: 25000,
    retry: 3,
  });
}

export function useAdminBookings(params?: BookingParams) {
  return useQuery<BookingsListResponse>({
    queryKey: adminQueryKeys.bookingsList(params),
    queryFn: async (): Promise<BookingsListResponse> => {
      try {
        const res = await apiClient.get("/api/admin/bookings", { params });
        return res.data;
      } catch (error) {
        console.error('❌ Error fetching admin bookings:', error);
        throw error;
      }
    },
    refetchInterval: 30000,
    staleTime: 25000,
    retry: 3,
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bookingId, status, data }: { 
      bookingId: string; 
      status: string; 
      data?: Record<string, any> 
    }) => {
      try {
        const res = await apiClient.put(`/api/bookings/${bookingId}/status`, {
          status,
          ...data,
        });
        return res.data;
      } catch (error) {
        console.error('❌ Error updating booking status:', error);
        throw error;
      }
    },
    onSuccess: (response, variables) => {
      // Update the booking in cache
      if (response.booking) {
        queryClient.setQueryData(
          bookingQueryKeys.detail(variables.bookingId),
          response.booking
        );
      }
      
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.myBookings() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.bookings() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats() });
      
      console.log('✅ Booking status updated successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to update booking status:', error);
    },
  });
}

// ---------------- AUTH HOOKS ----------------
export function useUserProfile() {
  return useQuery({
    queryKey: authQueryKeys.profile(),
    queryFn: async () => {
      try {
        const res = await apiClient.get("/api/auth/profile");
        return res.data;
      } catch (error) {
        console.error('❌ Error fetching user profile:', error);
        throw error;
      }
    },
    staleTime: 300000,
    retry: 3,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Record<string, any>) => {
      try {
        const res = await apiClient.put("/api/auth/profile", data);
        return res.data;
      } catch (error) {
        console.error('❌ Error updating user profile:', error);
        throw error;
      }
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authQueryKeys.profile(), updatedUser);
      console.log('✅ User profile updated successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to update user profile:', error);
    },
  });
}

// ---------------- UTILITY HOOKS ----------------
export function useBookingOperations() {
  const createMutation = useCreateBooking();
  const cancelMutation = useCancelBooking();
  const feedbackMutation = useSubmitFeedback();
  const updateStatusMutation = useUpdateBookingStatus();

  return {
    // Mutation functions
    createBooking: createMutation.mutateAsync,
    cancelBooking: cancelMutation.mutateAsync,
    submitFeedback: feedbackMutation.mutateAsync,
    updateBookingStatus: updateStatusMutation.mutateAsync,
    
    // Loading states
    isCreating: createMutation.isPending,
    isCancelling: cancelMutation.isPending,
    isSubmittingFeedback: feedbackMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    
    // Error states
    createError: createMutation.error,
    cancelError: cancelMutation.error,
    feedbackError: feedbackMutation.error,
    updateStatusError: updateStatusMutation.error,
    
    // Success states
    createSuccess: createMutation.isSuccess,
    cancelSuccess: cancelMutation.isSuccess,
    feedbackSuccess: feedbackMutation.isSuccess,
    updateStatusSuccess: updateStatusMutation.isSuccess,
    
    // Reset functions
    resetCreate: createMutation.reset,
    resetCancel: cancelMutation.reset,
    resetFeedback: feedbackMutation.reset,
    resetUpdateStatus: updateStatusMutation.reset,
  };
}

// User context hook
export function useUserContext() {
  const { user, isLoaded, isSignedIn } = useUser();
  
  const userInfo = isSignedIn && user ? {
    id: user.id,
    name: user.firstName || user.fullName || 'User',
    email: user.emailAddresses[0]?.emailAddress,
    phone: user.phoneNumbers[0]?.phoneNumber,
    isAdmin: user.publicMetadata?.role === 'admin'
  } : null;

  return {
    user: userInfo,
    isLoaded,
    isSignedIn,
    isAdmin: userInfo?.isAdmin || false
  };
}