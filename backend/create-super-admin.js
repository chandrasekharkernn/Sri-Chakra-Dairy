const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
require('dotenv').config()

// Override any existing DATABASE_URL with our PostgreSQL one
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/sri_chakra_diary'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function createSuperAdmin() {
  const client = await pool.connect()
  
  try {
    // Check if super admin already exists
    const checkQuery = 'SELECT * FROM users WHERE email = $1'
    const existingUser = await client.query(checkQuery, ['chandrasekhar@kernn.ai'])
    
    if (existingUser.rows.length > 0) {
      console.log('✅ Super Admin already exists!')
      return
    }

    // Generate a dummy password hash for OTP-only login
    const dummyPassword = 'otp-only-login-' + Date.now()
    const passwordHash = await bcrypt.hash(dummyPassword, 10)

    // Create super admin user
    const insertQuery = `
      INSERT INTO users (username, email, mobile_number, password_hash, role, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `
    
    const result = await client.query(insertQuery, [
      'Chandra Sekhar',
      'chandrasekhar@kernn.ai',
      '9059549852',
      passwordHash,
      'super_admin',
      true
    ])

    console.log('✅ Super Admin created successfully!')
    console.log('User ID:', result.rows[0].id)
    console.log('Name:', result.rows[0].username)
    console.log('Email:', result.rows[0].email)
    console.log('Mobile:', result.rows[0].mobile_number)
    console.log('Role:', result.rows[0].role)
    console.log('Login: OTP-based only')

  } catch (error) {
    console.error('❌ Error creating Super Admin:', error.message)
  } finally {
    client.release()
  }
}

createSuperAdmin().then(() => {
  pool.end()
  console.log('Script completed!')
})
