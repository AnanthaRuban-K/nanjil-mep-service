import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HTTPException(401, { message: 'Authorization header required' })
    }
    
    const token = authHeader.substring(7)
    
    // PRODUCTION SOLUTION: Add both admin and customer mock tokens
    if (token === 'mock-jwt-token') {
      // Default customer user
      c.set('user', {
        id: '1',
        email: 'rforruban@gmail.com',
        role: 'customer'
      })
      await next()
      return
    }
    
    // ADD THIS: Admin token for testing admin functionality
    if (token === 'mock-admin-token') {
      c.set('user', {
        id: 'admin-1',
        email: 'aswinima29@gmail.com',
        role: 'admin'
      })
      await next()
      return
    }

    // PRODUCTION: Replace this section with your actual JWT verification
    // Example with real JWT:
    /*
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Get user from database
      const user = await getUserById(decoded.userId)
      
      if (!user) {
        throw new HTTPException(401, { message: 'User not found' })
      }
      
      c.set('user', {
        id: user.id,
        email: user.email,
        role: user.role
      })
      
      await next()
      return
    } catch (jwtError) {
      throw new HTTPException(401, { message: 'Invalid token' })
    }
    */
    
    throw new HTTPException(401, { message: 'Invalid token' })
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error
    }
    throw new HTTPException(401, { message: 'Authentication failed' })
  }
}