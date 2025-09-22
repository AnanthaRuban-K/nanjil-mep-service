import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

export async function validateBooking(c: Context, next: Next) {
  try {
    const body = await c.req.json()
    
    const required = ['serviceType', 'description', 'contactInfo', 'scheduledTime']
    const missing = required.filter(field => !body[field])
    
    if (missing.length > 0) {
      throw new HTTPException(400, { 
        message: `Missing required fields: ${missing.join(', ')}` 
      })
    }
    
    if (!body.contactInfo.name || !body.contactInfo.phone || !body.contactInfo.address) {
      throw new HTTPException(400, { 
        message: 'Complete contact information required: name, phone, address' 
      })
    }
    
    if (!['electrical', 'plumbing'].includes(body.serviceType)) {
      throw new HTTPException(400, { 
        message: 'Invalid service type. Must be: electrical, plumbing' 
      })
    }
    
    if (body.priority && !['normal', 'urgent', 'emergency'].includes(body.priority)) {
      throw new HTTPException(400, { 
        message: 'Invalid priority. Must be: normal, urgent, emergency' 
      })
    }
    
    await next()
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error
    }
    throw new HTTPException(400, { message: 'Invalid request data' })
  }
}

export async function validateFeedback(c: Context, next: Next) {
  try {
    const body = await c.req.json()
    
    if (!body.rating || body.rating < 1 || body.rating > 5) {
      throw new HTTPException(400, { 
        message: 'Valid rating (1-5) is required' 
      })
    }
    
    await next()
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error
    }
    throw new HTTPException(400, { message: 'Invalid feedback data' })
  }
}