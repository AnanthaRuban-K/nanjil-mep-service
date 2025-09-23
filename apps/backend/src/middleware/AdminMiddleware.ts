import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

export async function adminOnly(c: Context, next: Next) {
  try {
    const user = c.get('user')
    
    if (!user) {
      throw new HTTPException(401, { message: 'Authentication required' })
    }
    
    if (user.role !== 'admin') {
      throw new HTTPException(403, { message: 'Admin access required' })
    }
    
    await next()
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error
    }
    throw new HTTPException(403, { message: 'Access denied' })
  }
}