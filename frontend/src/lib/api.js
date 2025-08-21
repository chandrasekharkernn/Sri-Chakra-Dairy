import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API helper functions
export const entriesApi = {
  getAll: (params) => api.get('/entries', { params }),
  getById: (id) => api.get(`/entries/${id}`),
  create: (data) => api.post('/entries', data),
  update: (id, data) => api.put(`/entries/${id}`, data),
  delete: (id) => api.delete(`/entries/${id}`),
}

export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
  getStats: () => api.get('/categories/stats/usage'),
}

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (updates) => api.put('/auth/profile', updates),
}

export const dataApi = {
  // Sales Data
  saveSalesData: (data, entryDate) => api.post('/data/sales/save', { data, entryDate }),
  submitSalesData: (data, entryDate) => api.post('/data/sales/submit', { data, entryDate }),
  getSalesData: (date) => api.get(`/data/sales/${date}`),
  
  // Other Dairy Sales Data
  saveOtherDairySalesData: (data, entryDate) => api.post('/data/other-dairy-sales/save', { data, entryDate }),
  submitOtherDairySalesData: (data, entryDate) => api.post('/data/other-dairy-sales/submit', { data, entryDate }),
  getOtherDairySalesData: (date) => api.get(`/data/other-dairy-sales/${date}`),
  
  // Products Data
  saveProductsData: (data, entryDate) => api.post('/data/products/save', { data, entryDate }),
  submitProductsData: (data, entryDate) => api.post('/data/products/submit', { data, entryDate }),
  getProductsData: (date) => api.get(`/data/products/${date}`),
  
  // Silo Closing Balance Data
  saveSiloClosingBalanceData: (data, entryDate) => api.post('/data/silo-closing-balance/save', { data, entryDate }),
  submitSiloClosingBalanceData: (data, entryDate) => api.post('/data/silo-closing-balance/submit', { data, entryDate }),
  getSiloClosingBalanceData: (date) => api.get(`/data/silo-closing-balance/${date}`),
  
  // Products Closing Stock Data
  saveProductsClosingStockData: (data, entryDate) => api.post('/data/products-closing-stock/save', { data, entryDate }),
  submitProductsClosingStockData: (data, entryDate) => api.post('/data/products-closing-stock/submit', { data, entryDate }),
  getProductsClosingStockData: (date) => api.get(`/data/products-closing-stock/${date}`),
  
  // Waiting Tanker Data
  saveWaitingTankerData: (data, entryDate) => api.post('/data/waiting-tanker/save', { data, entryDate }),
  submitWaitingTankerData: (data, entryDate) => api.post('/data/waiting-tanker/submit', { data, entryDate }),
  getWaitingTankerData: (date) => api.get(`/data/waiting-tanker/${date}`),
  
  // Third Party Procurement Data
  saveThirdPartyProcurementData: (data, entryDate) => api.post('/data/third-party-procurement/save', { data, entryDate }),
  submitThirdPartyProcurementData: (data, entryDate) => api.post('/data/third-party-procurement/submit', { data, entryDate }),
  getThirdPartyProcurementData: (date) => api.get(`/data/third-party-procurement/${date}`),
  
  // Opening Stock Data
  saveOpeningStockData: (data, entryDate) => api.post('/data/opening-stock/save', { data, entryDate }),
  submitOpeningStockData: (data, entryDate) => api.post('/data/opening-stock/submit', { data, entryDate }),
  getOpeningStockData: (date) => api.get(`/data/opening-stock/${date}`),
  
  // Daily Reports
  getDailyReport: (date) => api.get(`/data/daily-reports/${date}`),
}
