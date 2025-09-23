import * as admin from 'firebase-admin'
import { db } from "../db/index"
import { adminTokens, notifications } from "../db/schema"
import { eq } from "drizzle-orm"

export interface NotificationPayload {
  type: 'new_booking' | 'booking_updated' | 'emergency_booking' | 'customer_message'
  title: string
  message: string
  bookingId?: number
  bookingNumber?: string
  customerId?: number
  priority: 'normal' | 'urgent' | 'emergency'
  data?: any
}

export class NotificationService {
  constructor() {
    this.initializeFirebase()
  }

  private initializeFirebase() {
    // Only initialize if not already initialized
    if (!admin.apps.length) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        })
        console.log('Firebase Admin initialized successfully')
      } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error)
      }
    }
  }

  // Add admin FCM token
  async addAdminToken(token: string) {
    try {
      // Check if token already exists
      const existing = await db.select()
        .from(adminTokens)
        .where(eq(adminTokens.token, token))
        .limit(1)

      if (existing.length === 0) {
        await db.insert(adminTokens).values({
          token,
          isActive: true,
          createdAt: new Date(),
        })
        console.log('Admin token saved to database')
      }
    } catch (error) {
      console.error('Error saving token to database:', error)
    }
  }

  // Send notification to all admin tokens
  async sendToAllAdmins(notification: NotificationPayload) {
    try {
      const tokens = await this.getActiveAdminTokens()
      
      if (tokens.length === 0) {
        console.log('No admin tokens found')
        // Still save notification to database for history
        await this.saveNotificationToDatabase(notification)
        return
      }

      const message = {
        notification: {
          title: notification.title,
          body: notification.message,
        },
        data: {
          type: notification.type,
          priority: notification.priority,
          bookingId: notification.bookingId?.toString() || '',
          bookingNumber: notification.bookingNumber || '',
          customerId: notification.customerId?.toString() || '',
          click_action: 'FLUTTER_NOTIFICATION_CLICK', // For mobile apps
        },
      }

      // Send to each token individually (Firebase Admin SDK way)
      const promises = tokens.map(async (token) => {
        try {
          const response = await admin.messaging().send({
            ...message,
            token: token,
          })
          console.log('Notification sent successfully to token:', token.substring(0, 20) + '...')
          return { success: true, token }
        } catch (error) {
          console.error('Failed to send to token:', token.substring(0, 20) + '...', error)
          // Mark token as inactive if it's invalid
          await this.markTokenInactive(token)
          return { success: false, token, error }
        }
      })

      const results = await Promise.allSettled(promises)
      const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length
      
      console.log(`Push notifications: ${successCount}/${tokens.length} successful`)

      // Save notification to database
      await this.saveNotificationToDatabase(notification)

      return { successCount, totalCount: tokens.length }
    } catch (error) {
      console.error('Error sending push notifications:', error)
      // Don't throw error - still save to database
      await this.saveNotificationToDatabase(notification)
      return { successCount: 0, totalCount: 0 }
    }
  }

  private async getActiveAdminTokens(): Promise<string[]> {
    try {
      const result = await db.select({ token: adminTokens.token })
        .from(adminTokens)
        .where(eq(adminTokens.isActive, true))
      
      return result.map(r => r.token)
    } catch (error) {
      console.error('Error getting admin tokens:', error)
      return []
    }
  }

  private async markTokenInactive(token: string) {
    try {
      await db.update(adminTokens)
        .set({ isActive: false })
        .where(eq(adminTokens.token, token))
    } catch (error) {
      console.error('Error marking token inactive:', error)
    }
  }

  private async saveNotificationToDatabase(notification: NotificationPayload) {
    try {
      await db.insert(notifications).values({
        type: notification.type,
        title: notification.title,
        message: notification.message,
        bookingId: notification.bookingId || null,
        priority: notification.priority,
        isRead: 'false',
        createdAt: new Date(),
      })
    } catch (error) {
      console.error('Error saving notification to database:', error)
    }
  }

  // Simplified notification methods
  async notifyNewBooking(booking: any, customer: any) {
    const urgencyEmoji = this.getUrgencyEmoji(booking.priority)
    const serviceEmoji = booking.serviceType === 'electrical' ? '⚡' : '🔧'
    
    return this.sendToAllAdmins({
      type: 'new_booking',
      title: `${urgencyEmoji} New Service Booking`,
      message: `${serviceEmoji} ${customer.name} booked ${booking.serviceType} service - ${booking.priority.toUpperCase()}`,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      customerId: customer.id,
      priority: booking.priority,
      data: {
        customerName: customer.name,
        customerPhone: customer.phone,
        serviceType: booking.serviceType,
        address: booking.address,
      }
    })
  }

  async notifyEmergencyBooking(booking: any, customer: any) {
    return this.sendToAllAdmins({
      type: 'emergency_booking',
      title: '🚨 EMERGENCY SERVICE REQUEST',
      message: `⚡ URGENT: ${customer.name} needs immediate ${booking.serviceType} service!`,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      customerId: customer.id,
      priority: 'emergency',
      data: {
        customerName: customer.name,
        customerPhone: customer.phone,
        serviceType: booking.serviceType,
        address: booking.address,
        problem: booking.problemDescription,
      }
    })
  }

  private getUrgencyEmoji(priority: string): string {
    switch (priority) {
      case 'emergency': return '🚨'
      case 'urgent': return '⚠️'
      default: return '📋'
    }
  }

  // Test notification method
  async testNotification() {
    return this.sendToAllAdmins({
      type: 'new_booking',
      title: '🧪 Test Notification',
      message: 'This is a test notification for admin dashboard',
      priority: 'normal'
    })
  }
}

// Simple usage example:
/*
const notificationService = new NotificationService()

// Register admin token
await notificationService.addAdminToken('your-fcm-token-here')

// Send notification
await notificationService.notifyNewBooking(booking, customer)

// Test notification
await notificationService.testNotification()
*/