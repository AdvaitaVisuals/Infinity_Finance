
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export interface ReceiptData {
    receiptNumber: string
    date: Date

    // Lender Details
    lenderName: string
    lenderPhone: string
    lenderAddress?: string

    // Borrower Details
    borrowerName: string
    borrowerPhone: string
    borrowerAddress?: string

    // Loan Details
    loanNumber: string
    loanAmount: number

    // Payment Details
    paymentAmount: number
    paymentMode: string
    transactionRef?: string

    // Breakup
    principalPortion: number
    interestPortion: number
    penaltyPortion?: number

    // Balance
    principalPending: number
    interestPending: number
    totalPending: number
}

export function generateReceipt(data: ReceiptData): jsPDF {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('PAYMENT RECEIPT', 105, 20, { align: 'center' })

    // Receipt Number & Date
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Receipt No: ${data.receiptNumber}`, 15, 35)
    doc.text(`Date: ${formatDate(data.date)}`, 150, 35)

    // Horizontal line
    doc.setLineWidth(0.5)
    doc.line(15, 40, 195, 40)

    // Lender Details
    doc.setFont('helvetica', 'bold')
    doc.text('From (Lender):', 15, 50)
    doc.setFont('helvetica', 'normal')
    doc.text(data.lenderName, 15, 57)
    doc.text(data.lenderPhone, 15, 63)
    if (data.lenderAddress) {
        doc.text(data.lenderAddress, 15, 69, { maxWidth: 80 })
    }

    // Borrower Details
    doc.setFont('helvetica', 'bold')
    doc.text('To (Borrower):', 110, 50)
    doc.setFont('helvetica', 'normal')
    doc.text(data.borrowerName, 110, 57)
    doc.text(data.borrowerPhone, 110, 63)
    if (data.borrowerAddress) {
        doc.text(data.borrowerAddress, 110, 69, { maxWidth: 80 })
    }

    // Loan Reference
    doc.setLineWidth(0.3)
    doc.line(15, 80, 195, 80)
    doc.setFont('helvetica', 'bold')
    doc.text(`Loan Reference: ${data.loanNumber}`, 15, 88)
    doc.text(`Original Loan Amount: ${formatCurrency(data.loanAmount)}`, 110, 88)

    // Payment Details Table
    const tableData: (string | number)[][] = [
        ['Payment Amount', formatCurrency(data.paymentAmount)],
        ['Payment Mode', data.paymentMode],
        ['Transaction Ref', data.transactionRef || '-'],
        ['', ''],
        ['BREAKUP', ''],
        ['Principal Paid', formatCurrency(data.principalPortion)],
        ['Interest Paid', formatCurrency(data.interestPortion)],
    ]

    if (data.penaltyPortion && data.penaltyPortion > 0) {
        tableData.push(['Penalty Paid', formatCurrency(data.penaltyPortion)])
    }

    tableData.push(
        ['', ''],
        ['BALANCE PENDING', ''],
        ['Principal Pending', formatCurrency(data.principalPending)],
        ['Interest Pending', formatCurrency(data.interestPending)],
        ['Total Pending', formatCurrency(data.totalPending)]
    )

    // @ts-ignore - jspdf-autotable definitions sometimes tricky
    doc.autoTable({
        startY: 95,
        head: [],
        body: tableData,
        theme: 'plain',
        styles: { fontSize: 10 },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 80 },
            1: { cellWidth: 80, halign: 'right' }
        }
    })

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 20

    doc.setFontSize(8)
    doc.text('This is a computer-generated receipt.', 105, finalY, { align: 'center' })
    doc.text('For any queries, contact the lender.', 105, finalY + 5, { align: 'center' })

    // Signature areas
    doc.setFontSize(10)
    doc.text('_____________________', 30, finalY + 25)
    doc.text('Lender Signature', 35, finalY + 32)

    doc.text('_____________________', 130, finalY + 25)
    doc.text('Borrower Signature', 135, finalY + 32)

    return doc
}

// Helper functions
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
