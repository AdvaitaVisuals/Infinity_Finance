"use client"

import { Sidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, FileText, TrendingUp, AlertTriangle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { useState, useEffect } from 'react'

export default function ReportsPage() {
    // ... (state remains same)
    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7))
    const [reportData, setReportData] = useState<{
        summary: { totalCollected: number, principalRecovered: number, interestEarned: number },
        payments: any[]
    } | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchReport()
    }, [currentMonth])

    const fetchReport = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/reports/monthly?month=${currentMonth}`, {
                headers: { 'x-user-id': 'test-user-id' }
            })
            const result = await res.json()
            if (result.success) {
                setReportData(result.data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const generatePDF = () => {
        if (!reportData) return
        const doc = new jsPDF()

        // Header
        doc.setFont("helvetica", "bold")
        doc.setFontSize(22)
        doc.text("LoanBook Monthly Report", 20, 20)

        doc.setFontSize(12)
        doc.setFont("helvetica", "normal")
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30)
        doc.text(`Month: ${currentMonth}`, 20, 36)

        // Summary Line
        doc.setDrawColor(0)
        doc.setLineWidth(0.1)
        doc.line(20, 45, 190, 45)

        doc.setFont("helvetica", "bold")
        doc.text("Total Collected", 20, 55)
        doc.text("Principal", 80, 55)
        doc.text("Interest", 140, 55)

        doc.setFont("helvetica", "normal")
        doc.text(`INR ${reportData.summary.totalCollected.toLocaleString()}`, 20, 62)
        doc.text(`INR ${reportData.summary.principalRecovered.toLocaleString()}`, 80, 62)
        doc.text(`INR ${reportData.summary.interestEarned.toLocaleString()}`, 140, 62)

        // Table
        const tableData = reportData.payments.map((p: any) => [
            new Date(p.paymentDate).toLocaleDateString(),
            p.borrowerName || '-',
            `INR ${p.amount.toLocaleString()}`,
            p.notes || '-'
        ])

            ; (doc as any).autoTable({
                startY: 75,
                head: [['Date', 'Borrower', 'Amount', 'Notes']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [0, 0, 0] }, // Black header
            })

        doc.save(`LoanBook_Report_${currentMonth}.pdf`)
    }

    return (
        <div className="bg-[#EBF1F5] min-h-screen flex font-sans text-slate-900">
            <div className="py-4 pl-4 shrink-0">
                <Sidebar />
            </div>

            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Reports</h1>
                        <p className="text-gray-500 mt-1">Detailed financial analysis & exports</p>
                    </div>

                    <Button onClick={generatePDF} className="bg-black text-white hover:bg-gray-800 rounded-full px-6 gap-2">
                        <Download className="w-4 h-4" /> Download Report
                    </Button>
                </header>

                <Tabs defaultValue="monthly" className="space-y-6">
                    <TabsList className="bg-white rounded-full p-1 w-auto inline-flex shadow-sm">
                        <TabsTrigger value="monthly" className="rounded-full px-6 data-[state=active]:bg-black data-[state=active]:text-white">Monthly Ledger</TabsTrigger>
                        <TabsTrigger value="profit" className="rounded-full px-6 data-[state=active]:bg-black data-[state=active]:text-white">Profit & Loss</TabsTrigger>
                        <TabsTrigger value="outstanding" className="rounded-full px-6 data-[state=active]:bg-black data-[state=active]:text-white">Outstanding</TabsTrigger>
                    </TabsList>

                    <TabsContent value="monthly" className="space-y-6">
                        {/* Report Card */}
                        <Card className="rounded-[24px] border-none shadow-sm bg-white overflow-hidden">
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold">Monthly Collection Report</h3>
                                        <p className="text-gray-500 text-sm mt-1">Select month to view transactions</p>
                                    </div>
                                    <Input
                                        type="month"
                                        value={currentMonth}
                                        onChange={(e) => setCurrentMonth(e.target.value)}
                                        className="bg-slate-50 border-none rounded-xl w-auto"
                                    />
                                </div>
                                <Button variant="outline" className="rounded-xl border-gray-200" onClick={generatePDF}>
                                    <FileText className="w-4 h-4 mr-2" /> Export PDF
                                </Button>
                            </div>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-3 gap-8 mb-8">
                                    <div className="p-4 bg-green-50 rounded-2xl">
                                        <p className="text-sm text-gray-500 mb-1">Total Collected</p>
                                        <p className="text-2xl font-bold text-green-700">₹{reportData?.summary.totalCollected.toLocaleString() || '0'}</p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-2xl">
                                        <p className="text-sm text-gray-500 mb-1">Principal Recovered</p>
                                        <p className="text-2xl font-bold text-blue-700">₹{reportData?.summary.principalRecovered.toLocaleString() || '0'}</p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-2xl">
                                        <p className="text-sm text-gray-500 mb-1">Interest Earned</p>
                                        <p className="text-2xl font-bold text-purple-700">₹{reportData?.summary.interestEarned.toLocaleString() || '0'}</p>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="text-center py-20 text-gray-400">Loading data...</div>
                                ) : (!reportData?.payments || reportData.payments.length === 0) ? (
                                    <div className="text-center py-10 bg-slate-50 rounded-2xl text-gray-400">
                                        <p>No transactions recorded for this month.</p>
                                        <p className="text-sm text-gray-300 mt-2">Try adding a new payment or selecting a different month.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-lg mb-4">Transactions ({reportData.payments.length})</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-50 text-gray-500 uppercase font-medium">
                                                    <tr>
                                                        <th className="px-6 py-3 rounded-l-xl">Date</th>
                                                        <th className="px-6 py-3">Borrower</th>
                                                        <th className="px-6 py-3">Loan</th>
                                                        <th className="px-6 py-3">Note</th>
                                                        <th className="px-6 py-3 text-right rounded-r-xl">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {reportData.payments.map((payment) => (
                                                        <tr key={payment.id} className="hover:bg-slate-50/50">
                                                            <td className="px-6 py-4 font-medium">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                                            <td className="px-6 py-4">{payment.borrowerName || 'Unknown'}</td>
                                                            <td className="px-6 py-4 text-gray-500">{payment.loanNumber || '-'}</td>
                                                            <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">{payment.notes}</td>
                                                            <td className="px-6 py-4 text-right font-bold">₹{payment.amount.toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="profit">
                        <Card className="rounded-[24px] border-none shadow-sm bg-white">
                            <CardContent className="p-8 text-center text-gray-500">
                                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>Profit & Loss analysis coming soon.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="outstanding">
                        <Card className="rounded-[24px] border-none shadow-sm bg-white">
                            <CardContent className="p-8 text-center text-gray-500">
                                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>Outstanding report coming soon.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </main>
        </div>
    )
}
