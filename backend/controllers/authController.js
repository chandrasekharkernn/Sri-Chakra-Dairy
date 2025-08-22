const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const db = require('../config/database')

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map()

// Email transporter (configure for your email service)
let transporter = null

// Initialize email transporter only if credentials are available
if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your-gmail-app-password') {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'donotreplythisisotp@gmail.com',
      pass: 'jwkuexaybpynqubr'
    },
    tls: {
      rejectUnauthorized: false
    }
  })
  console.log('✅ Email transporter configured successfully')
} else {
  console.log('⚠️ Email credentials not configured. OTP will be logged only.')
}

// Generate OTP
const generateOTP = async (req, res) => {
  try {
    const { mobileNumber } = req.body

    if (!mobileNumber) {
      return res.status(400).json({ error: 'Mobile number is required' })
    }

    // Check if user exists in database by mobile number
    const user = await db.getRow(
      'SELECT id, username, email, mobile_number, role, is_active FROM users WHERE mobile_number = $1',
      [mobileNumber]
    )

    if (!user) {
      return res.status(404).json({ error: 'User not found. Please contact administrator.' })
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is deactivated. Please contact administrator.' })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store OTP with user info and expiration (5 minutes)
    otpStore.set(mobileNumber, {
      otp,
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    })

    // Log OTP clearly in backend console
    console.log('\n' + '='.repeat(60))
    console.log('🔐 OTP GENERATED SUCCESSFULLY 🔐')
    console.log('='.repeat(60))
    console.log('📱 Mobile Number:', mobileNumber)
    console.log('👤 Username:', user.username)
    console.log('📧 Email:', user.email)
    console.log('🔑 Role:', user.role)
    console.log('🎫 OTP Code:', otp)
    console.log('⏰ Expires in: 5 minutes')
    console.log('📅 Generated at:', new Date().toLocaleString())
    console.log('='.repeat(60))
    console.log('🔐 OTP GENERATED SUCCESSFULLY 🔐')
    console.log('='.repeat(60) + '\n')

    // Simple email content like the example
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email, // Send to user's registered email
      subject: 'Login OTP',
      text: `Your OTP to login is ${otp}. Also Check your mobile.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <p>Your OTP to login is <strong>${otp}</strong>. Also Check your mobile.</p>
        </div>
      `
    }

    // Send email
    if (transporter) {
      try {
        await transporter.sendMail(mailOptions)
        console.log('✅ Email sent successfully to:', user.email)
        res.json({
          success: true,
          message: 'OTP sent successfully to your registered email',
          mobileNumber: mobileNumber
        })
      } catch (emailError) {
        console.error('❌ Email error:', emailError.message)
        console.log('📧 OTP would be sent to:', user.email)
        // For development, return OTP in response when email fails
        res.json({
          success: true,
          message: 'OTP generated successfully (email service error)',
          tempOtp: otp, // Development only - remove in production
          mobileNumber: mobileNumber
        })
      }
    } else {
      // Email not configured - return OTP for development
      console.log('📧 OTP would be sent to:', user.email)
      res.json({
        success: true,
        message: 'OTP generated successfully (email not configured)',
        tempOtp: otp, // Development only - remove in production
        mobileNumber: mobileNumber
      })
    }

  } catch (error) {
    console.error('❌ OTP generation error:', error)
    res.status(500).json({ error: 'Server error during OTP generation' })
  }
}

// Verify OTP and login
const verifyOTP = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body

    if (!mobileNumber || !otp) {
      return res.status(400).json({ error: 'Mobile number and OTP are required' })
    }

    // Get stored OTP data
    const otpData = otpStore.get(mobileNumber)

    if (!otpData) {
      console.log('❌ OTP not found for mobile:', mobileNumber)
      return res.status(400).json({ error: 'OTP not found. Please generate a new OTP.' })
    }

    // Check if OTP is expired
    if (Date.now() > otpData.expiresAt) {
      console.log('⏰ OTP expired for mobile:', mobileNumber)
      otpStore.delete(mobileNumber)
      return res.status(400).json({ error: 'OTP has expired. Please generate a new OTP.' })
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      console.log('\n' + '❌'.repeat(20))
      console.log('❌ INVALID OTP ATTEMPT ❌')
      console.log('❌'.repeat(20))
      console.log('📱 Mobile Number:', mobileNumber)
      console.log('👤 Username:', otpData.username)
      console.log('🎫 Expected OTP:', otpData.otp)
      console.log('🎫 Received OTP:', otp)
      console.log('📅 Attempt Time:', new Date().toLocaleString())
      console.log('❌'.repeat(20) + '\n')
      return res.status(400).json({ error: 'Invalid OTP' })
    }

    // Get user from database
    const user = await db.getRow(
      'SELECT id, username, email, mobile_number, role, is_active FROM users WHERE mobile_number = $1',
      [mobileNumber]
    )

    if (!user || !user.is_active) {
      return res.status(403).json({ error: 'User not found or account deactivated' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        mobileNumber: user.mobile_number,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Clear OTP from store
    otpStore.delete(mobileNumber)

    console.log('\n' + '✅'.repeat(20))
    console.log('✅ LOGIN SUCCESSFUL ✅')
    console.log('✅'.repeat(20))
    console.log('👤 Username:', user.username)
    console.log('📱 Mobile Number:', mobileNumber)
    console.log('📧 Email:', user.email)
    console.log('🔑 Role:', user.role)
    console.log('🎫 OTP Verified Successfully')
    console.log('📅 Login Time:', new Date().toLocaleString())
    console.log('✅'.repeat(20))
    console.log('✅ LOGIN SUCCESSFUL ✅')
    console.log('✅'.repeat(20) + '\n')

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile_number: user.mobile_number,
        role: user.role
      },
      token
    })

  } catch (error) {
    console.error('❌ OTP verification error:', error)
    res.status(500).json({ error: 'Server error during OTP verification' })
  }
}

// Logout
const logout = async (req, res) => {
  try {
    // In a real app, you'd invalidate the token
    res.json({
      message: 'Logout successful'
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ error: 'Server error during logout' })
  }
}

// Token refresh
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' })
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'your-secret-key')

    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '15m' }
    )

    res.json({
      message: 'Token refreshed successfully',
      accessToken: newAccessToken
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(401).json({ error: 'Invalid refresh token' })
  }
}

module.exports = {
  generateOTP,
  verifyOTP,
  logout,
  refreshToken
}


