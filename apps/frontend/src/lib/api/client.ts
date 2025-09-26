// Simplified client.ts for Production
import axios from 'axios'

// Simple API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (
  process.env.NODE_ENV === 'production' 
    ? 'https://api.nanjilmepservice.com'  // Replace with your actual production API URL
    : 'http://localhost:3101'
)

console.log('API Base URL:', API_BASE_URL)

export const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://api.nanjilmepservice.com/api' // Use HTTPS in production
    : 'http://localhost:3101/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Simple auth token management
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  
  // For development, provide mock tokens
  if (process.env.NODE_ENV === 'development') {
    const isAdminRoute = window.location.pathname.includes('/admin')
    return isAdminRoute ? 'dev-admin-token' : 'dev-user-token'
  }
  
  // For production, get real token from localStorage or cookies
  return localStorage.getItem('auth_token') || null
}

// Request interceptor - simplified
api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - simplified error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server not responding')
      throw new Error('Server is not responding. Please try again later.')
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - cannot reach server')
      throw new Error('Cannot connect to server. Check your internet connection.')
    }
    
    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response?.data)
      throw new Error('Server error. Please try again later.')
    }
    
    // Handle unauthorized
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      if (window.location.pathname.includes('/admin')) {
        window.location.href = '/admin/login'
      }
    }
    
    throw error
  }
)

export default api