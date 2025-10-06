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

const getAuthToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null
  
  try {
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

api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('✅ Token attached to request')
    } else {
      console.warn('⚠️ No token available')
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout')
      return Promise.reject(new Error('Server not responding. Please try again.'))
    }
    
    if (!error.response) {
      console.error('Network error')
      return Promise.reject(new Error('Cannot connect to server.'))
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const newToken = await getAuthToken()
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      }
      
      // REDIRECT DISABLED - JUST LOG THE ERROR
      console.error('❌ 401 Unauthorized - No valid token')
    }

    if (error.response?.status === 429) {
      console.error('Rate limit exceeded')
      return Promise.reject(new Error('Too many requests. Please wait.'))
    }
    
    return Promise.reject(error)
  }
)

export default api