const db = require('../config/database')

async function addDepartmentAndUpdate() {
  try {
    console.log('🔄 Starting database update process...')
    
    // Step 1: Check if department column already exists
    const columnExists = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'department'
    `)
    
    if (columnExists.rows.length === 0) {
      console.log('📝 Adding department column to users table...')
      
      // Add department column
      await db.query(`
        ALTER TABLE users 
        ADD COLUMN department character varying DEFAULT 'Not Assigned'
      `)
      
      console.log('✅ Department column added successfully!')
    } else {
      console.log('✅ Department column already exists')
    }
    
    // Step 2: Show current super admin users
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
    
    // Step 3: Update all super admin users to have "All Departments"
    const updateResult = await db.query(
      'UPDATE users SET department = $1, updated_at = NOW() WHERE role = $2 RETURNING id, username, department',
      ['All Departments', 'super_admin']
    )
    
    console.log(`✅ Successfully updated ${updateResult.rows.length} super admin user(s)`)
    
    // Step 4: Show the updated results
    console.log('📊 Updated super admin users:')
    updateResult.rows.forEach(user => {
      console.log(`   - ID: ${user.id}, Username: ${user.username}, New Department: ${user.department}`)
    })
    
    // Step 5: Also update admin users to have "All Departments"
    const adminUsers = await db.query(
      'SELECT id, username, email, role, department FROM users WHERE role = $1',
      ['admin']
    )
    
    if (adminUsers.rows.length > 0) {
      console.log(`\n📋 Found ${adminUsers.rows.length} admin user(s):`)
      adminUsers.rows.forEach(user => {
        console.log(`   - ID: ${user.id}, Username: ${user.username}, Current Department: ${user.department || 'NULL'}`)
      })
      
      const adminUpdateResult = await db.query(
        'UPDATE users SET department = $1, updated_at = NOW() WHERE role = $2 RETURNING id, username, department',
        ['All Departments', 'admin']
      )
      
      console.log(`✅ Successfully updated ${adminUpdateResult.rows.length} admin user(s)`)
    }
    
    // Step 6: Show final state of all users
    const allUsers = await db.query(
      'SELECT id, username, email, role, department, is_active FROM users ORDER BY role, username'
    )
    
    console.log('\n📊 Final state of all users:')
    allUsers.rows.forEach(user => {
      console.log(`   - ID: ${user.id}, Username: ${user.username}, Role: ${user.role}, Department: ${user.department || 'Not Assigned'}`)
    })
    
    console.log('\n🎉 Database update completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during database update:', error)
  } finally {
    // Close database connection
    await db.end()
  }
}

// Run the update
addDepartmentAndUpdate()
