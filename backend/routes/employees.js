const express = require('express')
const router = express.Router()
const { createEmployee, getAllEmployees, updateEmployee, deleteEmployee } = require('../controllers/employeeController')
const db = require('../config/database')

// Middleware to verify JWT token and get user from database
const verify_jwt = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  try {
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    
    // Get user from database to ensure they exist and get their current role
    const user = await db.getRow(
      'SELECT id, username, email, role, is_active FROM users WHERE id = $1',
      [decoded.userId]
    )
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }
    
    if (!user.is_active) {
      return res.status(403).json({ error: 'User account is deactivated' })
    }
    
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' })
    }
    console.error('JWT verification error:', error)
    return res.status(500).json({ error: 'Token verification failed.' })
  }
}

// Middleware to check if user is admin or super admin
const admin_access = (req, res, next) => {
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin or Super Admin access required' })
  }
  next()
}

// Employee routes (all require admin or super admin access)
router.post('/', verify_jwt, admin_access, createEmployee)
router.get('/', verify_jwt, admin_access, getAllEmployees)
router.put('/:id', verify_jwt, admin_access, updateEmployee)
router.delete('/:id', verify_jwt, admin_access, deleteEmployee)

module.exports = router
