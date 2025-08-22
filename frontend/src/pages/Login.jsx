import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Phone, ArrowRight } from 'lucide-react'
import Logo from '../components/Logo'

const Login = () => {
  const [employeeNumber, setEmployeeNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState('')
  const navigate = useNavigate()

  const handleSendOTP = async () => {
    if (!employeeNumber || employeeNumber.length < 5) {
      toast.error('Please enter a valid employee number')
      return
    }

    setLoading(true)
    try {
      console.log('🔧 API URL:', import.meta.env.VITE_API_URL)
      console.log('🔧 Axios baseURL:', axios.defaults.baseURL)
      console.log('🔧 Attempting to send OTP to:', employeeNumber)
      
      const response = await axios.post('/api/auth/generate-otp', {
        employeeNumber
      })
      
      if (response.data.success) {
        setShowOtpInput(true)
        toast.success('OTP sent to your registered email!')
        if (response.data.tempOtp) {
          setGeneratedOtp(response.data.tempOtp)
        }
      }
    } catch (error) {
      console.error('OTP Error:', error)
      console.error('Error details:', error.response?.data)
      console.error('Error status:', error.response?.status)
      console.error('Error message:', error.message)
      
      if (error.response?.data?.tempOtp) {
        setGeneratedOtp(error.response.data.tempOtp)
        setShowOtpInput(true)
        toast.success('OTP sent! (Check console for development)')
      } else {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to send OTP. Please try again.'
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post('/api/auth/verify-otp', {
        employeeNumber,
        otp
      })

      if (response.data.success) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        toast.success('Login successful!')
        
        // Redirect to welcome page
        navigate('/welcome')
      }
    } catch (error) {
      console.error('OTP Verification Error:', error)
      toast.error(error.response?.data?.error || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="large" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h1>
          <p className="text-green-600 font-medium">Login to continue</p>
        </div>

                 {/* Login Card */}
         <div className="bg-white rounded-2xl shadow-xl p-12">
          {!showOtpInput ? (
            /* Mobile Number Input */
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employee Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={employeeNumber}
                    onChange={(e) => setEmployeeNumber(e.target.value)}
                    placeholder="Enter your employee number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    maxLength={20}
                  />
                </div>
              </div>
              
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* OTP Input */
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-lg font-mono"
                  maxLength={6}
                />
                <p className="text-sm text-gray-500 mt-2">
                  OTP sent to your registered email
                </p>
              </div>

              {generatedOtp && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Development OTP:</strong> {generatedOtp}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                
                <button
                  onClick={() => {
                    setShowOtpInput(false)
                    setOtp('')
                    setGeneratedOtp('')
                  }}
                  className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors duration-200"
                >
                  ← Back to employee number
                </button>
              </div>
            </div>
          )}
        </div>

                 {/* Footer */}
         <div className="text-center mt-16">
          <div className="text-sm text-gray-600 mb-2">
            Terms and Conditions | Privacy Policy | Refunds | Contact Us
          </div>
          <div className="w-32 h-px bg-blue-300 mx-auto mb-2"></div>
          <div className="text-sm">
            <span className="text-gray-600">Powered by </span>
            <button
              onClick={() => window.open('https://kernn.ai/', '_blank')}
              className="text-red-700 font-semibold hover:text-red-800 transition-colors duration-200 cursor-pointer"
            >
              KERNN
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
