const { Pool } = require('pg');

// Force use Supabase database URL, override any system environment variables
const databaseUrl = 'postgresql://postgres:S3@@@1303@db.yrakjnonabrqyicyvdam.supabase.co:5432/postgres';

// Debug: Log the DATABASE_URL being used
console.log('🔧 Using DATABASE_URL:', databaseUrl);

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test the connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Helper function to run queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

// Helper function to get a single row
const getRow = async (text, params) => {
  const result = await query(text, params);
  return result.rows[0];
};

// Helper function to get multiple rows
const getRows = async (text, params) => {
  const result = await query(text, params);
  return result.rows;
};

// Helper function to execute a query without returning results
const execute = async (text, params) => {
  const result = await query(text, params);
  return result.rowCount;
};

module.exports = {
  query,
  getRow,
  getRows,
  execute,
  pool,
  connected: true,
  end: () => pool.end()
};
