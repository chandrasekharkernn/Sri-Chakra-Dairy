import React, { useState, useEffect } from 'react'
import { Download, Calendar, FileSpreadsheet, FileText, Eye, Printer } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { dataApi } from '../lib/api'
import { toast } from 'react-hot-toast'
import * as XLSX from 'xlsx'

const DailyReports = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isLoading, setIsLoading] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewRows, setPreviewRows] = useState([])
  const [reportData, setReportData] = useState(null)
  const todayISO = new Date().toISOString().split('T')[0]

  // Load report data when component mounts
  useEffect(() => {
    if (selectedDate) {
      handleDateChange(selectedDate)
    }
  }, []) // Empty dependency array means this runs once on mount

  // CSV cell escaper to safely handle commas, quotes, and newlines
  const csvEscape = (value) => {
    const str = value === null || value === undefined ? '' : String(value)
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"'
    }
    return str
  }

  const formatReportDate = (isoDate) => {
    // Expect yyyy-mm-dd, output dd.MM.yyyy
    try {
      const [y, m, d] = isoDate.split('-')
      return `${d}.${m}.${y}`
    } catch (_) {
      return isoDate
    }
  }

  const monthLabel = (isoDate) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    try {
      const dt = new Date(isoDate)
      const mon = months[dt.getMonth()]
      const yr = dt.getFullYear()
      return `${mon}'${yr}`
    } catch (_) {
      return isoDate
    }
  }

  const handleViewReport = async () => {
    if (!reportData) {
      toast.error('Please select a date first')
      return
    }
    
    setIsPreviewOpen(true)
    toast.success('Excel preview opened!')
    
    // Auto scroll to preview after a short delay
    setTimeout(() => {
      const previewModal = document.querySelector('.preview-modal')
      if (previewModal) {
        previewModal.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      
      // Auto scroll to table content
      setTimeout(() => {
        const tableContainer = document.getElementById('preview-table-container')
        if (tableContainer) {
          tableContainer.scrollTop = 0
        }
      }, 200)
    }, 100)
  }

  // Auto-load report when date changes
  const handleDateChange = async (newDate) => {
    setSelectedDate(newDate)
    if (newDate) {
    setIsLoading(true)
    try {
        const response = await dataApi.getDailyReport(newDate)
        
                if (response.data.success) {
          const data = response.data.data
          console.log('Available data keys:', Object.keys(data))
          console.log('Full data:', data)
          setReportData(data)
          
          // Generate Excel-like data structure for preview
          const excelData = generateExcelData(data, newDate)
        setPreviewRows(excelData)
      } else {
        toast.error('Failed to fetch report data')
      }
    } catch (error) {
        console.error('Error loading report:', error)
        toast.error('Failed to load report. Please try again.')
    } finally {
      setIsLoading(false)
      }
    }
  }

  const handleDownloadReport = async () => {
    if (!reportData) {
      toast.error('Please select a date first')
      return
    }
    
    // Show Excel preview first
    setIsPreviewOpen(true)
    toast.success('Excel preview opened!')
    
    // Auto scroll to preview after a short delay
    setTimeout(() => {
      const previewModal = document.querySelector('.preview-modal')
      if (previewModal) {
        previewModal.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      
      // Auto scroll to table content
      setTimeout(() => {
        const tableContainer = document.getElementById('preview-table-container')
        if (tableContainer) {
          tableContainer.scrollTop = 0
        }
      }, 200)
    }, 100)
  }

  const handleConfirmDownload = async () => {
    try {
    const csvContent = previewRows.map(row => row.map(csvEscape).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `daily_report_${selectedDate}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Daily report downloaded successfully!')
    } catch (error) {
      console.error('Error downloading report:', error)
      toast.error('Failed to download report')
    }
  }

  // Generate PDF preview and download
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false)
  const [pdfHtml, setPdfHtml] = useState('')

  const handlePdfPreview = async () => {
    if (!reportData) {
      toast.error('Please load the report first')
      return
    }
    
    try {
      const rows = generateExcelData(reportData, selectedDate)
      // Build comprehensive HTML for PDF preview
      const logoSrc = '/sri chakra logo.png'
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto;">
          <!-- Header -->
          <div style="display:flex; align-items:center; justify-content:center; gap:12px; margin-bottom:16px; border-bottom: 2px solid #1f2937; padding-bottom: 12px;">
            <img src="${logoSrc}" alt="Sri Chakra" style="height:50px;"/>
            <div style="font-weight:700; font-size: 18px; color: #1f2937;">Sri Chakra Milk Products - Avapadu</div>
          </div>
          
          <!-- Title -->
          <div style="text-align:center; font-size:16px; margin-bottom:8px; font-weight: 600; color: #374151;">
            Material Balance Statement for the Month of ${monthLabel(selectedDate)}
          </div>
          
          <!-- Date -->
          <div style="text-align:right; font-size:14px; margin-bottom:20px; color: #6b7280;">
            Date: ${formatReportDate(selectedDate)}
          </div>
          
          <!-- Report Table -->
          <table style="width:100%; border-collapse:collapse; font-size:12px; border: 2px solid #1f2937;">
            ${rows
              .map((r) => {
                const nonEmpty = r.filter(v => v !== '' && v !== null && v !== undefined)
                const isCentered = r[7] && nonEmpty.length === 1
                if (isCentered) {
                  return `<tr><td colspan="16" style="border:1px solid #d1d5db; padding:8px; text-align:center; font-weight:700; background:#f3f4f6; font-size:14px;">${r[7]}</td></tr>`
                }
                const isHeader = r[0] === 'Particulars' && r[8] === 'Particulars'
                if (isHeader) {
                  const cells = r.map((h) => `<th style=\"border:1px solid #d1d5db; padding:8px; text-align:center; background:#1f2937; color:white; font-weight:600;\">${h}</th>`).join('')
                  return `<tr>${cells}</tr>`
                }
                const isLeftTitle = r[0] && r.slice(1, 8).every(v => !v)
                const isRightTitle = r[8] && r.slice(9, 16).every(v => !v)
                if (isLeftTitle || isRightTitle) {
                  const left = isLeftTitle ? `<td colspan=\"8\" style=\"border:1px solid #d1d5db; padding:8px; font-weight:700; background:#dbeafe; color:#1e40af;\">${r[0]}</td>` : r.slice(0,8).map((c,i)=>`<td style=\"border:1px solid #d1d5db; padding:6px; ${i===0?'text-align:left':'text-align:right'}; font-weight:500;\">${c}</td>`).join('')
                  const right = isRightTitle ? `<td colspan=\"8\" style=\"border:1px solid #d1d5db; padding:8px; font-weight:700; background:#dbeafe; color:#1e40af;\">${r[8]}</td>` : r.slice(8,16).map((c,i)=>`<td style=\"border:1px solid #d1d5db; padding:6px; ${i===0?'text-align:left':'text-align:right'}; font-weight:500;\">${c}</td>`).join('')
                  return `<tr>${left}${right}</tr>`
                }
                const cells = r.map((c,i)=>`<td style=\"border:1px solid #d1d5db; padding:6px; ${i%8===0?'text-align:left':'text-align:right'}; font-weight:400;\">${c}</td>`).join('')
                return `<tr>${cells}</td></tr>`
              })
              .join('')}
          </table>
          
          <!-- Footer -->
          <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #d1d5db; padding-top: 12px;">
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <p>Sri Chakra Milk Products - Daily Report</p>
          </div>
        </div>`
      setPdfHtml(html)
      setIsPdfPreviewOpen(true)
      
      // Auto scroll to PDF preview after a short delay
      setTimeout(() => {
        const pdfModal = document.querySelector('.pdf-modal')
        if (pdfModal) {
          pdfModal.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } catch (e) {
      console.error(e)
      toast.error('Failed to generate PDF preview')
    }
  }

  const handleConfirmPdfDownload = () => {
    const w = window.open('', 'printWindow')
    if (!w) return
    w.document.write(`<html><head><title>Daily Report ${selectedDate}</title></head><body>${pdfHtml}</body></html>`)
    w.document.close()
    w.focus()
    w.print()
  }

  const generateExcelData = (data, date) => {
    const headers = ['Particulars', 'Qty (Ltr)', 'Qty Kg\'s', 'Avg Fat', 'CLR', 'Avg SNF', 'Kg Fat', 'Kg SNF']
    const dateText = `Dt:${formatReportDate(date)}`
    const title1 = 'Sri Chakra Milk Products - Avapadu'
    const title2 = `Material Balance Statement for the Month of ${monthLabel(date)}`

    const formatNumber = (value) => {
      if (value === null || value === undefined || value === '') return ''
      const n = Number(value)
      if (Number.isNaN(n)) return ''
      return String(n)
    }

    const mapRow = (item) => [
      item.particulars || '',
      formatNumber(item.qty_ltr),
      formatNumber(item.qty_kg),
      formatNumber(item.avg_fat),
      formatNumber(item.clr),
      formatNumber(item.avg_snf),
      formatNumber(item.kg_fat),
      formatNumber(item.kg_snf)
    ]

    const hasAnyValues = (items) => {
      return items?.some(it =>
        [it.qty_ltr, it.qty_kg, it.avg_fat, it.clr, it.avg_snf, it.kg_fat, it.kg_snf]
          .some(v => v !== null && v !== undefined && v !== '' && !Number.isNaN(Number(v)))
      )
    }

    const totalsRow = (items) => {
      const totals = calculateTotals(items)
      if (!hasAnyValues(items)) {
        return ['TOTAL', '', '', '', '', '', '', '']
      }
      return [
        'TOTAL',
        formatNumber(totals.qtyLtr),
        formatNumber(totals.qtyKg),
        formatNumber(totals.avgFat),
        formatNumber(totals.clr),
        formatNumber(totals.avgSnf),
        formatNumber(totals.kgFat),
        formatNumber(totals.kgSnf)
      ]
    }

    const calculateTotals = (items) => {
      if (!items || items.length === 0) return { qtyLtr: 0, qtyKg: 0, avgFat: 0, clr: 0, avgSnf: 0, kgFat: 0, kgSnf: 0 }
      
      const totals = items.reduce((acc, item) => {
        acc.qtyLtr += Number(item.qty_ltr) || 0
        acc.qtyKg += Number(item.qty_kg) || 0
        acc.kgFat += Number(item.kg_fat) || 0
        acc.kgSnf += Number(item.kg_snf) || 0
        return acc
      }, { qtyLtr: 0, qtyKg: 0, avgFat: 0, clr: 0, avgSnf: 0, kgFat: 0, kgSnf: 0 })
      
      // Calculate averages
      if (totals.qtyLtr > 0) {
        totals.avgFat = totals.kgFat / totals.qtyLtr * 100
        totals.avgSnf = totals.kgSnf / totals.qtyLtr * 100
      }
      
      return totals
    }

      const rows = []
    
    // Title rows
    rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    rows.push(['', '', '', '', '', '', '', title1, '', '', '', '', '', '', '', ''])
    rows.push(['', '', '', '', '', '', '', title2, '', '', '', '', '', '', '', ''])
    rows.push(['', '', '', '', '', '', '', dateText, '', '', '', '', '', '', '', ''])
    rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    
    // Header row with column names
    rows.push(['Particulars', 'Qty (Ltr)', 'Qty (Kg)', 'Avg Fat', 'CLR', 'Avg SNF', 'Kg Fat', 'Kg SNF', 'Particulars', 'Qty (Ltr)', 'Qty (Kg)', 'Avg Fat', 'CLR', 'Avg SNF', 'Kg Fat', 'Kg SNF'])
    
    // LEFT SIDE SECTIONS ONLY - Each section shows its own data
    
    // EXACT PATTERN MATCHING THE IMAGE - SINGLE PAGE LAYOUT
    
    // Helper function to add left side section with data
    const addLeftSection = (sectionTitle, sectionData) => {
      rows.push([sectionTitle, '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
      if (sectionData && sectionData.length > 0) {
        sectionData.forEach(item => {
          rows.push([...mapRow(item), ...Array(8).fill('')])
        })
        rows.push([...totalsRow(sectionData), ...Array(8).fill('')])
      } else {
        rows.push(['No data available', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
      }
      rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    }
    
    // Helper function to add right side section with data
    const addRightSection = (sectionTitle, sectionData) => {
      rows.push(['', '', '', '', '', '', '', '', sectionTitle, '', '', '', '', '', '', ''])
      if (sectionData && sectionData.length > 0) {
        sectionData.forEach(item => {
          rows.push([...Array(8).fill(''), ...mapRow(item)])
        })
        rows.push([...Array(8).fill(''), ...totalsRow(sectionData)])
      } else {
        rows.push(['', '', '', '', '', '', '', '', 'No data available', '', '', '', '', '', '', ''])
      }
      rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    }
    
    // SIDE BY SIDE LAYOUT - Left and Right sections alternating
    
    // Opening Stock (Left) and Sales (Right) - Side by side
    rows.push(['OPENING STOCK', '', '', '', '', '', '', '', 'SALES', '', '', '', '', '', '', ''])
    if (data.openingStockData && data.openingStockData.length > 0) {
      data.openingStockData.forEach(item => {
        rows.push([...mapRow(item), ...Array(8).fill('')])
      })
      rows.push([...totalsRow(data.openingStockData), ...Array(8).fill('')])
    } else {
      rows.push(['No data available', '', '', '', '', '', '', '', 'No data available', '', '', '', '', '', '', ''])
    }
    rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    

    
    // Third Party Procurement (Left) and Silo Closing Balance (Right) - Side by side
    rows.push(['THIRD PARTY PROCUREMENT', '', '', '', '', '', '', '', 'SILO CLOSING BALANCE', '', '', '', '', '', '', ''])
    if (data.thirdPartyProcurementData && data.thirdPartyProcurementData.length > 0) {
      data.thirdPartyProcurementData.forEach(item => {
        rows.push([...mapRow(item), ...Array(8).fill('')])
      })
      rows.push([...totalsRow(data.thirdPartyProcurementData), ...Array(8).fill('')])
    } else {
      rows.push(['No data available', '', '', '', '', '', '', '', 'No data available', '', '', '', '', '', '', ''])
    }
    rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    
    // Products Closing Stock (Right only)
    rows.push(['', '', '', '', '', '', '', '', 'PRODUCTS CLOSING STOCK', '', '', '', '', '', '', ''])
    if (data.productsClosingStockData && data.productsClosingStockData.length > 0) {
      data.productsClosingStockData.forEach(item => {
        rows.push([...Array(8).fill(''), ...mapRow(item)])
      })
      rows.push([...Array(8).fill(''), ...totalsRow(data.productsClosingStockData)])
    } else {
      rows.push(['', '', '', '', '', '', '', '', 'No data available', '', '', '', '', '', '', ''])
    }
    rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    
    // Waiting Tanker (Right only)
    rows.push(['', '', '', '', '', '', '', '', 'WAITING TANKER', '', '', '', '', '', '', ''])
    if (data.waitingTankerData && data.waitingTankerData.length > 0) {
      data.waitingTankerData.forEach(item => {
        rows.push([...Array(8).fill(''), ...mapRow(item)])
      })
      rows.push([...Array(8).fill(''), ...totalsRow(data.waitingTankerData)])
    } else {
      rows.push(['', '', '', '', '', '', '', '', 'No data available', '', '', '', '', '', '', ''])
    }
    
    // Add empty row before grand total
    rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    
    // Calculate Grand Total
    const allData = [
      ...(data.openingStockData || []),
      ...(data.salesData || []),
      ...(data.otherDairySalesData || []),
      ...(data.productsData || []),
      ...(data.siloClosingBalanceData || []),
      ...(data.productsClosingStockData || []),
      ...(data.waitingTankerData || []),
      ...(data.thirdPartyProcurementData || [])
    ]
    
    const grandTotal = calculateTotals(allData)
    
    // Grand Total Section
    rows.push(['GRAND TOTAL', '', '', '', '', '', '', '', 'GRAND TOTAL', '', '', '', '', '', '', ''])
    rows.push([
      'Total',
      formatNumber(grandTotal.qtyLtr),
      formatNumber(grandTotal.qtyKg),
      formatNumber(grandTotal.avgFat),
      formatNumber(grandTotal.clr),
      formatNumber(grandTotal.avgSnf),
      formatNumber(grandTotal.kgFat),
      formatNumber(grandTotal.kgSnf),
      'Total',
      formatNumber(grandTotal.qtyLtr),
      formatNumber(grandTotal.qtyKg),
      formatNumber(grandTotal.avgFat),
      formatNumber(grandTotal.clr),
      formatNumber(grandTotal.avgSnf),
      formatNumber(grandTotal.kgFat),
      formatNumber(grandTotal.kgSnf)
    ])
    
    return rows
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <div className="flex-1 overflow-auto pt-24 p-8 ml-16">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Reports</h1>
            <p className="text-gray-600">Select a date to automatically view and download daily reports with PDF and Excel preview</p>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Date Selector */}
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <label htmlFor="date" className="text-sm font-medium text-gray-700">
              Select Date:
            </label>
            <input
              type="date"
                  id="date"
              value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
              max={todayISO}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
              <div className="flex gap-3">
            <button
                  onClick={handlePdfPreview}
                  disabled={!reportData || isLoading}
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  <Printer className="h-4 w-4" />
                  PDF Preview
            </button>

            <button
                  onClick={handleDownloadReport}
                  disabled={!reportData || isLoading}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  Download Excel
            </button>
              </div>
            </div>


          </div>

          {/* Report Preview Modal */}
          {isPreviewOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 preview-modal">
              <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-7xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-900">Excel Preview - {formatReportDate(selectedDate)}</h2>
                  <div className="flex gap-2">
                    <button onClick={handleConfirmDownload} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download Excel
                    </button>
                    <button onClick={handlePdfPreview} className="bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-700 flex items-center gap-2">
                      <Printer className="h-4 w-4" />
                      PDF Preview
                    </button>
                    <button onClick={() => setIsPreviewOpen(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200">Close</button>
                  </div>
                </div>
                <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]" id="preview-table-container">
                  <table className="min-w-full border border-gray-200 text-sm">
                    <tbody>
                      {previewRows.map((row, idx) => {
                        // Centered title rows (only middle cell filled)
                        const nonEmpty = row.filter(v => v !== '' && v !== null && v !== undefined)
                        const isCentered = row[7] && nonEmpty.length === 1

                        if (isCentered) {
                          return (
                            <tr key={idx}>
                              <td colSpan={16} className="border border-gray-200 px-3 py-3 text-center font-bold text-base bg-gray-100">
                                {row[7]}
                              </td>
                            </tr>
                          )
                        }

                        const isLeftTitle = row[0] && row[0] !== 'Particulars' && row.slice(1, 8).every(v => !v) && !row[8]
                        const isRightTitle = row[8] && row[8] !== 'Particulars' && row.slice(9, 16).every(v => !v) && !row[0]
                        const isHeaderRow = row[0] === 'Particulars' && row[8] === 'Particulars'

                        if (isHeaderRow) {
                          return (
                            <tr key={idx} className="bg-gray-800 text-white">
                              {row.slice(0, 8).map((h, i) => (
                                <th key={`lh-${i}`} className="border border-gray-600 px-3 py-2 text-center font-semibold">{h}</th>
                              ))}
                              {row.slice(8, 16).map((h, i) => (
                                <th key={`rh-${i}`} className="border border-gray-600 px-3 py-2 text-center font-semibold">{h}</th>
                              ))}
                            </tr>
                          )
                        }

                        return (
                          <tr key={idx} className="hover:bg-gray-50">
                            {isLeftTitle && isRightTitle ? (
                              <>
                                <td colSpan={8} className="border border-gray-200 px-3 py-2 font-bold bg-blue-100 text-blue-800">{row[0]}</td>
                                <td colSpan={8} className="border border-gray-200 px-3 py-2 font-bold bg-blue-100 text-blue-800">{row[8]}</td>
                              </>
                            ) : isLeftTitle ? (
                              <>
                                <td colSpan={8} className="border border-gray-200 px-3 py-2 font-bold bg-blue-100 text-blue-800">{row[0]}</td>
                                {row.slice(8, 16).map((cell, cidx) => (
                                  <td
                                    key={`r-${cidx}`}
                                    className={`border border-gray-200 px-3 py-2 ${cidx === 0 ? 'text-left font-medium' : 'text-right'}`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </>
                            ) : isRightTitle ? (
                              <>
                                {row.slice(0, 8).map((cell, cidx) => (
                                  <td
                                    key={`l-${cidx}`}
                                    className={`border border-gray-200 px-3 py-2 ${cidx === 0 ? 'text-left font-medium' : 'text-right'}`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                                <td colSpan={8} className="border border-gray-200 px-3 py-2 font-bold bg-blue-100 text-blue-800">{row[8]}</td>
                              </>
                            ) : (
                              <>
                                {row.slice(0, 8).map((cell, cidx) => (
                                <td
                                  key={`l-${cidx}`}
                                    className={`border border-gray-200 px-3 py-2 ${cidx === 0 ? 'text-left font-medium' : 'text-right'}`}
                                >
                                  {cell}
                                </td>
                                ))}
                                {row.slice(8, 16).map((cell, cidx) => (
                                <td
                                  key={`r-${cidx}`}
                                    className={`border border-gray-200 px-3 py-2 ${cidx === 0 ? 'text-left font-medium' : 'text-right'}`}
                                >
                                  {cell}
                                </td>
                                ))}
                              </>
                            )}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PDF Preview Modal */}
          {isPdfPreviewOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pdf-modal">
              <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-6xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-900">PDF Preview - {formatReportDate(selectedDate)}</h2>
                  <div className="flex gap-2">
                    <button onClick={handleConfirmPdfDownload} className="bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-700 flex items-center gap-2">
                      <Printer className="h-4 w-4" />
                      Print / Save PDF
                    </button>
                    <button onClick={() => setIsPdfPreviewOpen(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200">Close</button>
                  </div>
                </div>
                <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
                  <div dangerouslySetInnerHTML={{ __html: pdfHtml }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default DailyReports
