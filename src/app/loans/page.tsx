"use client"

import { db } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Plus, Filter, FileText, ChevronRight, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function LoansPage() {
    return (
        <div className="bg-[#EBF1F5] min-h-screen flex font-sans text-slate-900">
            <div className="py-4 pl-4 shrink-0">
                <Sidebar />
            </div>

            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <LoansContent />
            </main>
        </div>
    )
}

function LoansContent() {
    const searchParams = useSearchParams()
    const [loans, setLoans] = useState<any[]>([])
    const [filteredLoans, setFilteredLoans] = useState<any[]>([])
    const [statusFilter, setStatusFilter] = useState('ALL')

    useEffect(() => {
        const filterParam = searchParams.get('filter')
        if (filterParam) setStatusFilter(filterParam)
    }, [searchParams])

    useEffect(() => {
        fetch('/api/loans/list')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setLoans(data.data)
                    // Initial filter will be applied by the next useEffect
                }
            })
    }, [])

    useEffect(() => {
        let result = loans

        // Status Filter
        if (statusFilter !== 'ALL') {
            if (statusFilter === 'OVERDUE') {
                // Client-side Overdue Check
                const now = new Date()
                result = result.filter(l => {
                    const start = new Date(l.startDate)
                    const end = new Date(start)
                    end.setMonth(start.getMonth() + parseInt(l.duration))
                    return l.status === 'ACTIVE' && end < now
                })
            } else {
                result = result.filter(l => l.status === statusFilter)
            }
        }

        // Sort Filter
        if (searchParams.get('sort') === 'new') {
            const thisMonth = new Date().toISOString().slice(0, 7)
            result = result.filter(l => l.createdAt.startsWith(thisMonth))
        }

        setFilteredLoans(result)
    }, [statusFilter, loans, searchParams])

    return (
        <>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Loans</h1>
                    <p className="text-gray-500 mt-1">Track active and closed loans</p>
                </div>

                <div className="flex gap-3">
                    <Link href="/loans/new">
                        <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6 gap-2">
                            <Plus className="w-4 h-4" /> Create Loan
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-[20px] mb-6 flex gap-4 items-center shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search borrower or loan ID..." className="pl-10 bg-slate-50 border-none rounded-xl" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] rounded-xl bg-slate-50 border-none">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                        <SelectItem value="OVERDUE">Overdue</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Loans List */}
            <div className="space-y-4">
                {filteredLoans.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        No loans found matching your criteria.
                    </div>
                ) : (
                    filteredLoans.map((loan) => (
                        <Link key={loan.id} href={`/loans/${loan.id}`}>
                            <Card className="rounded-[20px] border-none shadow-sm bg-white hover:shadow-md transition-all group cursor-pointer">
                                <CardContent className="p-0 flex items-center">
                                    {/* Left Status Strip */}
                                    <div className={`w-3 self-stretch ${loan.status === 'ACTIVE' ? 'bg-green-500' :
                                        loan.status === 'OVERDUE' ? 'bg-red-500' :
                                            loan.status === 'CLOSED' ? 'bg-gray-400' : 'bg-yellow-500'
                                        }`}></div>

                                    <div className="p-6 flex-1 flex items-center justify-between">
                                        <div className="grid grid-cols-4 gap-8 w-full items-center">
                                            <div className="col-span-1">
                                                <p className="text-xs text-gray-400 mb-1">Borrower</p>
                                                <div className="flex flex-col">
                                                    <h3 className="font-bold text-lg group-hover:text-blue-600">{loan.borrowerName}</h3>
                                                    <p className="text-xs text-gray-500">{loan.loanNumber}</p>
                                                </div>
                                            </div>

                                            <div className="col-span-1">
                                                <p className="text-xs text-gray-400 mb-1">Principal</p>
                                                <p className="font-bold">₹{loan.principalAmount.toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">{loan.interestType}</p>
                                            </div>

                                            <div className="col-span-1">
                                                <p className="text-xs text-gray-400 mb-1">Balance Due</p>
                                                <p className={`font-bold ${loan.status === 'CLOSED' ? 'text-green-600' : 'text-red-600'}`}>
                                                    ₹{(loan.principalPending + loan.interestPending).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-gray-500">Expected Interest</p>
                                            </div>

                                            <div className="col-span-1 flex justify-end items-center gap-4">
                                                <Badge variant="outline" className={`rounded-md px-3 py-1 ${loan.status === 'ACTIVE' ? 'bg-green-50 text-green-700' :
                                                    loan.status === 'OVERDUE' ? 'bg-red-50 text-red-700' : 'bg-gray-100'
                                                    }`}>
                                                    {loan.status}
                                                </Badge>
                                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </>
    )
}
