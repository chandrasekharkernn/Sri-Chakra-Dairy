const db = require('../config/database');

const verify_user = async (req, res, next) => {
  try {
    // This middleware can be used for additional user verification
    // beyond just JWT verification
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        error: 'User not authenticated' 
      });
    }

    // You can add additional user verification logic here
    // For example: check if user account is active, not suspended, etc.
    
    // For now, we'll just pass through if user exists
    next();
    
  } catch (error) {
    console.error('User verification error:', error);
    return res.status(500).json({ 
      error: 'User verification failed.' 
    });
  }
};

module.exports = verify_user;
