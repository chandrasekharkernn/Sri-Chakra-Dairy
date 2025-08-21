import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, Send, Calendar, Plus, Trash2, ArrowLeft } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { dataApi } from '../lib/api'
import { toast } from 'react-hot-toast'

const SiloClosingBalance = () => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  // Silo Closing Balance data with pre-filled particulars
  const [siloClosingBalanceData, setSiloClosingBalanceData] = useState([
    { particulars: 'Silo 1', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Silo 2', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Silo 3', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Silo 4', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Silo 5', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Silo 6', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Silo 7', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Silo 8', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Silo 9', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Silo 10', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Silo 11', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Silo 12', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Silo 13', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Advance Packing', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' }
  ])

  const tableHeaders = ['Particulars', 'Qty (Ltr)', 'Qty Kg\'s', 'Avg Fat', 'CLR', 'Avg SNF', 'Kg Fat', 'Kg SNF']

  const handleSiloClosingBalanceChange = (index, field, value) => {
    const newData = [...siloClosingBalanceData]
    newData[index][field] = value
    setSiloClosingBalanceData(newData)
  }

  const addSiloClosingBalanceRow = () => {
    setSiloClosingBalanceData([...siloClosingBalanceData, { particulars: '', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' }])
  }

  const removeSiloClosingBalanceRow = (index) => {
    if (siloClosingBalanceData.length > 1) {
      const newData = siloClosingBalanceData.filter((_, i) => i !== index)
      setSiloClosingBalanceData(newData)
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

  const siloClosingBalanceTotals = calculateTotals(siloClosingBalanceData)

  // Load existing data when date changes
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const response = await dataApi.getSiloClosingBalanceData(selectedDate)
        if (response.data.success && response.data.data.length > 0) {
          setSiloClosingBalanceData(response.data.data)
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
      await dataApi.saveSiloClosingBalanceData(siloClosingBalanceData, selectedDate)
      toast.success('Silo closing balance data saved successfully!')
    } catch (error) {
      console.error('Error saving silo closing balance data:', error)
      toast.error('Failed to save silo closing balance data. Please try again.')
    }
  }

  const handleSubmit = async () => {
    try {
      await dataApi.submitSiloClosingBalanceData(siloClosingBalanceData, selectedDate)
      toast.success('Silo closing balance data submitted successfully!')
    } catch (error) {
      console.error('Error submitting silo closing balance data:', error)
      toast.error('Failed to submit silo closing balance data. Please try again.')
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
              <h1 className="text-3xl font-bold text-gray-900">Silo Closing Balance</h1>
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

          {/* Silo Closing Balance Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Silo Closing Balance</h2>
                <button
                  onClick={addSiloClosingBalanceRow}
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
                  {siloClosingBalanceData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="px-4 py-3 border-r border-gray-300">
                        <span className="font-semibold text-gray-800">{row.particulars}</span>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.qtyLtr}
                          onChange={(e) => handleSiloClosingBalanceChange(rowIndex, 'qtyLtr', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.qtyKg}
                          onChange={(e) => handleSiloClosingBalanceChange(rowIndex, 'qtyKg', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.avgFat}
                          onChange={(e) => handleSiloClosingBalanceChange(rowIndex, 'avgFat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.clr}
                          onChange={(e) => handleSiloClosingBalanceChange(rowIndex, 'clr', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.avgSnf}
                          onChange={(e) => handleSiloClosingBalanceChange(rowIndex, 'avgSnf', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.kgFat}
                          onChange={(e) => handleSiloClosingBalanceChange(rowIndex, 'kgFat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.kgSnf}
                          onChange={(e) => handleSiloClosingBalanceChange(rowIndex, 'kgSnf', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {siloClosingBalanceData.length > 1 && (
                          <button
                            onClick={() => removeSiloClosingBalanceRow(rowIndex)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr className="bg-orange-50 font-bold">
                    <td className="px-4 py-3 border-r border-gray-300 text-orange-900">TOTAL</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-orange-900 text-right">{siloClosingBalanceTotals.qtyLtr.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-orange-900 text-right">{siloClosingBalanceTotals.qtyKg.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-orange-900 text-right">{siloClosingBalanceTotals.avgFat.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-orange-900 text-right">{siloClosingBalanceTotals.clr.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-orange-900 text-right">{siloClosingBalanceTotals.avgSnf.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-orange-900 text-right">{siloClosingBalanceTotals.kgFat.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-orange-900 text-right">{siloClosingBalanceTotals.kgSnf.toFixed(2)}</td>
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

export default SiloClosingBalance
