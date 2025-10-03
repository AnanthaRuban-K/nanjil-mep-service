import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://api.nanjilmepservice.com'
    : 'http://localhost:3101')

console.log('🔧 API Base URL:', API_BASE_URL)

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // Important for cookies
})

// Get Clerk session token
const getAuthToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null
  
  try {
    // Get Clerk's window object
    const clerk = (window as any).Clerk
    if (!clerk) return null

    // Get session token from Clerk
    const session = await clerk.session
    if (!session) return null

    const token = await session.getToken()
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
      console.error('⏱️ Request timeout')
      throw new Error('Server not responding. Please try again.')
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('🌐 Network error')
      throw new Error('Cannot connect to server.')
    }

    // Handle 401 - try to refresh token once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const newToken = await getAuthToken()
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      }
      
      // Redirect to login if still unauthorized
      if (typeof window !== 'undefined' && window.location.pathname.includes('/admin')) {
        window.location.href = '/admin/login'
      }
    }

    // Handle 429 - rate limit
    if (error.response?.status === 429) {
      console.error('⚠️ Rate limit exceeded')
      throw new Error('Too many requests. Please wait a moment.')
    }
    
    throw error
  }
)

export default api