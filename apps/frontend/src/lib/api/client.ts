import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://api.nanjilmepservice.com'
    : 'http://localhost:3101')

console.log('API Base URL:', API_BASE_URL)

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased from 10s to 30s
  withCredentials: false, // Changed - CORS doesn't need credentials for JWT
})

const getAuthToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null
  
  try {
    // Wait for Clerk to be ready
    const waitForClerk = () => new Promise<any>((resolve) => {
      const checkClerk = () => {
        const clerk = (window as any).Clerk
        if (clerk?.loaded) {
          resolve(clerk)
        } else {
          setTimeout(checkClerk, 100)
        }
      }
      checkClerk()
    })

    const clerk = await waitForClerk()
    
    if (!clerk?.session) {
      console.warn('No active Clerk session')
      return null
    }

    const token = await clerk.session.getToken()
    return token
  } catch (error) {
    console.error('Failed to get auth token:', error)
    return null
  }
}

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Token attached to request') // Debug log
    } else {
      console.warn('No token available') // Debug log
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout')
      throw new Error('Server not responding. Please try again.')
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - cannot reach server')
      throw new Error('Cannot connect to server. Check your internet connection.')
    }

    // Handle 401 - try to refresh token once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      // Try getting token again
      const newToken = await getAuthToken()
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      }
      
      // If still no token and on admin page, redirect to login
      if (typeof window !== 'undefined') {
        const path = window.location.pathname
        if (path.startsWith('/admin') && path !== '/admin/login') {
          console.error('Unauthorized - redirecting to login')
          window.location.href = '/admin/login'
        }
      }
    }

    // Handle 429 - rate limit
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded')
      throw new Error('Too many requests. Please wait a moment.')
    }
    
    return Promise.reject(error)
  }
)

export default api