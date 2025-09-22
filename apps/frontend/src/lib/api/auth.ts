import { api } from './client'

export interface User {
  id: string
  name?: string
  email?: string
  phone?: string
  role?: string
}

export interface AuthResponse {
  success: boolean
  user: User
  token?: string
  error?: string
}

// Get user profile
export async function getUserProfile(): Promise<User> {
  console.log('👤 Fetching user profile...')
  
  try {
    const response = await api.get<{ success: boolean; user: User }>('/api/auth/profile')
    
    if (!response.data.success) {
      throw new Error('Failed to fetch user profile')
    }
    
    console.log('✅ User profile fetched successfully')
    return response.data.user
  } catch (error) {
    console.error('❌ Error fetching user profile:', error)
    throw new Error('Failed to load user profile')
  }
}

// Update user profile
export async function updateUserProfile(userData: Partial<User>): Promise<User> {
  console.log('📝 Updating user profile...')
  
  try {
    const response = await api.put<{ success: boolean; user: User }>('/api/auth/profile', userData)
    
    if (!response.data.success) {
      throw new Error('Failed to update user profile')
    }
    
    console.log('✅ User profile updated successfully')
    return response.data.user
  } catch (error: any) {
    console.error('❌ Error updating user profile:', error)
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    }
    
    throw new Error('Failed to update profile')
  }
}