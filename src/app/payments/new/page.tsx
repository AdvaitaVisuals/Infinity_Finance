
"use client"

import { Sidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, CreditCard, Banknote, IndianRupee, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function NewPaymentPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [borrowers, setBorrowers] = useState<any[]>([])
    const [loans, setLoans] = useState<any[]>([])

    const [formData, setFormData] = useState({
        borrowerId: searchParams.get('borrowerId') || '',
        loanId: searchParams.get('loanId') || '',
        amount: '',
        paymentMode: 'CASH',
        paymentType: 'INTEREST',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: ''
    })

    // Load Borrowers
    useEffect(() => {
        fetch('/api/borrowers', { headers: { 'x-user-id': 'test-user-id' } })
            .then(res => res.json())
            .then(res => {
                if (res.success) setBorrowers(res.data)
            })
    }, [])

    // Load Loans when Borrower is selected
    useEffect(() => {
        if (formData.borrowerId) {
            // Ideally fetch filtered loans, for now fetching all and filtering clientside
            // In production valid API should accept ?borrowerId=...
            fetch('/api/loans/list')
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        const userLoans = res.data.filter((l: any) => l.borrowerId === formData.borrowerId)
                        setLoans(userLoans)
                    }
                })
        } else {
            setLoans([])
        }
    }, [formData.borrowerId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const result = await response.json()

            if (result.success) {
                router.push('/payments')
                router.refresh()
            } else {
                alert("Error recording payment: " + result.error)
            }

        } catch (error) {
            alert("Error recording payment")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-[#EBF1F5] min-h-screen flex font-sans text-slate-900">
            <div className="py-4 pl-4 shrink-0">
                <Sidebar />
            </div>

            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <header className="mb-8 flex items-center gap-4">
                    <Link href="/payments">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Record Payment</h1>
                        <p className="text-gray-500 mt-1">Receive money from a borrower</p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                    <Card className="rounded-[24px] border-none shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-gray-100 p-6">
                            <div className="flex items-center gap-2">
                                <div className="bg-green-600 text-white p-2 rounded-lg">
                                    <Banknote className="w-4 h-4" />
                                </div>
                                <CardTitle>Transaction Details</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">

                            <div className="space-y-2">
                                <Label>Select Borrower</Label>
                                <Select
                                    onValueChange={(val) => setFormData({ ...formData, borrowerId: val, loanId: '' })}
                                >
                                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none">
                                        <SelectValue placeholder="Search borrower..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {borrowers.map(b => (
                                            <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Select Loan (Optional)</Label>
                                <Select
                                    disabled={!formData.borrowerId || loans.length === 0}
                                    onValueChange={(val) => setFormData({ ...formData, loanId: val })}
                                >
                                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none">
                                        <SelectValue placeholder={loans.length === 0 ? "No active loans found" : "Select loan to credit"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loans.map(l => (
                                            <SelectItem key={l.id} value={l.id}>
                                                {l.loanNumber} - Due: ₹{(l.principalPending + l.interestPending).toLocaleString()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-400">If no loan is selected, amount will be added to Wallet/Excess.</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Payment Type</Label>
                                <Select
                                    defaultValue="INTEREST"
                                    onValueChange={(val) => setFormData({ ...formData, paymentType: val })}
                                >
                                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INTEREST">Interest Only</SelectItem>
                                        <SelectItem value="PRINCIPAL">Principal Repayment</SelectItem>
                                        <SelectItem value="FULL_SETTLEMENT">Full Settlement</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Amount Received (₹)</Label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                    <Input
                                        type="number"
                                        required
                                        placeholder="0.00"
                                        className="pl-10 bg-slate-50 border-none h-12 rounded-xl font-bold text-lg"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Payment Mode</Label>
                                    <Select
                                        defaultValue="CASH"
                                        onValueChange={(val) => setFormData({ ...formData, paymentMode: val })}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CASH">Cash</SelectItem>
                                            <SelectItem value="UPI">UPI / GPay</SelectItem>
                                            <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                            <SelectItem value="CHEQUE">Cheque</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input
                                        type="date"
                                        required
                                        className="bg-slate-50 border-none h-12 rounded-xl"
                                        value={formData.paymentDate}
                                        onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Notes (Optional)</Label>
                                <Input
                                    placeholder="Transaction ID, Remarks..."
                                    className="bg-slate-50 border-none h-12 rounded-xl"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white hover:bg-gray-800 rounded-xl h-12 text-base font-bold shadow-lg shadow-black/20"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm Payment
                            </Button>

                        </CardContent>
                    </Card>
                </form>
            </main>
        </div>
    )
}
