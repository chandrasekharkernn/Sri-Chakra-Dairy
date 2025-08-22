import React, { useState } from 'react'
import { Download, Calendar, FileSpreadsheet, FileText, Eye, Printer } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { dataApi } from '../lib/api'
import { toast } from 'react-hot-toast'

const DailyReports = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isLoading, setIsLoading] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewRows, setPreviewRows] = useState([])
  const [reportData, setReportData] = useState(null)
  const todayISO = new Date().toISOString().split('T')[0]

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
    setIsLoading(true)
    try {
      const response = await dataApi.getDailyReport(selectedDate)
      
      if (response.data.success) {
        const data = response.data.data
        setReportData(data)
        
        // Generate Excel-like data structure for preview
        const excelData = generateExcelData(data, selectedDate)
        setPreviewRows(excelData)
        setIsPreviewOpen(true)
        toast.success('Daily report loaded successfully!')
        
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

  const handleDownloadReport = async () => {
    if (!reportData) {
      toast.error('Please load the report first')
      return
    }
    
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
    
    // Opening Stock Section
    rows.push(['OPENING STOCK', '', '', '', '', '', '', '', 'OPENING STOCK', '', '', '', '', '', '', ''])
    if (data.openingStockData && data.openingStockData.length > 0) {
      data.openingStockData.forEach(item => {
        rows.push([...mapRow(item), ...mapRow(item)])
      })
      rows.push([...totalsRow(data.openingStockData), ...totalsRow(data.openingStockData)])
    } else {
      rows.push(['No data available', '', '', '', '', '', '', '', 'No data available', '', '', '', '', '', '', ''])
    }
    rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    
    // Sales Section
    rows.push(['SALES', '', '', '', '', '', '', '', 'SALES', '', '', '', '', '', '', ''])
    if (data.salesData && data.salesData.length > 0) {
      data.salesData.forEach(item => {
        rows.push([...mapRow(item), ...mapRow(item)])
      })
      rows.push([...totalsRow(data.salesData), ...totalsRow(data.salesData)])
    } else {
      rows.push(['No data available', '', '', '', '', '', '', '', 'No data available', '', '', '', '', '', '', ''])
    }
    rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    
    // Other Dairy Sales Section
    rows.push(['OTHER DAIRY SALES', '', '', '', '', '', '', '', 'OTHER DAIRY SALES', '', '', '', '', '', '', ''])
    if (data.otherDairySalesData && data.otherDairySalesData.length > 0) {
      data.otherDairySalesData.forEach(item => {
        rows.push([...mapRow(item), ...mapRow(item)])
      })
      rows.push([...totalsRow(data.otherDairySalesData), ...totalsRow(data.otherDairySalesData)])
    } else {
      rows.push(['No data available', '', '', '', '', '', '', '', 'No data available', '', '', '', '', '', '', ''])
    }
    rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    
    // Products Section
    rows.push(['PRODUCTS', '', '', '', '', '', '', '', 'PRODUCTS', '', '', '', '', '', '', ''])
    if (data.productsData && data.productsData.length > 0) {
      data.productsData.forEach(item => {
        rows.push([...mapRow(item), ...mapRow(item)])
      })
      rows.push([...totalsRow(data.productsData), ...totalsRow(data.productsData)])
    } else {
      rows.push(['No data available', '', '', '', '', '', '', '', 'No data available', '', '', '', '', '', '', ''])
    }
    rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    
    // Silo Closing Balance Section
    rows.push(['SILO CLOSING BALANCE', '', '', '', '', '', '', '', 'SILO CLOSING BALANCE', '', '', '', '', '', '', ''])
    if (data.siloClosingBalanceData && data.siloClosingBalanceData.length > 0) {
      data.siloClosingBalanceData.forEach(item => {
        rows.push([...mapRow(item), ...mapRow(item)])
      })
      rows.push([...totalsRow(data.siloClosingBalanceData), ...totalsRow(data.siloClosingBalanceData)])
    } else {
      rows.push(['No data available', '', '', '', '', '', '', '', 'No data available', '', '', '', '', '', '', ''])
    }
    rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    
    // Products Closing Stock Section
    rows.push(['PRODUCTS CLOSING STOCK', '', '', '', '', '', '', '', 'PRODUCTS CLOSING STOCK', '', '', '', '', '', '', ''])
    if (data.productsClosingStockData && data.productsClosingStockData.length > 0) {
      data.productsClosingStockData.forEach(item => {
        rows.push([...mapRow(item), ...mapRow(item)])
      })
      rows.push([...totalsRow(data.productsClosingStockData), ...totalsRow(data.productsClosingStockData)])
    } else {
      rows.push(['No data available', '', '', '', '', '', '', '', 'No data available', '', '', '', '', '', '', ''])
    }
    rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    
    // Waiting Tanker Section
    rows.push(['WAITING TANKER', '', '', '', '', '', '', '', 'WAITING TANKER', '', '', '', '', '', '', ''])
    if (data.waitingTankerData && data.waitingTankerData.length > 0) {
      data.waitingTankerData.forEach(item => {
        rows.push([...mapRow(item), ...mapRow(item)])
      })
      rows.push([...totalsRow(data.waitingTankerData), ...totalsRow(data.waitingTankerData)])
    } else {
      rows.push(['No data available', '', '', '', '', '', '', '', 'No data available', '', '', '', '', '', '', ''])
    }
    rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
    
    // Third Party Procurement Section
    rows.push(['THIRD PARTY PROCUREMENT', '', '', '', '', '', '', '', 'THIRD PARTY PROCUREMENT', '', '', '', '', '', '', ''])
    if (data.thirdPartyProcurementData && data.thirdPartyProcurementData.length > 0) {
      data.thirdPartyProcurementData.forEach(item => {
        rows.push([...mapRow(item), ...mapRow(item)])
      })
      rows.push([...totalsRow(data.thirdPartyProcurementData), ...totalsRow(data.thirdPartyProcurementData)])
    } else {
      rows.push(['No data available', '', '', '', '', '', '', '', 'No data available', '', '', '', '', '', '', ''])
    }
    
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
        <div className="flex-1 overflow-auto pt-24 p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Reports</h1>
            <p className="text-gray-600">Generate comprehensive daily reports with all data in one view</p>
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
                  onChange={(e) => setSelectedDate(e.target.value)}
              max={todayISO}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
              <div className="flex gap-3">
            <button
                  onClick={handleViewReport}
              disabled={isLoading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
                  <Eye className="h-4 w-4" />
                  {isLoading ? 'Loading...' : 'View Report'}
            </button>

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
                  Download CSV
            </button>
              </div>
            </div>

            {/* Report Summary */}
            {reportData && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Report Summary - {formatReportDate(selectedDate)}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-800">Opening Stock:</span>
                    <span className="ml-2 text-blue-600">{reportData.openingStockData?.length || 0} entries</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Sales:</span>
                    <span className="ml-2 text-blue-600">{reportData.salesData?.length || 0} entries</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Products:</span>
                    <span className="ml-2 text-blue-600">{reportData.productsData?.length || 0} entries</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Procurement:</span>
                    <span className="ml-2 text-blue-600">{reportData.thirdPartyProcurementData?.length || 0} entries</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Report Preview Modal */}
          {isPreviewOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 preview-modal">
              <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-7xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-900">Daily Report Preview - {formatReportDate(selectedDate)}</h2>
                  <div className="flex gap-2">
                    <button onClick={handleDownloadReport} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download CSV
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

                        const isLeftTitle = row[0] && row.slice(1, 8).every(v => !v)
                        const isRightTitle = row[8] && row.slice(9, 16).every(v => !v)
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
                            {isLeftTitle ? (
                              <td colSpan={8} className="border border-gray-200 px-3 py-2 font-bold bg-blue-100 text-blue-800">{row[0]}</td>
                            ) : (
                              row.slice(0, 8).map((cell, cidx) => (
                                <td
                                  key={`l-${cidx}`}
                                  className={`border border-gray-200 px-3 py-2 ${cidx === 0 ? 'text-left font-medium' : 'text-right'}`}
                                >
                                  {cell}
                                </td>
                              ))
                            )}

                            {isRightTitle ? (
                              <td colSpan={8} className="border border-gray-200 px-3 py-2 font-bold bg-blue-100 text-blue-800">{row[8]}</td>
                            ) : (
                              row.slice(8, 16).map((cell, cidx) => (
                                <td
                                  key={`r-${cidx}`}
                                  className={`border border-gray-200 px-3 py-2 ${cidx === 0 ? 'text-left font-medium' : 'text-right'}`}
                                >
                                  {cell}
                                </td>
                              ))
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
