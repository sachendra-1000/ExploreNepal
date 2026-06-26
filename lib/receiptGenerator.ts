import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import QRCode from 'qrcode'

// Interface for Booking Receipt Data
export interface ReceiptData {
  bookingId: string
  receiptNumber: string
  bookingDate: string
  bookingTime: string
  paymentStatus: string
  bookingStatus: string
  
  // Customer Info
  customerName: string
  customerEmail: string
  customerPhone: string
  nationality?: string
  adults?: number
  children?: number
  
  // Service Info
  serviceName: string
  category: string
  packageName?: string
  destination?: string
  duration?: string
  pricePerPerson?: number
  
  // Travel Info
  from?: string
  to?: string
  travelDate: string
  returnDate?: string
  pickupLocation?: string
  dropLocation?: string
  reportingTime?: string
  
  // Payment Info
  totalAmount: number
  discount?: number
  tax?: number
  grandTotal: number
  paymentMethod: string
  transactionId?: string
  
  // Additional Info
  specialRequests?: string
  notes?: string
  emergencyContact?: string
}

// Company Information
const COMPANY_INFO = {
  name: 'Explore Nepal',
  website: 'https://explorenepal.com',
  email: 'support@explorenepal.com',
  phone: '+977-980-0000000',
  address: 'Kathmandu, Nepal'
}

// Helper to load image as data URL
async function loadImageAsDataURL(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      } else {
        reject(new Error('Failed to get canvas context'))
      }
    }
    img.onerror = reject
    img.src = url
  })
}

// Generate QR Code as Data URL
async function generateQRCode(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      width: 100,
      margin: 1,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      }
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    return ''
  }
}

// Format currency (Nepalese Rupees)
function formatCurrency(amount: number): string {
  return `₨${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`
}

// Format date
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateStr
  }
}

