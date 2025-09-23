import { Hono } from 'hono'
import { NotificationService } from '../services/NotificationService.js'

const adminRouter = new Hono()
const notificationService = new NotificationService()

// Register admin FCM token
adminRouter.post('/register-token', async (c) => {
  try {
    const { token } = await c.req.json()
    
    if (!token) {
      return c.json({ error: 'FCM token is required' }, 400)
    }

    await notificationService.addAdminToken(token)
    
    return c.json({ 
      success: true, 
      message: 'Admin token registered successfully' 
    })
  } catch (error) {
    console.error('Error registering admin token:', error)
    return c.json({ error: 'Failed to register token' }, 500)
  }
})

// Test notification endpoint
adminRouter.post('/test-notification', async (c) => {
  try {
    await notificationService.sendToAllAdmins({
      type: 'new_booking',
      title: '🧪 Test Notification',
      message: 'This is a test notification for admins',
      priority: 'normal'
    })
    
    return c.json({ 
      success: true, 
      message: 'Test notification sent' 
    })
  } catch (error) {
    console.error('Error sending test notification:', error)
    return c.json({ error: 'Failed to send test notification' }, 500)
  }
})

export { adminRouter }