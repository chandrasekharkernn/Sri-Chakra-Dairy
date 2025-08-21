import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Welcome from './pages/Welcome'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import CreateEmployee from './pages/CreateEmployee'
import ManageEmployees from './pages/ManageEmployees'
import Profile from './pages/Profile'
import OpeningStock from './pages/OpeningStock'
import Home from './dashboard/Home'
import Employees from './dashboard/Employees'
import DailyReports from './dashboard/DailyReports'
import Procurement from './dashboard/Procurement'
import Production from './dashboard/Production'
import Sales from './dashboard/Sales'
import OtherDairySales from './dashboard/OtherDairySales'
import Products from './dashboard/Products'
import SiloClosingBalance from './dashboard/SiloClosingBalance'
import ThirdPartyProcurement from './dashboard/ThirdPartyProcurement'
import ProductsClosingStock from './dashboard/ProductsClosingStock'
import WaitingTanker from './dashboard/WaitingTanker'
import { SidebarProvider } from './contexts/SidebarContext'
import { SearchProvider } from './contexts/SearchContext'
import './index.css'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  if (!token || !user.role) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <SidebarProvider>
      <SearchProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />
          
          {/* Super Admin Routes */}
          <Route 
            path="/super-admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/super-admin/create-employee" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <CreateEmployee />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/super-admin/manage-employees" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <ManageEmployees />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/super-admin/employees" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <Employees />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/super-admin/daily-reports" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <DailyReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/super-admin/procurement" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <Procurement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/procurement/third-party" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <ThirdPartyProcurement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/super-admin/production" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <Production />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/production/sales" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <Sales />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/production/other-dairy-sales" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <OtherDairySales />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/production/products" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <Products />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/production/silo-closing-balance" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <SiloClosingBalance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/production/products-closing-stock" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <ProductsClosingStock />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/production/waiting-tanker" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <WaitingTanker />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/super-admin/reports" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Employee Routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <DailyReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/procurement" 
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <Procurement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/production" 
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <Production />
              </ProtectedRoute>
            } 
          />

          {/* Opening Stock Route (accessible to all authenticated users) */}
          <Route path="/opening-stock" element={<OpeningStock />} />
          
          {/* Profile Route (accessible to all authenticated users) */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </SearchProvider>
    </SidebarProvider>
  )
}

export default App
