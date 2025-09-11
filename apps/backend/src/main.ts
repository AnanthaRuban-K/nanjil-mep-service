// ===== Fix apps/backend/src/main.ts imports =====
// Remove .js extensions from all imports

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
// Fix these imports - remove .js extensions:
import { bookingRoutes } from './routes/bookingRoutes'  // ← Remove .js
import { adminRoutes } from './routes/adminRoutes'      // ← Remove .js

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://nanjilmepservice.com']
    : ['http://localhost:3100'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    message: 'Nanjil MEP Service API - Simplified Version'
  })
})

// Routes
app.route('/api/bookings', bookingRoutes)
app.route('/api/admin', adminRoutes)

// Root endpoint
app.get('/', (c) => {
  return c.json({ 
    message: 'Nanjil MEP Service API - Simplified',
    version: '2.0.0',
    status: 'running',
    features: [
      'Simple booking creation',
      'Basic admin management', 
      'Cash payment (no tracking)',
      'Tamil/English support',
      'Mobile-first design'
    ]
  })
})

// 404 handler
app.notFound((c) => {
  return c.json({ 
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /',
      'GET /health', 
      'POST /api/bookings',
      'GET /api/bookings/:id',
      'PUT /api/bookings/:id/cancel',
      'POST /api/bookings/:id/feedback',
      'GET /api/admin/dashboard',
      'GET /api/admin/bookings',
      'PUT /api/admin/bookings/:id/status'
    ]
  }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err)
  return c.json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  }, 500)
})

const port = Number(process.env.PORT) || 3101

serve({
  fetch: app.fetch,
  hostname: "0.0.0.0",  // Important: bind to all interfaces
  port,
}, (info) => {
  console.log(`🚀 Nanjil MEP API running at http://0.0.0.0:${port}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔧 Features: Simplified booking system`)
})