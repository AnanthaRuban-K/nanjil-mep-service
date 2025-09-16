import { Hono } from 'hono'
import { NotificationService } from '../services/notificationService.js'

const notificationRoutes = new Hono()
const notificationService = new NotificationService()

// Get all notifications
notificationRoutes.get('/', async (c) => {
  try {
    const notifications = await notificationService.getAllNotifications()
    return c.json({ success: true, notifications })
  } catch (error) {
    return c.json({ error: 'Failed to fetch notifications' }, 500)
  }
})

// Get unread notifications
notificationRoutes.get('/unread', async (c) => {
  try {
    const notifications = await notificationService.getUnreadNotifications()
    return c.json({ success: true, notifications, count: notifications.length })
  } catch (error) {
    return c.json({ error: 'Failed to fetch unread notifications' }, 500)
  }
})

// Mark notification as read
notificationRoutes.put('/:id/read', async (c) => {
  try {
    const id = Number(c.req.param('id'))
    await notificationService.markAsRead(id)
    return c.json({ success: true, message: 'Notification marked as read' })
  } catch (error) {
    return c.json({ error: 'Failed to mark notification as read' }, 500)
  }
})

// Mark all notifications as read
notificationRoutes.put('/mark-all-read', async (c) => {
  try {
    await notificationService.markAllAsRead()
    return c.json({ success: true, message: 'All notifications marked as read' })
  } catch (error) {
    return c.json({ error: 'Failed to mark notifications as read' }, 500)
  }
})

export { notificationRoutes }