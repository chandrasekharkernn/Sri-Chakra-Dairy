import React from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import Footer from '../components/Footer'

const Welcome = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleGetStarted = () => {
    if (user.role === 'super_admin') {
      navigate('/super-admin/dashboard')
    } else {
      navigate('/home')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo and Branding */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="xlarge" showText={true} />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome{' '}
            <span className="text-green-600">
              {user.username || 'User'}
            </span>
          </h1>
          <p className="text-gray-600">
            {user.role === 'super_admin' ? 'Super Admin Dashboard' : 'Employee Dashboard'}
          </p>
        </div>

        {/* Get Started Button */}
        <div className="mb-8">
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 border-2 border-blue-600 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200"
          >
            Get Started
          </button>
        </div>

        {/* Footer - Removed from welcome page */}
      </div>
    </div>
  )
}

export default Welcome
