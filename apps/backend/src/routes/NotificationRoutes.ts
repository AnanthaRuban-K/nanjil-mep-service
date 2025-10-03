import { Hono } from 'hono'
import { NotificationService } from '../services/NotificationService'

export const notificationRoutes = new Hono()
const notificationService = new NotificationService()

notificationRoutes.post('/register-token', async (c) => {
  try {
    const body = await c.req.json()
    console.log('📝 Register token body:', body)
    
    const { token, deviceType, userId } = body
    
    if (!token) {
      return c.json({ error: 'FCM token is required' }, 400)
    }

    if (!userId) {
      return c.json({ error: 'User ID is required' }, 400)
    }

    console.log('✅ Calling registerToken...')
    await notificationService.registerToken(userId, token, deviceType || 'web')
    
    console.log('✅ Token registered successfully')
    return c.json({ success: true })
  } catch (error) {
    console.error('❌ Register token error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    return c.json({ 
      error: 'Failed to register token',
      details: error instanceof Error ? error.message : String(error)
    }, 500)
  }
})

notificationRoutes.post('/test', async (c) => {
  try {
    const result = await notificationService.sendToAllAdmins({
      title: 'Test Notification',
      body: 'This is a test notification',
      data: { type: 'test' }
    })
    
    return c.json({ success: true, result })
  } catch (error) {
    console.error('Test notification error:', error)
    return c.json({ error: 'Failed to send test' }, 500)
  }
})