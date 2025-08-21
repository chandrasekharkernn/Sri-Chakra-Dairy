// authentication/routes/index.js
const router = require('express').Router();

const authController = require('../controllers/authController');

// --- Auth ---
router.post('/generate-otp', authController.generateOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;