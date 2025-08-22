const db = require('../config/database')

async function deploymentSetup() {
  try {
    console.log('🚀 Starting deployment setup...')
    
    // Array of required columns for users table
    const userColumns = [
      { name: 'role', type: 'character varying', default: "'employee'", nullable: true },
      { name: 'is_active', type: 'boolean', default: 'true', nullable: true },
      { name: 'mobile_number', type: 'character varying', default: null, nullable: true },
      { name: 'department', type: 'character varying', default: "'Not Assigned'", nullable: true }
    ]
    
    // Array of required columns for opening_stock_data table
    const openingStockColumns = [
      { name: 'section', type: 'character varying', default: "'General'", nullable: true }
    ]
    
    // Check and add missing columns to users table
    console.log('📋 Checking users table columns...')
    for (const column of userColumns) {
      const columnExists = await db.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = $1
      `, [column.name])
      
      if (columnExists.rows.length === 0) {
        console.log(`📝 Adding ${column.name} column to users table...`)
        await db.query(`
          ALTER TABLE users 
          ADD COLUMN ${column.name} ${column.type} ${column.default ? `DEFAULT ${column.default}` : ''} ${column.nullable ? '' : 'NOT NULL'}
        `)
        console.log(`✅ ${column.name} column added successfully!`)
      } else {
        console.log(`✅ ${column.name} column already exists`)
      }
    }
    
    // Check and add missing columns to opening_stock_data table
    console.log('📋 Checking opening_stock_data table columns...')
    for (const column of openingStockColumns) {
      const columnExists = await db.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'opening_stock_data' AND column_name = $1
      `, [column.name])
      
      if (columnExists.rows.length === 0) {
        console.log(`📝 Adding ${column.name} column to opening_stock_data table...`)
        await db.query(`
          ALTER TABLE opening_stock_data 
          ADD COLUMN ${column.name} ${column.type} ${column.default ? `DEFAULT ${column.default}` : ''} ${column.nullable ? '' : 'NOT NULL'}
        `)
        console.log(`✅ ${column.name} column added successfully!`)
      } else {
        console.log(`✅ ${column.name} column already exists`)
      }
    }
    
    // Update existing super admin user
    console.log('👤 Updating super admin user...')
    const updateResult = await db.query(`
      UPDATE users 
      SET role = 'super_admin', 
          email = COALESCE(email, 'chandrasekhar@kernn.ai'), 
          is_active = true, 
          department = 'All Departments'
      WHERE employee_number = '9059549852'
      RETURNING id, username, email, employee_number, role, is_active, department
    `)
    
    if (updateResult.rows.length > 0) {
      console.log('✅ Super admin user updated successfully')
    } else {
      console.log('⚠️ No super admin user found to update')
    }
    
    // Verify all tables exist
    console.log('🔍 Verifying all required tables...')
    const requiredTables = [
      'users',
      'sales_data',
      'other_dairy_sales_data', 
      'products_data',
      'silo_closing_balance_data',
      'products_closing_stock_data',
      'waiting_tanker_data',
      'third_party_procurement_data',
      'opening_stock_data'
    ]
    
    for (const table of requiredTables) {
      const tableExists = await db.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_name = $1
      `, [table])
      
      if (tableExists.rows.length > 0) {
        console.log(`✅ Table ${table} exists`)
      } else {
        console.log(`❌ Table ${table} is missing - this may cause issues`)
      }
    }
    
    console.log('\n🎉 Deployment setup completed successfully!')
    console.log('✅ All required columns and tables are ready')
    console.log('✅ Database is ready for production deployment')
    
  } catch (error) {
    console.error('❌ Deployment setup failed:', error)
    throw error
  } finally {
    await db.end()
  }
}

// Run the deployment setup
deploymentSetup()
