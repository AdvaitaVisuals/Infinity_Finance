
"use client"

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, ArrowRight } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { EditPaymentDialog } from './edit-payment-dialog'

export function PaymentList({ payments }: { payments: any[] }) {
    const [showAll, setShowAll] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState<any>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    if (payments.length === 0) {
        return <div className="text-center py-10 text-gray-500">No transactions recorded.</div>
    }

    const handleRowClick = (payment: any) => {
        setSelectedPayment(payment)
        setIsEditDialogOpen(true)
    }

    const displayedPayments = showAll ? payments : payments.slice(0, 5)

    return (
        <>
            <div className="divide-y divide-gray-50">
                {displayedPayments.map((payment) => (
                    <div
                        key={payment.id}
                        onClick={() => handleRowClick(payment)}
                        className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group animate-in fade-in slide-in-from-bottom-1"
                    >
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-green-100 text-green-700 font-bold group-hover:bg-green-200 transition-colors">
                                    {payment.borrowerName.substring(0, 1)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{payment.borrowerName}</p>
                                <p className="text-xs text-gray-400">{new Date(payment.paymentDate).toLocaleDateString()} • {payment.receiptNumber}</p>
                            </div>
                        </div>

                        <div className="flex gap-10">
                            <div className="text-right">
                                <p className="text-xs text-gray-400 mb-1">Amount</p>
                                <p className="font-bold text-green-600">+ ₹{payment.amount.toLocaleString()}</p>
                            </div>
                            <div className="text-right hidden md:block">
                                <p className="text-xs text-gray-400 mb-1">Principal / Interest</p>
                                <div className="flex items-center justify-end gap-2">
                                    <p className="text-sm font-medium">₹{payment.principalPortion} / ₹{payment.interestPortion}</p>
                                    {payment.principalPortion > 0 ? (
                                        <Badge variant="outline" className="text-[10px] h-4 bg-blue-50 text-blue-600 border-blue-200">Principal</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-[10px] h-4 bg-orange-50 text-orange-600 border-orange-200">Interest</Badge>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 mb-1">Mode</p>
                                <Badge variant="secondary" className="bg-gray-100 text-gray-600 group-hover:bg-white transition-colors">
                                    {payment.paymentMode}
                                </Badge>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {payments.length > 5 && (
                <div className="p-4 flex justify-center border-t border-gray-100 bg-slate-50/50">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-sm font-bold text-gray-500 hover:text-black flex items-center gap-2"
                    >
                        {showAll ? 'See Less' : `See More (${payments.length - 5})`}
                    </button>
                </div>
            )}

            {selectedPayment && (
                <EditPaymentDialog
                    payment={selectedPayment}
                    isOpen={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                />
            )}
        </>
    )
}
