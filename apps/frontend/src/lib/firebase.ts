import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null

export const requestNotificationPermission = async () => {
  try {
    console.log('Requesting notification permission...')
    const permission = await Notification.requestPermission()
    console.log('Permission:', permission)
    
    if (permission === 'granted' && messaging) {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      })
      console.log('FCM Token:', token) // This is the real token
      return token
    }
    return null
  } catch (error) {
    console.error('FCM Error:', error)
    return null
  }
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        resolve(payload)
      })
    }
  })