
"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Edit2, Check, Banknote } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function LoanDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [loan, setLoan] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Since we don't have a single loan getter API, we fetch all and filter for now
        // In real app: GET /api/loans/[id]
        fetch('/api/loans?userId=test-user-id')
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    const found = res.data.find((l: any) => l.id === id)
                    setLoan(found)
                }
                setLoading(false)
            })
    }, [id])

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-[#EBF1F5]">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
    )

    if (!loan) return (
        <div className="flex items-center justify-center min-h-screen bg-[#EBF1F5]">
            <p>Loan not found.</p>
        </div>
    )

    const totalDue = loan.principalPending + loan.interestPending

    return (
        <div className="bg-[#EBF1F5] min-h-screen flex font-sans text-slate-900">
            <div className="py-4 pl-4 shrink-0">
                <Sidebar />
            </div>

            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <header className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/loans">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-extrabold tracking-tight">Loan Details</h1>
                                <Badge className={loan.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-500'}>{loan.status}</Badge>
                            </div>
                            <p className="text-gray-500 mt-1">Reference: {loan.loanNumber}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href={`/payments/new?loanId=${loan.id}&borrowerId=${loan.borrowerId}`}>
                            <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6 gap-2">
                                <Banknote className="w-4 h-4" /> Record Payment
                            </Button>
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-12 gap-6">
                    {/* Basic Info */}
                    <Card className="col-span-8 rounded-[24px] border-none shadow-sm bg-white">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle>Financial Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-sm font-medium text-gray-400 mb-1">Principal Amount</h3>
                                <p className="text-2xl font-bold">₹{loan.principalAmount.toLocaleString()}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-400 mb-1">Total Paid So Far</h3>
                                <p className="text-2xl font-bold text-green-600">₹{(loan.totalPaid || 0).toLocaleString()}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-400 mb-1">Outstanding Principal</h3>
                                <p className="text-xl font-bold">₹{loan.principalPending.toLocaleString()}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-400 mb-1">Outstanding Interest</h3>
                                <p className="text-xl font-bold text-orange-600">₹{loan.interestPending.toLocaleString()}</p>
                            </div>
                            <div className="col-span-2 pt-4 border-t border-gray-100 mt-2">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 mb-1">Total Balance Due</h3>
                                        <p className="text-4xl font-extrabold text-red-600">₹{totalDue.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">Next Payment Date</p>
                                        <p className="font-medium">{new Date().toLocaleDateString()}</p>
                                        {/* Mock date for now */}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Borrower Info */}
                    <Card className="col-span-4 rounded-[24px] border-none shadow-sm bg-white">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle>Borrower</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xl text-slate-700">
                                    {loan.borrowerName?.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{loan.borrowerName}</h3>
                                    <p className="text-sm text-gray-400">Client since 2024</p>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Phone</span>
                                    <span className="font-medium">+91 98765 43210</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Email</span>
                                    <span className="font-medium">Confidential</span>
                                </div>
                            </div>

                            <Link href={`/borrowers/${loan.borrowerId}`} className="block mt-6">
                                <Button variant="outline" className="w-full rounded-xl">View Profile</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Terms */}
                    <Card className="col-span-12 rounded-[24px] border-none shadow-sm bg-white">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle>Loan Terms</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 grid grid-cols-4 gap-6">
                            <div>
                                <Label className="text-gray-400">Interest Rate</Label>
                                <p className="font-bold text-lg">{loan.interestRate}% / {loan.interestType === 'MONTHLY_FLAT' ? 'Month' : 'Year'}</p>
                                <p className="text-sm text-green-600 font-medium mt-1">
                                    ≈ ₹{Math.round(loan.principalAmount * (loan.interestRate / 100)).toLocaleString()} per month
                                </p>
                            </div>
                            <div>
                                <Label className="text-gray-400">Duration</Label>
                                <p className="font-bold text-lg">{loan.duration} Months</p>
                            </div>
                            <div>
                                <Label className="text-gray-400">Start Date</Label>
                                <p className="font-bold text-lg">{new Date(loan.startDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <Label className="text-gray-400">End Date</Label>
                                <p className="font-bold text-lg">{new Date(loan.endDate).toLocaleDateString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </main>
        </div>
    )
}
