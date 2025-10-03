'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { requestNotificationPermission, onMessageListener } from '@/lib/firebase'
import { api } from '@/lib/api/client'
import toast from 'react-hot-toast'

export default function NotificationHandler() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && user) {
      setupNotifications()
    }
  }, [user, isLoaded])

  const setupNotifications = async () => {
    try {
      const fcmToken = await requestNotificationPermission()
      
      console.log('FCM Token:', fcmToken)
      console.log('User ID:', user?.id)
      
      if (!fcmToken) {
        console.log('No FCM token received')
        return
      }

      if (!user?.id) {
        console.log('No user ID available')
        return
      }

      const response = await api.post('/api/notifications/register-token', { 
        token: fcmToken,
        userId: user.id,
        deviceType: 'web'
      })
      
      console.log('Token registered:', response.data)
      toast.success('Notifications enabled')
      
      onMessageListener()
        .then((payload: any) => {
          toast.success(payload.notification.title)
        })
        .catch((err) => console.log('Listener error:', err))
        
    } catch (error) {
      console.error('Setup notifications error:', error)
    }
  }

  return null
}