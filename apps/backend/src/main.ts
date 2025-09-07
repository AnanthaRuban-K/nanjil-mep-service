import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors())

app.get('/', (c) => {
  return c.json({ 
    message: 'Nanjil MEP Service API',
    status: 'running',
    port: 3101
  })
})

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

const port = parseInt(process.env.PORT || '3101')

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`🚀 Backend running at http://localhost:${info.port}`)
})