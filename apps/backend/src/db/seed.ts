import { db } from './index'
import { services, admins } from './schema'

async function seed() {
  console.log('Seeding database...')

  try {
    // Seed services
    await db.insert(services).values([
      {
        name_en: 'Fan Repair',
        name_ta: 'விசிறி சரிசெய்தல்',
        category: 'electrical',
        description_en: 'Fix ceiling fans, table fans, and exhaust fans',
        description_ta: 'சீலிங் விசிறி, டேபிள் விசிறி, எக்ஸாஸ்ட் விசிறி சரிசெய்தல்',
        baseCost: '300.00'
      },
      {
        name_en: 'Light Installation',
        name_ta: 'விளக்கு பொருத்துதல்',
        category: 'electrical',
        description_en: 'Install and repair lights, bulbs, and fixtures',
        description_ta: 'விளக்கு, பல்பு, ஃபிக்சர் பொருத்துதல் மற்றும் சரிசெய்தல்',
        baseCost: '250.00'
      },
      {
        name_en: 'Pipe Repair',
        name_ta: 'குழாய் சரிசெய்தல்',
        category: 'plumbing',
        description_en: 'Fix leaking pipes and water connections',
        description_ta: 'லீக்காகும் குழாய் மற்றும் வாட்டர் கனெக்ஷன் சரிசெய்தல்',
        baseCost: '350.00'
      },
      {
        name_en: 'Toilet Repair',
        name_ta: 'கழிவறை சரிசெய்தல்',
        category: 'plumbing',
        description_en: 'Fix toilet flush and drainage issues',
        description_ta: 'டாய்லெட் ஃப்ளஷ் மற்றும் ட்ரெயினேஜ் பிரச்சனை சரிசெய்தல்',
        baseCost: '400.00'
      }
    ])

    // Seed default admin
    await db.insert(admins).values([
      {
        clerkUserId: 'admin_default',
        name: 'நாஞ்சில் MEP Admin',
        email: 'admin@nanjilmep.com',
        phone: '9876543210',
        role: 'admin'
      }
    ])

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Seeding failed:', error)
  }
}

seed()