import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

// Simple in-memory rate limiter (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export async function rateLimiter(c: Context, next: Next) {
  try {
    const clientIp = c.req.header('CF-Connecting-IP') || 
                    c.req.header('X-Forwarded-For') || 
                    c.req.header('X-Real-IP') || 
                    'unknown'
    
    const now = Date.now()
    const windowMs = 15 * 60 * 1000 // 15 minutes
    const maxRequests = 100 // 100 requests per 15 minutes
    
    const key = `rate_limit:${clientIp}`
    const record = rateLimitStore.get(key)
    
    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
      await next()
      return
    }
    
    if (record.count >= maxRequests) {
      throw new HTTPException(429, { 
        message: 'Too many requests. Please try again later.' 
      })
    }
    
    record.count++
    rateLimitStore.set(key, record)
    
    await next()
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error
    }
    await next()
  }
}