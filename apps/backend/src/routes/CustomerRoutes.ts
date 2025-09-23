import { Hono } from 'hono'
import { CustomerController } from '../controllers/CustomerController'

const customerRoutes = new Hono()
const customerController = new CustomerController()

// Create customer profile
customerRoutes.post('/', async (c) => {
  return await customerController.createCustomer(c)
})

// Get customer profile
customerRoutes.get('/profile', async (c) => {
  return await customerController.getCustomerProfile(c)
})

// Update customer profile
customerRoutes.put('/profile', async (c) => {
  return await customerController.updateCustomerProfile(c)
})

// Get customer booking history
customerRoutes.get('/:id/bookings', async (c) => {
  return await customerController.getCustomerBookings(c)
})

export { customerRoutes }