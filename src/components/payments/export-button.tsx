
"use client"

import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function ExportPaymentsButton() {
    const [loading, setLoading] = useState(false)

    const handleExport = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/payments')
            const result = await response.json()

            if (!result.success) throw new Error("Failed to fetch")

            const payments = result.data

            const doc = new jsPDF()

            // Header
            doc.setFontSize(20)
            doc.text("Payment Transactions Report", 14, 22)
            doc.setFontSize(10)
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

            // Table
            autoTable(doc, {
                startY: 40,
                head: [['Date', 'Receipt #', 'Borrower', 'Loan #', 'Mode', 'Amount (₹)']],
                body: payments.map((p: any) => [
                    new Date(p.paymentDate).toLocaleDateString(),
                    p.receiptNumber,
                    p.borrowerName,
                    p.loanNumber,
                    p.paymentMode,
                    p.amount.toLocaleString()
                ]),
                theme: 'grid',
                styles: { fontSize: 9 },
                headStyles: { fillColor: [0, 0, 0] }
            })

            doc.save(`payments_export_${new Date().toISOString().split('T')[0]}.pdf`)

        } catch (e) {
            alert("Export failed")
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            onClick={handleExport}
            disabled={loading}
            variant="outline"
            className="rounded-full gap-2 bg-white border-none shadow-sm"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export
        </Button>
    )
}
