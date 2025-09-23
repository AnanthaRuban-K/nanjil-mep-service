import { Hono } from 'hono'
import { ServiceController } from '../controllers/ServiceController'

const serviceRoutes = new Hono()
const serviceController = new ServiceController()

// Get all services
serviceRoutes.get('/', async (c) => {
  return await serviceController.getAllServices(c)
})

// Get service by ID
serviceRoutes.get('/:id', async (c) => {
  return await serviceController.getService(c)
})

// Get services by category
serviceRoutes.get('/category/:category', async (c) => {
  return await serviceController.getServicesByCategory(c)
})

// Get service pricing
serviceRoutes.get('/:id/pricing', async (c) => {
  return await serviceController.getServicePricing(c)
})

export { serviceRoutes }