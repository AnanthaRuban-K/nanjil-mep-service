import { api } from './client'

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

export interface ServicesResponse {
  success: boolean
  services: Service[]
  error?: string
}

// Get all services
export async function getServices(category?: 'electrical' | 'plumbing'): Promise<Service[]> {
  console.log('🔧 Fetching services...', category ? `category: ${category}` : 'all')
  
  try {
    const response = await api.get<ServicesResponse>('/api/services', {
      params: category ? { category } : {}
    })
    
    console.log('✅ Services fetched successfully')
    return response.data.services
  } catch (error) {
    console.error('❌ Error fetching services:', error)
    throw new Error('Failed to fetch services')
  }
}

// Get service by ID
export async function getService(id: number): Promise<Service> {
  console.log(`🔍 Fetching service ${id}...`)
  
  try {
    const response = await api.get<{ success: boolean; service: Service }>(`/api/services/${id}`)
    
    if (!response.data.success) {
      throw new Error('Service not found')
    }
    
    console.log(`✅ Service ${id} fetched successfully`)
    return response.data.service
  } catch (error) {
    console.error(`❌ Error fetching service ${id}:`, error)
    throw new Error('Failed to fetch service')
  }
}