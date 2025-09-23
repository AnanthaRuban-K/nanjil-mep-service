import { db } from './index.js'
import { services, admins, customers, bookings } from './schema.js'
import { generateUniqueBookingNumber, calculateEstimatedCostFromDB } from './helpers/BookingHelpers.js'

export async function seedDatabase() {
  console.log('🌱 Seeding database with initial data...')

  try {
    // Clear existing data (be careful in production!)
    console.log('🗑️ Clearing existing data...')
    await db.delete(bookings)
    await db.delete(customers)
    await db.delete(admins)
    await db.delete(services)

    // Seed services
    console.log('🔧 Seeding services...')
    await db.insert(services).values([
      // Electrical Services
      {
        name_en: 'Fan Repair & Installation',
        name_ta: 'விசிறி சரிசெய்தல் மற்றும் பொருத்துதல்',
        category: 'electrical',
        description_en: 'Ceiling fans, table fans, exhaust fans repair and installation',
        description_ta: 'சீலிங் விசிறி, டேபிள் விசிறி, எக்ஸாஸ்ட் விசிறி சரிசெய்தல் மற்றும் பொருத்துதல்',
        baseCost: '300.00'
      },
      {
        name_en: 'Light & Electrical Fittings',
        name_ta: 'விளக்கு மற்றும் மின் பொருத்துதல்',
        category: 'electrical',
        description_en: 'LED lights, tube lights, bulbs, switches, and socket installation/repair',
        description_ta: 'LED விளக்கு, டியூப் லைட், பல்பு, ஸ்விட்ச், சாக்கெட் பொருத்துதல்/சரிசெய்தல்',
        baseCost: '250.00'
      },
      {
        name_en: 'Wiring & Circuit Issues',
        name_ta: 'வயரிங் மற்றும் சர்க்யூட் பிரச்சனைகள்',
        category: 'electrical',
        description_en: 'House wiring, circuit repair, electrical troubleshooting',
        description_ta: 'வீட்டு வயரிங், சர்க்யூட் சரிசெய்தல், மின் பிரச்சனை தீர்வு',
        baseCost: '500.00'
      },
      
      // Plumbing Services
      {
        name_en: 'Tap & Faucet Repair',
        name_ta: 'குழாய் மற்றும் ஃபாசெட் சரிசெய்தல்',
        category: 'plumbing',
        description_en: 'Kitchen taps, bathroom faucets, mixer repair and replacement',
        description_ta: 'சமையலறை குழாய், குளியலறை ஃபாசெட், மிக்சர் சரிசெய்தல் மற்றும் மாற்றுதல்',
        baseCost: '350.00'
      },
      {
        name_en: 'Toilet & Bathroom Issues',
        name_ta: 'கழிவறை மற்றும் குளியலறை பிரச்சனைகள்',
        category: 'plumbing',
        description_en: 'Toilet flush repair, commode installation, bathroom fittings',
        description_ta: 'டாய்லெட் ஃப்ளஷ் சரிசெய்தல், காம்மோட் பொருத்துதல், குளியலறை பொருத்துதல்',
        baseCost: '400.00'
      },
      {
        name_en: 'Pipe & Drainage Repair',
        name_ta: 'குழாய் மற்றும் வடிகால் சரிசெய்தல்',
        category: 'plumbing',
        description_en: 'Water pipe leakage, drainage blockage, pipe installation',
        description_ta: 'தண்ணீர் குழாய் கசிவு, வடிகால் அடைப்பு, குழாய் பொருத்துதல்',
        baseCost: '450.00'
      }
    ])

    // Seed admin users
    console.log('👤 Seeding admin users...')
    await db.insert(admins).values([
      {
        clerkUserId: 'admin_nanjil_001',
        name: 'நாஞ்சில் MEP Admin',
        email: 'admin@nanjilmep.com',
        phone: '9876543210',
        role: 'admin'
      },
      {
        clerkUserId: 'admin_nanjil_002',
        name: 'Service Manager',
        email: 'manager@nanjilmep.com',
        phone: '9876543211',
        role: 'manager'
      }
    ])

    // Seed sample customers
    console.log('👥 Seeding sample customers...')
    const sampleCustomers = await db.insert(customers).values([
      {
        name: 'Raja Kumar',
        phone: '9876543210',
        address: 'No.123, Main Street, Nagercoil, Tamil Nadu - 629001',
        language: 'ta'
      },
      {
        name: 'Sundari Ammal',
        phone: '9876543212',
        address: 'No.456, Gandhi Road, Kanyakumari, Tamil Nadu - 629702',
        language: 'ta'
      },
      {
        name: 'Murugan Sir',
        phone: '9876543214',
        address: 'No.789, Temple Street, Tirunelveli, Tamil Nadu - 627001',
        language: 'ta'
      }
    ]).returning()

    // Seed sample bookings
    console.log('📋 Seeding sample bookings...')
    const now = new Date()
    const sampleBookings = [
      {
        bookingNumber: generateUniqueBookingNumber(),
        serviceType: 'electrical',
        priority: 'normal',
        description: 'Ceiling fan not working properly, making noise',
        contactInfo: {
          name: 'Raja Kumar',
          phone: '9876543210',
          address: 'No.123, Main Street, Nagercoil, Tamil Nadu - 629001'
        },
        scheduledTime: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
        status: 'completed',
        totalCost: '300.00',
        actualCost: '350.00',
        rating: 5,
        review: 'Excellent service! Very professional and quick.',
        completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        bookingNumber: generateUniqueBookingNumber(),
        serviceType: 'plumbing',
        priority: 'urgent',
        description: 'Kitchen tap leaking continuously, water wastage',
        contactInfo: {
          name: 'Sundari Ammal',
          phone: '9876543212',
          address: 'No.456, Gandhi Road, Kanyakumari, Tamil Nadu - 629702'
        },
        scheduledTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
        status: 'in_progress',
        totalCost: '455.00' // 350 * 1.3 for urgent
      },
      {
        bookingNumber: generateUniqueBookingNumber(),
        serviceType: 'electrical',
        priority: 'emergency',
        description: 'Complete power outage in house, main switch issue',
        contactInfo: {
          name: 'Murugan Sir',
          phone: '9876543214',
          address: 'No.789, Temple Street, Tirunelveli, Tamil Nadu - 627001'
        },
        scheduledTime: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 hours from now
        status: 'confirmed',
        totalCost: '750.00' // 500 * 1.5 for emergency
      }
    ]

    await db.insert(bookings).values(sampleBookings)

    console.log('✅ Database seeded successfully!')
    console.log('📊 Seeded data summary:')
    console.log('   - 6 services (3 electrical, 3 plumbing)')
    console.log('   - 2 admin users')
    console.log('   - 3 sample customers')
    console.log('   - 3 sample bookings')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

// CommonJS-compatible way to check if file is being run directly
const isMainModule = require.main === module

if (isMainModule) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}