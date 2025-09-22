import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'

export function errorHandler(err: Error, c: Context) {
  console.error('Global error handler:', err)
  
  if (err instanceof HTTPException) {
    return c.json({
      error: err.message,
      status: err.status
    }, err.status)
  }
  
  // Database errors
  if (err.message.includes('duplicate key') || err.message.includes('unique constraint')) {
    return c.json({
      error: 'Resource already exists',
      message: 'This record already exists in our system'
    }, 409)
  }
  
  // Validation errors
  if (err.message.includes('invalid input') || err.message.includes('validation')) {
    return c.json({
      error: 'Validation error',
      message: err.message
    }, 400)
  }
  
  // Default error
  return c.json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  }, 500)
}