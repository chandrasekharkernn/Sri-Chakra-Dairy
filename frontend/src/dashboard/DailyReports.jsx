import React, { useState } from 'react'
import { Download, Calendar, FileSpreadsheet, FileText } from 'lucide-react'
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

  // Previous reports removed per request

  const handleDownloadReport = async () => {
    setIsLoading(true)
    try {
      // Fetch all data for the selected date
      const response = await dataApi.getDailyReport(selectedDate)
      
      if (response.data.success) {
        const reportData = response.data.data
        
        // Generate Excel-like data structure
        const excelData = generateExcelData(reportData, selectedDate)

        // Open preview modal instead of downloading immediately
        setPreviewRows(excelData)
        setIsPreviewOpen(true)
        toast.success('Preview generated')
      } else {
        toast.error('Failed to fetch report data')
      }
    } catch (error) {
      console.error('Error downloading report:', error)
      toast.error('Failed to generate preview. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmDownload = () => {
    if (!previewRows || previewRows.length === 0) {
      toast.error('No data to download')
      return
    }
    const csvContent = previewRows.map(row => row.map(csvEscape).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `daily_report_${selectedDate}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Daily report downloaded successfully!')
  }

  // Generate PDF preview and download
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false)
  const [pdfHtml, setPdfHtml] = useState('')

  const handlePdfPreview = async () => {
    setIsLoading(true)
    try {
      const response = await dataApi.getDailyReport(selectedDate)
      if (!response.data.success) {
        toast.error('Failed to fetch report data')
        return
      }
      const reportData = response.data.data
      const rows = generateExcelData(reportData, selectedDate)
      // Build simple HTML for PDF preview
      const logoSrc = '/sri chakra logo.png'
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 16px;">
          <div style="display:flex; align-items:center; justify-content:center; gap:12px; margin-bottom:8px;">
            <img src="${logoSrc}" alt="Sri Chakra" style="height:40px;"/>
            <div style="font-weight:700;">Sri Chakra Milk Products - Avapadu</div>
          </div>
          <div style="text-align:center; font-size:14px; margin-bottom:6px;">Material Balance Statement for the Month of ${monthLabel(selectedDate)}</div>
          <div style="text-align:right; font-size:12px; margin-bottom:10px;">Dt:${formatReportDate(selectedDate)}</div>
          <table style="width:100%; border-collapse:collapse; font-size:11px;">
            ${rows
              .map((r) => {
                const nonEmpty = r.filter(v => v !== '' && v !== null && v !== undefined)
                const isCentered = r[7] && nonEmpty.length === 1
                if (isCentered) {
                  return `<tr><td colspan="16" style="border:1px solid #e5e7eb; padding:6px; text-align:center; font-weight:600;">${r[7]}</td></tr>`
                }
                const isHeader = r[0] === 'Particulars' && r[8] === 'Particulars'
                if (isHeader) {
                  const cells = r.map((h) => `<th style=\"border:1px solid #e5e7eb; padding:6px; text-align:left; background:#f3f4f6;\">${h}</th>`).join('')
                  return `<tr>${cells}</tr>`
                }
                const isLeftTitle = r[0] && r.slice(1, 8).every(v => !v)
                const isRightTitle = r[8] && r.slice(9, 16).every(v => !v)
                if (isLeftTitle || isRightTitle) {
                  const left = isLeftTitle ? `<td colspan=\"8\" style=\"border:1px solid #e5e7eb; padding:6px; font-weight:600; background:#eff6ff;\">${r[0]}</td>` : r.slice(0,8).map((c,i)=>`<td style=\"border:1px solid #e5e7eb; padding:6px; ${i===0?'text-align:left':'text-align:right'};\">${c}</td>`).join('')
                  const right = isRightTitle ? `<td colspan=\"8\" style=\"border:1px solid #e5e7eb; padding:6px; font-weight:600; background:#eff6ff;\">${r[8]}</td>` : r.slice(8,16).map((c,i)=>`<td style=\"border:1px solid #e5e7eb; padding:6px; ${i===0?'text-align:left':'text-align:right'};\">${c}</td>`).join('')
                  return `<tr>${left}${right}</tr>`
                }
                const cells = r.map((c,i)=>`<td style=\"border:1px solid #e5e7eb; padding:6px; ${i%8===0?'text-align:left':'text-align:right'};\">${c}</td>`).join('')
                return `<tr>${cells}</tr>`
              })
              .join('')}
          </table>
        </div>`
      setPdfHtml(html)
      setIsPdfPreviewOpen(true)
    } catch (e) {
      console.error(e)
      toast.error('Failed to generate PDF preview')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmPdfDownload = () => {
    // Use browser print to PDF for now (opens print dialog). For full jsPDF we can add later.
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

    const buildSectionRows = (title, items) => {
      const rows = []
      rows.push([title, '', '', '', '', '', '', ''])
      items?.forEach((it) => rows.push(mapRow(it)))
      rows.push(totalsRow(items || []))
      rows.push(['', '', '', '', '', '', '', ''])
      return rows
    }

    const mergeTwoColumns = (left, right) => {
      const maxLen = Math.max(left.length, right.length)
      const merged = []
      for (let i = 0; i < maxLen; i++) {
        const l = left[i] || ['', '', '', '', '', '', '', '']
        const r = right[i] || ['', '', '', '', '', '', '', '']
        merged.push([...l, ...r])
      }
      return merged
    }

    // Split Opening Stock sections
    const openingStock = (data.openingStockData || []).filter(i => i.section === 'opening_stock')
    const tanker = (data.openingStockData || []).filter(i => i.section === 'tanker_transaction')
    const ownProc = (data.openingStockData || []).filter(i => i.section === 'own_procurement')

    // Left column blocks
    const leftBlocks = [
      headers,
      ...buildSectionRows('Opening Stock', openingStock),
      ...buildSectionRows('Tanker Transaction', tanker),
      ...buildSectionRows('Own Procurement', ownProc),
      ...buildSectionRows('3rd Party Procurement', data.thirdPartyProcurementData || [])
    ]

    // Right column blocks (align header with left side)
    const rightBlocks = [
      headers,
      ...buildSectionRows('Sales', data.salesData || []),
      ...buildSectionRows('Other Dairy Sales', data.otherDairySalesData || []),
      ...buildSectionRows('Products', data.productsData || []),
      ...buildSectionRows('Silo Closing Balance', data.siloClosingBalanceData || []),
      ...buildSectionRows('Products Closing Stock', data.productsClosingStockData || []),
      ...buildSectionRows('Waiting Tanker', data.waitingTankerData || [])
    ]

    const merged = mergeTwoColumns(leftBlocks, rightBlocks)

    // Create centered title rows and separate date row
    const centerRow = (text) => {
      const arr = new Array(16).fill('')
      arr[7] = text
      return arr
    }
    const dateRow = new Array(16).fill('')
    dateRow[15] = dateText

    // Add centered titles and statement for the day
    const statementRow = centerRow('Statement for the Day')
    merged.unshift(dateRow)
    merged.unshift(statementRow)
    merged.unshift(centerRow(title2))
    merged.unshift(centerRow(title1))

    // Compute column-wise totals (left and right sides separately)
    const leftItems = [
      ...openingStock,
      ...tanker,
      ...ownProc,
      ...(data.thirdPartyProcurementData || [])
    ]
    const rightItems = [
      ...(data.salesData || []),
      ...(data.otherDairySalesData || []),
      ...(data.productsData || []),
      ...(data.siloClosingBalanceData || []),
      ...(data.productsClosingStockData || []),
      ...(data.waitingTankerData || [])
    ]

    const lt = calculateTotals(leftItems)
    const rt = calculateTotals(rightItems)

    // Append final totals row for both columns
    merged.push([
      'Total',
      formatNumber(lt.qtyLtr),
      formatNumber(lt.qtyKg),
      formatNumber(lt.avgFat),
      formatNumber(lt.clr),
      formatNumber(lt.avgSnf),
      formatNumber(lt.kgFat),
      formatNumber(lt.kgSnf),
      'TOTAL',
      formatNumber(rt.qtyLtr),
      formatNumber(rt.qtyKg),
      formatNumber(rt.avgFat),
      formatNumber(rt.clr),
      formatNumber(rt.avgSnf),
      formatNumber(rt.kgFat),
      formatNumber(rt.kgSnf)
    ])

    return merged
  }

  const calculateTotals = (data) => {
    return data.reduce((acc, row) => {
      acc.qtyLtr += parseFloat(row.qty_ltr) || 0
      acc.qtyKg += parseFloat(row.qty_kg) || 0
      acc.avgFat += parseFloat(row.avg_fat) || 0
      acc.clr += parseFloat(row.clr) || 0
      acc.avgSnf += parseFloat(row.avg_snf) || 0
      acc.kgFat += parseFloat(row.kg_fat) || 0
      acc.kgSnf += parseFloat(row.kg_snf) || 0
      return acc
    }, { qtyLtr: 0, qtyKg: 0, avgFat: 0, clr: 0, avgSnf: 0, kgFat: 0, kgSnf: 0 })
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
            <h1 className="text-3xl font-bold text-gray-900">Daily Reports</h1>
            <p className="text-gray-600 mt-2">Manage and submit your daily work reports</p>
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
              max={todayISO}
              onChange={(e) => {
                const chosen = e.target.value
                if (chosen > todayISO) {
                  toast.error('Future dates are not allowed')
                  setSelectedDate(todayISO)
                } else {
                  setSelectedDate(chosen)
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            {/* Excel Preview/Download */}
            <button
              onClick={handleDownloadReport}
              disabled={isLoading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileSpreadsheet className="h-5 w-5" />
              {isLoading ? 'Generating Preview...' : 'Download Report in Excel'}
            </button>

            {/* PDF Preview/Download */}
            <button
              onClick={handlePdfPreview}
              disabled={isLoading}
              className="flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-5 w-5" />
              {isLoading ? 'Generating PDF Preview...' : 'Download Report in PDF'}
            </button>
          </div>

          {/* Excel Preview Modal */}
          {isPreviewOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-6xl max-h-[80vh] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold">Daily Report Preview - {selectedDate}</h2>
                  <div className="flex gap-2">
                    <button onClick={handleConfirmDownload} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Download</button>
                    <button onClick={() => setIsPreviewOpen(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200">Close</button>
                  </div>
                </div>
                <div className="p-4 overflow-auto">
                  <table className="min-w-full border border-gray-200 text-sm">
                    <tbody>
                      {previewRows.map((row, idx) => {
                        // Centered title rows (only middle cell filled)
                        const nonEmpty = row.filter(v => v !== '' && v !== null && v !== undefined)
                        const isCentered = row[7] && nonEmpty.length === 1

                        if (isCentered) {
                          return (
                            <tr key={idx}>
                              <td colSpan={16} className="border border-gray-200 px-2 py-2 text-center font-semibold text-base">
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
                            <tr key={idx} className="bg-gray-100">
                              {row.slice(0, 8).map((h, i) => (
                                <th key={`lh-${i}`} className="border border-gray-200 px-2 py-1 text-left font-semibold">{h}</th>
                              ))}
                              {row.slice(8, 16).map((h, i) => (
                                <th key={`rh-${i}`} className="border border-gray-200 px-2 py-1 text-left font-semibold">{h}</th>
                              ))}
                            </tr>
                          )
                        }

                        return (
                          <tr key={idx} className="odd:bg-gray-50">
                            {isLeftTitle ? (
                              <td colSpan={8} className="border border-gray-200 px-2 py-1 font-semibold bg-blue-50">{row[0]}</td>
                            ) : (
                              row.slice(0, 8).map((cell, cidx) => (
                                <td
                                  key={`l-${cidx}`}
                                  className={`border border-gray-200 px-2 py-1 ${cidx === 0 ? 'text-left' : 'text-right'}`}
                                >
                                  {cell}
                                </td>
                              ))
                            )}

                            {isRightTitle ? (
                              <td colSpan={8} className="border border-gray-200 px-2 py-1 font-semibold bg-blue-50">{row[8]}</td>
                            ) : (
                              row.slice(8, 16).map((cell, cidx) => (
                                <td
                                  key={`r-${cidx}`}
                                  className={`border border-gray-200 px-2 py-1 ${cidx === 0 ? 'text-left' : 'text-right'}`}
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-5xl max-h-[85vh] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold">PDF Preview - {selectedDate}</h2>
                  <div className="flex gap-2">
                    <button onClick={handleConfirmPdfDownload} className="bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-700">Print / Save PDF</button>
                    <button onClick={() => setIsPdfPreviewOpen(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200">Close</button>
                  </div>
                </div>
                <div className="p-4 overflow-auto">
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
