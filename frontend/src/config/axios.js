import axios from 'axios'

// Set base URL for API calls - Update this with your actual backend URL
const API_URL = import.meta.env.VITE_API_URL || 'https://sri-chakra-dairy-backend-jwmt38r86.vercel.app'
axios.defaults.baseURL = API_URL

console.log('🔧 Frontend connecting to API:', API_URL)

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle errors
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axios
