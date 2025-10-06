import { Hono } from 'hono'
import { AdminController } from '../controllers/AdminController'
import { adminOnly } from '../middleware/adminOnly'  // Import it

const adminRoutes = new Hono()
const adminController = new AdminController()

// Apply middleware to ALL admin routes
adminRoutes.use('*', adminOnly)  // ← ADD THIS LINE

// Dashboard & Analytics
adminRoutes.get('/dashboard', (c) => adminController.getDashboardMetrics(c))
adminRoutes.get('/analytics/customers', (c) => adminController.getCustomerAnalytics(c))
adminRoutes.get('/analytics/services', (c) => adminController.getServiceAnalytics(c))
adminRoutes.get('/analytics/revenue', (c) => adminController.getRevenueAnalytics(c))

// Bookings CRUD
adminRoutes.get('/bookings', (c) => adminController.getAdminBookings(c))
adminRoutes.get('/bookings/:id', (c) => adminController.getBookingDetails(c))
adminRoutes.put('/bookings/:id/status', (c) => adminController.updateBookingStatus(c))
adminRoutes.put('/bookings/bulk/status', (c) => adminController.bulkUpdateStatus(c))
adminRoutes.get('/export/bookings', (c) => adminController.exportBookings(c))

// Customers CRUD
adminRoutes.get('/customers', (c) => adminController.getAdminCustomers(c))
adminRoutes.get('/customers/:id', (c) => adminController.getCustomerDetails(c))
adminRoutes.put('/customers/:id', (c) => adminController.updateCustomer(c))
adminRoutes.post('/customers/:id/block', (c) => adminController.blockCustomer(c))
adminRoutes.post('/customers/:id/unblock', (c) => adminController.unblockCustomer(c))

export { adminRoutes }