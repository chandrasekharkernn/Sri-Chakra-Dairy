import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Users, UserCheck, UserX, Shield } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import axios from '../config/axios'

const Employees = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    rolesCovered: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployeeStats()
  }, [])

  const fetchEmployeeStats = async () => {
    try {
      const response = await axios.get('/api/employees')

      const employees = response.data.employees || []
      
      // Calculate stats
      const totalEmployees = employees.length
      const activeEmployees = employees.filter(emp => emp.is_active).length
      const inactiveEmployees = totalEmployees - activeEmployees
      
      // Count unique roles (excluding super_admin)
      const uniqueRoles = new Set(employees.map(emp => emp.role).filter(role => role !== 'super_admin'))
      const rolesCovered = uniqueRoles.size

      setStats({
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        rolesCovered
      })
    } catch (error) {
      console.error('Error fetching employee stats:', error)
      // Set default values if API fails
      setStats({
        totalEmployees: 0,
        activeEmployees: 0,
        inactiveEmployees: 0,
        rolesCovered: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEmployee = () => {
    navigate('/super-admin/create-employee')
  }

  const handleManageEmployees = () => {
    // Navigate to employee management page (can be implemented later)
    navigate('/super-admin/manage-employees')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-16">
        {/* Content Area */}
        <div className="pt-24 p-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-gray-600 mt-2">Manage your organization's employees</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleCreateEmployee}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <Plus className="h-5 w-5" />
              Create Employee
            </button>
            <button
              onClick={handleManageEmployees}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
            >
              <Users className="h-5 w-5" />
              Manage Employees
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Employees */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {loading ? '...' : stats.totalEmployees}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Active Employees */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Employees</p>
                  <p className="text-3xl font-bold text-green-600">
                    {loading ? '...' : stats.activeEmployees}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Inactive Employees */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive Employees</p>
                  <p className="text-3xl font-bold text-red-600">
                    {loading ? '...' : stats.inactiveEmployees}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <UserX className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>

            {/* Roles Covered */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Roles Covered</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {loading ? '...' : stats.rolesCovered}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  )
}

export default Employees
