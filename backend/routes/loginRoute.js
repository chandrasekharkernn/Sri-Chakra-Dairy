
// authentication/routes/loginRoute.js
const express = require('express');
const loginrouter = express.Router();

const verify_jwt = require('../middleware/verify_jwt');
const verify_user = require('../middleware/verify_user');
const super_admin = require('../middleware/verify_super_admin');

const {
  generateOTP,
  verifyOTP,
  refreshToken,
  logout
} = require('../controllers/authController');

// Define login routes
loginrouter.post('/generate-otp', generateOTP);
loginrouter.post('/verify-otp', verifyOTP);
loginrouter.post('/refresh-token', verify_jwt, refreshToken);
loginrouter.post('/logout', verify_jwt, logout);

module.exports = loginrouter;
