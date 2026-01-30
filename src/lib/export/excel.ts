
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export interface LedgerExportData {
    lenderName: string
    reportPeriod: string

    loans: {
        loanNumber: string
        borrowerName: string
        borrowerPhone: string
        principalAmount: number
        interestRate: number
        startDate: Date
        duration: number
        totalReceivable: number
        totalPaid: number
        totalPending: number
        status: string
    }[]

    payments: {
        date: Date
        receiptNumber: string
        borrowerName: string
        loanNumber: string
        amount: number
        principal: number
        interest: number
        mode: string
    }[]

    summary: {
        totalLent: number
        totalReceivable: number
        totalReceived: number
        totalPending: number
        totalInterestEarned: number
        activeLoans: number
        closedLoans: number
    }
}

export function exportLedgerToExcel(data: LedgerExportData): void {
    const workbook = XLSX.utils.book_new()

    // Summary Sheet
    const summaryData = [
        ['LOAN LEDGER REPORT'],
        [''],
        ['Lender:', data.lenderName],
        ['Period:', data.reportPeriod],
        ['Generated:', new Date().toLocaleDateString('en-IN')],
        [''],
        ['SUMMARY'],
        ['Total Money Lent', data.summary.totalLent],
        ['Total Receivable', data.summary.totalReceivable],
        ['Total Received', data.summary.totalReceived],
        ['Total Pending', data.summary.totalPending],
        ['Total Interest Earned', data.summary.totalInterestEarned],
        ['Active Loans', data.summary.activeLoans],
        ['Closed Loans', data.summary.closedLoans],
    ]

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

    // Loans Sheet
    const loansHeader = [
        'Loan No', 'Borrower', 'Phone', 'Principal', 'Interest Rate',
        'Start Date', 'Duration', 'Total Receivable', 'Total Paid',
        'Pending', 'Status'
    ]

    const loansData = data.loans.map(loan => [
        loan.loanNumber,
        loan.borrowerName,
        loan.borrowerPhone,
        loan.principalAmount,
        `${loan.interestRate}%`,
        formatDate(loan.startDate),
        `${loan.duration} months`,
        loan.totalReceivable,
        loan.totalPaid,
        loan.totalPending,
        loan.status
    ])

    const loansSheet = XLSX.utils.aoa_to_sheet([loansHeader, ...loansData])
    XLSX.utils.book_append_sheet(workbook, loansSheet, 'Loans')

    // Payments Sheet
    const paymentsHeader = [
        'Date', 'Receipt No', 'Borrower', 'Loan No', 'Amount',
        'Principal', 'Interest', 'Mode'
    ]

    const paymentsData = data.payments.map(payment => [
        formatDate(payment.date),
        payment.receiptNumber,
        payment.borrowerName,
        payment.loanNumber,
        payment.amount,
        payment.principal,
        payment.interest,
        payment.mode
    ])

    const paymentsSheet = XLSX.utils.aoa_to_sheet([paymentsHeader, ...paymentsData])
    XLSX.utils.book_append_sheet(workbook, paymentsSheet, 'Payments')

    // Generate and download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, `Loan_Ledger_${data.reportPeriod.replace(/\s/g, '_')}.xlsx`)
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date)
}
