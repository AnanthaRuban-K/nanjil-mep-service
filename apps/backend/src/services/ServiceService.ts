import { db } from '../db/index'
import { services } from '../db/schema'
import { eq, and } from 'drizzle-orm'

export class ServiceService {
  async getAllServices(params: {
    category?: string
    isActive?: boolean
  } = {}) {
    try {
      // Build conditions array
      const conditions = []
      if (params.category) {
        conditions.push(eq(services.category, params.category as any))
      }
      if (params.isActive !== undefined) {
        conditions.push(eq(services.isActive, params.isActive ? 'true' : 'false'))
      }
      
      // Execute query directly based on conditions
      if (conditions.length > 0) {
        return await db.select()
          .from(services)
          .where(and(...conditions))
      } else {
        return await db.select()
          .from(services)
      }
    } catch (error) {
      console.error('getAllServices error:', error)
      throw new Error(`Failed to get services`)
    }
  }

  async getServiceById(serviceId: number) {
    try {
      const result = await db.select()
        .from(services)
        .where(eq(services.id, serviceId))
      return result[0] || null
    } catch (error) {
      console.error('getServiceById error:', error)
      throw new Error(`Failed to get service`)
    }
  }

  async getServicesByCategory(category: string) {
    try {
      return await db.select()
        .from(services)
        .where(and(
          eq(services.category, category as any),
          eq(services.isActive, 'true')
        ))
    } catch (error) {
      console.error('getServicesByCategory error:', error)
      throw new Error(`Failed to get services by category`)
    }
  }

  async getServicePricing(serviceId: number, priority: string = 'normal') {
    try {
      const service = await this.getServiceById(serviceId)
      
      if (!service) {
        throw new Error('Service not found')
      }
      
      const baseCost = parseFloat(service.baseCost)
      const priorityMultipliers = {
        normal: 1,
        urgent: 1.2,
        emergency: 1.5
      }
      
      const multiplier = priorityMultipliers[priority as keyof typeof priorityMultipliers] || 1
      const travelCharge = 50
      const finalCost = Math.round((baseCost * multiplier) + travelCharge)
      
      return {
        serviceId,
        serviceName: service.name_en,
        serviceNameTa: service.name_ta,
        baseCost,
        priority,
        priorityMultiplier: multiplier,
        travelCharge,
        finalCost,
        breakdown: {
          serviceCharge: Math.round(baseCost * multiplier),
          travelCharge,
          total: finalCost
        }
      }
    } catch (error) {
      console.error('getServicePricing error:', error)
      throw new Error(`Failed to get service pricing`)
    }
  }
}