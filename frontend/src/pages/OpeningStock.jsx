import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, Send, Calendar, Plus, Trash2, ArrowLeft } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { dataApi } from '../lib/api'
import { toast } from 'react-hot-toast'

const OpeningStock = () => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const prefillToastShown = useRef(new Set())
  
  // Tanker Transaction data
  const [tankerData, setTankerData] = useState([
    { particulars: '', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' }
  ])
  
  // Own Procurement data
  const [procurementData, setProcurementData] = useState([
    { particulars: 'Avapadu', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Asannagudem', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Chinnaigudem', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Korukonda', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Jangareddy Gudem', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'T.Narasapuram', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' }
  ])

  // Opening Stock data
  const [openingStockData, setOpeningStockData] = useState([
    { particulars: 'Silo stock', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' },
    { particulars: 'Curd Stock', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' }
  ])

  const tableHeaders = ['Particulars', 'Qty (Ltr)', 'Qty Kg\'s', 'Avg Fat', 'CLR', 'Avg SNF', 'Kg Fat', 'Kg SNF']

  const handleTankerChange = (index, field, value) => {
    const newData = [...tankerData]
    newData[index][field] = value
    setTankerData(newData)
  }

  const handleProcurementChange = (index, field, value) => {
    const newData = [...procurementData]
    newData[index][field] = value
    setProcurementData(newData)
  }

  const handleOpeningStockChange = (index, field, value) => {
    const newData = [...openingStockData]
    newData[index][field] = value
    setOpeningStockData(newData)
  }

  const addTankerRow = () => {
    setTankerData([...tankerData, { particulars: '', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' }])
  }

  const addProcurementRow = () => {
    setProcurementData([...procurementData, { particulars: '', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' }])
  }

  const addOpeningStockRow = () => {
    setOpeningStockData([...openingStockData, { particulars: '', qtyLtr: '', qtyKg: '', avgFat: '', clr: '', avgSnf: '', kgFat: '', kgSnf: '' }])
  }

  const removeTankerRow = (index) => {
    if (tankerData.length > 1) {
      const newData = tankerData.filter((_, i) => i !== index)
      setTankerData(newData)
    }
  }

  const removeProcurementRow = (index) => {
    if (procurementData.length > 1) {
      const newData = procurementData.filter((_, i) => i !== index)
      setProcurementData(newData)
    }
  }

  const removeOpeningStockRow = (index) => {
    if (openingStockData.length > 1) {
      const newData = openingStockData.filter((_, i) => i !== index)
      setOpeningStockData(newData)
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

  const tankerTotals = calculateTotals(tankerData)
  const procurementTotals = calculateTotals(procurementData)
  const openingStockTotals = calculateTotals(openingStockData)

  const handleBackToProcurement = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const role = user.role
    const backPath = role === 'super_admin' || role === 'admin' ? '/super-admin/procurement' : '/procurement'
    navigate(backPath)
  }

  // Helper to get previous date (yyyy-mm-dd)
  const getPreviousDateISO = (iso) => {
    try {
      const d = new Date(iso)
      d.setDate(d.getDate() - 1)
      return d.toISOString().split('T')[0]
    } catch (e) {
      return iso
    }
  }

  // Load existing data when date changes
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const response = await dataApi.getOpeningStockData(selectedDate)
        if (response.data.success && response.data.data) {
          const { openingStockData: existingOpeningStock, tankerData: existingTanker, procurementData: existingProcurement } = response.data.data
          
          let hasOpening = false
          if (existingOpeningStock && existingOpeningStock.length > 0) {
            const convertedOpeningStock = existingOpeningStock.map(item => ({
              particulars: item.particulars,
              qtyLtr: item.qty_ltr || '',
              qtyKg: item.qty_kg || '',
              avgFat: item.avg_fat || '',
              clr: item.clr || '',
              avgSnf: item.avg_snf || '',
              kgFat: item.kg_fat || '',
              kgSnf: item.kg_snf || ''
            }))
            setOpeningStockData(convertedOpeningStock)
            hasOpening = true
          }
          
          if (existingTanker && existingTanker.length > 0) {
            const convertedTanker = existingTanker.map(item => ({
              particulars: item.particulars,
              qtyLtr: item.qty_ltr || '',
              qtyKg: item.qty_kg || '',
              avgFat: item.avg_fat || '',
              clr: item.clr || '',
              avgSnf: item.avg_snf || '',
              kgFat: item.kg_fat || '',
              kgSnf: item.kg_snf || ''
            }))
            setTankerData(convertedTanker)
          }
          
          if (existingProcurement && existingProcurement.length > 0) {
            const convertedProcurement = existingProcurement.map(item => ({
              particulars: item.particulars,
              qtyLtr: item.qty_ltr || '',
              qtyKg: item.qty_kg || '',
              avgFat: item.avg_fat || '',
              clr: item.clr || '',
              avgSnf: item.avg_snf || '',
              kgFat: item.kg_fat || '',
              kgSnf: item.kg_snf || ''
            }))
            setProcurementData(convertedProcurement)
          }

          // If no opening stock for selected date, prefill from previous day's closing
          if (!hasOpening) {
            try {
              const prevDate = getPreviousDateISO(selectedDate)
              const [siloRes, productsCloseRes] = await Promise.all([
                dataApi.getSiloClosingBalanceData(prevDate),
                dataApi.getProductsClosingStockData(prevDate)
              ])

              const siloRows = siloRes?.data?.data || []
              const prodCloseRows = productsCloseRes?.data?.data || []
              const sum = (rows, key) => rows.reduce((acc, r) => acc + (parseFloat(r[key]) || 0), 0)

              const fmt = (n) => (Number.isFinite(n) && n !== 0 ? n.toFixed(2) : '0')

              const siloQtyLtr = sum(siloRows, 'qty_ltr')
              const siloQtyKg = sum(siloRows, 'qty_kg')
              const siloKgFat = sum(siloRows, 'kg_fat')
              const siloKgSnf = sum(siloRows, 'kg_snf')

              const curdQtyLtr = sum(prodCloseRows, 'qty_ltr')
              const curdQtyKg = sum(prodCloseRows, 'qty_kg')
              const curdKgFat = sum(prodCloseRows, 'kg_fat')
              const curdKgSnf = sum(prodCloseRows, 'kg_snf')

              setOpeningStockData([
                { particulars: 'Silo stock', qtyLtr: fmt(siloQtyLtr), qtyKg: fmt(siloQtyKg), avgFat: '0', clr: '0', avgSnf: '0', kgFat: fmt(siloKgFat), kgSnf: fmt(siloKgSnf) },
                { particulars: 'Curd Stock', qtyLtr: fmt(curdQtyLtr), qtyKg: fmt(curdQtyKg), avgFat: '0', clr: '0', avgSnf: '0', kgFat: fmt(curdKgFat), kgSnf: fmt(curdKgSnf) }
              ])
              const hasAnyPrev = [siloQtyLtr, siloQtyKg, siloKgFat, siloKgSnf, curdQtyLtr, curdQtyKg, curdKgFat, curdKgSnf]
                .some(v => Number(v) > 0)
              if (hasAnyPrev && !prefillToastShown.current.has(selectedDate)) {
                toast.success('Pre-filled opening stock from previous day closing')
                prefillToastShown.current.add(selectedDate)
              }
            } catch (e) {
              // Previous day data may not exist; ignore silently
            }
          }
        }
      } catch (error) {
        console.error('Error loading existing data:', error)
        // If no data exists for this date, keep the default pre-filled data
      }
    }

    loadExistingData()
  }, [selectedDate])

  const handleSave = async () => {
    try {
      const data = {
        openingStockData,
        tankerData,
        procurementData
      }
      await dataApi.saveOpeningStockData(data, selectedDate)
      toast.success('Opening stock data saved successfully!')
    } catch (error) {
      console.error('Error saving opening stock data:', error)
      toast.error('Failed to save opening stock data. Please try again.')
    }
  }

  const handleSubmit = async () => {
    try {
      const data = {
        openingStockData,
        tankerData,
        procurementData
      }
      await dataApi.submitOpeningStockData(data, selectedDate)
      toast.success('Opening stock data submitted successfully!')
    } catch (error) {
      console.error('Error submitting opening stock data:', error)
      toast.error('Failed to submit opening stock data. Please try again.')
    }
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
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Opening Stock</h1>
              <button
                onClick={handleBackToProcurement}
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

          {/* Opening Stock Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Opening Stock</h2>
                <button
                  onClick={addOpeningStockRow}
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
                  {openingStockData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="px-4 py-3 border-r border-gray-300">
                        <span className="font-semibold text-gray-800">{row.particulars}</span>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.qtyLtr}
                          onChange={(e) => handleOpeningStockChange(rowIndex, 'qtyLtr', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.qtyKg}
                          onChange={(e) => handleOpeningStockChange(rowIndex, 'qtyKg', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.avgFat}
                          onChange={(e) => handleOpeningStockChange(rowIndex, 'avgFat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.clr}
                          onChange={(e) => handleOpeningStockChange(rowIndex, 'clr', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.avgSnf}
                          onChange={(e) => handleOpeningStockChange(rowIndex, 'avgSnf', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.kgFat}
                          onChange={(e) => handleOpeningStockChange(rowIndex, 'kgFat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.kgSnf}
                          onChange={(e) => handleOpeningStockChange(rowIndex, 'kgSnf', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {openingStockData.length > 1 && (
                          <button
                            onClick={() => removeOpeningStockRow(rowIndex)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr className="bg-purple-50 font-bold">
                    <td className="px-4 py-3 border-r border-gray-300 text-purple-900">TOTAL</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-purple-900 text-right">{openingStockTotals.qtyLtr.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-purple-900 text-right">{openingStockTotals.qtyKg.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-purple-900 text-right">{openingStockTotals.avgFat.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-purple-900 text-right">{openingStockTotals.clr.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-purple-900 text-right">{openingStockTotals.avgSnf.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-purple-900 text-right">{openingStockTotals.kgFat.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-purple-900 text-right">{openingStockTotals.kgSnf.toFixed(2)}</td>
                    <td className="px-4 py-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tanker Transaction Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Tanker Transaction</h2>
                <button
                  onClick={addTankerRow}
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
                  {tankerData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="text"
                          value={row.particulars}
                          onChange={(e) => handleTankerChange(rowIndex, 'particulars', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter particulars"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.qtyLtr}
                          onChange={(e) => handleTankerChange(rowIndex, 'qtyLtr', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.qtyKg}
                          onChange={(e) => handleTankerChange(rowIndex, 'qtyKg', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.avgFat}
                          onChange={(e) => handleTankerChange(rowIndex, 'avgFat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.clr}
                          onChange={(e) => handleTankerChange(rowIndex, 'clr', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.avgSnf}
                          onChange={(e) => handleTankerChange(rowIndex, 'avgSnf', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.kgFat}
                          onChange={(e) => handleTankerChange(rowIndex, 'kgFat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.kgSnf}
                          onChange={(e) => handleTankerChange(rowIndex, 'kgSnf', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {tankerData.length > 1 && (
                          <button
                            onClick={() => removeTankerRow(rowIndex)}
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
                    <td className="px-4 py-3 border-r border-gray-300 text-blue-900 text-right">{tankerTotals.qtyLtr.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-blue-900 text-right">{tankerTotals.qtyKg.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-blue-900 text-right">{tankerTotals.avgFat.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-blue-900 text-right">{tankerTotals.clr.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-blue-900 text-right">{tankerTotals.avgSnf.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-blue-900 text-right">{tankerTotals.kgFat.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-blue-900 text-right">{tankerTotals.kgSnf.toFixed(2)}</td>
                    <td className="px-4 py-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Own Procurement Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Own Procurement</h2>
                <button
                  onClick={addProcurementRow}
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
                  {procurementData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="px-4 py-3 border-r border-gray-300">
                        <span className="font-semibold text-gray-800">{row.particulars}</span>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.qtyLtr}
                          onChange={(e) => handleProcurementChange(rowIndex, 'qtyLtr', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.qtyKg}
                          onChange={(e) => handleProcurementChange(rowIndex, 'qtyKg', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.avgFat}
                          onChange={(e) => handleProcurementChange(rowIndex, 'avgFat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.clr}
                          onChange={(e) => handleProcurementChange(rowIndex, 'clr', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.avgSnf}
                          onChange={(e) => handleProcurementChange(rowIndex, 'avgSnf', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.kgFat}
                          onChange={(e) => handleProcurementChange(rowIndex, 'kgFat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-300">
                        <input
                          type="number"
                          value={row.kgSnf}
                          onChange={(e) => handleProcurementChange(rowIndex, 'kgSnf', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {procurementData.length > 1 && (
                          <button
                            onClick={() => removeProcurementRow(rowIndex)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr className="bg-green-50 font-bold">
                    <td className="px-4 py-3 border-r border-gray-300 text-green-900">TOTAL</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-green-900 text-right">{procurementTotals.qtyLtr.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-green-900 text-right">{procurementTotals.qtyKg.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-green-900 text-right">{procurementTotals.avgFat.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-green-900 text-right">{procurementTotals.clr.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-green-900 text-right">{procurementTotals.avgSnf.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-green-900 text-right">{procurementTotals.kgFat.toFixed(2)}</td>
                    <td className="px-4 py-3 border-r border-gray-300 text-green-900 text-right">{procurementTotals.kgSnf.toFixed(2)}</td>
                    <td className="px-4 py-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default OpeningStock
