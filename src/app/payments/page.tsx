
import { db } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Plus, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ExportPaymentsButton } from '@/components/payments/export-button'
import { PaymentList } from '@/components/payments/payment-list'

function getPayments() {
    const userId = 'test-user-id'
    const payments = db.prepare(`
    SELECT p.*, l.loanNumber, b.name as borrowerName 
    FROM payments p
    JOIN loans l ON p.loanId = l.id
    JOIN borrowers b ON l.borrowerId = b.id
    WHERE p.userId = ?
    ORDER BY p.paymentDate DESC
    LIMIT 50
  `).all(userId) as any[]

    const stats = db.prepare(`
    SELECT 
      SUM(amount) as totalReceived
    FROM payments 
    WHERE userId = ?
  `).get(userId) as { totalReceived: number }

    return { payments, stats }
}

export default function PaymentsPage() {
    const { payments, stats } = getPayments()

    return (
        <div className="bg-[#EBF1F5] min-h-screen flex font-sans text-slate-900">
            <Sidebar />

            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Payments</h1>
                        <p className="text-gray-500 mt-1">Transaction history and collection</p>
                    </div>

                    <div className="flex gap-3">
                        <ExportPaymentsButton />
                        <Link href="/payments/new">
                            <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6 gap-2">
                                <Plus className="w-4 h-4" /> Record Payment
                            </Button>
                        </Link>
                    </div>
                </header>

                {/* Stats Strip */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <Card className="rounded-[24px] border-none shadow-sm bg-black text-white p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-white/20 rounded-full">
                                <ArrowDownLeft className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-lg">All Time</span>
                        </div>
                        <h3 className="text-3xl font-extrabold mb-1">₹{stats.totalReceived?.toLocaleString() || 0}</h3>
                        <p className="text-sm text-gray-400">Total Collections</p>
                    </Card>
                    {/* Placeholders for future stats */}
                    <Card className="rounded-[24px] border-none shadow-sm bg-white p-6 opacity-50">
                        <p className="font-bold">This Month</p>
                        <p className="text-2xl mt-2">--</p>
                    </Card>
                    <Card className="rounded-[24px] border-none shadow-sm bg-white p-6 opacity-50">
                        <p className="font-bold">Pending</p>
                        <p className="text-2xl mt-2">--</p>
                    </Card>
                </div>

                {/* Transactions List */}
                <Card className="rounded-[30px] border-none shadow-sm bg-white overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-lg">Recent Transactions</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        <PaymentList payments={payments} />
                    </div>
                </Card>

            </main>
        </div>
    )
}
