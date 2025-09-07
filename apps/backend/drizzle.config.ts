import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables from the correct path
dotenv.config({ path: resolve(__dirname, '.env') })

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not set in .env file')
  console.error('📝 Please add your Neon PostgreSQL URL to apps/backend/.env')
  process.exit(1)
}

console.log('✅ Database URL loaded:', databaseUrl.substring(0, 30) + '...')

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
  strict: true,
} satisfies Config