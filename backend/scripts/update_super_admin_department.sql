-- Update Super Admin Department to "All Departments"
-- This script updates all users with role 'super_admin' to have department 'All Departments'

-- First, let's see what super admin users exist
SELECT id, username, email, role, department, created_at 
FROM users 
WHERE role = 'super_admin';

-- Update all super admin users to have "All Departments"
UPDATE users 
SET department = 'All Departments', 
    updated_at = NOW() 
WHERE role = 'super_admin';

-- Verify the update was successful
SELECT id, username, email, role, department, updated_at 
FROM users 
WHERE role = 'super_admin';

-- Show all users for verification
SELECT id, username, email, role, department, is_active, created_at 
FROM users 
ORDER BY role, username;
