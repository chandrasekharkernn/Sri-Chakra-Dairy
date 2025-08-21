import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, Send, Calendar, Plus, Trash2, ArrowLeft } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { dataApi } from '../lib/api'
import { toast } from 'react-hot-toast'

const ProductsClosingStock = () => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  // Products Closing Stock data with pre-filled particulars
  const [productsClosingStockData, setProductsClosingStockData] = useState([
    { particulars: 'B.Milk - Cold Storage', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Curd 3.0%', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Curd 1.50%', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Slim Curd 10KG', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Curd 4.5%', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Loose Curd', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' }
  ])

  const tableHeaders = ['Particulars', 'Qty (Ltr)', 'Qty Kg\'s', 'Avg Fat', 'CLR', 'Avg SNF', 'Kg Fat', 'Kg SNF']

  const handleProductsClosingStockChange = (index, field, value) => {
    const newData = [...productsClosingStockData]
    newData[index][field] = value
    setProductsClosingStockData(newData)
  }

  const addProductsClosingStockRow = () => {
    setProductsClosingStockData([...productsClosingStockData, { particulars: '', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' }])
  }

  const removeProductsClosingStockRow = (index) => {
    if (productsClosingStockData.length > 1) {
      const newData = productsClosingStockData.filter((_, i) => i !== index)
      setProductsClosingStockData(newData)
    }
  }

  const calculateTotals = (data) => {
    return data.reduce((acc, row) => {
      acc.qtyLtr += parseFloat(row.qtyLtr) || 0
      acc.qtyKg += parseFloat(row.qtyKg) || 0
      acc.avgFat += parseFloat(row.avgFat) || 0
      acc.clr += parseFloat(row.clr) || 0
      acc.avgSnf += parseFloat(row.avgSnf) || 0
      acc.kgFat += parseFloat(row.kgFat) || 0
      acc.kgSnf += parseFloat(row.kgSnf) || 0
      return acc
    }, { qtyLtr: 0, qtyKg: 0, avgFat: 0, clr: 0, avgSnf: 0, kgFat: 0, kgSnf: 0 })
  }

  const productsClosingStockTotals = calculateTotals(productsClosingStockData)

  // Load existing data when date changes
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const response = await dataApi.getProductsClosingStockData(selectedDate)
        if (response.data.success && response.data.data.length > 0) {
          setProductsClosingStockData(response.data.data)
        }
      } catch (error) {
        console.error('Error loading existing data:', error)
        // Don't show error toast for 404 (no existing data)
        if (error.response?.status !== 404) {
          toast.error('Failed to load existing data')
        }
      }
    }

    loadExistingData()
  }, [selectedDate])

  const handleSave = async () => {
    try {
      await dataApi.saveProductsClosingStockData(productsClosingStockData, selectedDate)
      toast.success('Products closing stock data saved successfully!')
    } catch (error) {
      console.error('Error saving products closing stock data:', error)
      toast.error('Failed to save products closing stock data. Please try again.')
    }
  }

  const handleSubmit = async () => {
    try {
      await dataApi.submitProductsClosingStockData(productsClosingStockData, selectedDate)
      toast.success('Products closing stock data submitted successfully!')
    } catch (error) {
      console.error('Error submitting products closing stock data:', error)
      toast.error('Failed to submit products closing stock data. Please try again.')
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <div className="flex-1 ml-16">
        <div className="pt-24 p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Products Closing Stock</h1>
              <button
                onClick={() => navigate('/super-admin/production')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Production
              </button>
            </div>
            
            {/* Date Picker */}
            <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4" />
                Select Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm font-medium"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm font-medium"
              >
                <Send className="h-4 w-4" />
                Submit
              </button>
            </div>
          </div>

          {/* Products Closing Stock Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Products Closing Stock</h2>
                <button
                  onClick={addProductsClosingStockRow}
                  className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  Add Row
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    {tableHeaders.map((header, index) => (
                      <th key={index} className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-r border-gray-300 last:border-r-0">
                        {header}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {productsClosingStockData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="px-4 py-3 border-r border-gray-300">
                        <span className="font-semibold text-gray-800">{row.particulars}</span>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.qtyLtr}
                          onChange={(e) => handleProductsClosingStockChange(rowIndex, 'qtyLtr', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.qtyKg}
                          onChange={(e) => handleProductsClosingStockChange(rowIndex, 'qtyKg', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.avgFat}
                          onChange={(e) => handleProductsClosingStockChange(rowIndex, 'avgFat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.clr}
                          onChange={(e) => handleProductsClosingStockChange(rowIndex, 'clr', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.avgSnf}
                          onChange={(e) => handleProductsClosingStockChange(rowIndex, 'avgSnf', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.kgFat}
                          onChange={(e) => handleProductsClosingStockChange(rowIndex, 'kgFat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.kgSnf}
                          onChange={(e) => handleProductsClosingStockChange(rowIndex, 'kgSnf', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {productsClosingStockData.length > 1 && (
                          <button
                            onClick={() => removeProductsClosingStockRow(rowIndex)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr className="bg-indigo-50 font-bold">
                    <td className="px-4 py-3 border-r border-gray-300 text-indigo-900">TOTAL</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-indigo-900 text-right">{productsClosingStockTotals.qtyLtr.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-indigo-900 text-right">{productsClosingStockTotals.qtyKg.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-indigo-900 text-right">{productsClosingStockTotals.avgFat.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-indigo-900 text-right">{productsClosingStockTotals.clr.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-indigo-900 text-right">{productsClosingStockTotals.avgSnf.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-indigo-900 text-right">{productsClosingStockTotals.kgFat.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-indigo-900 text-right">{productsClosingStockTotals.kgSnf.toFixed(2)}</td>
                    <td className="px-4 py-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ProductsClosingStock
