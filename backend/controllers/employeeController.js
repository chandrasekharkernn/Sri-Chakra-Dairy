const bcrypt = require('bcryptjs')
const db = require('../config/database')

// Create Employee
const createEmployee = async (req, res) => {
  try {
    const { username, email, mobile_number, department, role } = req.body

    // Validate required fields
    if (!username || !email || !mobile_number || !department) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Validate department (only Sales, Finance, or All Departments allowed)
    const allowedDepartments = ['Sales', 'Finance', 'All Departments']
    if (!allowedDepartments.includes(department)) {
      return res.status(400).json({ error: 'Only Sales, Finance, or All Departments are allowed' })
    }

    // Use the role from request body instead of forcing it to 'employee'
    const userRole = role || 'employee'

    // Check if email already exists
    const existingEmail = await db.getRow(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    // Check if mobile number already exists
    const existingMobile = await db.getRow(
      'SELECT id FROM users WHERE mobile_number = $1',
      [mobile_number]
    )

    if (existingMobile) {
      return res.status(400).json({ error: 'Mobile number already exists' })
    }

    // Generate dummy password hash (since login is OTP-based)
    const dummyPassword = 'dummy-password-for-otp-only'
    const passwordHash = await bcrypt.hash(dummyPassword, 10)

    // Insert new employee
    const result = await db.query(
      `INSERT INTO users (username, email, mobile_number, password_hash, role, department, is_active, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
       RETURNING id, username, email, mobile_number, role, department, is_active`,
      [username, email, mobile_number, passwordHash, userRole, department, true]
    )

    const newEmployee = result.rows[0]

    console.log('✅ Employee created successfully:', {
      id: newEmployee.id,
      username: newEmployee.username,
      email: newEmployee.email,
      mobile_number: newEmployee.mobile_number,
      role: newEmployee.role,
      department: department
    })

    res.status(201).json({
      message: 'Employee created successfully',
      employee: {
        id: newEmployee.id,
        username: newEmployee.username,
        email: newEmployee.email,
        mobile_number: newEmployee.mobile_number,
        role: newEmployee.role,
        department: department
      }
    })

  } catch (error) {
    console.error('❌ Create employee error:', error)
    res.status(500).json({ error: 'Server error during employee creation' })
  }
}

// Get All Employees
const getAllEmployees = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, email, mobile_number, role, department, is_active, created_at FROM users WHERE role IN ($1, $2) ORDER BY created_at DESC',
      ['employee', 'admin']
    )

    res.json({
      employees: result.rows
    })

  } catch (error) {
    console.error('❌ Get employees error:', error)
    res.status(500).json({ error: 'Server error while fetching employees' })
  }
}

// Update Employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params
    const { username, email, mobile_number, department, is_active } = req.body

    // Validate department (only Sales, Finance, or All Departments allowed)
    if (department && !['Sales', 'Finance', 'All Departments'].includes(department)) {
      return res.status(400).json({ error: 'Only Sales, Finance, or All Departments are allowed' })
    }

    // Check if employee exists
    const existingEmployee = await db.getRow(
      'SELECT id, role FROM users WHERE id = $1',
      [id]
    )

    if (!existingEmployee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    // Ensure only employees and admins can be updated (not super_admin)
    if (existingEmployee.role === 'super_admin') {
      return res.status(403).json({ error: 'Cannot update super admin' })
    }

    // Check if email conflicts with other users (excluding current employee)
    if (email) {
      const existingEmail = await db.getRow(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, id]
      )
      
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists for another user' })
      }
    }

    // Check if mobile number conflicts with other users (excluding current employee)
    if (mobile_number) {
      const existingMobile = await db.getRow(
        'SELECT id FROM users WHERE mobile_number = $1 AND id != $2',
        [mobile_number, id]
      )
      
      if (existingMobile) {
        return res.status(400).json({ error: 'Mobile number already exists for another user' })
      }
    }

    // Update employee or admin
    const result = await db.query(
      `UPDATE users 
       SET username = COALESCE($1, username), 
           email = COALESCE($2, email), 
           mobile_number = COALESCE($3, mobile_number), 
           department = COALESCE($4, department),
           is_active = COALESCE($5, is_active),
           updated_at = NOW()
       WHERE id = $6 AND role IN ('employee', 'admin')
       RETURNING id, username, email, mobile_number, role, department, is_active`,
      [username, email, mobile_number, department, is_active, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found or cannot be updated' })
    }

    const updatedEmployee = result.rows[0]

    console.log('✅ Employee updated successfully:', {
      id: updatedEmployee.id,
      username: updatedEmployee.username,
      email: updatedEmployee.email,
      mobile_number: updatedEmployee.mobile_number,
      role: updatedEmployee.role
    })

    res.json({
      message: 'Employee updated successfully',
      employee: updatedEmployee
    })

  } catch (error) {
    console.error('❌ Update employee error:', error)
    res.status(500).json({ error: 'Server error during employee update' })
  }
}

// Delete Employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params

    // Check if employee exists
    const existingEmployee = await db.getRow(
      'SELECT id, role FROM users WHERE id = $1',
      [id]
    )

    if (!existingEmployee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    // Ensure only employees and admins can be deleted (not super_admin)
    if (existingEmployee.role === 'super_admin') {
      return res.status(403).json({ error: 'Cannot delete super admin' })
    }

    // Hard delete (completely remove from database)
    const result = await db.query(
      `DELETE FROM users 
       WHERE id = $1 AND role IN ('employee', 'admin')
       RETURNING id, username, email`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found or cannot be deleted' })
    }

    const deletedEmployee = result.rows[0]

    console.log('✅ Employee deleted successfully:', {
      id: deletedEmployee.id,
      username: deletedEmployee.username,
      email: deletedEmployee.email
    })

    res.json({
      message: 'Employee deleted successfully',
      employee: deletedEmployee
    })

  } catch (error) {
    console.error('❌ Delete employee error:', error)
    res.status(500).json({ error: 'Server error during employee deletion' })
  }
}

module.exports = {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee
}
