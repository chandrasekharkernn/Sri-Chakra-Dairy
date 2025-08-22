const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const db = require('./config/database');
const authRoutes = require('./routes/auth');
// const entryRoutes = require('./routes/entries');
// const categoryRoutes = require('./routes/categories');
const indexRoutes = require('./routes/index');
// const loginRoutes = require('./routes/loginRoute');
const employeeRoutes = require('./routes/employees');
const profileRoutes = require('./routes/profile');
const dataRoutes = require('./routes/data');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
// Dynamic CORS configuration for Vercel deployments
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://sri-chakra-dairy.vercel.app',
  'https://sri-chakra-dairy.vercel.app/',
  'https://sri-chakra-dairy-frontend.vercel.app',
  'https://sri-chakra-dairy-frontend.vercel.app/',
  /^https:\/\/sri-chakra-dairy.*\.vercel\.app$/,
  'https://sri-chakra-dairy.onrender.com'
];

// Add environment-specific frontend URL if provided
if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

console.log('🔧 CORS allowed origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // For development/testing - allow all Vercel deployments
    if (origin && (origin.includes('vercel.app') || origin.includes('onrender.com'))) {
      console.log('✅ CORS: Allowed deployment origin:', origin);
      callback(null, true);
      return;
    }
    
    // Check if origin is in allowed list or matches regex pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      console.log('✅ CORS: Allowed origin:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS: Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Sri Chakra Diary Backend API',
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: db.connected ? 'Connected' : 'Disconnected',
    version: '1.0.0'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: db.connected ? 'Connected' : 'Disconnected'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', indexRoutes); // Mount OTP routes at /api/auth
// app.use('/api/entries', entryRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/login', loginRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/data', dataRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  db.end();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  db.end();
  process.exit(0);
});

module.exports = app;
