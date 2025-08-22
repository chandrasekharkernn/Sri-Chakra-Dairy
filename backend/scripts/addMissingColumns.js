const db = require('../config/database')

async function addMissingColumns() {
  try {
    console.log('🔄 Starting database column update process...')
    
    // Step 1: Check if role column exists in users table
    const roleColumnExists = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'role'
    `)
    
    if (roleColumnExists.rows.length === 0) {
      console.log('📝 Adding role column to users table...')
      
      // Add role column
      await db.query(`
        ALTER TABLE users 
        ADD COLUMN role character varying DEFAULT 'employee'
      `)
      
      console.log('✅ Role column added successfully!')
    } else {
      console.log('✅ Role column already exists')
    }
    
    // Step 2: Check if email column exists in users table
    const emailColumnExists = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'email'
    `)
    
    if (emailColumnExists.rows.length === 0) {
      console.log('📝 Adding email column to users table...')
      
      // Add email column
      await db.query(`
        ALTER TABLE users 
        ADD COLUMN email character varying
      `)
      
      console.log('✅ Email column added successfully!')
    } else {
      console.log('✅ Email column already exists')
    }
    
    // Step 3: Check if is_active column exists in users table
    const isActiveColumnExists = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'is_active'
    `)
    
    if (isActiveColumnExists.rows.length === 0) {
      console.log('📝 Adding is_active column to users table...')
      
      // Add is_active column
      await db.query(`
        ALTER TABLE users 
        ADD COLUMN is_active boolean DEFAULT true
      `)
      
      console.log('✅ is_active column added successfully!')
    } else {
      console.log('✅ is_active column already exists')
    }
    
    // Step 4: Check if mobile_number column exists in users table
    const mobileNumberColumnExists = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'mobile_number'
    `)
    
    if (mobileNumberColumnExists.rows.length === 0) {
      console.log('📝 Adding mobile_number column to users table...')
      
      // Add mobile_number column
      await db.query(`
        ALTER TABLE users 
        ADD COLUMN mobile_number character varying
      `)
      
      console.log('✅ mobile_number column added successfully!')
    } else {
      console.log('✅ mobile_number column already exists')
    }
    
    // Step 5: Check if department column exists in users table
    const departmentColumnExists = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'department'
    `)
    
    if (departmentColumnExists.rows.length === 0) {
      console.log('📝 Adding department column to users table...')
      
      // Add department column
      await db.query(`
        ALTER TABLE users 
        ADD COLUMN department character varying DEFAULT 'Not Assigned'
      `)
      
      console.log('✅ department column added successfully!')
    } else {
      console.log('✅ department column already exists')
    }
    
    // Step 6: Check if section column exists in opening_stock_data table
    const sectionColumnExists = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'opening_stock_data' AND column_name = 'section'
    `)
    
    if (sectionColumnExists.rows.length === 0) {
      console.log('📝 Adding section column to opening_stock_data table...')
      
      // Add section column
      await db.query(`
        ALTER TABLE opening_stock_data 
        ADD COLUMN section character varying DEFAULT 'General'
      `)
      
      console.log('✅ section column added successfully!')
    } else {
      console.log('✅ section column already exists')
    }
    
    // Step 7: Update existing user to have super_admin role and set as active
    const updateResult = await db.query(`
      UPDATE users 
      SET role = 'super_admin', email = 'chandrasekhar@kernn.ai', is_active = true, department = 'All Departments'
      WHERE employee_number = '9059549852'
      RETURNING id, username, email, employee_number, role, is_active, department
    `)
    
    console.log('✅ Updated existing user:')
    console.log(JSON.stringify(updateResult.rows[0], null, 2))
    
    // Step 8: Show final users table structure
    const tableInfo = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `)
    
    console.log('\n📋 Final users table structure:')
    console.log('Column Name | Data Type | Nullable | Default')
    console.log('------------|-----------|----------|---------')
    tableInfo.rows.forEach(col => {
      console.log(`${col.column_name.padEnd(12)} | ${col.data_type.padEnd(9)} | ${col.is_nullable.padEnd(8)} | ${col.column_default || 'NULL'}`)
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
addMissingColumns()
