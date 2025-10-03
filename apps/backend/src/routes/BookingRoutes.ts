import { Hono } from 'hono'
import { BookingController } from '../controllers/BookingController'


export const bookingRoutes = new Hono()
const bookingController = new BookingController()

// Public booking endpoints
bookingRoutes.get('/', (c) => bookingController.getBookings(c))
bookingRoutes.post('/', (c) => bookingController.createBooking(c))
bookingRoutes.get('/my', (c) => bookingController.getMyBookings(c))
bookingRoutes.get('/stats/summary', (c) => bookingController.getStats(c))
bookingRoutes.get('/:id', (c) => bookingController.getBookingById(c))

// Protected booking endpoints
bookingRoutes.put('/:id/cancel',  (c) => bookingController.cancelBooking(c))
bookingRoutes.post('/:id/feedback',  (c) => bookingController.submitFeedback(c))