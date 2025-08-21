const db = require('../config/database');

const verifyAccess = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // For now, we'll implement a simple permission system
      // In a real application, you'd have a more complex role-based system
      
      // Check if user exists (already verified by verify_jwt)
      if (!req.user || !req.user.id) {
        return res.status(401).json({ 
          error: 'User not authenticated' 
        });
      }

      // For the Sri Chakra Diary app, we'll use a simplified approach
      // where all authenticated users have basic permissions
      // You can extend this later with a proper role/permission system
      
      const allowedPermissions = [
        'profile.me',
        'scope.read',
        'department.read',
        'role.read',
        'employee.read'
      ];

      const adminPermissions = [
        'scope.manage',
        'department.manage', 
        'role.manage',
        'employee.create',
        'employee.update',
        'employee.delete',
        'employee.roles.set',
        'employee.departments.set'
      ];

      // Check if user has the required permission
      if (allowedPermissions.includes(requiredPermission)) {
        return next(); // Allow access for basic permissions
      }

      // For admin permissions, check if user is admin (you can implement this logic)
      // For now, we'll allow all authenticated users (you can modify this)
      if (adminPermissions.includes(requiredPermission)) {
        // You can add admin check logic here
        // For example: check if user has admin role in database
        return next();
      }

      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.',
        required: requiredPermission
      });

    } catch (error) {
      console.error('Access verification error:', error);
      return res.status(500).json({ 
        error: 'Access verification failed.' 
      });
    }
  };
};

module.exports = verifyAccess;
