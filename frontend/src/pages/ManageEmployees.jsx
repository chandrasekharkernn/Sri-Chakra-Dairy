import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit, Trash2, UserCheck, UserX, Eye } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import axios from '../config/axios'

const ManageEmployees = () => {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees')
      setEmployees(response.data.employees || [])
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (employeeId, currentStatus) => {
    try {
      await axios.put(`/api/employees/${employeeId}`, {
        is_active: !currentStatus
      })
      // Refresh the list
      fetchEmployees()
    } catch (error) {
      console.error('Error updating employee status:', error)
    }
  }

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`/api/employees/${employeeId}`)
        // Refresh the list
        fetchEmployees()
      } catch (error) {
        console.error('Error deleting employee:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Header />
        <Sidebar />
        <div className="flex-1 ml-16">
          <div className="pt-24 p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading employees...</div>
            </div>
          </div>
        </div>
      </div>
    )
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
          {/* Breadcrumb */}
          <div className="mb-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <button
                    onClick={() => navigate('/super-admin/employees')}
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Employees
                  </button>
                </li>
                <li>
                  <div className="flex items-center">
                                         <span className="text-gray-400 mx-2">{'>'}</span>
                    <span className="text-sm font-medium text-gray-500">Manage Employees</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Employees</h1>
            <p className="text-gray-600 mt-2">View and manage all employees</p>
          </div>

          {/* Employees Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Employee List</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {employee.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {employee.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.email}</div>
                        <div className="text-sm text-gray-500">{employee.mobile_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {employee.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleStatus(employee.id, employee.is_active)}
                            className={`inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white ${
                              employee.is_active 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {employee.is_active ? (
                              <>
                                <UserX className="h-3 w-3 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-3 w-3 mr-1" />
                                Activate
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {employees.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">No employees found</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageEmployees
