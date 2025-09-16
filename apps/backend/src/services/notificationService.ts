import { db } from '../db/index.js'
import { notifications } from '../db/schema.js'
import { eq, desc, and } from 'drizzle-orm'

export interface NotificationData {
  type: 'new_booking' | 'booking_updated' | 'emergency_booking'
  title: string
  message: string
  bookingId: number
  bookingNumber: string
  priority?: 'normal' | 'urgent' | 'emergency'
}

export class NotificationService {
  async createNotification(data: NotificationData) {
    try {
      const [notification] = await db.insert(notifications).values({
        type: data.type,
        title: data.title,
        message: data.message,
        bookingId: data.bookingId,
        bookingNumber: data.bookingNumber,
        priority: data.priority || 'normal',
        isRead: false
      }).returning()
      
      return notification
    } catch (error) {
      console.error('Create notification error:', error)
      throw new Error('Failed to create notification')
    }
  }

  async getUnreadNotifications() {
    try {
      return await db
        .select()
        .from(notifications)
        .where(eq(notifications.isRead, false))
        .orderBy(desc(notifications.createdAt))
    } catch (error) {
      console.error('Get unread notifications error:', error)
      return []
    }
  }

  async getAllNotifications(limit = 50) {
    try {
      return await db
        .select()
        .from(notifications)
        .orderBy(desc(notifications.createdAt))
        .limit(limit)
    } catch (error) {
      console.error('Get all notifications error:', error)
      return []
    }
  }

  async markAsRead(notificationId: number) {
    try {
      await db
        .update(notifications)
        .set({ isRead: true, readAt: new Date() })
        .where(eq(notifications.id, notificationId))
      return true
    } catch (error) {
      console.error('Mark notification as read error:', error)
      return false
    }
  }

  async markAllAsRead() {
    try {
      await db
        .update(notifications)
        .set({ isRead: true, readAt: new Date() })
        .where(eq(notifications.isRead, false))
      return true
    } catch (error) {
      console.error('Mark all notifications as read error:', error)
      return false
    }
  }

  async deleteOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)
      
      await db
        .delete(notifications)
        .where(and(
          eq(notifications.isRead, true),
          // Add date comparison here when needed
        ))
      
      return true
    } catch (error) {
      console.error('Delete old notifications error:', error)
      return false
    }
  }
}