import * as admin from 'firebase-admin'
import { db } from "../db/index.js"
import { adminTokens, notifications } from "../db/schema.js"  // Import your schema tables
import { eq, inArray } from "drizzle-orm"  // Import drizzle-orm functions

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
  // Store admin FCM tokens (you can store these in database)
  private adminTokens: string[] = []

  constructor() {
    // Initialize Firebase Admin SDK if not already done
    this.initializeFirebase()
  }

  private initializeFirebase() {
    // Initialize Firebase Admin SDK with your service account
    // Make sure to add FIREBASE_SERVICE_ACCOUNT_KEY to environment variables
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      })
    }
  }

  // Add admin FCM token
  async addAdminToken(token: string) {
    if (!this.adminTokens.includes(token)) {
      this.adminTokens.push(token)
      // Save to database
      await this.saveTokenToDatabase(token)
    }
  }

  private async saveTokenToDatabase(token: string) {
    try {
      // Save FCM token to database (implement based on your schema)
      await db.insert(adminTokens).values({
        token,
        isActive: true,
        createdAt: new Date(),
      })
    } catch (error) {
      console.error('Error saving token to database:', error)
    }
  }

  // Send push notification to all admins
  async sendToAllAdmins(notification: NotificationPayload) {
    try {
      // Get all active admin tokens from database
      const tokens = await this.getActiveAdminTokens()
      
      if (tokens.length === 0) {
        console.log('No admin tokens found')
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
          ...notification.data,
        },
        tokens: tokens,
      }

      const response = await admin.messaging().sendMulticast(message)
      
      console.log('Push notifications sent:', response.successCount, 'successful')
      
      // Handle failed tokens (remove invalid ones)
      if (response.failureCount > 0) {
        await this.handleFailedTokens(response, tokens)
      }

      // Save notification to database
      await this.saveNotificationToDatabase(notification)

      return response
    } catch (error) {
      console.error('Error sending push notifications:', error)
      throw error
    }
  }

  private async getActiveAdminTokens(): Promise<string[]> {
    try {
      // Implement based on your database schema
      const result = await db.select({ token: adminTokens.token })
        .from(adminTokens)
        .where(eq(adminTokens.isActive, true))
      
      return result.map(r => r.token)
    } catch (error) {
      console.error('Error getting admin tokens:', error)
      return []
    }
  }

  private async handleFailedTokens(response: any, tokens: string[]) {
    const failedTokens: string[] = []
    
    response.responses.forEach((resp: any, idx: number) => {
      if (!resp.success) {
        failedTokens.push(tokens[idx])
      }
    })

    // Remove invalid tokens from database
    if (failedTokens.length > 0) {
      await db.update(adminTokens)
        .set({ isActive: false })
        .where(inArray(adminTokens.token, failedTokens))
    }
  }

  private async saveNotificationToDatabase(notification: NotificationPayload) {
    try {
      await db.insert(notifications).values({
        type: notification.type,
        title: notification.title,
        message: notification.message,
        bookingId: notification.bookingId,
        priority: notification.priority,
        isRead: 'false', // Since your schema uses varchar for boolean
        createdAt: new Date(),
      })
    } catch (error) {
      console.error('Error saving notification to database:', error)
    }
  }

  // Create booking notifications
  async notifyNewBooking(booking: any, customer: any) {
    const urgencyEmoji = this.getUrgencyEmoji(booking.priority)
    const serviceEmoji = booking.serviceType === 'electrical' ? '⚡' : '🔧'
    
    await this.sendToAllAdmins({
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
    await this.sendToAllAdmins({
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
}