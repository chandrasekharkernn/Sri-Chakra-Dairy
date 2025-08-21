import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, ShoppingBag, Package, Database, Box, Truck } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Production = () => {
  const navigate = useNavigate()

  const handleSales = () => {
    // Handle sales functionality
    console.log('Sales clicked')
    navigate('/production/sales')
  }

  const handleOtherDairySales = () => {
    navigate('/production/other-dairy-sales')
  }

  const handleProducts = () => {
    navigate('/production/products')
  }

  const handleSiloClosingBalance = () => {
    navigate('/production/silo-closing-balance')
  }

  const handleProductsClosingStock = () => {
    navigate('/production/products-closing-stock')
  }

  const handleWaitingTanker = () => {
    navigate('/production/waiting-tanker')
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
            <h1 className="text-3xl font-bold text-gray-900">Production</h1>
            <p className="text-gray-600 mt-2">Manage production operations and sales tracking</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            {/* Sales Button */}
            <button
              onClick={handleSales}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <TrendingUp className="h-5 w-5" />
              Sales
            </button>

            {/* Other Dairy Sales Button */}
            <button
              onClick={handleOtherDairySales}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
            >
              <ShoppingBag className="h-5 w-5" />
              Other Dairy Sales
            </button>

            {/* Products Button */}
            <button
              onClick={handleProducts}
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-sm"
            >
              <Package className="h-5 w-5" />
              Products
            </button>

            {/* Silo Closing Balance Button */}
            <button
              onClick={handleSiloClosingBalance}
              className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors duration-200 shadow-sm"
            >
              <Database className="h-5 w-5" />
              Silo Closing Balance
            </button>

            {/* Products Closing Stock Button */}
            <button
              onClick={handleProductsClosingStock}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
            >
              <Box className="h-5 w-5" />
              Products Closing Stock
            </button>

            {/* Waiting Tanker Button */}
            <button
              onClick={handleWaitingTanker}
              className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200 shadow-sm"
            >
              <Truck className="h-5 w-5" />
              Waiting Tanker
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Production
