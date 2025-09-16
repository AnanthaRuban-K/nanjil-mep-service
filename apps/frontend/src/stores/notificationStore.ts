import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Notification {
  id: number
  type: 'new_booking' | 'booking_updated' | 'emergency_booking'
  title: string
  message: string
  bookingId: number
  bookingNumber: string
  priority: 'normal' | 'urgent' | 'emergency'
  isRead: boolean
  readAt?: string
  createdAt: string
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  
  // Actions
  fetchNotifications: () => Promise<void>
  fetchUnreadNotifications: () => Promise<void>
  markAsRead: (id: number) => Promise<void>
  markAllAsRead: () => Promise<void>
  setLoading: (loading: boolean) => void
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3101"

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,

      fetchNotifications: async () => {
        try {
          set({ isLoading: true })
          
          const response = await fetch(`${API_BASE}/api/notifications`)
          if (!response.ok) throw new Error('Failed to fetch notifications')
          
          const data = await response.json()
          set({ 
            notifications: data.notifications || [],
            unreadCount: data.notifications?.filter((n: Notification) => !n.isRead).length || 0
          })
        } catch (error) {
          console.error('Fetch notifications error:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      fetchUnreadNotifications: async () => {
        try {
          const response = await fetch(`${API_BASE}/api/notifications/unread`)
          if (!response.ok) throw new Error('Failed to fetch unread notifications')
          
          const data = await response.json()
          set({ 
            unreadCount: data.count || 0
          })
        } catch (error) {
          console.error('Fetch unread notifications error:', error)
        }
      },

      markAsRead: async (id: number) => {
        try {
          const response = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
            method: 'PUT'
          })
          if (!response.ok) throw new Error('Failed to mark as read')
          
          // Update local state
          set((state) => ({
            notifications: state.notifications.map(n => 
              n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1)
          }))
        } catch (error) {
          console.error('Mark as read error:', error)
        }
      },

      markAllAsRead: async () => {
        try {
          const response = await fetch(`${API_BASE}/api/notifications/mark-all-read`, {
            method: 'PUT'
          })
          if (!response.ok) throw new Error('Failed to mark all as read')
          
          // Update local state
          set((state) => ({
            notifications: state.notifications.map(n => ({ 
              ...n, 
              isRead: true, 
              readAt: new Date().toISOString() 
            })),
            unreadCount: 0
          }))
        } catch (error) {
          console.error('Mark all as read error:', error)
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      }
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
        notifications: state.notifications.slice(0, 10), // Only persist latest 10
        unreadCount: state.unreadCount
      })
    }
  )
)