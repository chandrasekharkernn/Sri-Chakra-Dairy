const db = require('../config/database')

async function updateSuperAdminDepartment() {
  try {
    console.log('🔄 Starting super admin department update...')
    
    // First, let's see what super admin users exist
    const superAdminUsers = await db.query(
      'SELECT id, username, email, role, department FROM users WHERE role = $1',
      ['super_admin']
    )
    
    if (superAdminUsers.rows.length === 0) {
      console.log('❌ No super admin users found in the database')
      return
    }
    
    console.log(`📋 Found ${superAdminUsers.rows.length} super admin user(s):`)
    superAdminUsers.rows.forEach(user => {
      console.log(`   - ID: ${user.id}, Username: ${user.username}, Current Department: ${user.department || 'NULL'}`)
    })
    
    // Update all super admin users to have "All Departments"
    const updateResult = await db.query(
      'UPDATE users SET department = $1, updated_at = NOW() WHERE role = $2 RETURNING id, username, department',
      ['All Departments', 'super_admin']
    )
    
    console.log(`✅ Successfully updated ${updateResult.rows.length} super admin user(s)`)
    
    // Show the updated results
    console.log('📊 Updated super admin users:')
    updateResult.rows.forEach(user => {
      console.log(`   - ID: ${user.id}, Username: ${user.username}, New Department: ${user.department}`)
    })
    
    console.log('🎉 Super admin department update completed successfully!')
    
  } catch (error) {
    console.error('❌ Error updating super admin department:', error)
  } finally {
    // Close database connection
    await db.end()
  }
}

// Run the update
updateSuperAdminDepartment()
