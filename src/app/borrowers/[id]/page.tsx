
import { db } from '@/lib/db'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Phone, MapPin, Edit, Save, Trash2, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { BorrowerClientParams } from './client-params'

interface BorrowerDetails {
    id: string
    name: string
    phone: string
    address: string
    email: string
    aadharNumber: string
    panNumber: string
    status: string
    createdAt: string
}

export default async function BorrowerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    // Fetch Data Server Side
    const borrower = db.prepare('SELECT * FROM borrowers WHERE id = ?').get(id) as BorrowerDetails

    if (!borrower) {
        return <div>Borrower not found</div>
    }

    const loans = db.prepare(`
    SELECT * FROM loans WHERE borrowerId = ? ORDER BY createdAt DESC
  `).all(id) as any[]

    const payments = db.prepare(`
    SELECT p.*, l.loanNumber 
    FROM payments p
    JOIN loans l ON p.loanId = l.id
    WHERE l.borrowerId = ? 
    ORDER BY p.paymentDate DESC
  `).all(id) as any[]

    const stats = {
        totalLent: loans.reduce((acc, curr) => acc + curr.principalAmount, 0),
        totalDebt: loans.reduce((acc, curr) => acc + (curr.principalPending + curr.interestPending), 0),
        activeLoans: loans.filter(l => l.status === 'ACTIVE').length
    }

    return (
        <div className="bg-[#EBF1F5] min-h-screen flex font-sans text-slate-900">
            <div className="py-4 pl-4 shrink-0">
                <Sidebar />
            </div>

            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <header className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/borrowers">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">{borrower.name}</h1>
                            <p className="text-gray-500 mt-1 flex items-center gap-4">
                                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {borrower.phone}</span>
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${borrower.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-200'}`}>{borrower.status}</span>
                            </p>
                        </div>
                    </div>
                    <Link href={`/loans/new?borrowerId=${borrower.id}`}>
                        <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">
                            + Grant New Loan
                        </Button>
                    </Link>
                </header>

                <div className="grid grid-cols-12 gap-8">
                    {/* Sidebar Stats */}
                    <div className="col-span-4 space-y-6">
                        <Card className="rounded-[24px] border-none shadow-sm bg-white overflow-hidden">
                            <CardContent className="p-6 space-y-4">
                                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-3xl font-bold text-yellow-800 mx-auto mb-4">
                                    {borrower.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Total Debt</p>
                                    <p className="text-3xl font-extrabold text-red-600">₹{stats.totalDebt.toLocaleString()}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-center border-t border-gray-100 pt-4">
                                    <div>
                                        <p className="text-xs text-gray-400">Active Loans</p>
                                        <p className="font-bold text-lg">{stats.activeLoans}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Lifetime Lent</p>
                                        <p className="font-bold text-lg">₹{stats.totalLent.toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Address Card */}
                        <Card className="rounded-[24px] border-none shadow-sm bg-white overflow-hidden">
                            <CardContent className="p-6 flex items-start gap-4">
                                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                <div>
                                    <h4 className="font-bold text-sm">Address</h4>
                                    <p className="text-sm text-gray-500 mt-1">{borrower.address}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Tabs */}
                    <div className="col-span-8">
                        <BorrowerClientParams borrower={borrower} loans={loans} payments={payments} />
                    </div>
                </div>
            </main>
        </div>
    )
}
