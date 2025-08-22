const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use DATABASE_URL; supports Railway/Supabase/Neon/etc.
// Use public Railway host for local development
const databaseUrl = 'postgresql://postgres:gFa42eB1dAdEga6dBfgFEG4age331d6E@mainline.proxy.rlwy.net:46839/postgres';

// Initialize Sequelize with PostgreSQL
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: /sslmode=require/i.test(databaseUrl) || process.env.NODE_ENV === 'production'
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
