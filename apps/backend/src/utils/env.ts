export function validateEnv() {
  const required = ['DATABASE_URL']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '))
    console.error('📝 Please check your .env file')
    process.exit(1)
  }
  
  console.log('✅ Environment variables validated')
}