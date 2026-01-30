
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit, Save, Trash2, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

import { useRouter } from 'next/navigation'

export function BorrowerClientParams({ borrower, loans, payments }: { borrower: any, loans: any[], payments: any[] }) {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState(borrower)
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/borrowers/${borrower.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success) {
                setIsEditing(false)
                router.refresh()
                // alert("Saved successfully!") // User wanted no console bullshit, maybe generic alert is fine or silent
            } else {
                alert("Error: " + data.error)
            }
        } catch (e) {
            alert("Failed to save")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this borrower?")) return

        setLoading(true)
        try {
            const res = await fetch(`/api/borrowers/${borrower.id}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (data.success) {
                router.push('/borrowers')
                router.refresh()
            } else {
                alert("Error: " + data.error)
            }
        } catch (e) {
            alert("Failed to delete")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Tabs defaultValue="loans" className="w-full">
            <TabsList className="bg-white rounded-full p-1 mb-6 shadow-sm">
                <TabsTrigger value="loans" className="rounded-full px-6 data-[state=active]:bg-black data-[state=active]:text-white">Loans History</TabsTrigger>
                <TabsTrigger value="payments" className="rounded-full px-6 data-[state=active]:bg-black data-[state=active]:text-white">Payments</TabsTrigger>
                <TabsTrigger value="profile" className="rounded-full px-6 data-[state=active]:bg-black data-[state=active]:text-white">Profile & Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="loans" className="space-y-4">
                {loans.length === 0 ? <div className="text-center py-10 text-gray-500">No loan history</div> :
                    loans.map(loan => (
                        <Card key={loan.id} className="rounded-[20px] border-none shadow-sm bg-white hover:shadow-md transition-all">
                            <div className="p-6 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">{loan.loanNumber}</p>
                                    <h3 className="font-bold text-lg">₹{loan.principalAmount.toLocaleString()}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(loan.startDate).toLocaleDateString()} • {loan.interestType}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${loan.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                        }`}>{loan.status}</span>
                                    <p className="mt-2 text-sm font-bold text-red-600">Due: ₹{(loan.principalPending + loan.interestPending).toLocaleString()}</p>
                                </div>
                            </div>
                        </Card>
                    ))
                }
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
                {payments.length === 0 ? <div className="text-center py-10 text-gray-500">No payment history</div> :
                    payments.map(payment => (
                        <div key={payment.id} className="p-4 bg-white rounded-[20px] shadow-sm flex justify-between items-center">
                            <div>
                                <p className="font-bold">₹{payment.amount.toLocaleString()}</p>
                                <p className="text-xs text-gray-400">{new Date(payment.paymentDate).toLocaleDateString()} • {payment.paymentMode}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">{payment.loanNumber}</p>
                            </div>
                        </div>
                    ))
                }
            </TabsContent>

            <TabsContent value="profile">
                <Card className="rounded-[24px] border-none shadow-sm bg-white">
                    <CardContent className="p-8 space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Edit Profile</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : (isEditing ? <><Save className="w-4 h-4 mr-2" /> Save Changes</> : <><Edit className="w-4 h-4 mr-2" /> Edit Details</>)}
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input disabled={!isEditing} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-slate-50 border-none rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input disabled={!isEditing} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="bg-slate-50 border-none rounded-xl" />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Address</Label>
                                <Input disabled={!isEditing} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="bg-slate-50 border-none rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label>Aadhaar</Label>
                                <Input disabled={!isEditing} value={formData.aadharNumber || ''} onChange={e => setFormData({ ...formData, aadharNumber: e.target.value })} className="bg-slate-50 border-none rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label>PAN</Label>
                                <Input disabled={!isEditing} value={formData.panNumber || ''} onChange={e => setFormData({ ...formData, panNumber: e.target.value })} className="bg-slate-50 border-none rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label>Default Interest Rate</Label>
                                <Input disabled={!isEditing} type="number" step="0.1" value={formData.defaultInterestRate || '2.0'} onChange={e => setFormData({ ...formData, defaultInterestRate: e.target.value })} className="bg-slate-50 border-none rounded-xl" />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="pt-6 border-t border-gray-100">
                                <Button
                                    variant="destructive"
                                    className="w-full rounded-xl"
                                    onClick={handleDelete}
                                    disabled={loading}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> {loading ? 'Deleting...' : 'Delete Borrower'}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
