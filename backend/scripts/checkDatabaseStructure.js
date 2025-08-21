const db = require('../config/database')

async function checkDatabaseStructure() {
  try {
    console.log('🔍 Checking database structure...')
    
    // Check what columns exist in the users table
    const tableInfo = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `)
    
    console.log('📋 Users table structure:')
    console.log('Column Name | Data Type | Nullable | Default')
    console.log('------------|-----------|----------|---------')
    tableInfo.rows.forEach(col => {
      console.log(`${col.column_name.padEnd(12)} | ${col.data_type.padEnd(9)} | ${col.is_nullable.padEnd(8)} | ${col.column_default || 'NULL'}`)
    })
    
    // Check if users table has any data
    const userCount = await db.query('SELECT COUNT(*) as count FROM users')
    console.log(`\n👥 Total users in database: ${userCount.rows[0].count}`)
    
    // Show sample user data
    const sampleUsers = await db.query('SELECT * FROM users LIMIT 3')
    if (sampleUsers.rows.length > 0) {
      console.log('\n📊 Sample user data:')
      console.log(JSON.stringify(sampleUsers.rows, null, 2))
    }
    
  } catch (error) {
    console.error('❌ Error checking database structure:', error)
  } finally {
    // Close database connection
    await db.end()
  }
}

// Run the check
checkDatabaseStructure()
