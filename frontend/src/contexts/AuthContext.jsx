import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await api.get('/auth/profile')
        setUser(response.data.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user, token } = response.data
      
      localStorage.setItem('token', token)
      setUser(user)
      
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      }
    }
  }

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { 
        username, 
        email, 
        password 
      })
      const { user, token } = response.data
      
      localStorage.setItem('token', token)
      setUser(user)
      
      return { success: true }
    } catch (error) {
      console.error('Registration failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateProfile = async (updates) => {
    try {
      const response = await api.put('/auth/profile', updates)
      setUser(response.data.user)
      return { success: true }
    } catch (error) {
      console.error('Profile update failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Profile update failed' 
      }
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
