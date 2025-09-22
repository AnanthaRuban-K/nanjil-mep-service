// Updated client.ts - Production Ready Solution
import axios from 'axios'

// Environment configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Function to get auth token with production logic
const getAuthToken = (): string | null => {
  // PRODUCTION: Check if we're in development mode
  if (process.env.NODE_ENV === 'development') {
    // For development, check if we need admin access
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
    
    if (currentPath.includes('/admin')) {
      // Use admin token for admin routes
      console.log('Using admin token for admin routes')
      return 'mock-admin-token'
    } else {
      // Use customer token for regular routes
      console.log('Using customer token for regular routes')
      return 'mock-jwt-token'
    }
  }

  // PRODUCTION: Real token retrieval logic
  if (typeof window !== 'undefined') {
    // 1. Check localStorage first
    const localToken = localStorage.getItem('auth_token')
    if (localToken) return localToken
    
    // 2. Check for Clerk session token
    const clerkToken = localStorage.getItem('__clerk_client')
    if (clerkToken) {
      try {
        const parsed = JSON.parse(clerkToken)
        return parsed.sessions?.[0]?.id || null
      } catch (e) {
        console.log('Could not parse Clerk token')
      }
    }
    
    // 3. Check for other auth systems (add your own here)
    // const customToken = getCookieValue('auth-token')
    // if (customToken) return customToken
  }
  
  return null
}

// Function to set auth token
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}

// Function to clear auth token
export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
}

// PRODUCTION: Login function for admin
export const adminLogin = async (email: string = 'admin@nanjilmep.com', password: string = 'admin123') => {
  try {
    // In development, just set the token
    if (process.env.NODE_ENV === 'development') {
      setAuthToken('mock-admin-token')
      return true
    }
    
    // In production, make actual login API call
    const response = await api.post('/api/auth/login', { email, password })
    
    if (response.data.success && response.data.token) {
      setAuthToken(response.data.token)
      return true
    }
    
    return false
  } catch (error) {
    console.error('Admin login failed:', error)
    return false
  }
}

// Request interceptor for logging and auth
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    
    // Add auth token if available
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('✓ Auth token added to request:', token.substring(0, 20) + '...')
    } else {
      console.log('⚠ No auth token found')
    }
    
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    })
    
    // Handle common error cases
    if (error.response?.status === 401) {
      console.warn('🔒 Unauthorized - clearing auth token')
      clearAuthToken()
      
      // Only redirect if we're in a browser environment
      if (typeof window !== 'undefined') {
        // For admin routes, redirect to admin login
        if (window.location.pathname.includes('/admin')) {
          setTimeout(() => {
            window.location.href = '/admin/login'
          }, 1000)
        } else {
          // For regular routes, redirect to sign-in
          setTimeout(() => {
            window.location.href = '/sign-in'
          }, 1000)
        }
      }
    }
    
    if (error.response?.status === 403) {
      console.warn('🚫 Forbidden - insufficient permissions')
      
      if (typeof window !== 'undefined') {
        if (window.location.pathname.includes('/admin')) {
          alert('You need admin privileges to access this page.')
          setTimeout(() => {
            window.location.href = '/'
          }, 1000)
        }
      }
    }
    
    if (error.response?.status === 404) {
      console.warn('📭 Resource not found')
    }
    
    if (error.response?.status >= 500) {
      console.error('🔥 Server error occurred')
    }
    
    return Promise.reject(error)
  }
)

// Helper function to test authentication
export const testAuth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/api/admin/dashboard')
    return response.status === 200
  } catch (error) {
    return false
  }
}

export default api