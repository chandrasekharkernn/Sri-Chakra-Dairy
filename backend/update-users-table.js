const { Pool } = require('pg')
require('dotenv').config()

// Override any existing DATABASE_URL with our PostgreSQL one
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/sri_chakra_diary'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function updateUsersTable() {
  const client = await pool.connect()
  
  try {
    // Add mobile_number column if it doesn't exist
    const addMobileQuery = `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(15)
    `
    await client.query(addMobileQuery)
    console.log('✅ Added mobile_number column')

    // Add role column if it doesn't exist
    const addRoleQuery = `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'employee'
    `
    await client.query(addRoleQuery)
    console.log('✅ Added role column')

    // Add is_active column if it doesn't exist
    const addActiveQuery = `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true
    `
    await client.query(addActiveQuery)
    console.log('✅ Added is_active column')

    console.log('✅ Users table updated successfully!')

  } catch (error) {
    console.error('❌ Error updating users table:', error.message)
  } finally {
    client.release()
  }
}

updateUsersTable().then(() => {
  pool.end()
  console.log('Script completed!')
})
