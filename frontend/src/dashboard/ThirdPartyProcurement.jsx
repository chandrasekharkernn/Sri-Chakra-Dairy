import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, Send, Calendar, Plus, Trash2, ArrowLeft } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { dataApi } from '../lib/api'
import { toast } from 'react-hot-toast'

const ThirdPartyProcurement = () => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  // Third Party Procurement data with pre-filled particulars
  const [thirdPartyProcurementData, setThirdPartyProcurementData] = useState([
    { particulars: 'Sri Lakshmi Foods', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Srinidhi Products', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'The Kurnool District Milk Producers', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Sidhnath Agrotech Producer', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Chandana Milk Products', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Chandana Milk Products', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' }
  ])

  const tableHeaders = ['Particulars', 'Qty (Ltr)', 'Qty Kg\'s', 'Avg Fat', 'CLR', 'Avg SNF', 'Kg Fat', 'Kg SNF']

  const handleThirdPartyProcurementChange = (index, field, value) => {
    const newData = [...thirdPartyProcurementData]
    newData[index][field] = value
    setThirdPartyProcurementData(newData)
  }

  const addThirdPartyProcurementRow = () => {
    setThirdPartyProcurementData([...thirdPartyProcurementData, { particulars: '', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' }])
  }

  const removeThirdPartyProcurementRow = (index) => {
    if (thirdPartyProcurementData.length > 1) {
      const newData = thirdPartyProcurementData.filter((_, i) => i !== index)
      setThirdPartyProcurementData(newData)
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

  const thirdPartyProcurementTotals = calculateTotals(thirdPartyProcurementData)

  // Load existing data when date changes
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const response = await dataApi.getThirdPartyProcurementData(selectedDate)
        if (response.data.success && response.data.data.length > 0) {
          setThirdPartyProcurementData(response.data.data)
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
      await dataApi.saveThirdPartyProcurementData(thirdPartyProcurementData, selectedDate)
      toast.success('Third party procurement data saved successfully!')
    } catch (error) {
      console.error('Error saving third party procurement data:', error)
      toast.error('Failed to save third party procurement data. Please try again.')
    }
  }

  const handleSubmit = async () => {
    try {
      await dataApi.submitThirdPartyProcurementData(thirdPartyProcurementData, selectedDate)
      toast.success('Third party procurement data submitted successfully!')
    } catch (error) {
      console.error('Error submitting third party procurement data:', error)
      toast.error('Failed to submit third party procurement data. Please try again.')
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
              <h1 className="text-3xl font-bold text-gray-900">3rd Party Procurement</h1>
              <button
                onClick={() => navigate('/super-admin/procurement')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Procurement
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

          {/* 3rd Party Procurement Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">3rd Party Procurement</h2>
                <button
                  onClick={addThirdPartyProcurementRow}
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
                  {thirdPartyProcurementData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="text"
                          value={row.particulars}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.qtyLtr}
                          onChange={(e) => handleThirdPartyProcurementChange(rowIndex, 'qtyLtr', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.qtyKg}
                          onChange={(e) => handleThirdPartyProcurementChange(rowIndex, 'qtyKg', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.avgFat}
                          onChange={(e) => handleThirdPartyProcurementChange(rowIndex, 'avgFat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.clr}
                          onChange={(e) => handleThirdPartyProcurementChange(rowIndex, 'clr', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.avgSnf}
                          onChange={(e) => handleThirdPartyProcurementChange(rowIndex, 'avgSnf', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.kgFat}
                          onChange={(e) => handleThirdPartyProcurementChange(rowIndex, 'kgFat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.kgSnf}
                          onChange={(e) => handleThirdPartyProcurementChange(rowIndex, 'kgSnf', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {thirdPartyProcurementData.length > 1 && (
                          <button
                            onClick={() => removeThirdPartyProcurementRow(rowIndex)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr className="bg-blue-50 font-bold">
                    <td className="px-4 py-3 border-r border-gray-300 text-blue-900">TOTAL</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-blue-900 text-right">{thirdPartyProcurementTotals.qtyLtr.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-blue-900 text-right">{thirdPartyProcurementTotals.qtyKg.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-blue-900 text-right">{thirdPartyProcurementTotals.avgFat.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-blue-900 text-right">{thirdPartyProcurementTotals.clr.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-blue-900 text-right">{thirdPartyProcurementTotals.avgSnf.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-blue-900 text-right">{thirdPartyProcurementTotals.kgFat.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-blue-900 text-right">{thirdPartyProcurementTotals.kgSnf.toFixed(2)}</td>
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

export default ThirdPartyProcurement
