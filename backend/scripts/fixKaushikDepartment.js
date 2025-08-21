const db = require('../config/database')

async function fixKaushikDepartment() {
  try {
    console.log('🔧 Fixing Kaushik\'s department...')
    
    // Update Kaushik's department to Sales
    const result = await db.query(
      `UPDATE users 
       SET department = $1, updated_at = NOW() 
       WHERE username = $2 AND email = $3
       RETURNING id, username, email, department`,
      ['Sales', 'Kaushik', 'kaushik@kernn.ai']
    )
    
    if (result.rows.length === 0) {
      console.log('❌ Kaushik not found in database')
      return
    }
    
    const updatedUser = result.rows[0]
    console.log('✅ Successfully updated Kaushik\'s department:')
    console.log(`   - ID: ${updatedUser.id}`)
    console.log(`   - Username: ${updatedUser.username}`)
    console.log(`   - Email: ${updatedUser.email}`)
    console.log(`   - New Department: ${updatedUser.department}`)
    
    // Show all users to verify
    const allUsers = await db.query(
      'SELECT id, username, email, role, department FROM users ORDER BY username'
    )
    
    console.log('\n📊 Current state of all users:')
    allUsers.rows.forEach(user => {
      console.log(`   - ${user.username} (${user.role}): ${user.department}`)
    })
    
    console.log('\n🎉 Department fix completed successfully!')
    
  } catch (error) {
    console.error('❌ Error fixing department:', error)
  } finally {
    // Close database connection
    await db.end()
  }
}

// Run the fix
fixKaushikDepartment()
