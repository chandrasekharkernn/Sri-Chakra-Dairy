require('dotenv').config();
// Override any existing DATABASE_URL with our PostgreSQL one
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/sri_chakra_diary';
console.log('🔧 DATABASE_URL:', process.env.DATABASE_URL);
const db = require('./config/database');

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const result = await db.getRow('SELECT NOW() as current_time');
    console.log('✅ Database connection successful');
    console.log('📅 Current time:', result.current_time);
    
    // Test if tables exist
    const tables = await db.getRows(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'departments', 'roles', 'scopes')
      ORDER BY table_name
    `);
    
    console.log('📋 Found tables:', tables.map(t => t.table_name));
    
    // Test sample data
    const deptCount = await db.getRow('SELECT COUNT(*) as count FROM departments');
    const scopeCount = await db.getRow('SELECT COUNT(*) as count FROM scopes');
    const roleCount = await db.getRow('SELECT COUNT(*) as count FROM roles');
    
    console.log('📊 Sample data counts:');
    console.log(`   Departments: ${deptCount.count}`);
    console.log(`   Scopes: ${scopeCount.count}`);
    console.log(`   Roles: ${roleCount.count}`);
    
    console.log('🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await db.end();
    process.exit(0);
  }
}

testConnection();
