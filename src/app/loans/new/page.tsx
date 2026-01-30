
"use client"

import { Sidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Calculator, User, Calendar, Percent } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewLoanPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [borrowers, setBorrowers] = useState<any[]>([])
    const [formData, setFormData] = useState({
        borrowerId: '',
        principalAmount: '',
        interestRate: '3',
        interestType: 'MONTHLY_FLAT',
        duration: '12',
        startDate: new Date().toISOString().split('T')[0],
        purpose: '',
        notes: '',
        consentGiven: true
    })

    // Calculations Preview
    const [preview, setPreview] = useState({
        monthlyInterest: 0,
        totalRepayment: 0,
        emi: 0
    })

    // Load Borrowers
    useEffect(() => {
        fetch('/api/borrowers', { headers: { 'x-user-id': 'test-user-id' } })
            .then(res => res.json())
            .then(res => {
                if (res.success) setBorrowers(res.data)
            })
    }, [])

    // Live Calculations
    useEffect(() => {
        const P = parseFloat(formData.principalAmount) || 0
        const R = parseFloat(formData.interestRate) || 0
        const N = parseFloat(formData.duration) || 0

        if (P > 0 && N > 0) {
            // Simplified Flat Rate Calculation for Display
            const monthlyInt = P * (R / 100)
            const totalInt = monthlyInt * N
            const totalAmt = P + totalInt
            const emi = totalAmt / N

            setPreview({
                monthlyInterest: Math.round(monthlyInt),
                totalRepayment: Math.round(totalAmt),
                emi: Math.round(emi)
            })
        }
    }, [formData.principalAmount, formData.interestRate, formData.duration])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const payload = {
                ...formData,
                principalAmount: parseFloat(formData.principalAmount),
                interestRate: parseFloat(formData.interestRate),
                duration: parseFloat(formData.duration),
                startDate: new Date(formData.startDate)
            }

            const response = await fetch('/api/loans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const result = await response.json()

            if (result.success) {
                router.push('/loans')
                router.refresh()
            } else {
                alert("Error: " + result.error)
            }
        } catch (error) {
            alert("Something went wrong")
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
                    <Link href="/loans">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Create New Loan</h1>
                        <p className="text-gray-500 mt-1">Setup logic and repayment schedule</p>
                    </div>
                </header>

                <div className="grid grid-cols-12 gap-8">
                    {/* Form Column */}
                    <div className="col-span-8 space-y-6">
                        <form id="loan-form" onSubmit={handleSubmit}>
                            <Card className="rounded-[24px] border-none shadow-sm bg-white overflow-hidden mb-6">
                                <CardHeader className="bg-slate-50/50 border-b border-gray-100 p-6">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-black text-white p-2 rounded-lg">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <CardTitle>Borrower Selection</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="space-y-2">
                                        <Label>Select Borrower</Label>
                                        <Select
                                            onValueChange={(val) => {
                                                const selectedBorrower = borrowers.find(b => b.id === val)
                                                setFormData({
                                                    ...formData,
                                                    borrowerId: val,
                                                    interestRate: selectedBorrower?.defaultInterestRate ? selectedBorrower.defaultInterestRate.toString() : formData.interestRate
                                                })
                                            }}
                                        >
                                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none">
                                                <SelectValue placeholder="Search borrower..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {borrowers.map(b => (
                                                    <SelectItem key={b.id} value={b.id}>
                                                        {b.name} ({b.phone})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex justify-end mt-2">
                                            <Link href="/borrowers/new" className="text-xs text-blue-600 font-bold hover:underline">
                                                + Add New Borrower
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-[24px] border-none shadow-sm bg-white overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-gray-100 p-6">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-blue-600 text-white p-2 rounded-lg">
                                            <Calculator className="w-4 h-4" />
                                        </div>
                                        <CardTitle>Loan Terms</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 grid grid-cols-2 gap-6">
                                    <div className="space-y-2 col-span-2">
                                        <Label>Principal Amount (₹)</Label>
                                        <Input
                                            type="number"
                                            required
                                            placeholder="50000"
                                            className="bg-slate-50 border-none h-14 rounded-xl text-xl font-bold"
                                            value={formData.principalAmount}
                                            onChange={(e) => setFormData({ ...formData, principalAmount: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Interest Rate (% Monthly)</Label>
                                        <div className="relative">
                                            <Percent className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                                            <Input
                                                type="number"
                                                step="0.1"
                                                required
                                                className="pl-10 bg-slate-50 border-none h-12 rounded-xl"
                                                value={formData.interestRate}
                                                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Interest Type</Label>
                                        <Select
                                            value={formData.interestType}
                                            onValueChange={(val) => setFormData({ ...formData, interestType: val })}
                                        >
                                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MONTHLY_FLAT">Monthly Flat (Simple)</SelectItem>
                                                <SelectItem value="MONTHLY_REDUCING">Monthly Reducing</SelectItem>
                                                <SelectItem value="DAILY">Daily Interest</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Duration (Months)</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                            <Input
                                                type="number"
                                                required
                                                className="pl-10 bg-slate-50 border-none h-12 rounded-xl"
                                                value={formData.duration}
                                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Input
                                            type="date"
                                            required
                                            className="bg-slate-50 border-none h-12 rounded-xl"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </div>

                    {/* Calculations Column */}
                    <div className="col-span-4 space-y-6">
                        <Card className="rounded-[24px] border-none shadow-lg shadow-blue-900/5 bg-black text-white overflow-hidden sticky top-8">
                            <div className="p-8 space-y-6">
                                <h3 className="text-xl font-bold">Summary</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-gray-400">
                                        <span>Principal</span>
                                        <span className="text-white font-medium">₹{parseFloat(formData.principalAmount || '0').toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-400">
                                        <span>Monthly Interest</span>
                                        <span className="text-white font-medium">+ ₹{preview.monthlyInterest.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-400">
                                        <span>Duration</span>
                                        <span className="text-white font-medium">{formData.duration} Months</span>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-gray-800"></div>

                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Total Repayment Amount</p>
                                    <p className="text-3xl font-extrabold text-white">₹{preview.totalRepayment.toLocaleString()}</p>
                                </div>

                                <div className="bg-gray-900 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 mb-1">Estimated Monthly EMI</p>
                                    <p className="text-xl font-bold text-green-400">₹{preview.emi.toLocaleString()}</p>
                                </div>

                                <Button
                                    form="loan-form"
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-white text-black hover:bg-gray-100 font-bold rounded-xl h-12"
                                >
                                    {loading ? 'Creating...' : 'Confirm Loan'}
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
