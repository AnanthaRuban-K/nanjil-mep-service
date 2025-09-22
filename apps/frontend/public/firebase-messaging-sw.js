importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyC0D4ZQBIZzUN8rIwYNLN5tjKFKwzdKzh8",
  authDomain: "nanjil-mep-abca4.firebaseapp.com",
  projectId: "nanjil-mep-abca4",
  storageBucket: "nanjil-mep-abca4.firebasestorage.app",
  messagingSenderId: "28150420876",
  appId: "1:28150420876:web:8cc6f2fe36ddd7e971b2a9",
  measurementId: "G-5158FXRB6W"
})

const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload)

  const notificationTitle = payload.notification?.title || 'New Booking'
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new service request',
    icon: '/icons/notification-icon.png',
    badge: '/icons/badge-icon.png',
    tag: payload.data?.bookingId || 'general',
    requireInteraction: payload.data?.priority === 'emergency',
    actions: [
      {
        action: 'view',
        title: '👀 View Booking'
      },
      {
        action: 'dismiss',
        title: '❌ Dismiss'
      }
    ],
    data: payload.data
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'view') {
    const bookingId = event.notification.data?.bookingId
    const url = bookingId ? `/admin/bookings/${bookingId}` : '/admin/dashboard'
    
    event.waitUntil(
      clients.openWindow(url)
    )
  }
})