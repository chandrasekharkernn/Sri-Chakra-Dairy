const express = require('express')
const router = express.Router()
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
    
    // Get user from database to ensure they exist and get their current data
    const user = await db.getRow(
      'SELECT id, username, email, mobile_number, role, department, is_active FROM users WHERE id = $1',
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

// Get current user profile
router.get('/me', verify_jwt, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    })
  } catch (error) {
    console.error('❌ Get profile error:', error)
    res.status(500).json({ error: 'Server error while fetching profile' })
  }
})

// Update current user profile
router.put('/me', verify_jwt, async (req, res) => {
  try {
    const { username, mobile_number, email, department } = req.body
    const userId = req.user.id

    // Validate department (only Sales, Finance, or All Departments allowed)
    if (department && !['Sales', 'Finance', 'All Departments'].includes(department)) {
      return res.status(400).json({ error: 'Only Sales, Finance, or All Departments are allowed' })
    }

    // Check if email conflicts with other users (excluding current user)
    if (email) {
      const existingEmail = await db.getRow(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, userId]
      )
      
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists for another user' })
      }
    }

    // Check if mobile number conflicts with other users (excluding current user)
    if (mobile_number) {
      const existingMobile = await db.getRow(
        'SELECT id FROM users WHERE mobile_number = $1 AND id != $2',
        [mobile_number, userId]
      )
      
      if (existingMobile) {
        return res.status(400).json({ error: 'Mobile number already exists for another user' })
      }
    }

    // Update user profile
    const result = await db.query(
      `UPDATE users 
       SET username = COALESCE($1, username), 
           mobile_number = COALESCE($2, mobile_number), 
           email = COALESCE($3, email), 
           department = COALESCE($4, department),
           updated_at = NOW()
       WHERE id = $5
       RETURNING id, username, email, mobile_number, role, department, is_active`,
      [username, mobile_number, email, department, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const updatedUser = result.rows[0]

    console.log('✅ Profile updated successfully:', {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      mobile_number: updatedUser.mobile_number,
      role: updatedUser.role,
      department: updatedUser.department
    })

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('❌ Update profile error:', error)
    res.status(500).json({ error: 'Server error during profile update' })
  }
})

module.exports = router
