import { messaging } from '../config/firebase'
import { db } from '../db'
import { adminTokens } from '../db/schema'
import { eq, and } from 'drizzle-orm'

export class NotificationService {
  
 async registerToken(userId: string, token: string, deviceType: string = 'web') {
    try {
      console.log('Registering token for userId:', userId)
      
      // Check if token exists
      const existing = await db.select()
        .from(adminTokens)
        .where(eq(adminTokens.token, token))
      
      if (existing.length > 0) {
        console.log('Token exists, updating...')
        await db.update(adminTokens)
          .set({ 
            isActive: true, 
            lastUsed: new Date(),
            updatedAt: new Date()
          })
          .where(eq(adminTokens.token, token))
      } else {
        console.log('Inserting new token...')
        // Don't use adminId if you're storing Clerk user IDs as strings
        // Either create a separate customer_tokens table or modify schema
        await db.insert(adminTokens).values({
          token,
          
          deviceType,
          isActive: true
        })
      }
      
      console.log('Token registered successfully')
    } catch (error) {
      console.error('registerToken error:', error)
      throw error
    }
  }

  // Send notification to specific user
  async sendToUser(userId: string, notification: {
    title: string
    body: string
    data?: Record<string, string>
  }) {
    try {
      const tokens = await db.select()
        .from(adminTokens)
        .where(and(
          eq(adminTokens.adminId, Number(userId)),
          eq(adminTokens.isActive, true)
        ))
      
      if (tokens.length === 0) {
        console.log('No FCM tokens found for user:', userId)
        return { successCount: 0, failureCount: 0 }
      }

      // Send to each token individually
      const messages = tokens.map(t => ({
        notification: {
          title: notification.title,
          body: notification.body
        },
        data: notification.data || {},
        token: t.token
      }))

      // Use sendEach instead of sendMulticast
      const response = await messaging.sendEach(messages)
      
      console.log('Notification sent:', response.successCount, 'success,', response.failureCount, 'failed')
      
      // Clean up invalid tokens
      if (response.failureCount > 0) {
        await this.cleanupInvalidTokens(response.responses, tokens)
      }
      
      return response
    } catch (error) {
      console.error('Error sending notification:', error)
      throw error
    }
  }

  // Send to all admins
  async sendToAllAdmins(notification: {
    title: string
    body: string
    data?: Record<string, string>
  }) {
    try {
      const tokens = await db.select()
        .from(adminTokens)
        .where(eq(adminTokens.isActive, true))
      
      if (tokens.length === 0) {
        console.log('No admin tokens found')
        return { successCount: 0, failureCount: 0 }
      }

      const messages = tokens.map(t => ({
        notification: {
          title: notification.title,
          body: notification.body
        },
        data: notification.data || {},
        token: t.token
      }))

      const response = await messaging.sendEach(messages)
      
      console.log('Admin notification sent:', response.successCount, 'success,', response.failureCount, 'failed')
      
      if (response.failureCount > 0) {
        await this.cleanupInvalidTokens(response.responses, tokens)
      }
      
      return response
    } catch (error) {
      console.error('Error sending admin notification:', error)
      throw error
    }
  }

  // Clean up invalid tokens
  private async cleanupInvalidTokens(responses: any[], tokens: any[]) {
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i]
      if (!response.success) {
        const errorCode = response.error?.code
        
        // Remove invalid tokens
        if (errorCode === 'messaging/invalid-registration-token' || 
            errorCode === 'messaging/registration-token-not-registered') {
          await db.update(adminTokens)
            .set({ isActive: false })
            .where(eq(adminTokens.token, tokens[i].token))
          
          console.log('Deactivated invalid token:', tokens[i].token)
        }
      }
    }
  }

  // Booking notifications
  async notifyNewBooking(bookingId: number, bookingData: any) {
    return await this.sendToAllAdmins({
      title: 'புதிய பதிவு • New Booking',
      body: `${bookingData.contactInfo.name} - ${bookingData.serviceType}`,
      data: {
        type: 'new_booking',
        bookingId: bookingId.toString(),
        priority: bookingData.priority
      }
    })
  }

  async notifyBookingStatusUpdate(customerId: string, bookingNumber: string, status: string) {
    const statusMessages: Record<string, string> = {
      confirmed: 'உங்கள் பதிவு உறுதிப்படுத்தப்பட்டது • Booking confirmed',
      in_progress: 'பணியாளர் வழியில் உள்ளார் • Technician on the way',
      completed: 'சேவை முடிவடைந்தது • Service completed',
      cancelled: 'பதிவு ரத்து செய்யப்பட்டது • Booking cancelled'
    }

    return await this.sendToUser(customerId, {
      title: `பதிவு ${bookingNumber}`,
      body: statusMessages[status] || 'Status updated',
      data: {
        type: 'booking_update',
        bookingNumber,
        status
      }
    })
  }

  async notifyEmergencyBooking(bookingId: number, bookingData: any) {
    return await this.sendToAllAdmins({
      title: 'அவசர பதிவு • EMERGENCY BOOKING',
      body: `${bookingData.contactInfo.name} - ${bookingData.description.substring(0, 50)}`,
      data: {
        type: 'emergency_booking',
        bookingId: bookingId.toString(),
        priority: 'emergency'
      }
    })
  }
}