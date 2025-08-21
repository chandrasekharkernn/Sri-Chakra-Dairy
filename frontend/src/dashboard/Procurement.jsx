import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, ShoppingCart } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Procurement = () => {
  const navigate = useNavigate()

  const handleOpeningStock = () => {
    // Navigate to Opening Stock page
    navigate('/opening-stock')
  }

  const handleThirdPartyProcurement = () => {
    navigate('/procurement/third-party')
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
            <h1 className="text-3xl font-bold text-gray-900">Procurement</h1>
            <p className="text-gray-600 mt-2">Manage procurement and inventory operations</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            {/* Opening Stock Button */}
            <button
              onClick={handleOpeningStock}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
            >
              <Package className="h-5 w-5" />
              Opening Stock
            </button>

            {/* 3rd Party Procurement Button */}
            <button
              onClick={handleThirdPartyProcurement}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <ShoppingCart className="h-5 w-5" />
              3rd Party Procurement
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Procurement
