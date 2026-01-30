
import jsPDF from 'jspdf'

export interface AgreementData {
    agreementNumber: string
    date: Date

    // Lender
    lenderName: string
    lenderAddress: string
    lenderPhone: string

    // Borrower
    borrowerName: string
    borrowerAddress: string
    borrowerPhone: string
    borrowerAadhaar?: string
    borrowerPan?: string

    // Guarantor (if any)
    guarantorName?: string
    guarantorAddress?: string
    guarantorPhone?: string

    // Loan Terms
    principalAmount: number
    interestRate: number
    interestType: string
    duration: number
    totalInterest: number
    totalReceivable: number
    emiAmount: number
    startDate: Date
    endDate: Date

    // Purpose
    purpose?: string
}

export function generateAgreement(data: AgreementData): jsPDF {
    const doc = new jsPDF()
    let y = 20

    // Title
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('LOAN AGREEMENT', 105, y, { align: 'center' })
    y += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Agreement No: ${data.agreementNumber}`, 15, y)
    doc.text(`Date: ${formatDate(data.date)}`, 150, y)
    y += 15

    // Introduction
    doc.setFontSize(10)
    const intro = `This Loan Agreement ("Agreement") is entered into on ${formatDate(data.date)} between:`
    doc.text(intro, 15, y)
    y += 15

    // Party 1 - Lender
    doc.setFont('helvetica', 'bold')
    doc.text('LENDER (Party 1):', 15, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(`Name: ${data.lenderName}`, 20, y)
    y += 5
    doc.text(`Address: ${data.lenderAddress}`, 20, y, { maxWidth: 170 })
    y += 10
    doc.text(`Phone: ${data.lenderPhone}`, 20, y)
    y += 12

    // Party 2 - Borrower
    doc.setFont('helvetica', 'bold')
    doc.text('BORROWER (Party 2):', 15, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(`Name: ${data.borrowerName}`, 20, y)
    y += 5
    doc.text(`Address: ${data.borrowerAddress}`, 20, y, { maxWidth: 170 })
    y += 10
    doc.text(`Phone: ${data.borrowerPhone}`, 20, y)
    y += 5
    if (data.borrowerAadhaar) {
        doc.text(`Aadhaar: ${data.borrowerAadhaar}`, 20, y)
        y += 5
    }
    if (data.borrowerPan) {
        doc.text(`PAN: ${data.borrowerPan}`, 20, y)
        y += 5
    }
    y += 10

    // Loan Terms
    doc.setFont('helvetica', 'bold')
    doc.text('LOAN TERMS:', 15, y)
    y += 8
    doc.setFont('helvetica', 'normal')

    const terms = [
        `1. Principal Amount: ${formatCurrency(data.principalAmount)}`,
        `2. Interest Rate: ${data.interestRate}% per month (${data.interestType})`,
        `3. Loan Duration: ${data.duration} months`,
        `4. Total Interest: ${formatCurrency(data.totalInterest)}`,
        `5. Total Amount Payable: ${formatCurrency(data.totalReceivable)}`,
        `6. Monthly EMI: ${formatCurrency(data.emiAmount)}`,
        `7. Loan Start Date: ${formatDate(data.startDate)}`,
        `8. Loan End Date: ${formatDate(data.endDate)}`,
        data.purpose ? `9. Purpose: ${data.purpose}` : null
    ].filter(Boolean)

    // @ts-ignore
    terms.forEach(term => {
        doc.text(term!, 20, y)
        y += 6
    })
    y += 8

    // Terms & Conditions
    doc.setFont('helvetica', 'bold')
    doc.text('TERMS & CONDITIONS:', 15, y)
    y += 8
    doc.setFont('helvetica', 'normal')

    const conditions = [
        '1. The Borrower agrees to repay the loan amount along with interest as per the schedule.',
        '2. Late payment will attract a penalty as decided by the Lender.',
        '3. The Borrower can prepay the loan without any prepayment charges.',
        '4. In case of default, the Lender reserves the right to take legal action.',
        '5. This agreement is governed by the laws of India.',
        '6. Any disputes shall be subject to the jurisdiction of local courts.'
    ]

    conditions.forEach(cond => {
        const lines = doc.splitTextToSize(cond, 175)
        doc.text(lines, 15, y)
        y += lines.length * 5 + 3
    })

    // Check if we need a new page
    if (y > 240) {
        doc.addPage()
        y = 20
    }

    y += 10

    // Disclaimer
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.text('DISCLAIMER: The interest rate charged is mutually agreed upon by both parties.', 15, y)
    y += 5
    doc.text('The Lender is not a registered NBFC/Bank. This is a private lending arrangement.', 15, y)
    y += 15

    // Signatures
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    doc.text('_________________________', 20, y)
    doc.text('_________________________', 120, y)
    y += 5
    doc.text('Lender Signature', 30, y)
    doc.text('Borrower Signature', 130, y)
    y += 8
    doc.text(`Name: ${data.lenderName}`, 20, y)
    doc.text(`Name: ${data.borrowerName}`, 120, y)
    y += 5
    doc.text(`Date: ${formatDate(data.date)}`, 20, y)
    doc.text(`Date: ${formatDate(data.date)}`, 120, y)

    // Guarantor (if present)
    if (data.guarantorName) {
        y += 15
        doc.setFont('helvetica', 'bold')
        doc.text('GUARANTOR:', 15, y)
        y += 8
        doc.setFont('helvetica', 'normal')
        doc.text('_________________________', 20, y)
        y += 5
        doc.text('Guarantor Signature', 30, y)
        y += 8
        doc.text(`Name: ${data.guarantorName}`, 20, y)
        y += 5
        doc.text(`Phone: ${data.guarantorPhone || '-'}`, 20, y)
    }

    return doc
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount)
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date)
}
