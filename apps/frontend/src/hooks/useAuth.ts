// File: src/hooks/useAuth.ts - Enhanced Authentication Hook (ADD TO YOUR EXISTING)
import { useUser, useClerk } from '@clerk/nextjs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'admin' | 'customer' | 'technician'
  isActive: boolean
  createdAt?: string
}

// ✅ ADD THIS - Missing authQueryKeys export (This was causing the error)
export const authQueryKeys = {
  all: ['auth'] as const,
  user: () => [...authQueryKeys.all, 'user'] as const,
  profile: () => [...authQueryKeys.all, 'profile'] as const,
  session: () => [...authQueryKeys.all, 'session'] as const,
} as const

// Enhanced Auth Hook (YOUR EXISTING CODE - KEEP AS IS)
export function useAuth() {
  const { user, isSignedIn, isLoaded } = useUser()
  const { signOut, openSignIn } = useClerk()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Determine user role and permissions
  const getUserRole = (): 'admin' | 'customer' | 'technician' | null => {
    if (!user) return null
    const role = user.publicMetadata?.role as string
    return role as 'admin' | 'customer' | 'technician' || 'customer'
  }

  const isAdmin = () => {
    const role = getUserRole()
    return role === 'admin'
  }

  const isCustomer = () => {
    const role = getUserRole()
    return role === 'customer'
  }

  const isTechnician = () => {
    const role = getUserRole()
    return role === 'technician'
  }

  // Enhanced logout with proper cleanup
  const logout = async (redirectTo = '/') => {
    try {
      setIsLoggingOut(true)
      
      // Clear all cached data
      queryClient.clear()
      
      // Clear session storage
      sessionStorage.clear()
      localStorage.removeItem('bookingFlow')
      
      // Sign out from Clerk
      await signOut()
      
      // Force redirect
      window.location.href = redirectTo
      
    } catch (error) {
      console.error('Logout failed:', error)
      // Fallback logout
      window.location.href = '/api/auth/logout'
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Role-based redirects
  const redirectBasedOnRole = () => {
    if (!user || !isLoaded) return
    
    const role = getUserRole()
    
    switch (role) {
      case 'admin':
        router.push('/admin/dashboard')
        break
      case 'technician':
        router.push('/technician/dashboard')
        break
      case 'customer':
      default:
        router.push('/')
        break
    }
  }

  // Convert Clerk user to app user format
  const userData: User | null = user ? {
    id: user.id,
    name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 
          user.fullName || 
          user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User',
    email: user.emailAddresses[0]?.emailAddress || '',
    phone: user.phoneNumbers[0]?.phoneNumber,
    role: getUserRole() || 'customer',
    isActive: true,
    createdAt: user.createdAt?.toISOString()
  } : null

  return {
    // User state
    user: userData,
    clerkUser: user,
    isSignedIn,
    isLoaded,
    isLoading: !isLoaded,
    isLoggingOut,
    
    // Role checks
    isAdmin: isAdmin(),
    isCustomer: isCustomer(),
    isTechnician: isTechnician(),
    role: getUserRole(),
    
    // Actions
    logout,
    login: openSignIn,
    redirectBasedOnRole,
    
    // Permissions
    canAccessAdmin: isAdmin(),
    canBookServices: isCustomer() || isAdmin(),
    canManageBookings: isAdmin() || isTechnician(),
  }
}

// Role Guard Hook (YOUR EXISTING CODE - KEEP AS IS)
export function useRoleGuard(requiredRoles: ('admin' | 'customer' | 'technician')[]) {
  const { user, isLoaded, role } = useAuth()
  const router = useRouter()

  const hasAccess = () => {
    if (!user || !role) return false
    return requiredRoles.includes(role)
  }

  const checkAccess = () => {
    if (!isLoaded) return false
    
    if (!user) {
      router.push('/sign-in')
      return false
    }

    if (!hasAccess()) {
      router.push('/')
      return false
    }

    return true
  }

  return {
    hasAccess: hasAccess(),
    checkAccess,
    isLoading: !isLoaded
  }
}

// ✅ ADD THESE - Additional hooks that might be needed by your other components
export function useUserProfile() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: authQueryKeys.profile(),
    queryFn: async () => {
      // Mock implementation - replace with actual API call
      console.log('📝 Mock: Fetching user profile...')
      return user
    },
    enabled: !!user,
    staleTime: 300000, // 5 minutes
    retry: 3,
  })
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      // Mock implementation - replace with actual API call
      console.log('🔄 Mock: Updating user profile...', userData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      return userData
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authQueryKeys.profile(), updatedUser)
      console.log('✅ User profile updated successfully')
    },
    onError: (error) => {
      console.error('❌ Failed to update profile:', error)
    },
  })
}

export function useLogout() {
  const { logout } = useAuth()

  return useMutation({
    mutationFn: async (redirectTo?: string) => {
      await logout(redirectTo)
    },
    onSuccess: () => {
      console.log('✅ User logged out successfully')
    },
    onError: (error) => {
      console.error('❌ Logout failed:', error)
    },
  })
}