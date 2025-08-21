const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create database file in the backend directory
const dbPath = path.join(__dirname, '..', 'backend', 'database.sqlite');

console.log('🚀 Setting up SQLite database for Sri Chakra Diary...');
console.log(`📁 Database path: ${dbPath}`);

// Remove existing database file if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('🗑️  Removed existing database file');
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error creating database:', err.message);
    process.exit(1);
  } else {
    console.log('✅ SQLite database created successfully');
  }
});

// Read and execute the SQL setup script
const setupSQL = fs.readFileSync(path.join(__dirname, 'sqlite_setup.sql'), 'utf8');

db.exec(setupSQL, (err) => {
  if (err) {
    console.error('❌ Error setting up database:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Database tables and sample data created successfully');
    
    // Verify the setup
    db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, tables) => {
      if (err) {
        console.error('❌ Error verifying tables:', err.message);
      } else {
        console.log('📋 Created tables:', tables.map(t => t.name).join(', '));
      }
      
      db.all("SELECT 'departments' as table_name, COUNT(*) as count FROM departments UNION ALL SELECT 'scopes' as table_name, COUNT(*) as count FROM scopes UNION ALL SELECT 'roles' as table_name, COUNT(*) as count FROM roles", (err, counts) => {
        if (err) {
          console.error('❌ Error counting records:', err.message);
        } else {
          console.log('📊 Sample data counts:');
          counts.forEach(row => {
            console.log(`   ${row.table_name}: ${row.count}`);
          });
        }
        
        db.close((err) => {
          if (err) {
            console.error('❌ Error closing database:', err.message);
          } else {
            console.log('🎉 SQLite database setup completed successfully!');
            console.log('');
            console.log('Next steps:');
            console.log('1. cd backend');
            console.log('2. npm install');
            console.log('3. npm run dev');
          }
        });
      });
    });
  }
});
