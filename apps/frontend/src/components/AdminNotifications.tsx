'use client'
import React, { useEffect, useState } from 'react'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { initializeApp } from 'firebase/app'

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export default function AdminNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Request notification permission and get FCM token
    const initializeNotifications = async () => {
      try {
        const permission = await Notification.requestPermission()
        setPermission(permission)

        if (permission === 'granted') {
          const messaging = getMessaging(app)
          
          const currentToken = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
          })

          if (currentToken) {
            setToken(currentToken)
            
            // Register token with backend
            await fetch('/api/admin/register-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token: currentToken }),
            })

            console.log('✅ FCM token registered successfully')
          }

          // Listen for foreground messages
          onMessage(messaging, (payload) => {
            console.log('📱 Foreground message received:', payload)
            
            // Show browser notification
            if (payload.notification) {
              new Notification(payload.notification.title || 'New Notification', {
                body: payload.notification.body,
                icon: '/icons/notification-icon.png',
                badge: '/icons/badge-icon.png',
                tag: payload.data?.bookingId || 'general',
                requireInteraction: payload.data?.priority === 'emergency',
              })
            }

            // Play notification sound for emergency
            if (payload.data?.priority === 'emergency') {
              playNotificationSound()
            }

            // Update notification store
            // You can dispatch to your notification store here
          })
        }
      } catch (error) {
        console.error('❌ Error initializing notifications:', error)
      }
    }

    initializeNotifications()
  }, [])

  const playNotificationSound = () => {
    const audio = new Audio('/sounds/emergency-alert.mp3')
    audio.play().catch(e => console.log('Could not play sound:', e))
  }

  const testNotification = async () => {
    try {
      await fetch('/api/admin/test-notification', {
        method: 'POST',
      })
      console.log('Test notification sent!')
    } catch (error) {
      console.error('Error sending test notification:', error)
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-2">🔔 Admin Notifications</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          Status: <span className={`font-medium ${
            permission === 'granted' ? 'text-green-600' : 'text-red-600'
          }`}>
            {permission === 'granted' ? '✅ Enabled' : '❌ Disabled'}
          </span>
        </div>
        
        {token && (
          <div className="text-xs text-gray-500">
            Token registered: {token.substring(0, 20)}...
          </div>
        )}
      </div>

      {permission !== 'granted' && (
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Enable Notifications
        </button>
      )}

      <button
        onClick={testNotification}
        className="mt-2 ml-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
      >
        Test Notification
      </button>
    </div>
  )
}