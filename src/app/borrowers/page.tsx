
"use client"

import { db } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Plus, Search, Phone, MoreVertical } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function BorrowersPage() {
    const [borrowers, setBorrowers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/borrowers?userId=test-user-id')
            .then(res => res.json())
            .then(res => {
                if (res.success) setBorrowers(res.data)
                setLoading(false)
            })
    }, [])

    return (
        <div className="bg-[#EBF1F5] min-h-screen flex font-sans text-slate-900">
            <div className="py-4 pl-4 shrink-0">
                <Sidebar />
            </div>

            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Borrowers</h1>
                        <p className="text-gray-500 mt-1">Manage your client directory</p>
                    </div>
                    <Link href="/borrowers/new">
                        <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6 gap-2">
                            <Plus className="w-4 h-4" /> Add Borrower
                        </Button>
                    </Link>
                </header>

                {/* Search Bar */}
                <div className="bg-white rounded-[20px] p-2 mb-8 flex items-center shadow-sm w-full max-w-md">
                    <Search className="w-5 h-5 text-gray-400 ml-3" />
                    <Input
                        className="border-none shadow-none focus-visible:ring-0 text-base"
                        placeholder="Search by name or phone..."
                    />
                </div>

                {/* Borrowers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div>Loading...</div>
                    ) : borrowers.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No borrowers found. Add one to get started.
                        </div>
                    ) : (
                        borrowers.map((borrower) => (
                            <Card key={borrower.id} className="rounded-[24px] border-none shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer group">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-xl font-bold text-yellow-800">
                                            {borrower.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-black">
                                            <MoreVertical className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    <h3 className="text-xl font-bold mb-1 group-hover:text-blue-600 transition-colors">{borrower.name}</h3>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                                        <Phone className="w-3 h-3" /> {borrower.phone}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Status</span>
                                            <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${borrower.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {borrower.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Active Loans</span>
                                            <span className="font-bold">{borrower.activeLoanCount || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Total Debt</span>
                                            <span className="font-bold text-red-600">₹{borrower.totalDebt?.toLocaleString() || 0}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                                        <Link href={`/borrowers/${borrower.id}`} className="flex-1">
                                            <Button variant="outline" className="w-full rounded-xl text-xs h-9">
                                                History
                                            </Button>
                                        </Link>
                                        <Link href={`/loans/new?borrowerId=${borrower.id}`} className="flex-1">
                                            <Button className="w-full rounded-xl text-xs h-9 bg-black text-white hover:bg-gray-800">
                                                New Loan
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}
