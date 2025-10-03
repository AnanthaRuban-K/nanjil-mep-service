import admin from 'firebase-admin'
import * as path from 'path'
import * as fs from 'fs'

let firebaseApp: admin.app.App

try {
  // Load service account from file
  const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json')
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath)
    
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'nanjil-mep-abca4'
    })
    
    console.log('Firebase Admin initialized successfully')
  } else {
    throw new Error('Service account key file not found')
  }
} catch (error) {
  console.error('Firebase initialization error:', error)
  throw error
}

export const messaging = admin.messaging(firebaseApp)
export default admin