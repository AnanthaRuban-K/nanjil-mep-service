importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "AIzaSyC0D4ZQBIZzUN8rIwYNLN5tjKFKwzdKzh8",
  authDomain: "nanjil-mep-abca4.firebaseapp.com",
  projectId: "nanjil-mep-abca4",
  storageBucket: "nanjil-mep-abca4.firebasestorage.app",
  messagingSenderId: "28150420876",
  appId: "1:28150420876:web:8cc6f2fe36ddd7e971b2a9"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('Background Message:', payload)
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})