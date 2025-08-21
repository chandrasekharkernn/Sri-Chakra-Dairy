const db = require('../config/database');

const super_admin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        error: 'User not authenticated' 
      });
    }

    // For the Sri Chakra Diary app, we'll implement a simple super admin check
    // You can modify this logic based on your requirements
    
    // Option 1: Check if user has a specific role or flag in database
    // const userRole = await db.getRow(
    //   'SELECT role FROM users WHERE id = $1',
    //   [req.user.id]
    // );
    
    // if (userRole && userRole.role === 'super_admin') {
    //   return next();
    // }

    // Option 2: Check against a list of super admin user IDs
    const superAdminIds = process.env.SUPER_ADMIN_IDS ? 
      process.env.SUPER_ADMIN_IDS.split(',').map(id => parseInt(id.trim())) : 
      [1]; // Default to user ID 1 as super admin

    if (superAdminIds.includes(req.user.id)) {
      return next();
    }

    // Option 3: For development, allow all users (remove this in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Development mode: Allowing super admin access for user:', req.user.id);
      return next();
    }

    return res.status(403).json({ 
      error: 'Access denied. Super admin privileges required.' 
    });

  } catch (error) {
    console.error('Super admin verification error:', error);
    return res.status(500).json({ 
      error: 'Super admin verification failed.' 
    });
  }
};

module.exports = super_admin;