// Main function to generate PDF receipt
export async function generateReceiptPDF(receiptData: ReceiptData): Promise<void> {
  // Create new PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 12
  let yPosition = margin

  // Add watermark
  pdf.setFillColor(245, 245, 245)
  pdf.setFontSize(50)
  pdf.setTextColor(235, 235, 235)
  pdf.text('EXPLORE NEPAL', pageWidth / 2, pageHeight / 2, { align: 'center', angle: 45 })

  // Reset colors
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(12)

  // --- Header Section ---
  yPosition = margin
  
  try {
    const logoUrl = await loadImageAsDataURL('/image/logo_explorenepal-removebg-preview.png')
    pdf.addImage(logoUrl, 'PNG', margin, yPosition, 35, 35)
  } catch (error) {
    console.error('Error loading logo:', error)
    // Fallback to logo placeholder
    pdf.setFillColor(59, 130, 246)
    pdf.roundedRect(margin, yPosition, 35, 35, 5, 5, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.text('EXPLORE', margin + 17.5, yPosition + 15, { align: 'center' })
    pdf.text('NEPAL', margin + 17.5, yPosition + 25, { align: 'center' })
  }
  
  // Company Info
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text(COMPANY_INFO.name, margin + 42, yPosition + 12)
  
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Website: ${COMPANY_INFO.website}`, margin + 42, yPosition + 20)
  pdf.text(`Email: ${COMPANY_INFO.email}`, margin + 42, yPosition + 26)
  pdf.text(`Phone: ${COMPANY_INFO.phone}`, margin + 42, yPosition + 32)
  pdf.text(`Address: ${COMPANY_INFO.address}`, margin + 42, yPosition + 38)

  yPosition += 45

  // --- Colored Header Bar ---
  pdf.setFillColor(59, 130, 246) // Blue
  pdf.roundedRect(margin, yPosition, pageWidth - (margin * 2), 15, 4, 4, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('BOOKING RECEIPT', pageWidth / 2, yPosition + 10, { align: 'center' })
  
  yPosition += 22

  // --- Combine sections into two columns to save space ---
  
  // Left column (Booking + Customer)
  const leftColX = margin
  const colWidth = (pageWidth - margin * 2 - 5) / 2
  
  // Right column (Service + Travel)
  const rightColX = margin + colWidth + 5

  // --- Booking Information ---
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Booking Information', leftColX, yPosition)
  
  yPosition += 4
  pdf.setDrawColor(200, 200, 200)
  pdf.line(leftColX, yPosition, leftColX + colWidth, yPosition)
  yPosition += 5

  const bookingInfo = [
    ['Booking ID', receiptData.bookingId],
    ['Booking Date', formatDate(receiptData.bookingDate)],
    ['Booking Time', receiptData.bookingTime],
    ['Booking Status', receiptData.bookingStatus],
    ['Payment Status', receiptData.paymentStatus === 'verified' ? 'Paid ✓' : `${receiptData.paymentStatus} ⏳`]
  ]

  autoTable(pdf, {
    startY: yPosition,
    head: [['Field', 'Value']],
    body: bookingInfo,
    theme: 'striped',
    headStyles: {
      fillColor: [240, 248, 255],
      textColor: 30,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' }
    },
    margin: { left: leftColX, right: pageWidth - (leftColX + colWidth) },
    tableWidth: colWidth
  })

  // @ts-ignore
  const bookingInfoEndY = (pdf as any).lastAutoTable.finalY + 4
  yPosition = bookingInfoEndY

  // --- Customer Information ---
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Customer Information', leftColX, yPosition)
  
  yPosition += 4
  pdf.line(leftColX, yPosition, leftColX + colWidth, yPosition)
  yPosition += 5

  const customerInfo = [
    ['Full Name', receiptData.customerName],
    ['Email', receiptData.customerEmail],
    ['Phone', receiptData.customerPhone],
    ['Adults', receiptData.adults?.toString() || '1'],
    ['Children', receiptData.children?.toString() || '0']
  ]

  autoTable(pdf, {
    startY: yPosition,
    head: [['Field', 'Value']],
    body: customerInfo,
    theme: 'striped',
    headStyles: {
      fillColor: [240, 248, 255],
      textColor: 30,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' }
    },
    margin: { left: leftColX, right: pageWidth - (leftColX + colWidth) },
    tableWidth: colWidth
  })

  // @ts-ignore
  const customerInfoEndY = (pdf as any).lastAutoTable.finalY + 4

  // Now reset yPosition for right column
  yPosition = margin + 45 + 22

  // --- Service Information ---
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Service Information', rightColX, yPosition)
  
  yPosition += 4
  pdf.line(rightColX, yPosition, rightColX + colWidth, yPosition)
  yPosition += 5

  const serviceInfo = [
    ['Service Name', receiptData.serviceName],
    ['Category', receiptData.category],
    ['Destination', receiptData.destination || 'N/A'],
    ['Duration', receiptData.duration || 'N/A'],
    ['Price/Head', receiptData.pricePerPerson ? formatCurrency(receiptData.pricePerPerson) : 'N/A']
  ]

  autoTable(pdf, {
    startY: yPosition,
    head: [['Field', 'Value']],
    body: serviceInfo,
    theme: 'striped',
    headStyles: {
      fillColor: [240, 248, 255],
      textColor: 30,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' }
    },
    margin: { left: rightColX, right: pageWidth - (rightColX + colWidth) },
    tableWidth: colWidth
  })

  // @ts-ignore
  const serviceInfoEndY = (pdf as any).lastAutoTable.finalY + 4
  yPosition = serviceInfoEndY

  // --- Travel Information ---
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Travel Information', rightColX, yPosition)
  
  yPosition += 4
  pdf.line(rightColX, yPosition, rightColX + colWidth, yPosition)
  yPosition += 5

  const travelInfo = [
    ['From', receiptData.from || 'N/A'],
    ['To', receiptData.to || 'N/A'],
    ['Travel Date', formatDate(receiptData.travelDate)],
    ['Return Date', receiptData.returnDate ? formatDate(receiptData.returnDate) : 'N/A'],
    ['Pickup', receiptData.pickupLocation || 'N/A'],
    ['Drop', receiptData.dropLocation || 'N/A']
  ]

  autoTable(pdf, {
    startY: yPosition,
    head: [['Field', 'Value']],
    body: travelInfo,
    theme: 'striped',
    headStyles: {
      fillColor: [240, 248, 255],
      textColor: 30,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' }
    },
    margin: { left: rightColX, right: pageWidth - (rightColX + colWidth) },
    tableWidth: colWidth
  })

  // @ts-ignore
  yPosition = Math.max(customerInfoEndY, (pdf as any).lastAutoTable.finalY) + 6

  // --- Payment Information ---
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Payment Summary', margin, yPosition)
  
  yPosition += 5
  pdf.setFillColor(248, 250, 252)
  pdf.roundedRect(margin, yPosition, pageWidth - margin * 2, 40, 5, 5, 'F')

  yPosition += 8
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Payment Method: ${receiptData.paymentMethod}`, margin + 5, yPosition)
  pdf.text(`Transaction ID: ${receiptData.transactionId || 'N/A'}`, margin + 5, yPosition + 7)
  
  // Grand total box
  const totalBoxX = pageWidth - margin - 70
  pdf.setFillColor(59, 130, 246)
  pdf.roundedRect(totalBoxX, yPosition - 5, 70, 35, 5, 5, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(8)
  pdf.text('Grand Total', totalBoxX + 35, yPosition + 6, { align: 'center' })
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text(formatCurrency(receiptData.grandTotal), totalBoxX + 35, yPosition + 18, { align: 'center' })

  yPosition += 45

  // --- Additional Info ---
  if (receiptData.specialRequests || receiptData.notes) {
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Additional Information', margin, yPosition)
    
    yPosition += 4
    pdf.line(margin, yPosition, pageWidth - margin - 45, yPosition)
    yPosition += 5

    const addInfoRows = []
    if (receiptData.specialRequests) addInfoRows.push(['Special Requests', receiptData.specialRequests])
    if (receiptData.notes) addInfoRows.push(['Notes', receiptData.notes])

    if (addInfoRows.length > 0) {
      autoTable(pdf, {
        startY: yPosition,
        head: [['Field', 'Value']],
        body: addInfoRows,
        theme: 'striped',
        headStyles: {
          fillColor: [240, 248, 255],
          textColor: 30,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold' }
        },
        margin: { left: margin, right: pageWidth - margin - 45 }
      })
      // @ts-ignore
      yPosition = (pdf as any).lastAutoTable.finalY + 5
    }
  }

  // --- QR Code ---
  const qrData = JSON.stringify({
    bookingId: receiptData.bookingId,
    customerName: receiptData.customerName,
    serviceName: receiptData.serviceName,
    bookingStatus: receiptData.bookingStatus,
    paymentStatus: receiptData.paymentStatus
  })
  const qrCodeUrl = await generateQRCode(qrData)
  
  const qrX = pageWidth - margin - 40
  const qrY = (pageHeight - margin - 40) - 30
  if (qrCodeUrl) {
    pdf.addImage(qrCodeUrl, 'PNG', qrX, qrY, 40, 40)
    pdf.setFontSize(7)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text('Scan', qrX + 20, qrY + 48, { align: 'center' })
  }

  // --- Footer ---
  const footerY = pageHeight - 20
  
  pdf.setFillColor(30, 41, 59)
  pdf.roundedRect(margin, footerY, pageWidth - (margin * 2), 15, 4, 4, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  
  const now = new Date()
  const generatedDate = now.toLocaleDateString('en-US')
  const generatedTime = now.toLocaleTimeString('en-US')
  const footerTextLeft = `Receipt: ${receiptData.receiptNumber} | Generated: ${generatedDate} ${generatedTime}`
  const footerTextRight = 'Thank you for choosing Explore Nepal!'
  
  pdf.text(footerTextLeft, margin + 5, footerY + 10)
  pdf.text(footerTextRight, pageWidth - margin - 5, footerY + 10, { align: 'right' })

  // Download PDF
  pdf.save(`Receipt-${receiptData.bookingId}.pdf`)
}

// Helper function to format receipt data from booking object
export function prepareReceiptData(booking: any): ReceiptData {
  const now = new Date()
  const receiptNumber = `RCP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
  
  // Determine service name from booking
  let serviceName = 'N/A'
  if (booking.serviceName) serviceName = booking.serviceName
  else if (booking.hotelName) serviceName = booking.hotelName
  else if (booking.guideName) serviceName = booking.guideName
  else if (booking.packageName) serviceName = booking.packageName
  
  return {
    bookingId: booking.id || booking.bookingId || `BK${now.getTime()}`,
    receiptNumber,
    bookingDate: booking.createdAt?.toDate?.()?.toISOString() || booking.bookingDate || new Date().toISOString(),
    bookingTime: booking.createdAt?.toDate?.()?.toLocaleTimeString?.() || new Date().toLocaleTimeString(),
    paymentStatus: booking.paymentStatus || 'Pending',
    bookingStatus: booking.status || booking.bookingStatus || 'Pending',
    
    customerName: booking.userName || booking.customerName || booking.contactName || 'N/A',
    customerEmail: booking.userEmail || booking.customerEmail || booking.contactEmail || 'N/A',
    customerPhone: booking.phone || booking.customerPhone || booking.contactPhone || 'N/A',
    nationality: booking.nationality,
    adults: booking.numberOfTravelers || booking.adults,
    children: booking.children,
    
    serviceName: serviceName,
    category: booking.type || booking.category || 'Service',
    packageName: booking.packageName,
    destination: booking.destination || booking.location,
    duration: booking.duration,
    pricePerPerson: booking.price,
    
    from: booking.from,
    to: booking.to,
    travelDate: booking.travelDate || new Date().toISOString(),
    returnDate: booking.returnDate,
    pickupLocation: booking.pickupLocation,
    dropLocation: booking.dropLocation,
    reportingTime: booking.reportingTime,
    
    totalAmount: booking.totalAmount || booking.price || 0,
    discount: booking.discount || 0,
    tax: booking.tax || 0,
    grandTotal: booking.totalAmount || booking.price || 0,
    paymentMethod: booking.paymentMethod || 'N/A',
    transactionId: booking.transactionId,
    
    specialRequests: booking.specialRequests,
    notes: booking.notes,
    emergencyContact: booking.emergencyContact
  }
}
