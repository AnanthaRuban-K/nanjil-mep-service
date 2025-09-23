import { Context } from 'hono'
import { ServiceService } from '../services/ServiceService'
import { HTTPException } from 'hono/http-exception'

export class ServiceController {
  private serviceService: ServiceService

  constructor() {
    this.serviceService = new ServiceService()
  }

  async getAllServices(c: Context) {
    try {
      console.log('🔧 Getting all services...')
      
      const category = c.req.query('category')
      const isActive = c.req.query('active')

      const services = await this.serviceService.getAllServices({
        category,
        isActive: isActive === 'true'
      })

      console.log(`✅ Retrieved ${services.length} services`)
      return c.json({
        success: true,
        services
      })

    } catch (error) {
      console.error('❌ Get all services error:', error)
      throw new HTTPException(500, { message: 'Failed to retrieve services' })
    }
  }

  async getService(c: Context) {
    try {
      const serviceId = Number(c.req.param('id'))
      console.log(`🔍 Getting service: ${serviceId}`)

      if (isNaN(serviceId)) {
        throw new HTTPException(400, { message: 'Invalid service ID' })
      }

      const service = await this.serviceService.getServiceById(serviceId)

      if (!service) {
        throw new HTTPException(404, { message: 'Service not found' })
      }

      console.log('✅ Service retrieved successfully')
      return c.json({
        success: true,
        service
      })

    } catch (error) {
      console.error('❌ Get service error:', error)
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(500, { message: 'Failed to retrieve service' })
    }
  }

  async getServicesByCategory(c: Context) {
    try {
      const category = c.req.param('category')
      console.log(`🏷️ Getting services by category: ${category}`)

      const services = await this.serviceService.getServicesByCategory(category)

      console.log(`✅ Retrieved ${services.length} services in category ${category}`)
      return c.json({
        success: true,
        services,
        category
      })

    } catch (error) {
      console.error('❌ Get services by category error:', error)
      throw new HTTPException(500, { message: 'Failed to retrieve services by category' })
    }
  }

  async getServicePricing(c: Context) {
    try {
      const serviceId = Number(c.req.param('id'))
      const priority = c.req.query('priority') || 'normal'

      console.log(`💰 Getting pricing for service: ${serviceId}, priority: ${priority}`)

      const pricing = await this.serviceService.getServicePricing(serviceId, priority)

      console.log('✅ Service pricing retrieved')
      return c.json({
        success: true,
        pricing
      })

    } catch (error) {
      console.error('❌ Get service pricing error:', error)
      throw new HTTPException(500, { message: 'Failed to retrieve service pricing' })
    }
  }
}