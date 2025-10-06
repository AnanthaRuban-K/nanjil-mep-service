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
  timeout: 30000,
  withCredentials: false,
})

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('adminToken') || localStorage.getItem('token')
}

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Token attached to request')
    } else {
      console.warn('No token available')
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout')
      return Promise.reject(new Error('Server not responding. Please try again.'))
    }
    
    if (!error.response) {
      console.error('Network error')
      return Promise.reject(new Error('Cannot connect to server.'))
    }

    if (error.response?.status === 401) {
      console.error('401 Unauthorized - Token invalid or expired')
      
      // Clear tokens
      localStorage.removeItem('adminToken')
      localStorage.removeItem('token')
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login'
      }
    }

    if (error.response?.status === 429) {
      console.error('Rate limit exceeded')
      return Promise.reject(new Error('Too many requests. Please wait.'))
    }
    
    return Promise.reject(error)
  }
)

export default api