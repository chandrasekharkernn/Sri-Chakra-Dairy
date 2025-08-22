const { Pool } = require('pg');

// Prefer a single DATABASE_URL. Supports Railway/Supabase/Neon etc.
// Use public Railway host for local development
const connectionString = 'postgresql://postgres:gFa42eB1dAdEga6dBfgFEG4age331d6E@mainline.proxy.rlwy.net:46839/postgres';

// Enable SSL automatically when the URL asks for it (e.g., ?sslmode=require)
const shouldEnableSsl = /sslmode=require/i.test(connectionString) || process.env.NODE_ENV === 'production';

console.log('🔧 Using DATABASE_URL:', connectionString.replace(/:(.*?)@/, ':****@'));

const pool = new Pool({
  connectionString,
  ssl: shouldEnableSsl ? { rejectUnauthorized: false } : false,
  max: 15,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
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
